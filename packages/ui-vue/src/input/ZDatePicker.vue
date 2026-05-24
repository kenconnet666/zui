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
import type { SizePropMulti } from '../_internal/size-prop'

export interface ZDatePickerProps {
  value?: string
  min?: string
  max?: string
  disabled?: boolean
  placeholder?: string
  /** 尺寸 —— 纯 factory(默认 `INPUT_SIZE_MAP.middle`,复用 INPUT_SIZE_MAP)。 */
  size?: SizePropMulti
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
import { applySizeProp } from '../_internal/size-prop'
import { INPUT_SIZE_MAP } from '../_internal/component-sizes'

const props = withDefaults(defineProps<ZDatePickerProps>(), {
  disabled: false,
  size: INPUT_SIZE_MAP.middle,
})

const emit = defineEmits<ZDatePickerEmits>()

const theme = useZTheme()

const inputClass = computed(() =>
  icss(theme.value, (s) => {
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.color._text
    applySizeProp(props.size, s)
    s.paddingLeft._small
    s.paddingRight._small
    s.outline('none')
    s._hover((h) => {
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
