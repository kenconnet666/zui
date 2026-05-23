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

const SLIDER_STYLE_ID = 'zui-slider-styles'
if (typeof document !== 'undefined' && !document.getElementById(SLIDER_STYLE_ID)) {
  const style = document.createElement('style')
  style.id = SLIDER_STYLE_ID
  style.textContent = `
.zui-slider-input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 9999px;
  outline: none;
  cursor: pointer;
  margin: 8px 0;
}
.zui-slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  cursor: grab;
  border: 2px solid var(--zui-slider-thumb-border, #1976d2);
  background: var(--zui-slider-thumb-bg, #fff);
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.zui-slider-input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  cursor: grab;
  border: 2px solid var(--zui-slider-thumb-border, #1976d2);
  background: var(--zui-slider-thumb-bg, #fff);
}
.zui-slider-input:disabled { cursor: not-allowed; opacity: 0.5; }
`
  document.head.appendChild(style)
}

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
    s.flexGrow(1)
    const primary = getThemeColor(theme.value, 'primary', '#1976d2')
    const bgMuted = getThemeColor(theme.value, 'bgMuted', '#e5e7eb')
    const bg = getThemeColor(theme.value, 'bg', '#fff')
    s.background(
      `linear-gradient(to right, ${primary} 0%, ${primary} ${percent.value}%, ${bgMuted} ${percent.value}%, ${bgMuted} 100%)`,
    )
    // CSS custom properties —— chain 无对应 carrier,保留 _prop
    s._prop('--zui-slider-thumb-border', primary)
    s._prop('--zui-slider-thumb-bg', bg)
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
      :class="['zui-slider-input', inputClass]"
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
