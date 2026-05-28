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

export interface ZTooltipProps {
  content?: string
  placement?: Placement
  trigger?: 'hover' | 'click' | 'focus' | 'manual'
  visible?: boolean
  delay?: number
  disabled?: boolean
  /** tooltip 最大宽度 —— `number`(iem 倍数,默认 16 = 256px,对齐 antd 250px)。2026-05-24 B7。 */
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
import { computed, ref, watch } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { usePopper, useZId } from '../_hooks'

/**
 * 盒子模型(iem,Provider 控制基准;number 是 iem 倍数,默认 1iem=16px @ 1080p):
 *
 *   ┌─────────────────┐
 *   │ trigger wrap    │   inline-flex(包裹 default slot)
 *   │ #default slot   │
 *   └─────────────────┘
 *           │ floating-ui 定位(offset 6)
 *           ▼
 *   ┌────────────────────────────────────────┐
 *   │ tooltip(Teleport to body)            │   bg: _text(反色)
 *   │   max-width: `maxWidth` iem            │     默认 maxWidth=16(256px @ 1080p)
 *   │   pad-y: 0.25iem × 2 = 0.5iem 总高度  │   color: _bg(反色)
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
 * 非 iem 单位走 `:css` 兜底。
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
    s.paddingTop.iem(0.25)
    s.paddingBottom.iem(0.25)
    s.paddingLeft._small
    s.paddingRight._small
    s.borderRadius._tiny
    s.boxShadow._small
    if (props.trigger === 'hover') s.pointerEvents.auto
    else s.pointerEvents.none
    s.maxWidth.iem(props.maxWidth ?? 20)
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
  const userRef = sxTriggerAttrs.value.ref
  if (typeof userRef === 'function') userRef(node, {})
  else if (userRef && typeof userRef === 'object' && 'value' in userRef) {
    ;(userRef as { value: unknown }).value = node
  }
}

/**
 * floating tooltip 元素 ref 合并器 —— 同时写入内部 `floatingRef`(usePopper)
 * 与用户传入的 `sxContent.ref`。
 */
function bindFloating(el: unknown): void {
  const node = (el as HTMLElement | null) ?? null
  floatingRef.value = node
  const userRef = sxContentAttrs.value.ref
  if (typeof userRef === 'function') userRef(node, {})
  else if (userRef && typeof userRef === 'object' && 'value' in userRef) {
    ;(userRef as { value: unknown }).value = node
  }
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
