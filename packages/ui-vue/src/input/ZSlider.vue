<script lang="ts">
/**
 * `ZSlider` —— 数字滑块(基于原生 `<input type="range">` 包样式)。
 *
 * **API**:
 * - `v-model:value`
 * - `min?: number` / `max?: number` / `step?: number`(默认 0/100/1)
 * - `disabled?: boolean`
 * - `showValue?: boolean` —— 显示当前值标签
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZSliderProps {
  value?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  showValue?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZSliderEmits {
  (e: 'update:value', value: number): void
  (e: 'change', value: number): void
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { getThemeColor } from '../_internal/color-bridge'

const props = withDefaults(defineProps<ZSliderProps>(), {
  value: 0,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  showValue: false,
})

const emit = defineEmits<ZSliderEmits>()

const theme = useZTheme()

const percent = computed(() => {
  const range = props.max - props.min
  if (range <= 0) return 0
  return ((props.value - props.min) / range) * 100
})

const wrapperClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.alignItems.center
    s.gap._small
    s.width.pct(100)
    props.css?.(s)
  }),
)

const inputClass = computed(() =>
  icss(theme.value, (s) => {
    const primary = getThemeColor(theme.value, 'primary', '#1976d2')
    const bgMuted = getThemeColor(theme.value, 'bgMuted', '#e5e7eb')
    const bg = getThemeColor(theme.value, 'bg', '#fff')
    s.flexGrow(1)
    s.appearance.none
    s.width.pct(100)
    s.height.px(4)
    s.borderRadius._full
    s.outlineStyle.none
    s.cursor.pointer
    s.marginTop.px(8)
    s.marginBottom.px(8)
    s.background(
      `linear-gradient(to right, ${primary} 0%, ${primary} ${percent.value}%, ${bgMuted} ${percent.value}%, ${bgMuted} 100%)`,
    )
    s._disabled((d) => {
      d.cursor.notAllowed
      d.opacity._half
    })
    s._selector('&::-webkit-slider-thumb', (t) => {
      t.appearance.none
      t.width.px(16)
      t.height.px(16)
      t.borderRadius._full
      t.cursor('grab')
      t.borderWidth.px(2)
      t.borderStyle.solid
      t.borderColor(primary)
      t.background(bg)
      t.boxShadow('0 1px 3px rgba(0,0,0,0.2)')
    })
    s._selector('&::-moz-range-thumb', (t) => {
      t.width.px(16)
      t.height.px(16)
      t.borderRadius._full
      t.cursor('grab')
      t.borderWidth.px(2)
      t.borderStyle.solid
      t.borderColor(primary)
      t.background(bg)
    })
  }),
)

const valueLabelClass = computed(() =>
  icss(theme.value, (s) => {
    s.flexShrink(0)
    s.color._textSecondary
    s.fontSize._small
    s.minWidth.em(3)
    s.textAlign.right
  }),
)

function onInput(e: Event): void {
  const t = e.target as HTMLInputElement
  const v = Number(t.value)
  emit('update:value', v)
}
function onChange(e: Event): void {
  const t = e.target as HTMLInputElement
  emit('change', Number(t.value))
}
</script>

<template>
  <div :class="wrapperClass">
    <input
      :class="inputClass"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="value"
      :disabled="disabled"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="value"
      @input="onInput"
      @change="onChange"
    />
    <span v-if="showValue" :class="valueLabelClass">{{ value }}</span>
  </div>
</template>
