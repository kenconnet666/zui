<script lang="ts">
/**
 * `ZMention` —— 输入框 + `@` 触发候选下拉(简化版)。
 *
 * - `v-model:value` —— string
 * - `options: string[]` —— 候选(简化:字符串数组)
 * - `prefix?: string` —— 触发字符,默认 `'@'`
 *
 * **简化**:不做光标位置 popper(浮层固定在 input 下方),仅基于最后一段 @xxx 过滤。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZMentionProps {
  value?: string
  options: string[]
  prefix?: string
  placeholder?: string
  disabled?: boolean
  rows?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZMentionEmits {
  (e: 'update:value', value: string): void
  (e: 'select', mention: string): void
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

/**
 * 盒子模型(iem,Provider 控制基准):
 *
 *   ┌──────────────────────────────────────────────────┐
 *   │ wrapper  position: relative  width: 100%         │
 *   │                                                  │
 *   │  ┌────────────────────────────────────────────┐  │
 *   │  │ <textarea>                                 │  │   rows 默认 3
 *   │  │  border _thin solid _border  border-radius _small│  pad _small
 *   │  │  pad _small  bg _bg  color _text          │  │   bg _bg
 *   │  │  fontSize _middle  resize vertical        │  │   resize vertical
 *   │  │  width 100%  outline none                 │  │
 *   │  └────────────────────────────────────────────┘  │
 *   │                                                  │
 *   │  ┌────────────────────────────────────────────┐  │   dropdown(@xxx 触发,绝对定位):
 *   │  │ dropdown(条件渲染,贴在 textarea 下方)   │  │     top 100% / left 0 right 0
 *   │  │  top 100%  left 0  right 0                │  │     marginTop _tiny
 *   │  │  marginTop _tiny  border _thin _border    │  │     pad _tiny / max-height 15iem
 *   │  │  pad _tiny  max-height 15iem               │  │     overflow-y auto
 *   │  │  boxShadow _middle  border-radius _small  │  │     boxShadow _middle
 *   │  │  ┌──────────────────────────────────────┐  │  │
 *   │  │  │ @option string                       │  │  │   option:
 *   │  │  │   pad _tiny pad-x _small  fontSize _middle│ │     hover bg _primary.alpha(8)
 *   │  │  │   hover: bg _primary.alpha(8)        │  │  │
 *   │  │  └──────────────────────────────────────┘  │  │
 *   │  └────────────────────────────────────────────┘  │
 *   └──────────────────────────────────────────────────┘
 *
 * 输入到 `@` 时(且前置为空白或起首)开启候选,按 currentSegment 过滤。
 */
const props = withDefaults(defineProps<ZMentionProps>(), {
  prefix: '@',
  disabled: false,
  rows: 3,
})

const emit = defineEmits<ZMentionEmits>()

const theme = useZTheme()

const taRef = ref<HTMLTextAreaElement | null>(null)
const showDropdown = ref(false)
const lastPrefixPos = ref(-1)

const currentSegment = computed(() => {
  if (lastPrefixPos.value < 0 || !taRef.value) return ''
  const v = props.value ?? ''
  // 取 lastPrefixPos+1 之后到光标前的内容
  const caret = taRef.value.selectionStart
  return v.slice(lastPrefixPos.value + 1, caret)
})

const filtered = computed(() => {
  const q = currentSegment.value.toLowerCase()
  if (!q) return props.options
  return props.options.filter((o) => o.toLowerCase().includes(q))
})

function findPrefix(text: string, caret: number): number {
  // 从 caret 向前找最近的 prefix 字符,要求它前面是空白或字符串开头
  for (let i = caret - 1; i >= 0; i--) {
    const ch = text[i]
    if (ch === props.prefix) {
      if (i === 0 || /\s/.test(text[i - 1]!)) return i
      return -1
    }
    if (/\s/.test(ch ?? '')) return -1
  }
  return -1
}

function onInput(e: Event): void {
  const t = e.target as HTMLTextAreaElement
  emit('update:value', t.value)
  const pos = findPrefix(t.value, t.selectionStart)
  lastPrefixPos.value = pos
  showDropdown.value = pos >= 0
}

function pickMention(name: string): void {
  if (!taRef.value || lastPrefixPos.value < 0) return
  const v = props.value ?? ''
  const caret = taRef.value.selectionStart
  // 替换 @xxx → @name + 空格
  const next = v.slice(0, lastPrefixPos.value) + props.prefix + name + ' ' + v.slice(caret)
  emit('update:value', next)
  emit('select', name)
  showDropdown.value = false
  lastPrefixPos.value = -1
}

const wrapperClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.block
    s.position.relative
    s.width.pct(100)
    props.css?.(s)
  }),
)

const taClass = computed(() =>
  icss(theme.value, (s) => {
    s.width.pct(100)
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.color._text
    s.fontSize._middle
    s.padding._small
    s.outline('none')
    s.resize.vertical
    s.fontFamily('inherit')
    if (props.disabled) {
      s.opacity._dim
      s.backgroundColor._bgMuted
      s.cursor.notAllowed
    }
  }),
)

const dropdownClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.absolute
    s.top.pct(100)
    s.left.px(0)
    s.right.px(0)
    s.zIndex._popover
    s.backgroundColor._bg
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.boxShadow._middle
    s.padding._tiny
    s.maxHeight.iem(15)
    s.overflowY.auto
    s.marginTop._tiny
  }),
)

const optionClass = computed(() =>
  icss(theme.value, (s) => {
    s.padding._tiny
    s.paddingLeft._small
    s.paddingRight._small
    s.borderRadius._tiny
    s.cursor.pointer
    s.fontSize._middle
    s.color._text
    s._hover((h) => {
      h.backgroundColor._primary.alpha(8)
    })
  }),
)

const rootRef = ref<HTMLDivElement | null>(null)
defineExpose({ rootRef })
</script>

<template>
  <div ref="rootRef" :class="wrapperClass">
    <textarea
      ref="taRef"
      :class="taClass"
      :value="value"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="onInput"
    />
    <div v-if="showDropdown && filtered.length > 0" :class="dropdownClass" role="listbox">
      <div
        v-for="opt in filtered"
        :key="opt"
        :class="optionClass"
        role="option"
        @click="pickMention(opt)"
      >
        {{ prefix }}{{ opt }}
      </div>
    </div>
  </div>
</template>
