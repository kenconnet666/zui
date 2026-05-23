<script lang="ts">
/**
 * `ZTimePicker` —— 时间选择器(走原生 `input[type=time]`)。
 *
 * - `v-model:value` —— `HH:mm` 格式字符串
 * - `step?: number` —— 秒级精度(默认 60,即不显示秒)
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SizePropMulti } from '../_internal/size-prop'

export interface ZTimePickerProps {
  value?: string
  step?: number
  disabled?: boolean
  placeholder?: string
  /** 尺寸 —— `factory | Size5 | undefined` union(复用 INPUT_SIZE_MAP)。 */
  size?: SizePropMulti
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
import { applySizeProp } from '../_internal/size-prop'
import { INPUT_SIZE_MAP } from '../_internal/component-sizes'

const props = withDefaults(defineProps<ZTimePickerProps>(), {
  step: 60,
  disabled: false,
  size: 'middle',
})

const emit = defineEmits<ZTimePickerEmits>()

const theme = useZTheme()

const inputClass = computed(() =>
  icss(theme.value, (s) => {
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.color._text
    applySizeProp(props.size, INPUT_SIZE_MAP, s)
    s.paddingLeft._small
    s.paddingRight._small
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
