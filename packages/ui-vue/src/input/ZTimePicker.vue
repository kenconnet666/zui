<script lang="ts">
/**
 * `ZTimePicker` —— 时间选择器(走原生 `input[type=time]`)。
 *
 * - `v-model:value` —— `HH:mm` 格式字符串
 * - `step?: number` —— 秒级精度(默认 60,即不显示秒)
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZTimePickerProps {
  value?: string
  step?: number
  disabled?: boolean
  placeholder?: string
  /** 字号尺寸 —— `number`(px 倍数,1 单位 = 16px,默认 1)。同 ZInput。2026-05-24 B7。 */
  size?: number
  /** 高度 —— `number`(px 倍数,1 单位 = 16px,可选,默认 `size * 2`)。 */
  height?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZTimePickerEmits {
  (e: 'update:value', value: string): void
  (e: 'change', value: string): void
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applyInputSize } from '../_internal/input-size'

/**
 * 盒子模型(px,1 单位 = 16px;number 是 px 倍数,默认 1 单位=16px):
 *
 *   ┌──────────────────────────────────────────────────┐
 *   │ <input type="time">                              │
 *   │   font-size: sizePx(size)                        │   默认 size=1(16px)
 *   │   height: sizePx(height)                         │   默认 height=size*2=32px
 *   │   padding-y: sizePx(size*0.375)                  │   = 6px
 *   │   padding-x: sizePx(size*0.75)                   │   = 12px
 *   │   border-radius: sizePx(size*0.25)               │   = 4px
 *   │   border _thin solid _border / bg _bg / color _text │ outline none
 *   │   disabled: opacity _dim / bg _bgMuted           │
 *   └──────────────────────────────────────────────────┘
 *
 * 用户改 size 数字 → 所有 px 维度等比缩(整体比例不变)。height 可独立覆盖。
 * 时间选项走浏览器原生 spinner(step 控制秒精度)。非标准单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZTimePickerProps>(), {
  step: 60,
  disabled: false,
  size: 1,
})

const emit = defineEmits<ZTimePickerEmits>()

const theme = useZTheme()

const inputClass = computed(() =>
  icss(theme.value, s => {
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.color._text
    applyInputSize(s, props.size, props.height)
    s.outline('none')
    if (props.disabled) {
      s.opacity._dim
      s.cursor.notAllowed
      s.backgroundColor._bgMuted
    }
    props.css?.(s)
  }),
)

function onInput(e: Event): void {
  const t = e.target as HTMLInputElement
  emit('update:value', t.value)
}
function onChange(e: Event): void {
  const t = e.target as HTMLInputElement
  emit('change', t.value)
}
</script>

<template>
  <input
    :class="inputClass"
    type="time"
    :value="value"
    :step="step"
    :disabled="disabled"
    :placeholder="placeholder"
    @input="onInput"
    @change="onChange"
  />
</template>
