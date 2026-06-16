<script lang="ts">
/**
 * `ZDatePicker` —— 日期选择器(走原生 `input[type=date]` 配 zui 输入框样式)。
 *
 * **设计**:Phase α 简化,不做自绘日历;Phase γ 后期再做更复杂的 popup-calendar(date-fns 集成)。
 *
 * **API**:
 * - `v-model:value` —— ISO 字符串 `YYYY-MM-DD`
 * - `min?` / `max?` —— 限制日期范围
 * - `disabled?` / `placeholder?` / `size?`
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZDatePickerProps {
  value?: string
  min?: string
  max?: string
  disabled?: boolean
  placeholder?: string
  /** 字号尺寸 —— `number`(px 倍数,1 单位 = 16px,默认 1)。同 ZInput。2026-05-24 B7。 */
  size?: number
  /** 高度 —— `number`(px 倍数,1 单位 = 16px,可选,默认 `size * 2`)。 */
  height?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZDatePickerEmits {
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
 *   │ <input type="date">                              │
 *   │   font-size: sizePx(size)                        │   默认 size=1(16px)
 *   │   height: sizePx(height)                         │   默认 height=size*2=32px
 *   │   padding-y: sizePx(size*0.375)                  │   = 6px
 *   │   padding-x: sizePx(size*0.75)                   │   = 12px
 *   │   border-radius: sizePx(size*0.25)               │   = 4px
 *   │   border _thin solid _border / bg _bg / color _text │ outline none
 *   │   hover: borderColor _primary                    │
 *   │   disabled: opacity _dim / bg _bgMuted           │
 *   └──────────────────────────────────────────────────┘
 *
 * 用户改 size 数字 → 所有 px 维度等比缩(整体比例不变)。height 可独立覆盖。
 * 日期选项 popup 走浏览器原生(Phase α 简化),不可样式化。非标准单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZDatePickerProps>(), {
  disabled: false,
  size: 1,
})

const emit = defineEmits<ZDatePickerEmits>()

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
    s._hover(h => {
      if (!props.disabled) h.borderColor._primary
    })
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
    type="date"
    :value="value"
    :min="min"
    :max="max"
    :disabled="disabled"
    :placeholder="placeholder"
    @input="onInput"
    @change="onChange"
  />
</template>
