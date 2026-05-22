<script lang="ts">
/**
 * `ZCheckbox` —— 复选框,单独使用或配合 `ZCheckboxGroup`(通过 provide/inject)。
 *
 * **单独使用**:
 * - `v-model:checked`(boolean)
 * - `label?: string` —— 文字标签
 * - `disabled` / `indeterminate`
 *
 * **Group 内使用**:
 * - `value` —— 该选项对应的值
 * - `checked` 由 group 维护(group v-model:value 是 `any[]` 数组)
 *
 * **a11y**:原生 `<input type="checkbox">`,无障碍 free。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export interface ZCheckboxProps {
  /** 单独使用的双向绑定值。 */
  checked?: boolean
  /** Group 内的选项值。 */
  value?: string | number | boolean
  label?: string
  disabled?: boolean
  indeterminate?: boolean
  sxBox?: SxObject
  sxLabel?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZCheckboxEmits {
  (e: 'update:checked', checked: boolean): void
  (e: 'change', checked: boolean): void
}
</script>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { Z_CHECKBOX_GROUP_KEY, type CheckboxGroupCtx } from './_checkbox-group'

const props = withDefaults(defineProps<ZCheckboxProps>(), {
  checked: false,
  disabled: false,
  indeterminate: false,
})

const emit = defineEmits<ZCheckboxEmits>()

const theme = useZTheme()

const group = inject<CheckboxGroupCtx | null>(Z_CHECKBOX_GROUP_KEY, null)

const isChecked = computed(() =>
  group ? group.values.value.includes(props.value as never) : props.checked,
)

const isDisabled = computed(() => props.disabled || group?.disabled.value === true)

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap._tiny
    s.cursor.pointer
    s.color._text
    s.fontSize._middle
    if (isDisabled.value) {
      s.opacity._dim
      s._prop('cursor', 'not-allowed')
    }
    props.css?.(s)
  }),
)

const boxClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s._prop('width', 'calc(1 * var(--zui-iem, 16px))')
    s._prop('height', 'calc(1 * var(--zui-iem, 16px))')
    s.borderRadius._tiny
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.transitionProperty._colors
    s.transitionDuration._small
    if (isChecked.value || props.indeterminate) {
      s.borderColor._primary
      s.backgroundColor._primary
      s.color._bg
    }
    applySx(s, props.sxBox)
  }),
)
const sxBoxAttrs = computed(() => extractSxAttrs(props.sxBox))

const labelClass = computed(() =>
  icss(theme.value, (s) => {
    applySx(s, props.sxLabel)
  }),
)
const sxLabelAttrs = computed(() => extractSxAttrs(props.sxLabel))

function onChange(e: Event): void {
  if (isDisabled.value) return
  const target = e.target as HTMLInputElement
  if (group) {
    group.toggle(props.value as never, target.checked)
  } else {
    emit('update:checked', target.checked)
    emit('change', target.checked)
  }
}

const checkSvg = `<svg viewBox="0 0 16 16" width="0.75em" height="0.75em" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 8 7 12 13 4"/></svg>`
const dashSvg = `<svg viewBox="0 0 16 16" width="0.75em" height="0.75em" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="3" y1="8" x2="13" y2="8"/></svg>`

const innerSvg = computed(() => {
  if (props.indeterminate) return dashSvg
  if (isChecked.value) return checkSvg
  return ''
})
</script>

<template>
  <label :class="rootClass">
    <span
      :class="[boxClass, sxBoxAttrs.class]"
      :style="sxBoxAttrs.style"
      v-bind="sxBoxAttrs.attrs"
      v-html="innerSvg"
    />
    <input
      type="checkbox"
      :checked="isChecked"
      :disabled="isDisabled"
      :aria-checked="indeterminate ? 'mixed' : isChecked"
      style="position: absolute; opacity: 0; pointer-events: none; width: 0; height: 0"
      @change="onChange"
    />
    <span
      v-if="label || $slots.default"
      :class="[labelClass, sxLabelAttrs.class]"
      :style="sxLabelAttrs.style"
      v-bind="sxLabelAttrs.attrs"
    >
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
