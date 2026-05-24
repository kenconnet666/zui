<script lang="ts">
/**
 * `ZPopover` —— 弹出层(内容比 Tooltip 丰富,可放任意组件)。
 *
 * 跟 `ZTooltip` 的差别:
 * - 视觉:背景 `_bg` + 边框 + middle shadow,不再是反色小提示
 * - 默认 `trigger: 'click'`(Tooltip 默认 hover)
 * - 内置 onClickOutside 关闭(click 模式)
 * - 内置 useEscapeStack(visible 时 ESC 关)
 *
 * **API**:
 * - `title?` / `#content` slot —— 内容
 * - `placement` / `trigger`('click' / 'hover' / 'manual')
 * - `v-model:visible`
 * - sx:sxTrigger / sxContent / sxTitle
 */
import type { Placement } from '@floating-ui/vue'
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export interface ZPopoverProps {
  title?: string
  placement?: Placement
  trigger?: 'click' | 'hover' | 'manual'
  visible?: boolean
  disabled?: boolean
  sxTrigger?: SxObject
  sxContent?: SxObject
  sxTitle?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZPopoverEmits {
  (e: 'update:visible', value: boolean): void
}
</script>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { usePopper, useEscapeStack } from '../_hooks'

/**
 * 盒子模型(iem,Provider 控制基准):
 *
 *   ┌─────────────────┐
 *   │ trigger wrap    │   inline-flex(包裹 default slot)
 *   │ #default slot   │
 *   └─────────────────┘
 *           │ floating-ui 定位(offset 8)
 *           ▼
 *   ┌─────────────────────────────────────────┐
 *   │ popper(Teleport to body)              │   bg: _bg
 *   │   min-width: 8iem(避免极窄)           │   color: _text
 *   │   max-width: 30iem(防超长横铺)        │   border: _thin solid _border
 *   │   padding: _middle                      │   border-radius: _small
 *   │   border-radius: _small                 │   boxShadow: _middle
 *   │   z-index: _popover                     │
 *   │  ┌─────────────────────────────────┐    │
 *   │  │ title(条件 title 或 #title)   │    │   fontWeight: _semibold
 *   │  │  fontSize: _middle              │    │   marginBottom: _tiny
 *   │  └─────────────────────────────────┘    │
 *   │  ┌─────────────────────────────────┐    │
 *   │  │ #content slot                   │    │
 *   │  └─────────────────────────────────┘    │
 *   └─────────────────────────────────────────┘
 *
 * trigger: click / hover / manual;click 模式接 onClickOutside;visible 时 ESC 关。
 */
const props = withDefaults(defineProps<ZPopoverProps>(), {
  placement: 'bottom',
  trigger: 'click',
  visible: false,
  disabled: false,
})

const emit = defineEmits<ZPopoverEmits>()

const theme = useZTheme()

const triggerRef = ref<HTMLElement | null>(null)
const floatingRef = ref<HTMLElement | null>(null)
const innerVisible = ref(false)

const actualVisible = computed(() => {
  if (props.trigger === 'manual') return props.visible
  return innerVisible.value && !props.disabled
})

const { floatingStyles } = usePopper(triggerRef, floatingRef, {
  placement: computed(() => props.placement),
  offset: 8,
})

function setVisible(v: boolean): void {
  innerVisible.value = v
  emit('update:visible', v)
}

function show(): void {
  if (props.disabled || props.trigger === 'manual') return
  setVisible(true)
}
function hide(): void {
  if (props.trigger === 'manual') return
  setVisible(false)
}
function toggle(): void {
  if (props.disabled || props.trigger === 'manual') return
  setVisible(!innerVisible.value)
}

watch(
  () => props.visible,
  (v) => {
    if (props.trigger === 'manual') innerVisible.value = v
  },
  { immediate: true },
)

useEscapeStack(
  () => {
    if (innerVisible.value && props.trigger !== 'manual') setVisible(false)
  },
  { enabled: innerVisible },
)

onClickOutside(triggerRef, (e: Event) => {
  if (props.trigger !== 'click') return
  if (!innerVisible.value) return
  if (floatingRef.value && e.target && floatingRef.value.contains(e.target as Node)) return
  setVisible(false)
})

const triggerHandlers = computed(() => {
  if (props.trigger === 'click') return { onClick: toggle }
  if (props.trigger === 'hover') {
    return {
      onMouseenter: show,
      onMouseleave: hide,
    }
  }
  return {}
})

const triggerWrapClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    applySx(s, props.sxTrigger)
  }),
)
const sxTriggerAttrs = computed(() => extractSxAttrs(props.sxTrigger))

const popperClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.absolute
    s.zIndex._popover
    s.backgroundColor._bg
    s.color._text
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.boxShadow._middle
    s.padding._middle
    s.minWidth.iem(8)
    s.maxWidth.iem(30)
    applySx(s, props.sxContent)
    props.css?.(s)
  }),
)
const sxContentAttrs = computed(() => extractSxAttrs(props.sxContent))

const titleClass = computed(() =>
  icss(theme.value, (s) => {
    s.fontWeight._semibold
    s.fontSize._middle
    s.color._text
    s.marginBottom._tiny
    applySx(s, props.sxTitle)
  }),
)
const sxTitleAttrs = computed(() => extractSxAttrs(props.sxTitle))
</script>

<template>
  <span
    ref="triggerRef"
    :class="[triggerWrapClass, sxTriggerAttrs.class]"
    :style="sxTriggerAttrs.style"
    v-bind="{ ...sxTriggerAttrs.attrs, ...triggerHandlers }"
  >
    <slot />
  </span>

  <Teleport to="body">
    <div
      v-if="actualVisible"
      ref="floatingRef"
      :class="[popperClass, sxContentAttrs.class]"
      :style="[floatingStyles, sxContentAttrs.style]"
      role="dialog"
      v-bind="sxContentAttrs.attrs"
    >
      <div
        v-if="title || $slots.title"
        :class="[titleClass, sxTitleAttrs.class]"
        :style="sxTitleAttrs.style"
        v-bind="sxTitleAttrs.attrs"
      >
        <slot name="title">{{ title }}</slot>
      </div>
      <slot name="content" />
    </div>
  </Teleport>
</template>
