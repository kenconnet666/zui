<script lang="ts">
/**
 * `ZInputOTP` —— 一次性密码（OTP / 验证码）输入框。
 *
 * **API**:
 * - `v-model:value` (`value` + `update:value`) —— 当前已输入的字符串（长度 ≤ `length`）
 * - `length?: number` —— 位数，默认 6
 * - `type?: ZInputOTPType` —— `'text'`（默认）或 `'number'`（只接受数字）
 * - `size?: number` —— px 倍数，1 单位 = 16px，默认 1；box 高/宽 = `size * 2.5 * 16` px
 * - `disabled?: boolean` —— 禁用所有输入框
 * - `placeholder?: string` —— 单个字符占位（可选）
 * - `css?` —— 容器 CSS 逃生口
 *
 * **emit**:
 * - `update:value` —— 值变更（v-model:value）
 * - `complete` —— 所有位填满时触发，payload 为完整字符串
 *
 * **a11y**:容器 `role="group"` + 每个 input `aria-label="OTP digit N"`。
 *
 * **交互**:
 * - 打字 → 自动跳下一格；Backspace 空格跳上一格；Left / Right 方向键导航；
 * - 粘贴多字符 → 从当前格起填满（不超过 length）。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

/** OTP 输入类型：文本或纯数字。 */
export type ZInputOTPType = 'text' | 'number'

export interface ZInputOTPProps {
  /** 当前值（v-model:value），长度 ≤ `length`。 */
  value?: string | undefined
  /**
   * 验证码位数，默认 6。
   */
  length?: number | undefined
  /**
   * 框体尺寸 —— px 倍数，1 单位 = 16px，默认 1。
   *
   * 内部公式：
   * - font-size = sizePx(size) = size × 16 px（默认 16 px）
   * - width = height = sizePx(size × 2.5) = size × 40 px（默认 40 px）
   * - border-radius = sizePx(size × 0.25) = size × 4 px（默认 4 px）
   */
  size?: number | undefined
  /** 禁用所有输入框。 */
  disabled?: boolean | undefined
  /** 单字符占位（仅在对应位为空时显示）。 */
  placeholder?: string | undefined
  /** 输入模式：`'text'`（默认）或 `'number'`（仅接受数字 0-9）。 */
  type?: ZInputOTPType | undefined
  /** 容器 CSS 兜底（逃生口）。 */
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZInputOTPEmits {
  /** 值变更（v-model:value）。 */
  (e: 'update:value', v: string): void
  /** 所有位填满时触发。 */
  (e: 'complete', v: string): void
  /** 任意格变更时触发，payload 为当前字符串（与 `update:value` 同步）。 */
  (e: 'change', v: string): void
  /** 任意格聚焦时触发。 */
  (e: 'focus', event: FocusEvent): void
  /** 任意格失焦时触发。 */
  (e: 'blur', event: FocusEvent): void
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型（px，1 单位 = 16px；size 是 px 倍数，默认 1）:
 *
 *   ┌───────────────────────────────────────────────────┐
 *   │ container  inline-flex / gap _small / role=group  │
 *   │                                                   │
 *   │  ┌──────┐  ┌──────┐  ┌──────┐  …  ┌──────┐       │
 *   │  │  □   │  │  □   │  │  □   │     │  □   │       │
 *   │  │input │  │input │  │input │     │input │       │
 *   │  │ 40px │  │ 40px │  │ 40px │     │ 40px │       │
 *   │  └──────┘  └──────┘  └──────┘  …  └──────┘       │
 *   │  w/h = size×2.5×16px；font-size = size×16px        │
 *   │  border _thin solid _border；radius size×0.25×16px │
 *   │  focused: border _primary + boxShadow _tiny        │
 *   │  disabled: opacity _dim / cursor notAllowed        │
 *   └───────────────────────────────────────────────────┘
 */
const props = withDefaults(defineProps<ZInputOTPProps>(), {
  length: 6,
  size: 1,
  disabled: false,
  type: 'text',
})

const emit = defineEmits<ZInputOTPEmits>()

const theme = useZTheme()

/** 每个 box 的内部 ref 数组。 */
const inputRefs = ref<(HTMLInputElement | null)[]>([])

function setInputRef(el: unknown, index: number): void {
  inputRefs.value[index] = (el as HTMLInputElement | null) ?? null
}

/** 当前值拆成字符数组（长度固定为 length，不足补空串）。 */
const chars = computed<string[]>(() => {
  const len = props.length ?? 6
  const raw = (props.value ?? '').slice(0, len)
  return Array.from({ length: len }, (_, i) => raw[i] ?? '')
})

/** 拼出新值并 emit。 */
function emitValue(newChars: string[]): void {
  const next = newChars.join('')
  emit('update:value', next)
  emit('change', next)
  if (next.length === (props.length ?? 6) && newChars.every(c => c !== '')) {
    emit('complete', next)
  }
}

function focusBox(index: number): void {
  const len = props.length ?? 6
  const clamped = Math.max(0, Math.min(len - 1, index))
  inputRefs.value[clamped]?.focus()
}

function onKeydown(e: KeyboardEvent, index: number): void {
  if (props.disabled) return

  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    focusBox(index - 1)
    return
  }
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    focusBox(index + 1)
    return
  }
  if (e.key === 'Backspace') {
    e.preventDefault()
    const current = chars.value[index]
    if (current !== '') {
      // 清当前格
      const next = [...chars.value]
      next[index] = ''
      emitValue(next)
    } else {
      // 跳到前一格并清它
      const prevIdx = index - 1
      if (prevIdx >= 0) {
        const next = [...chars.value]
        next[prevIdx] = ''
        emitValue(next)
        focusBox(prevIdx)
      }
    }
  }
}

function onInput(e: Event, index: number): void {
  if (props.disabled) return
  const input = e.target as HTMLInputElement
  let raw = input.value

  if (props.type === 'number') {
    raw = raw.replace(/\D/g, '')
  }

  // 只取最后输入的一个字符（浏览器可能带残留内容）
  const ch = raw.slice(-1)
  if (!ch) {
    // 没有可用字符时重置 DOM value 并不改状态
    input.value = chars.value[index] ?? ''
    return
  }

  const next = [...chars.value]
  next[index] = ch
  emitValue(next)

  // 自动跳下一格
  const len = props.length ?? 6
  if (index < len - 1) {
    focusBox(index + 1)
  }
}

function onPaste(e: ClipboardEvent, index: number): void {
  if (props.disabled) return
  e.preventDefault()
  let text = e.clipboardData?.getData('text') ?? ''
  if (props.type === 'number') {
    text = text.replace(/\D/g, '')
  }
  if (!text) return

  const len = props.length ?? 6
  const next = [...chars.value]
  let filled = 0
  for (let i = 0; i < text.length && index + i < len; i++) {
    next[index + i] = text[i] ?? ''
    filled++
  }
  emitValue(next)
  // 聚焦到最后填入的格的下一格（或最后一格）
  focusBox(Math.min(index + filled, len - 1))
}

// ─── Styles ───

const containerClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap._small
    props.css?.(s)
  }),
)

const boxClass = computed(() =>
  icss(theme.value, s => {
    const sz = props.size ?? 1
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.width.px(sizePx(sz * 2.5))
    s.height.px(sizePx(sz * 2.5))
    s.fontSize.px(sizePx(sz))
    s.fontWeight._semibold
    s.textAlign.center
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.borderRadius.px(sizePx(sz * 0.25))
    s.backgroundColor._bg
    s.color._text
    s.outline('none')
    s.transitionProperty._colors
    s.transitionDuration._small
    s._focusVisible(f => {
      f.borderColor._primary
      f.boxShadow._tiny
    })
    if (props.disabled) {
      s.opacity._dim
      s.cursor.notAllowed
    }
  }),
)
</script>

<template>
  <div :class="containerClass" role="group">
    <input
      v-for="(char, i) in chars"
      :key="i"
      :ref="(el) => setInputRef(el, i)"
      :class="boxClass"
      :value="char"
      :placeholder="placeholder"
      :disabled="disabled"
      :inputmode="type === 'number' ? 'numeric' : 'text'"
      :aria-label="`OTP digit ${i + 1}`"
      maxlength="1"
      autocomplete="one-time-code"
      type="text"
      @keydown="(e) => onKeydown(e, i)"
      @input="(e) => onInput(e, i)"
      @paste="(e) => onPaste(e, i)"
      @focus="(e) => emit('focus', e)"
      @blur="(e) => emit('blur', e)"
    />
  </div>
</template>
