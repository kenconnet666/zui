<script lang="ts">
/**
 * `ZInputNumber` —— 数字输入(带上下增减按钮)。
 *
 * **API**:
 * - `v-model:value`(number | null)
 * - `step?: number` —— 默认 `1`
 * - `min?: number` / `max?: number` —— 边界
 * - `precision?: number` —— 小数位数(`undefined` 不限制)
 * - `disabled` / `readonly`
 * - `size: 'small' | 'middle' | 'large'`
 *
 * **emit**:`update:value` / `change` / `focus` / `blur`
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export type ZInputNumberSize = 'small' | 'middle' | 'large'

export interface ZInputNumberProps {
  value?: number | null
  step?: number
  min?: number
  max?: number
  precision?: number
  disabled?: boolean
  readonly?: boolean
  size?: ZInputNumberSize
  placeholder?: string
  sxInput?: SxObject
  sxButton?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZInputNumberEmits {
  (e: 'update:value', value: number | null): void
  (e: 'change', value: number | null): void
  (e: 'focus', evt: FocusEvent): void
  (e: 'blur', evt: FocusEvent): void
}
</script>

<script lang="ts" setup>
import { computed, h } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { BuiltinIcons, ZIcon } from '../gene'

const props = withDefaults(defineProps<ZInputNumberProps>(), {
  step: 1,
  disabled: false,
  readonly: false,
  size: 'middle',
})

const emit = defineEmits<ZInputNumberEmits>()

const theme = useZTheme()

const SIZE_PADDING_Y: Record<ZInputNumberSize, number> = {
  small: 0.25,
  middle: 0.375,
  large: 0.5,
}

const displayValue = computed(() => {
  if (props.value === null || props.value === undefined) return ''
  if (props.precision !== undefined) return props.value.toFixed(props.precision)
  return String(props.value)
})

function clamp(v: number): number {
  if (props.min !== undefined && v < props.min) return props.min
  if (props.max !== undefined && v > props.max) return props.max
  if (props.precision !== undefined) return Number(v.toFixed(props.precision))
  return v
}

function inc(): void {
  if (props.disabled || props.readonly) return
  const cur = props.value ?? 0
  emit('update:value', clamp(cur + props.step))
  emit('change', clamp(cur + props.step))
}
function dec(): void {
  if (props.disabled || props.readonly) return
  const cur = props.value ?? 0
  emit('update:value', clamp(cur - props.step))
  emit('change', clamp(cur - props.step))
}

function onInput(e: Event): void {
  const target = e.target as HTMLInputElement
  if (target.value === '') {
    emit('update:value', null)
    return
  }
  const num = Number(target.value)
  if (Number.isNaN(num)) return
  emit('update:value', clamp(num))
}
function onBlur(e: FocusEvent): void {
  emit('blur', e)
}
function onFocus(e: FocusEvent): void {
  emit('focus', e)
}

const wrapperClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.color._text
    s.fontSize._middle
    s.paddingTop.iem(SIZE_PADDING_Y[props.size])
    s.paddingBottom.iem(SIZE_PADDING_Y[props.size])
    s.paddingLeft._small
    s.paddingRight._tiny
    if (props.disabled) {
      s.opacity._dim
      s.backgroundColor._bgMuted
    }
    props.css?.(s)
  }),
)

const inputClass = computed(() =>
  icss(theme.value, (s) => {
    s.flexGrow(1)
    s.borderStyle.none
    s.backgroundColor.transparent
    s.color.currentColor
    s.fontSize.inherit
    s._prop('outline', 'none')
    s._prop('minWidth', '0')
    s.width.pct(100)
    s._prop('textAlign', 'left')
    applySx(s, props.sxInput)
  }),
)
const sxInputAttrs = computed(() => extractSxAttrs(props.sxInput))

const btnGroupClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.flexDirection.column
    s.flexShrink(0)
    s.marginLeft._tiny
  }),
)

const btnClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.borderStyle.none
    s.backgroundColor.transparent
    s.color._textSecondary
    s.cursor.pointer
    s._prop('width', 'calc(1 * var(--zui-iem, 16px))')
    s._prop('height', 'calc(0.625 * var(--zui-iem, 16px))')
    s.padding('0')
    s.fontSize._small
    s.borderRadius._tiny
    s._hover((h2) => {
      h2.color._primary
      h2.backgroundColor._primary.alpha(8)
    })
    if (props.disabled) {
      s._prop('cursor', 'not-allowed')
    }
    applySx(s, props.sxButton)
  }),
)
const sxButtonAttrs = computed(() => extractSxAttrs(props.sxButton))

const upIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronUp }))
const downIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronDown }))
</script>

<template>
  <div :class="wrapperClass">
    <input
      :class="[inputClass, sxInputAttrs.class]"
      :style="sxInputAttrs.style"
      type="text"
      inputmode="numeric"
      :value="displayValue"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      v-bind="sxInputAttrs.attrs"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />
    <span :class="btnGroupClass">
      <button
        type="button"
        :class="[btnClass, sxButtonAttrs.class]"
        :style="sxButtonAttrs.style"
        aria-label="增加"
        :disabled="disabled"
        tabindex="-1"
        v-bind="sxButtonAttrs.attrs"
        @click="inc"
      >
        <component :is="upIcon" />
      </button>
      <button
        type="button"
        :class="[btnClass, sxButtonAttrs.class]"
        :style="sxButtonAttrs.style"
        aria-label="减少"
        :disabled="disabled"
        tabindex="-1"
        v-bind="sxButtonAttrs.attrs"
        @click="dec"
      >
        <component :is="downIcon" />
      </button>
    </span>
  </div>
</template>
