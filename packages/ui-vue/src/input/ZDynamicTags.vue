<script lang="ts">
/**
 * `ZDynamicTags` —— 动态标签输入(回车添加 + 点 close 删除 + max 限制)。
 *
 * - `v-model:value: string[]`
 * - `max?: number` —— 标签数量上限
 * - `placeholder?: string` —— 输入框占位
 * - `addable?: boolean` —— 默认 true;`false` 时仅显示已有标签
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZDynamicTagsProps {
  value?: string[]
  max?: number
  placeholder?: string
  disabled?: boolean
  addable?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZDynamicTagsEmits {
  /** 标签列表变化(支持 `v-model:value`)。 */
  (e: 'update:value', value: string[]): void
  /** 标签列表提交变化(添加或删除),payload 同 `update:value`。 */
  (e: 'change', value: string[]): void
}
</script>

<script lang="ts" setup>
import { computed, h, nextTick, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { BuiltinIcons, ZIcon } from '../gene'
import ZTag from '../gene/ZTag.vue'
import ZButton from '../gene/ZButton.vue'
import { sizePx } from '../_internal/sizing'

const props = withDefaults(defineProps<ZDynamicTagsProps>(), {
  value: () => [],
  placeholder: '新标签',
  disabled: false,
  addable: true,
})

const emit = defineEmits<ZDynamicTagsEmits>()

const theme = useZTheme()

const editing = ref(false)
const inputValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const canAdd = computed(() => {
  if (props.disabled || !props.addable) return false
  if (props.max !== undefined && props.value.length >= props.max) return false
  return true
})

function startEdit(): void {
  if (!canAdd.value) return
  editing.value = true
  // 等 input 渲染后再 focus(替代 setTimeout 0 work-around,Vue 原生 idiom)
  nextTick(() => inputRef.value?.focus())
}

function commitInput(): void {
  const v = inputValue.value.trim()
  if (!v) {
    editing.value = false
    inputValue.value = ''
    return
  }
  if (props.value.includes(v)) {
    editing.value = false
    inputValue.value = ''
    return
  }
  const next = [...props.value, v]
  emit('update:value', next)
  emit('change', next)
  inputValue.value = ''
  editing.value = false
}

function removeTag(tag: string): void {
  if (props.disabled) return
  const next = props.value.filter(t => t !== tag)
  emit('update:value', next)
  emit('change', next)
}

function onKey(e: KeyboardEvent): void {
  if (e.key === 'Enter') {
    e.preventDefault()
    commitInput()
  } else if (e.key === 'Escape') {
    editing.value = false
    inputValue.value = ''
  }
}

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.flexWrap.wrap
    s.gap._tiny
    s.alignItems.center
    props.css?.(s)
  }),
)

// 添加按钮(复用 ZButton dashed):默认中性灰,css 压扁高度对齐 ZTag 行内高度 + hover 变 primary。
// (disabled 态由 canAdd 控制不渲染,无需 disabled 样式分支)
const addBtnColor = (c: Chain<ZuiSchema>['color']): void => {
  c._textSecondary
}
const addBtnCss = (s: Chain<ZuiSchema>): void => {
  s.height.auto
  s.paddingTop.px(sizePx(0.125))
  s.paddingBottom.px(sizePx(0.125))
  s.paddingLeft._small
  s.paddingRight._small
  s.borderRadius._tiny
  s._hover(h => {
    h.color._primary
    h.borderColor._primary
  })
}

const inputClass = computed(() =>
  icss(theme.value, s => {
    s.width.em(6)
    s.fontSize._small
    s.borderRadius._tiny
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._primary
    s.backgroundColor._bg
    s.color._text
    s.paddingLeft._tiny
    s.paddingRight._tiny
    s.paddingTop.px(sizePx(0.125))
    s.paddingBottom.px(sizePx(0.125))
    s.outline('none')
  }),
)

const addIcon = computed(() => h(ZIcon, { component: BuiltinIcons.add }))
</script>

<template>
  <div :class="rootClass" role="group">
    <ZTag
      v-for="tag in value"
      :key="tag"
      :closable="!disabled"
      :size="0.875"
      @close="removeTag(tag)"
    >{{ tag }}</ZTag>

    <input
      v-if="editing"
      ref="inputRef"
      :class="inputClass"
      type="text"
      v-model="inputValue"
      :placeholder="placeholder"
      @blur="commitInput"
      @keydown="onKey"
    />
    <ZButton
      v-else-if="canAdd"
      variant="dashed"
      :size="0.875"
      :color="addBtnColor"
      :ripple="false"
      :css="addBtnCss"
      @click="startEdit"
    >
      <component :is="addIcon" />
      <span>{{ placeholder }}</span>
    </ZButton>
  </div>
</template>
