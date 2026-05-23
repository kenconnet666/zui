<script lang="ts">
/**
 * `ZTimePicker` —— 时间选择器(走原生 `input[type=time]`)。
 *
 * - `v-model:value` —— `HH:mm` 格式字符串
 * - `step?: number` —— 秒级精度(默认 60,即不显示秒)
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export type ZTimePickerSize = 'small' | 'middle' | 'large'

export interface ZTimePickerProps {
  value?: string
  step?: number
  disabled?: boolean
  placeholder?: string
  size?: ZTimePickerSize
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

const props = withDefaults(defineProps<ZTimePickerProps>(), {
  step: 60,
  disabled: false,
  size: 'middle',
})

const emit = defineEmits<ZTimePickerEmits>()

const theme = useZTheme()

const SIZE_PADDING_Y: Record<ZTimePickerSize, number> = {
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
    type="time"
    :value="value"
    :step="step"
    :disabled="disabled"
    :placeholder="placeholder"
    @input="onInput"
    @change="onChange"
  />
</template>
