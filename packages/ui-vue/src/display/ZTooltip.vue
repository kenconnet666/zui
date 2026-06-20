<script lang="ts">
/**
 * `ZTooltip` —— 悬停提示(基于 `usePopper` + Teleport)。
 *
 * **API**:
 * - `content?: string` —— 提示文字(也可走 `#content` slot 自定义)
 * - `placement?: Placement` —— floating-ui placement,默认 `'top'`
 * - `trigger?: 'hover' | 'click' | 'focus' | 'manual'` —— 默认 `'hover'`
 * - `visible?: boolean` + `update:visible` —— manual / 受控
 * - `delay?: number` —— hover 模式 enter/leave 延迟 ms(默认 100)
 * - `disabled?: boolean` —— 禁用 tooltip
 * - sx:sxTrigger / sxContent
 *
 * **slot**:`default`(trigger)/ `content`(覆盖 `content` prop)
 *
 * **a11y**:`role="tooltip"` + trigger 上 `aria-describedby={tooltipId}`。
 */
import type { Placement } from '@floating-ui/vue'
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

/** 触发方式:'hover' 悬停 / 'click' 点击 / 'focus' 聚焦 / 'manual' 手动控制。 */
export type ZTooltipTrigger = 'hover' | 'click' | 'focus' | 'manual'

export interface ZTooltipProps {
  content?: string
  placement?: Placement
  trigger?: ZTooltipTrigger
  visible?: boolean
  delay?: number
  disabled?: boolean
  /** tooltip 最大宽度 —— `number`(px 倍数,1 单位 = 16px,默认 16 = 256px,对齐 antd 250px)。2026-05-24 B7。 */
  maxWidth?: number
  sxTrigger?: SxObject
  sxContent?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZTooltipEmits {
  (e: 'update:visible', value: boolean): void
}
</script>

<script lang="ts" setup>
import { computed, onScopeDispose, ref, watch } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { usePopper, useZId } from '../_hooks'
import { sizePx } from '../_internal/sizing'
import { applyUserRef } from '../_internal/merge-ref'

/**
 * 盒子模型(纯 px,number 是 px 倍数,1 单位 = 16px):
 *
 *   ┌─────────────────┐
 *   │ trigger wrap    │   inline-flex(包裹 default slot)
 *   │ #default slot   │
 *   └─────────────────┘
 *           │ floating-ui 定位(offset 6)
 *           ▼
 *   ┌────────────────────────────────────────┐
 *   │ tooltip(Teleport to body)            │   bg: _text(反色)
 *   │   max-width: sizePx(`maxWidth`)        │     默认 maxWidth=16(= 256px)
 *   │   pad-y: 4px × 2 = 8px 总高度         │   color: _bg(反色)
 *   │   pad-x: _small(token)               │   fontSize: _small
 *   │   border-radius: _tiny                 │   line-height: _tight
 *   │   word-break: break-word               │   boxShadow: _small / z-index: _tooltip
 *   │   pointer-events: hover 模式 auto      │
 *   │  ┌──────────────────────────────────┐  │
 *   │  │ content(content prop 或 #content)│
 *   │  └──────────────────────────────────┘  │
 *   └────────────────────────────────────────┘
 *
 * 用户改 maxWidth 数字 → tooltip 最大宽度等比缩(其它走固定 spacing token)。
 * trigger: hover / click / focus / manual。hover/focus 模式有 enter/leave delay(默认 100ms)。
 * 非整数倍数走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZTooltipProps>(), {
  placement: 'top',
  trigger: 'hover',
  visible: false,
  delay: 100,
  disabled: false,
  maxWidth: 16,
})

const emit = defineEmits<ZTooltipEmits>()

const theme = useZTheme()
const tooltipId = useZId('tooltip')

const triggerRef = ref<HTMLElement | null>(null)
const floatingRef = ref<HTMLElement | null>(null)
const innerVisible = ref(false)

const actualVisible = computed(() => {
  if (props.disabled) return false
  if (props.trigger === 'manual') return props.visible
  return innerVisible.value
})

const { floatingStyles } = usePopper(triggerRef, floatingRef, {
  placement: computed(() => props.placement),
  offset: 6,
})

let timer: ReturnType<typeof setTimeout> | null = null

function clearTimer(): void {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

// 组件卸载时清掉 pending 的 enter/leave 定时器,避免回调写已卸载组件的 ref
onScopeDispose(clearTimer)

function show(): void {
  if (props.disabled || props.trigger === 'manual') return
  clearTimer()
  if (props.delay > 0) {
    timer = setTimeout(() => {
      innerVisible.value = true
      emit('update:visible', true)
    }, props.delay)
  } else {
    innerVisible.value = true
    emit('update:visible', true)
  }
}

function hide(): void {
  if (props.trigger === 'manual') return
  clearTimer()
  if (props.delay > 0) {
    timer = setTimeout(() => {
      innerVisible.value = false
      emit('update:visible', false)
    }, props.delay)
  } else {
    innerVisible.value = false
    emit('update:visible', false)
  }
}

function toggle(): void {
  if (props.disabled || props.trigger === 'manual') return
  if (innerVisible.value) hide()
  else show()
}

watch(
  () => props.visible,
  v => {
    if (props.trigger === 'manual') innerVisible.value = v
  },
  { immediate: true },
)

const triggerHandlers = computed(() => {
  if (props.trigger === 'hover') {
    return {
      onMouseenter: show,
      onMouseleave: hide,
      onFocus: show,
      onBlur: hide,
    }
  }
  if (props.trigger === 'click') return { onClick: toggle }
  if (props.trigger === 'focus') return { onFocus: show, onBlur: hide }
  return {}
})

const contentHandlers = computed(() => {
  if (props.trigger === 'hover') {
    return { onMouseenter: show, onMouseleave: hide }
  }
  return {}
})

const tooltipClass = computed(() =>
  icss(theme.value, s => {
    s.position.absolute
    s.zIndex._tooltip
    s.backgroundColor._text
    s.color._bg
    s.fontSize._small
    s.lineHeight._tight
    s.paddingTop._tiny
    s.paddingBottom._tiny
    s.paddingLeft._small
    s.paddingRight._small
    s.borderRadius._tiny
    s.boxShadow._small
    if (props.trigger === 'hover') s.pointerEvents.auto
    else s.pointerEvents.none
    s.maxWidth.px(sizePx(props.maxWidth ?? 20))
    s.wordBreak.breakWord
    applySx(s, props.sxContent)
    props.css?.(s)
  }),
)
const sxContentAttrs = computed(() => extractSxAttrs(props.sxContent))

const triggerWrapClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    applySx(s, props.sxTrigger)
  }),
)
const sxTriggerAttrs = computed(() => extractSxAttrs(props.sxTrigger))

/**
 * trigger 元素 ref 合并器 —— 同时写入内部 `triggerRef`(usePopper)与
 * 用户传入的 `sxTrigger.ref`(string / function / Ref 对象,VNodeRef 形式)。
 */
function bindTrigger(el: unknown): void {
  const node = (el as HTMLElement | null) ?? null
  triggerRef.value = node
  applyUserRef(sxTriggerAttrs.value.ref, node)
}

/**
 * floating tooltip 元素 ref 合并器 —— 同时写入内部 `floatingRef`(usePopper)
 * 与用户传入的 `sxContent.ref`。
 */
function bindFloating(el: unknown): void {
  const node = (el as HTMLElement | null) ?? null
  floatingRef.value = node
  applyUserRef(sxContentAttrs.value.ref, node)
}
</script>

<template>
  <span
    :ref="bindTrigger"
    :class="[triggerWrapClass, sxTriggerAttrs.class]"
    :style="sxTriggerAttrs.style"
    :aria-describedby="actualVisible ? tooltipId : undefined"
    v-bind="{ ...sxTriggerAttrs.attrs, ...triggerHandlers }"
  >
    <slot />
  </span>

  <Teleport to="body">
    <div
      v-if="actualVisible"
      :id="tooltipId"
      :ref="bindFloating"
      :class="[tooltipClass, sxContentAttrs.class]"
      :style="[floatingStyles, sxContentAttrs.style]"
      role="tooltip"
      v-bind="{ ...sxContentAttrs.attrs, ...contentHandlers }"
    >
      <slot name="content">{{ content }}</slot>
    </div>
  </Teleport>
</template>
