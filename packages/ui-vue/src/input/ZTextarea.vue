<script lang="ts">
/**
 * `ZTextarea` —— 多行文本输入。
 *
 * **API**(跟 ZInput 共用风格,但走 `<textarea>` 元素):
 * - `v-model:value`
 * - `rows?: number` —— 默认 `3`
 * - `maxRows?: number` —— 配合 `autosize` 使用
 * - `autosize?: boolean` —— 自动根据内容高度调整(默认 `false`)
 * - `disabled` / `readonly` / `placeholder` / `maxlength` / `showCount`
 *
 * **autosize 实现**:每次 input 时把 textarea 重置 height auto,然后设为 scrollHeight,
 * 受 `maxRows` 限制(通过 line-height * maxRows 上限,超出走 scrollbar)。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export interface ZTextareaProps {
  value?: string
  rows?: number
  maxRows?: number
  autosize?: boolean
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  maxlength?: number
  showCount?: boolean
  autofocus?: boolean
  sxTextarea?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZTextareaEmits {
  (e: 'update:value', value: string): void
  (e: 'change', value: string, evt: Event): void
  (e: 'focus', evt: FocusEvent): void
  (e: 'blur', evt: FocusEvent): void
}
</script>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'

/**
 * 盒子模型(iem,Provider 控制基准):
 *
 *   ┌──────────────────────────────────────────────────┐
 *   │ wrapper  inline-flex column / gap _tiny          │   padding: _small
 *   │   padding _small  border _thin solid _border     │   border-radius: _small
 *   │   border-radius _small  bg _bg  color _text      │   fontSize: _middle
 *   │   fontSize _middle  lineHeight _normal           │   width: 100%
 *   │   focused: borderColor _primary                  │
 *   │   disabled: opacity _dim / bg _bgMuted           │
 *   │                                                  │
 *   │  ┌────────────────────────────────────────────┐  │
 *   │  │ <textarea>                                 │  │   rows 默认 3
 *   │  │  bg transparent / outline none             │  │   autosize=true → resize none + JS 高度
 *   │  │  resize: autosize→none / 否则 vertical    │  │   autosize=false → resize vertical
 *   │  │  width 100%  fontSize/lineHeight inherit  │  │
 *   │  └────────────────────────────────────────────┘  │
 *   │                              ┌──────────┐        │   counter(showCount=true):
 *   │                              │ N/M _tiny│        │     alignSelf flexEnd
 *   │                              │ _textSec │        │     fontSize _tiny
 *   │                              └──────────┘        │
 *   └──────────────────────────────────────────────────┘
 */
const props = withDefaults(defineProps<ZTextareaProps>(), {
  rows: 3,
  autosize: false,
  disabled: false,
  readonly: false,
  showCount: false,
  autofocus: false,
})

const emit = defineEmits<ZTextareaEmits>()

const theme = useZTheme()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const focused = ref(false)

const innerValue = computed(() => props.value ?? '')

const wrapperClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.flexDirection.column
    s.gap._tiny
    s.padding._small
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.color._text
    s.fontSize._middle
    s.lineHeight._normal
    s.width.pct(100)
    s.transitionProperty._colors
    s.transitionDuration._small
    if (focused.value && !props.disabled) {
      s.borderColor._primary
    }
    if (props.disabled) {
      s.opacity._dim
      s.cursor.notAllowed
      s.backgroundColor._bgMuted
    }

    props.css?.(s)
  }),
)

const textareaClass = computed(() =>
  icss(theme.value, (s) => {
    s.borderStyle.none
    s.backgroundColor.transparent
    s.color.currentColor
    s.fontSize.inherit
    s.lineHeight.inherit
    s.fontFamily.inherit
    s.outline('none')
    s.width.pct(100)
    s.resize(props.autosize ? 'none' : 'vertical')
    if (props.disabled) {
      s.cursor.notAllowed
    }
    applySx(s, props.sxTextarea)
  }),
)
const sxTextareaAttrs = computed(() => extractSxAttrs(props.sxTextarea))

const countClass = computed(() =>
  icss(theme.value, (s) => {
    s.fontSize._tiny
    s.color._textSecondary
    s.alignSelf.flexEnd
  }),
)

function adjustHeight(): void {
  if (!props.autosize) return
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  let next = el.scrollHeight
  if (props.maxRows) {
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20
    const max = lineHeight * props.maxRows
    if (next > max) next = max
  }
  el.style.height = `${next}px`
}

function onInput(e: Event): void {
  const target = e.target as HTMLTextAreaElement
  emit('update:value', target.value)
  nextTick(adjustHeight)
}
function onChange(e: Event): void {
  const target = e.target as HTMLTextAreaElement
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

watch(() => props.value, () => nextTick(adjustHeight))
onMounted(() => {
  if (props.autosize) nextTick(adjustHeight)
})
</script>

<template>
  <div :class="wrapperClass">
    <textarea
      ref="textareaRef"
      :class="[textareaClass, sxTextareaAttrs.class]"
      :style="sxTextareaAttrs.style"
      :value="innerValue"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :autofocus="autofocus"
      v-bind="sxTextareaAttrs.attrs"
      @input="onInput"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
    />
    <span v-if="showCount" :class="countClass">
      {{ innerValue.length }}<template v-if="maxlength">/{{ maxlength }}</template>
    </span>
  </div>
</template>
