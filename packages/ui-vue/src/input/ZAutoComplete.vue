<script lang="ts">
/**
 * `ZAutoComplete` —— 输入框 + 候选下拉(类 antd AutoComplete 简化)。
 *
 * **跟 ZSelect 区别**:
 * - 输入值可任意,不限于选项
 * - 选项是建议,点击插入到 input
 * - 不强制选中
 *
 * **API**:
 * - `v-model:value`(string)
 * - `options: string[]` —— 简化:仅字符串数组(label === value)
 * - `placeholder?` / `disabled?` / `size?`
 * - `filter?: (input, opt) => boolean` —— 自定义过滤(默认 includes)
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZAutoCompleteProps {
  value?: string
  options: string[]
  placeholder?: string
  disabled?: boolean
  /** 字号尺寸 —— `number`(px 倍数,1 单位 = 16px,默认 1)。同 ZInput。2026-05-24 B7。 */
  size?: number
  /** 高度 —— `number`(px 倍数,1 单位 = 16px,可选,默认 `size * 2`)。 */
  height?: number
  filter?: (input: string, opt: string) => boolean
  /**
   * 单个建议行高 —— px 倍数(1 单位 = 16px)。默认 `2`(= 32px)。
   * 浮层 suggestions 由 `ZVirtualList` 渲染(2026-05-24 v2)。
   */
  optionSize?: number
  /**
   * 浮层最大高度 —— px 倍数(1 单位 = 16px)。默认 `15`(= 240px)。
   */
  dropdownMaxHeight?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZAutoCompleteEmits {
  (e: 'update:value', value: string): void
  (e: 'select', value: string): void
  /** 输入值变更时触发（与 `update:value` 同步），选中建议项时也触发。 */
  (e: 'change', value: string): void
  /** input 聚焦时触发。 */
  (e: 'focus', event: FocusEvent): void
  /** input 失焦时触发。 */
  (e: 'blur', event: FocusEvent): void
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { usePopper, useEscapeStack, useZId } from '../_hooks'
import { sizePx } from '../_internal/sizing'
import ZVirtualList from '../display/ZVirtualList.vue'
import ZInput from './ZInput.vue'

/**
 * 盒子模型(px,1 单位 = 16px;number 是 px 倍数,默认 1 单位=16px):
 *
 *   ┌──────────────────────────────────────────────────┐
 *   │ <ZInput> (wrapper div)                           │
 *   │   font-size: sizePx(size)                        │   默认 size=1(16px)
 *   │   height: sizePx(height)                         │   默认 height=size*2=32px
 *   │   border / bg / color 由 ZInput 处理             │   width: 100% / outline none
 *   │   disabled: opacity _dim / bg _bgMuted           │
 *   └──────────────────────────────────────────────────┘
 *           │ floating-ui 定位(offset 4,锚点=ZInput wrapper div)
 *           ▼
 *   ┌──────────────────────────────────────────────────┐
 *   │ dropdown(Teleport body,仅有过滤项时显示)         │   min-width: 128px
 *   │   min-width: 128px  max-height: 240px            │   max-height: 240px
 *   │   pad _tiny  border _thin _border  boxShadow _middle│   overflow-y auto
 *   │   flex column                                    │
 *   │  ┌──────────────────────────────────────────┐   │   option:
 *   │  │ option string                            │   │     pad _tiny pad-x _small
 *   │  │   pad _tiny pad-x _small  fontSize _middle│  │     hover: bg _primary.alpha(8)
 *   │  └──────────────────────────────────────────┘   │
 *   │  (循环 filtered options)                         │
 *   └──────────────────────────────────────────────────┘
 *
 * 用户改 size 数字 → input 所有 px 维度等比缩放(dropdown 固定 spacing token)。
 * height 可独立覆盖。filter 默认 includes(input,opt);非标准单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZAutoCompleteProps>(), {
  disabled: false,
  size: 1,
  filter: (input: string, opt: string) => opt.toLowerCase().includes(input.toLowerCase()),
  optionSize: 2,
  dropdownMaxHeight: 15,
})

const emit = defineEmits<ZAutoCompleteEmits>()

const theme = useZTheme()

/** ZInput 组件实例引用,expose { rootRef, inputRef } */
const ziRef = ref<{ rootRef: HTMLElement | null; inputRef: HTMLInputElement | null } | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const open = ref(false)
const listboxId = useZId('zui-autocomplete-listbox')

const filtered = computed(() => {
  const v = props.value ?? ''
  if (!v) return props.options
  return props.options.filter(o => props.filter(v, o))
})

const showDropdown = computed(() => open.value && !props.disabled && filtered.value.length > 0)

/** 锚点:ZInput 的 wrapper div(rootRef),类型放宽为 HTMLElement */
const anchorRef = computed<HTMLElement | null>(() => ziRef.value?.rootRef ?? null)

const { floatingStyles } = usePopper(anchorRef, dropdownRef, {
  placement: 'bottom-start',
  offset: 4,
})

useEscapeStack(
  () => {
    if (open.value) open.value = false
  },
  { enabled: open },
)

/** onClickOutside 目标:ZInput wrapper div */
onClickOutside(anchorRef, (e: Event) => {
  if (!open.value) return
  if (dropdownRef.value && e.target && dropdownRef.value.contains(e.target as Node)) return
  open.value = false
})

const dropdownClass = computed(() =>
  icss(theme.value, s => {
    s.position.absolute
    s.zIndex._popover
    s.backgroundColor._bg
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.boxShadow._middle
    s.padding._tiny
    s.minWidth.px(sizePx(8))
  }),
)

const dropdownListHeight = computed<string>(() => {
  const totalPx = filtered.value.length * sizePx(props.optionSize)
  const maxPx = sizePx(props.dropdownMaxHeight)
  return `${Math.min(totalPx, maxPx)}px`
})

const optionClass = computed(() =>
  icss(theme.value, s => {
    s.padding._tiny
    s.paddingLeft._small
    s.paddingRight._small
    s.borderRadius._tiny
    s.cursor.pointer
    s.fontSize._middle
    s.color._text
    s._hover(h => {
      h.backgroundColor._bgHover
    })
  }),
)

/**
 * 键盘导航处理 —— 具名函数保证引用稳定。
 * 目前仅 Escape 由 useEscapeStack 统一接管;此处可扩展 ArrowUp/Down/Enter。
 */
function onKeydown(_e: KeyboardEvent): void {
  // Escape 由 useEscapeStack 处理,此处留钩供后续扩展
}

/**
 * combobox ARIA 属性 + 键盘事件,整体打包透传给 ZInput 的 inputAttrs。
 * ZInput 会将其 v-bind 到内层真实 `<input>` 上。
 */
const comboboxAttrs = computed(() => ({
  role: 'combobox',
  'aria-haspopup': 'listbox',
  'aria-expanded': showDropdown.value,
  'aria-controls': showDropdown.value ? listboxId : undefined,
  'aria-autocomplete': 'list',
  onKeydown,
}))

function onUpdateValue(v: string): void {
  emit('update:value', v)
  emit('change', v)
  open.value = true
}
function onFocus(e: FocusEvent): void {
  if (!props.disabled) open.value = true
  emit('focus', e)
}
function onBlur(e: FocusEvent): void {
  emit('blur', e)
}
function onSelect(opt: string): void {
  emit('update:value', opt)
  emit('select', opt)
  emit('change', opt)
  open.value = false
  // 选中后回焦内层 input
  ziRef.value?.inputRef?.focus()
}

/** expose:透出 ZInput 的 rootRef(wrapper div),供父组件 ref 使用 */
defineExpose({
  get rootRef() {
    return ziRef.value?.rootRef ?? null
  },
})
</script>

<template>
  <ZInput
    ref="ziRef"
    :value="value"
    :placeholder="placeholder"
    :disabled="disabled"
    :size="size"
    :height="height"
    :css="css"
    :input-attrs="comboboxAttrs"
    @update:value="onUpdateValue"
    @focus="onFocus"
    @blur="onBlur"
  />

  <Teleport to="body">
    <div
      v-if="showDropdown"
      ref="dropdownRef"
      :id="listboxId"
      :class="dropdownClass"
      :style="floatingStyles"
      role="listbox"
    >
      <ZVirtualList
        :items="filtered"
        :item-size="optionSize ?? 2"
        :height="dropdownListHeight"
      >
        <template #default="{ item: opt }">
          <div :class="optionClass" role="option" @click="onSelect(opt)">
            {{ opt }}
          </div>
        </template>
      </ZVirtualList>
    </div>
  </Teleport>
</template>
