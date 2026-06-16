<script lang="ts">
/**
 * `ZDateRangePicker` —— 日期范围选择器（开始~结束），基于两个原生 `input[type=date]`。
 *
 * **API**:
 * - `v-model:value` —— `[string, string] | null`（ISO `yyyy-mm-dd` 对；null = 空）
 * - `min?` / `max?` —— 限制整体可选范围
 * - `disabled?` / `startPlaceholder?` / `endPlaceholder?` / `separator?`
 * - `size?` / `height?` —— 同 ZDatePicker，px 倍数，1 单位 = 16px
 * - `css?` —— 根容器 CSS 兜底
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZDateRangePickerProps {
  /** ISO 日期对 `[yyyy-mm-dd, yyyy-mm-dd]`；null 表示空。 */
  value?: [string, string] | null | undefined
  /** 整体最早可选日期 `yyyy-mm-dd`。 */
  min?: string | undefined
  /** 整体最晚可选日期 `yyyy-mm-dd`。 */
  max?: string | undefined
  disabled?: boolean | undefined
  startPlaceholder?: string | undefined
  endPlaceholder?: string | undefined
  /** 两个日期输入框之间的分隔符，默认 `~`。 */
  separator?: string | undefined
  /**
   * 字号尺寸 —— `number`（px 倍数，1 单位 = 16px，默认 1）。
   *
   * 盒子模型（1 单位 = 16px）：
   * - font-size: size * 16px（默认 16px）
   * - height: (height ?? size * 2) * 16px（默认 32px）
   * - padding-y: size * 0.375 * 16px（= 6px）
   * - padding-x: size * 0.75 * 16px（= 12px）
   * - border-radius: size * 0.25 * 16px（= 4px）
   */
  size?: number | undefined
  /** 高度 —— `number`（px 倍数，1 单位 = 16px，默认 `size * 2`）。 */
  height?: number | undefined
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZDateRangePickerEmits {
  (e: 'update:value', value: [string, string] | null): void
  (e: 'change', value: [string, string] | null): void
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applyInputSize } from '../_internal/input-size'
import { sizePx } from '../_internal/sizing'

const props = withDefaults(defineProps<ZDateRangePickerProps>(), {
  disabled: false,
  separator: '~',
  size: 1,
})

const emit = defineEmits<ZDateRangePickerEmits>()

const theme = useZTheme()

/** 当前开始日期（字符串）。 */
const startValue = computed(() => props.value?.[0] ?? '')
/** 当前结束日期（字符串）。 */
const endValue = computed(() => props.value?.[1] ?? '')

/**
 * 结束 input 的 min = max(props.min, startValue)，防止结束日期早于开始日期。
 * 若无开始日期则退化为 props.min。
 */
const endMin = computed(() => {
  const s = startValue.value
  const m = props.min
  if (!s) return m
  if (!m) return s
  return s > m ? s : m
})

/**
 * 开始 input 的 max = min(props.max, endValue)，防止开始日期晚于结束日期。
 * 若无结束日期则退化为 props.max。
 */
const startMax = computed(() => {
  const e = endValue.value
  const x = props.max
  if (!e) return x
  if (!x) return e
  return e < x ? e : x
})

/** 容器样式：flex 横向排列两个 input + 分隔符。 */
const containerClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap.px(sizePx((props.size ?? 1) * 0.375))
    props.css?.(s)
  }),
)

/** 单个 input 的公共样式。 */
const inputClass = computed(() =>
  icss(theme.value, s => {
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.color._text
    applyInputSize(s, props.size, props.height)
    s.outline('none')
    s._hover(h => {
      if (!props.disabled) h.borderColor._primary
    })
    if (props.disabled) {
      s.opacity._dim
      s.cursor.notAllowed
      s.backgroundColor._bgMuted
    }
  }),
)

/** 分隔符样式。 */
const separatorClass = computed(() =>
  icss(theme.value, s => {
    s.color._textSecondary
    s.fontSize.px(sizePx(props.size ?? 1))
    s.userSelect.none
  }),
)

function onStartInput(e: Event): void {
  const t = e.target as HTMLInputElement
  const newStart = t.value
  const end = endValue.value
  const next: [string, string] | null =
    newStart ? [newStart, end] : end ? ['', end] : null
  emit('update:value', next)
}

function onStartChange(e: Event): void {
  const t = e.target as HTMLInputElement
  const newStart = t.value
  const end = endValue.value
  const next: [string, string] | null =
    newStart ? [newStart, end] : end ? ['', end] : null
  emit('change', next)
}

function onEndInput(e: Event): void {
  const t = e.target as HTMLInputElement
  const newEnd = t.value
  const start = startValue.value
  const next: [string, string] | null =
    newEnd ? [start, newEnd] : start ? [start, ''] : null
  emit('update:value', next)
}

function onEndChange(e: Event): void {
  const t = e.target as HTMLInputElement
  const newEnd = t.value
  const start = startValue.value
  const next: [string, string] | null =
    newEnd ? [start, newEnd] : start ? [start, ''] : null
  emit('change', next)
}
</script>

<template>
  <div :class="containerClass" role="group" aria-label="日期范围">
    <input
      :class="inputClass"
      type="date"
      :value="startValue"
      :min="min"
      :max="startMax"
      :disabled="disabled"
      :placeholder="startPlaceholder"
      aria-label="开始日期"
      @input="onStartInput"
      @change="onStartChange"
    />
    <span :class="separatorClass" aria-hidden="true">{{ separator }}</span>
    <input
      :class="inputClass"
      type="date"
      :value="endValue"
      :min="endMin"
      :max="max"
      :disabled="disabled"
      :placeholder="endPlaceholder"
      aria-label="结束日期"
      @input="onEndInput"
      @change="onEndChange"
    />
  </div>
</template>
