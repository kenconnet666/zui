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
 * - `size?: SizePropMulti` —— 尺寸 factory(默认等价 `INPUT_SIZE_MAP.middle`)
 *
 * **emit**:`update:value` / `change` / `focus` / `blur`
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export interface ZInputNumberProps {
  value?: number | null
  step?: number
  min?: number
  max?: number
  precision?: number
  disabled?: boolean
  readonly?: boolean
  /**
   * 字号尺寸 —— `number`(iem 倍数,默认 1)。
   *
   * 2026-05-24 B7:数值尺寸 prop 改 `number`,组件按比例算 height/padding/border-radius。
   */
  size?: number
  /** 高度 —— `number`(iem 倍数,可选,默认 `size * 2`)。 */
  height?: number
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
import { applyInputSize } from '../_internal/input-size'
import { BuiltinIcons, ZIcon } from '../gene'

/**
 * 盒子模型(iem,Provider 控制基准;number 是 iem 倍数,默认 1iem=16px @ 1080p):
 *
 *   ┌──────────────────────────────────────────────────┐
 *   │ wrapper  inline-flex / center                    │
 *   │   font-size: `size` iem                          │   默认 size=1(16px @ 1080p)
 *   │   height: `height` iem                           │   默认 height=size*2=2iem(32px)
 *   │   padding-y: size*0.375 iem                      │   = 0.375iem(6px)
 *   │   padding-l: size*0.75 iem                       │   = 0.75iem(12px)
 *   │   padding-r: _tiny(留出 btn 空间)              │
 *   │   border-radius: size*0.25 iem                   │   = 0.25iem(4px)
 *   │   border _thin solid _border / bg _bg            │   disabled: opacity _dim / bg _bgMuted
 *   │                                                  │
 *   │  ┌────────────────────────┐  ┌────────────────┐  │   btn group(垂直堆叠):
 *   │  │ <input> text 数字       │  │ ┌────────────┐ │  │     ┌──────┐
 *   │  │  inputmode numeric      │  │ │ ▲ inc btn  │ │  │     │ inc  │  width 1iem
 *   │  │  flex-grow 1            │  │ │ 1iem×0.625 │ │  │     │ 0.625│  height 0.625iem
 *   │  │  bg transparent         │  │ ├────────────┤ │  │     ├──────┤  hover color _primary
 *   │  │  outline none           │  │ │ ▼ dec btn  │ │  │     │ dec  │
 *   │  │  textAlign left         │  │ │ 1iem×0.625 │ │  │     │ 0.625│
 *   │  └────────────────────────┘  │ └────────────┘ │  │     └──────┘
 *   │                               └────────────────┘  │
 *   └──────────────────────────────────────────────────┘
 *
 * 用户改 size 数字 → input 所有 iem 维度等比缩(整体比例不变)。height 可独立覆盖。
 * 非 iem 单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZInputNumberProps>(), {
  step: 1,
  disabled: false,
  readonly: false,
  size: 1,
})

const emit = defineEmits<ZInputNumberEmits>()

const theme = useZTheme()

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
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.color._text
    applyInputSize(s, props.size, props.height)
    if (props.disabled) {
      s.opacity._dim
      s.backgroundColor._bgMuted
    }
    props.css?.(s)
  }),
)

const inputClass = computed(() =>
  icss(theme.value, s => {
    s.flexGrow(1)
    s.borderStyle.none
    s.backgroundColor.transparent
    s.color.currentColor
    s.fontSize.inherit
    s.outline('none')
    s.minWidth.px(0)
    s.width.pct(100)
    s.textAlign.left
    applySx(s, props.sxInput)
  }),
)
const sxInputAttrs = computed(() => extractSxAttrs(props.sxInput))

const btnGroupClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.flexDirection.column
    s.flexShrink(0)
    s.marginLeft._tiny
  }),
)

const btnClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.borderStyle.none
    s.backgroundColor.transparent
    s.color._textSecondary
    s.cursor.pointer
    s.width.iem(1)
    s.height.iem(0.625)
    s.padding.px(0)
    s.fontSize._small
    s.borderRadius._tiny
    s._hover(h2 => {
      h2.color._primary
      h2.backgroundColor._primary.alpha(8)
    })
    if (props.disabled) {
      s.cursor.notAllowed
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
      :ref="sxInputAttrs.ref"
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
        :ref="sxButtonAttrs.ref"
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
        :ref="sxButtonAttrs.ref"
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
