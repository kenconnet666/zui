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

const props = withDefaults(defineProps<ZTooltipProps>(), {
  placement: 'top',
  trigger: 'hover',
  visible: false,
  delay: 100,
  disabled: false,
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
  (v) => {
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

/**
 * tooltip 内容盒子模型(iem):
 * - padding-y: 0.25iem × 2 = 0.5iem 总垂直内边距
 * - padding-x 走 _small token
 * - maxWidth: 20iem(超长文本换行 wordBreak.breakWord)
 * - 反色:bg = _text,color = _bg
 */
const tooltipClass = computed(() =>
  icss(theme.value, (s) => {
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
    s.maxWidth.iem(20)
    s.wordBreak.breakWord
    applySx(s, props.sxContent)
    props.css?.(s)
  }),
)
const sxContentAttrs = computed(() => extractSxAttrs(props.sxContent))

const triggerWrapClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    applySx(s, props.sxTrigger)
  }),
)
const sxTriggerAttrs = computed(() => extractSxAttrs(props.sxTrigger))
</script>

<template>
  <span
    ref="triggerRef"
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
      ref="floatingRef"
      :class="[tooltipClass, sxContentAttrs.class]"
      :style="[floatingStyles, sxContentAttrs.style]"
      role="tooltip"
      v-bind="{ ...sxContentAttrs.attrs, ...contentHandlers }"
    >
      <slot name="content">{{ content }}</slot>
    </div>
  </Teleport>
</template>
