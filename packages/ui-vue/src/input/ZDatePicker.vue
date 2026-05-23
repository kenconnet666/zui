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

export type ZDatePickerSize = 'small' | 'middle' | 'large'

export interface ZDatePickerProps {
  value?: string
  min?: string
  max?: string
  disabled?: boolean
  placeholder?: string
  size?: ZDatePickerSize
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

const props = withDefaults(defineProps<ZDatePickerProps>(), {
  disabled: false,
  size: 'middle',
})

const emit = defineEmits<ZDatePickerEmits>()

const theme = useZTheme()

const SIZE_PADDING_Y: Record<ZDatePickerSize, number> = {
  small: 0.25,
  middle: 0.375,
  large: 0.5,
}

const inputClass = computed(() =>
  icss(theme.value, (s) => {
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.color._text
    s.fontSize._middle
    s.paddingLeft._small
    s.paddingRight._small
    s.paddingTop.iem(SIZE_PADDING_Y[props.size])
    s.paddingBottom.iem(SIZE_PADDING_Y[props.size])
    s._prop('outline', 'none')
    s._hover((h) => {
      if (!props.disabled) h.borderColor._primary
    })
    if (props.disabled) {
      s.opacity._dim
      s._prop('cursor', 'not-allowed')
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
