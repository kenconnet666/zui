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
  /** 字号尺寸 —— `number`(iem 倍数,默认 1)。同 ZInput。2026-05-24 B7。 */
  size?: number
  /** 高度 —— `number`(iem 倍数,可选,默认 `size * 2`)。 */
  height?: number
  filter?: (input: string, opt: string) => boolean
  /**
   * 单个建议行高 —— iem 倍数。默认 `2`(2iem = 32px @ 16px iem)。
   * 浮层 suggestions 由 `ZVirtualList` 渲染(2026-05-24 v2)。
   */
  optionSize?: number
  /**
   * 浮层最大高度 —— iem 倍数。默认 `15`(15iem = 240px @ 16px iem)。
   */
  dropdownMaxHeight?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZAutoCompleteEmits {
  (e: 'update:value', value: string): void
  (e: 'select', value: string): void
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applyInputSize } from '../_internal/input-size'
import { usePopper, useEscapeStack } from '../_hooks'
import { sizePx } from '../_internal/sizing'
import ZVirtualList from '../display/ZVirtualList.vue'

/**
 * 盒子模型(iem,Provider 控制基准;number 是 iem 倍数,默认 1iem=16px @ 1080p):
 *
 *   ┌──────────────────────────────────────────────────┐
 *   │ <input>                                          │
 *   │   font-size: `size` iem                          │   默认 size=1(16px @ 1080p)
 *   │   height: `height` iem                           │   默认 height=size*2=2iem(32px)
 *   │   padding-y: size*0.375 iem                      │   = 0.375iem(6px)
 *   │   padding-x: size*0.75 iem                       │   = 0.75iem(12px)
 *   │   border-radius: size*0.25 iem                   │   = 0.25iem(4px)
 *   │   border _thin solid _border  bg _bg color _text │   width: 100% / outline none
 *   │   disabled: opacity _dim / bg _bgMuted           │
 *   └──────────────────────────────────────────────────┘
 *           │ floating-ui 定位(offset 4)
 *           ▼
 *   ┌──────────────────────────────────────────────────┐
 *   │ dropdown(Teleport body,仅有过滤项时显示)     │   min-width: 8iem
 *   │   min-width: 8iem  max-height: 15iem            │   max-height: 15iem
 *   │   pad _tiny  border _thin _border  boxShadow _middle│   overflow-y auto
 *   │   flex column                                    │
 *   │  ┌──────────────────────────────────────────┐   │   option:
 *   │  │ option string                            │   │     pad _tiny pad-x _small
 *   │  │   pad _tiny pad-x _small  fontSize _middle│  │     hover: bg _primary.alpha(8)
 *   │  │   hover: bg _primary.alpha(8)            │   │
 *   │  └──────────────────────────────────────────┘   │
 *   │  (循环 filtered options)                        │
 *   └──────────────────────────────────────────────────┘
 *
 * 用户改 size 数字 → input 所有 iem 维度等比缩放(dropdown 固定 spacing token)。
 * height 可独立覆盖。filter 默认 includes(input,opt);非 iem 单位走 `:css` 兜底。
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

const inputRef = ref<HTMLInputElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const open = ref(false)

const filtered = computed(() => {
  const v = props.value ?? ''
  if (!v) return props.options
  return props.options.filter(o => props.filter(v, o))
})

const showDropdown = computed(() => open.value && !props.disabled && filtered.value.length > 0)

const { floatingStyles } = usePopper(inputRef, dropdownRef, {
  placement: 'bottom-start',
  offset: 4,
})

useEscapeStack(
  () => {
    if (open.value) open.value = false
  },
  { enabled: open },
)

onClickOutside(inputRef, (e: Event) => {
  if (!open.value) return
  if (dropdownRef.value && e.target && dropdownRef.value.contains(e.target as Node)) return
  open.value = false
})

const inputClass = computed(() =>
  icss(theme.value, s => {
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.color._text
    applyInputSize(s, props.size, props.height)
    s.width.pct(100)
    s.outline('none')
    if (props.disabled) {
      s.opacity._dim
      s.cursor.notAllowed
      s.backgroundColor._bgMuted
    }
    props.css?.(s)
  }),
)

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
      h.backgroundColor._primary.alpha(8)
    })
  }),
)

function onInput(e: Event): void {
  const t = e.target as HTMLInputElement
  emit('update:value', t.value)
  open.value = true
}
function onFocus(): void {
  if (!props.disabled) open.value = true
}
function onSelect(opt: string): void {
  emit('update:value', opt)
  emit('select', opt)
  open.value = false
}

const rootRef = ref<HTMLInputElement | null>(null)
function bindRoot(el: unknown): void {
  const node = (el as HTMLInputElement | null) ?? null
  rootRef.value = node
  inputRef.value = node
}
defineExpose({ rootRef })
</script>

<template>
  <input
    :ref="bindRoot"
    :class="inputClass"
    type="text"
    :value="value"
    :placeholder="placeholder"
    :disabled="disabled"
    role="combobox"
    :aria-expanded="showDropdown"
    aria-autocomplete="list"
    @input="onInput"
    @focus="onFocus"
  />

  <Teleport to="body">
    <div
      v-if="showDropdown"
      ref="dropdownRef"
      :class="dropdownClass"
      :style="floatingStyles"
      role="listbox"
    >
      <ZVirtualList
        :items="filtered"
        :item-size="optionSize ?? 2"
        :height="dropdownListHeight"
        key-field="value"
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
