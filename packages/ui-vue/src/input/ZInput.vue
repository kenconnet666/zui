<script lang="ts">
/**
 * `ZInput` —— 文本输入框(text/password/email/url/number/tel/search/...)。
 *
 * **API**:
 * - `v-model`(`value` + `update:value`)—— 双向绑定
 * - `type?: string` —— HTML input type,默认 `'text'`
 * - `size?: SizePropMulti` —— 尺寸 factory(默认等价 `INPUT_SIZE_MAP.middle`)
 * - `disabled` / `readonly` —— 标准 HTML 状态
 * - `placeholder` —— 占位文字
 * - `clearable` —— 显示清空按钮(有值时)
 * - `showCount` —— 显示字数(配合 `maxlength` 一起用)
 * - `maxlength` —— HTML maxlength
 * - `prefix` / `suffix` slot —— 前后图标 / 文字
 * - sx:sxPrefix / sxSuffix / sxClear / sxInput
 *
 * **emit**:`update:value` / `change` / `focus` / `blur` / `clear` / `pressEnter`
 *
 * **a11y**:`<input>` 原生即可,`disabled` / `readonly` 自动到 input 上。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export interface ZInputProps {
  value?: string | number
  type?: string
  /**
   * 字号尺寸 —— `number`(iem 倍数,默认 1)。
   *
   * 2026-05-24 B7:数值尺寸 prop 改 `number`,组件按比例算 height/padding/border-radius。
   *
   * 内部公式:font-size = size iem,height 默认 size*2 iem,padding-y = size*0.375 iem,
   * padding-x = size*0.75 iem,border-radius = size*0.25 iem。
   */
  size?: number
  /** 高度 —— `number`(iem 倍数,可选,默认 `size * 2`)。 */
  height?: number
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  clearable?: boolean
  showCount?: boolean
  maxlength?: number
  autofocus?: boolean

  sxInput?: SxObject
  sxPrefix?: SxObject
  sxSuffix?: SxObject
  sxClear?: SxObject

  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZInputEmits {
  (e: 'update:value', value: string): void
  (e: 'change', value: string, evt: Event): void
  (e: 'focus', evt: FocusEvent): void
  (e: 'blur', evt: FocusEvent): void
  (e: 'clear'): void
  (e: 'pressEnter', evt: KeyboardEvent): void
}
</script>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { applyInputSize } from '../_internal/input-size'
import { BuiltinIcons, ZIcon } from '../gene'

/**
 * 盒子模型(iem,Provider 控制基准;number 是 iem 倍数,默认 1iem=16px @ 1080p):
 *
 *   ┌─────────────────────────────────────────────────────┐
 *   │ wrapper  inline-flex / center / gap _tiny           │
 *   │   font-size: `size` iem                             │   默认 size=1(16px @ 1080p)
 *   │   height: `height` iem                              │   默认 height=size*2=2iem(32px)
 *   │   padding-y: size*0.375 iem                         │   = 0.375iem(6px)
 *   │   padding-x: size*0.75 iem                          │   = 0.75iem(12px)
 *   │   border-radius: size*0.25 iem                      │   = 0.25iem(4px)
 *   │   border _thin solid _border / bg _bg / color _text │   width 100% / lineHeight _normal
 *   │   focused: borderColor _primary + boxShadow _tiny   │
 *   │   disabled: opacity _dim / bg _bgMuted              │
 *   │                                                     │
 *   │  ┌────┐ ┌───────────────┐ ┌─────┐ ┌────┐ ┌────┐    │
 *   │  │prfx│ │ <input>       │ │clear│ │N/M │ │sufx│    │
 *   │  │slot│ │  flex-grow 1  │ │ ×   │ │_tiny│ │slot│    │
 *   │  │_2nd│ │  bg transp    │ │ _2nd│ │_2nd │ │_2nd│    │
 *   │  └────┘ │  outline none │ └─────┘ └────┘ └────┘    │
 *   │         └───────────────┘                           │
 *   └─────────────────────────────────────────────────────┘
 *
 * 用户改 size 数字 → 所有 iem 维度等比缩放(整体比例不变)。height 可独立覆盖。
 * 各小元素: prefix/suffix slot (inline-flex / _textSecondary),clear btn(条件 clearable + 有值),
 * counter(条件 showCount)。非 iem 单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZInputProps>(), {
  type: 'text',
  size: 1,
  disabled: false,
  readonly: false,
  clearable: false,
  showCount: false,
  autofocus: false,
})

const emit = defineEmits<ZInputEmits>()

const theme = useZTheme()

const inputRef = ref<HTMLInputElement | null>(null)
const focused = ref(false)

const innerValue = computed(() => (props.value ?? '').toString())

const wrapperClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap._tiny
    applyInputSize(s, props.size, props.height)
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.color._text
    s.lineHeight._normal
    s.width.pct(100)
    s.transitionProperty._colors
    s.transitionDuration._small
    if (focused.value && !props.disabled) {
      s.borderColor._primary
      s.boxShadow._tiny
    }
    if (props.disabled) {
      s.opacity._dim
      s.cursor.notAllowed
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
    s.lineHeight.inherit
    s.outline('none')
    s.width.pct(100)
    s.minWidth.px(0)
    if (props.disabled) {
      s.cursor.notAllowed
    }
    applySx(s, props.sxInput)
  }),
)
const sxInputAttrs = computed(() => extractSxAttrs(props.sxInput))

const affixClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.color._textSecondary
    s.flexShrink(0)
  }),
)

const clearBtnClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.cursor.pointer
    s.backgroundColor.transparent
    s.borderStyle.none
    s.padding.px(0)
    s.color._textSecondary
    s._hover(h2 => {
      h2.color._text
    })
    applySx(s, props.sxClear)
  }),
)
const sxClearAttrs = computed(() => extractSxAttrs(props.sxClear))

const countClass = computed(() =>
  icss(theme.value, s => {
    s.fontSize._tiny
    s.color._textSecondary
    s.flexShrink(0)
  }),
)

const sxPrefixAttrs = computed(() => extractSxAttrs(props.sxPrefix))
const sxSuffixAttrs = computed(() => extractSxAttrs(props.sxSuffix))

function onInput(e: Event): void {
  const target = e.target as HTMLInputElement
  emit('update:value', target.value)
}
function onChange(e: Event): void {
  const target = e.target as HTMLInputElement
  emit('change', target.value, e)
}
function onFocus(e: FocusEvent): void {
  focused.value = true
  emit('focus', e)
}
function onBlur(e: FocusEvent): void {
  focused.value = false
  emit('blur', e)
}
function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter') emit('pressEnter', e)
}
function onClear(): void {
  emit('update:value', '')
  emit('clear')
  inputRef.value?.focus()
}

const showClear = computed(
  () => props.clearable && !props.disabled && !props.readonly && innerValue.value.length > 0,
)
const showCounter = computed(() => props.showCount)

const clearIconNode = computed(() => h(ZIcon, { component: BuiltinIcons.close }))

const rootRef = ref<HTMLDivElement | null>(null)
/**
 * input 元素 ref 合并器 —— 同时写入内部 `inputRef`(focus 等内部用)与
 * 用户传入的 `sxInput.ref`(string / function / Ref 对象,VNodeRef 形式)。
 */
function bindInput(el: unknown): void {
  const node = (el as HTMLInputElement | null) ?? null
  inputRef.value = node
  const userRef = sxInputAttrs.value.ref
  if (typeof userRef === 'function') userRef(node, {})
  else if (userRef && typeof userRef === 'object' && 'value' in userRef) {
    ;(userRef as { value: unknown }).value = node
  }
}
defineExpose({ rootRef })
</script>

<template>
  <div ref="rootRef" :class="wrapperClass">
    <span
      v-if="$slots.prefix"
      :ref="sxPrefixAttrs.ref"
      :class="[affixClass, sxPrefixAttrs.class]"
      :style="sxPrefixAttrs.style"
      v-bind="sxPrefixAttrs.attrs"
    >
      <slot name="prefix" />
    </span>

    <input
      :ref="bindInput"
      :class="[inputClass, sxInputAttrs.class]"
      :style="sxInputAttrs.style"
      :type="type"
      :value="innerValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :autofocus="autofocus"
      v-bind="sxInputAttrs.attrs"
      @input="onInput"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeydown"
    />

    <button
      v-if="showClear"
      type="button"
      :ref="sxClearAttrs.ref"
      :class="[clearBtnClass, sxClearAttrs.class]"
      :style="sxClearAttrs.style"
      aria-label="清空"
      tabindex="-1"
      v-bind="sxClearAttrs.attrs"
      @click="onClear"
    >
      <component :is="clearIconNode" />
    </button>

    <span v-if="showCounter" :class="countClass">
      {{ innerValue.length }}<template v-if="maxlength">/{{ maxlength }}</template>
    </span>

    <span
      v-if="$slots.suffix"
      :ref="sxSuffixAttrs.ref"
      :class="[affixClass, sxSuffixAttrs.class]"
      :style="sxSuffixAttrs.style"
      v-bind="sxSuffixAttrs.attrs"
    >
      <slot name="suffix" />
    </span>
  </div>
</template>
