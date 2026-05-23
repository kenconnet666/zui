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
import type { SizePropMulti } from '../_internal/size-prop'

export interface ZAutoCompleteProps {
  value?: string
  options: string[]
  placeholder?: string
  disabled?: boolean
  /** 尺寸 —— `factory | Size5 | undefined` union(复用 INPUT_SIZE_MAP)。 */
  size?: SizePropMulti
  filter?: (input: string, opt: string) => boolean
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
import { applySizeProp } from '../_internal/size-prop'
import { INPUT_SIZE_MAP } from '../_internal/component-sizes'
import { usePopper, useEscapeStack } from '../_hooks'

const props = withDefaults(defineProps<ZAutoCompleteProps>(), {
  disabled: false,
  size: 'middle',
  filter: (input: string, opt: string) => opt.toLowerCase().includes(input.toLowerCase()),
})

const emit = defineEmits<ZAutoCompleteEmits>()

const theme = useZTheme()

const inputRef = ref<HTMLInputElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const open = ref(false)

const filtered = computed(() => {
  const v = props.value ?? ''
  if (!v) return props.options
  return props.options.filter((o) => props.filter(v, o))
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
  icss(theme.value, (s) => {
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.color._text
    applySizeProp(props.size, INPUT_SIZE_MAP, s)
    s.paddingLeft._small
    s.paddingRight._small
    s.width.pct(100)
    s._prop('outline', 'none')
    if (props.disabled) {
      s.opacity._dim
      s._prop('cursor', 'not-allowed')
      s.backgroundColor._bgMuted
    }
    props.css?.(s)
  }),
)

const dropdownClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.absolute
    s.zIndex._popover
    s.backgroundColor._bg
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.boxShadow._middle
    s.padding._tiny
    s.display.flex
    s.flexDirection.column
    s._prop('maxHeight', '240px')
    s._prop('overflowY', 'auto')
    s._prop('minWidth', 'calc(8 * var(--zui-iem, 16px))')
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
</script>

<template>
  <input
    ref="inputRef"
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
      <div
        v-for="opt in filtered"
        :key="opt"
        :class="optionClass"
        role="option"
        @click="onSelect(opt)"
      >
        {{ opt }}
      </div>
    </div>
  </Teleport>
</template>
