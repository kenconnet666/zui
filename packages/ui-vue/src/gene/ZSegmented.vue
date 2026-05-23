<script lang="ts">
/**
 * `ZSegmented` —— 分段控制器(类 iOS Segmented Control / antd Segmented)。
 *
 * - `v-model:value` —— 选中的 key
 * - `options: Array<{ value, label, disabled? }>`
 * - `size?: 'small' | 'middle' | 'large'`
 * - `block?: boolean` —— 满宽
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export type ZSegmentedSize = 'small' | 'middle' | 'large'

export interface ZSegmentedOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface ZSegmentedProps {
  value?: string | number
  options: ZSegmentedOption[]
  size?: ZSegmentedSize
  block?: boolean
  disabled?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZSegmentedEmits {
  (e: 'update:value', value: string | number): void
  (e: 'change', value: string | number): void
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZSegmentedProps>(), {
  size: 'middle',
  block: false,
  disabled: false,
})

const emit = defineEmits<ZSegmentedEmits>()

const theme = useZTheme()

const SIZE_PADDING_Y: Record<ZSegmentedSize, number> = {
  small: 0.125,
  middle: 0.25,
  large: 0.375,
}

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.padding._tiny
    s.backgroundColor._bgMuted
    s.borderRadius._small
    s.gap._tiny
    if (props.block) s.width.pct(100)
    if (props.disabled) s.opacity._dim
    props.css?.(s)
  }),
)

function itemClass(opt: ZSegmentedOption): string {
  const isActive = props.value === opt.value
  const isDisabled = opt.disabled || props.disabled
  return icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.borderStyle.none
    s.cursor(isDisabled ? 'not-allowed' : 'pointer')
    s.borderRadius._tiny
    s.fontSize._middle
    s.fontWeight._medium
    s.paddingLeft._middle
    s.paddingRight._middle
    s.paddingTop.iem(SIZE_PADDING_Y[props.size])
    s.paddingBottom.iem(SIZE_PADDING_Y[props.size])
    s.transitionProperty._colors
    s.transitionDuration._small
    if (props.block) s.flexGrow(1)
    if (isActive) {
      s.backgroundColor._bg
      s.color._text
      s.boxShadow._tiny
    } else {
      s.backgroundColor.transparent
      s.color._textSecondary
      s._hover((h) => {
        if (!isDisabled) h.color._text
      })
    }
    if (isDisabled) s.opacity._dim
  })
}

function select(opt: ZSegmentedOption): void {
  if (opt.disabled || props.disabled) return
  if (props.value === opt.value) return
  emit('update:value', opt.value)
  emit('change', opt.value)
}
</script>

<template>
  <div :class="rootClass" role="radiogroup">
    <button
      v-for="opt in options"
      :key="String(opt.value)"
      type="button"
      :class="itemClass(opt)"
      role="radio"
      :aria-checked="value === opt.value"
      :disabled="opt.disabled || disabled"
      @click="select(opt)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
