<script lang="ts">
/**
 * `ZSelect` —— 单选下拉框(Phase α v1)。
 *
 * **API**:
 * - `v-model:value`(单选,Phase β 支持多选)
 * - `options: Array<{ value, label, disabled? }>` —— 必填
 * - `placeholder?: string` —— 未选时占位
 * - `disabled` / `clearable` / `size`(SizePropMulti factory)
 * - `filterable: boolean` —— 启用搜索过滤(默认 `false`)
 * - sx:sxTrigger / sxDropdown / sxOption
 *
 * **实现要点**:
 * - `usePopper`(`@floating-ui/vue`)定位下拉,跟随触发器宽度
 * - `<ZPortal>` 渲染下拉到 body,避开父 overflow 截断
 * - `onClickOutside`(`@vueuse/core`)外部点击关闭
 * - `useEscapeStack` ESC 关闭
 * - `filterable` 时触发器位置显示 input,接管过滤
 *
 * **a11y**:`role="combobox"` + `aria-expanded`,下拉 `role="listbox"`,选项 `role="option"`。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'
import type { SizePropMulti } from '../_internal/size-prop'

export type ZSelectValue = string | number | boolean

export interface ZSelectOption {
  value: ZSelectValue
  label: string
  disabled?: boolean
}

export interface ZSelectProps {
  value?: ZSelectValue | ZSelectValue[] | null
  options: ZSelectOption[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  filterable?: boolean
  /** 多选模式;value 期望是 `ZSelectValue[]`(2026-05-23 Phase β 升级)。 */
  multiple?: boolean
  /** 尺寸 —— 纯 factory(默认 `INPUT_SIZE_MAP.middle`,同 ZInput)。 */
  size?: SizePropMulti
  sxTrigger?: SxObject
  sxDropdown?: SxObject
  sxOption?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZSelectEmits {
  (e: 'update:value', value: ZSelectValue | ZSelectValue[] | null): void
  (e: 'change', value: ZSelectValue | ZSelectValue[] | null): void
}
</script>

<script lang="ts" setup>
import { computed, h, ref, watch } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { applySizeProp } from '../_internal/size-prop'
import { INPUT_SIZE_MAP } from '../_internal/component-sizes'
import { BuiltinIcons, ZIcon } from '../gene'
import { usePopper, useEscapeStack } from '../_hooks'
import { onClickOutside } from '@vueuse/core'

const props = withDefaults(defineProps<ZSelectProps>(), {
  disabled: false,
  clearable: false,
  filterable: false,
  multiple: false,
  size: INPUT_SIZE_MAP.middle,
})

const emit = defineEmits<ZSelectEmits>()

const theme = useZTheme()

const triggerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const open = ref(false)
const search = ref('')

useEscapeStack(
  () => {
    if (open.value) open.value = false
  },
  { enabled: open },
)

const { floatingStyles } = usePopper(triggerRef, dropdownRef, {
  placement: 'bottom-start',
  offset: 4,
})

onClickOutside(triggerRef, (e: Event) => {
  // 触发器外点击 → 但要排除 dropdown 内的点击
  if (dropdownRef.value && e.target && dropdownRef.value.contains(e.target as Node)) return
  open.value = false
})

// 多选时 value 是数组,单选是单值。统一规整为数组方便内部用。
const valueArray = computed<ZSelectValue[]>(() => {
  if (props.value == null) return []
  if (Array.isArray(props.value)) return props.value
  return [props.value as ZSelectValue]
})

function isOptionSelected(opt: ZSelectOption): boolean {
  return valueArray.value.includes(opt.value)
}

const selectedLabel = computed(() => {
  if (props.multiple) {
    if (valueArray.value.length === 0) return ''
    return valueArray.value
      .map((v) => props.options.find((o) => o.value === v)?.label ?? String(v))
      .join(', ')
  }
  if (props.value === null || props.value === undefined || Array.isArray(props.value)) return ''
  return props.options.find((o) => o.value === props.value)?.label ?? String(props.value)
})

const filteredOptions = computed(() => {
  if (!props.filterable || !search.value) return props.options
  const q = search.value.toLowerCase()
  return props.options.filter((o) => o.label.toLowerCase().includes(q))
})

/**
 * 触发器盒子模型(iem):
 * - minWidth: 8iem,保证窄触发器不至于贴文字
 * - 高度走 INPUT_SIZE_MAP(small/middle/large 三档)
 * - border: _thin,圆角 _small
 */
const triggerClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap._tiny
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.color._text
    applySizeProp(props.size, s)
    s.paddingLeft._small
    s.paddingRight._small
    s.cursor.pointer
    s.minWidth.iem(8)
    s.transitionProperty._colors
    s.transitionDuration._small
    if (open.value) s.borderColor._primary
    if (props.disabled) {
      s.opacity._dim
      s.cursor.notAllowed
      s.backgroundColor._bgMuted
    }
    applySx(s, props.sxTrigger)
    props.css?.(s)
  }),
)
const sxTriggerAttrs = computed(() => extractSxAttrs(props.sxTrigger))

const triggerTextClass = computed(() =>
  icss(theme.value, (s) => {
    s.flexGrow(1)
    s.overflow.hidden
    s.whiteSpace.nowrap
    s.textOverflow.ellipsis
    if (!selectedLabel.value && !search.value) s.color._textSecondary
  }),
)

const triggerInputClass = computed(() =>
  icss(theme.value, (s) => {
    s.flexGrow(1)
    s.borderStyle.none
    s.backgroundColor.transparent
    s.color.currentColor
    s.fontSize.inherit
    s.outline('none')
    s.minWidth.px(0)
    s.width.pct(100)
  }),
)

/**
 * 下拉浮层盒子模型(iem):
 * - minWidth: 8iem(与触发器同步)
 * - maxHeight: 15iem,超出滚动
 * - padding: _tiny,圆角 _small,middle shadow
 */
const dropdownClass = computed(() =>
  icss(theme.value, (s) => {
    s.backgroundColor._bg
    s.color._text
    s.borderRadius._small
    s.boxShadow._middle
    s.padding._tiny
    s.zIndex._popover
    s.minWidth.iem(8)
    s.maxHeight.iem(15)
    s.overflowY.auto
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    applySx(s, props.sxDropdown)
  }),
)
const sxDropdownAttrs = computed(() => extractSxAttrs(props.sxDropdown))

const optionClass = (opt: ZSelectOption): string =>
  icss(theme.value, (s) => {
    s.display.flex
    s.alignItems.center
    s.gap._tiny
    s.padding._tiny
    s.paddingLeft._small
    s.paddingRight._small
    s.borderRadius._tiny
    s.cursor.pointer
    s.color._text
    s.fontSize._middle
    if (isOptionSelected(opt)) {
      s.backgroundColor._primary.alpha(8)
      s.color._primary
    }
    if (opt.disabled) {
      s.opacity._dim
      s.cursor.notAllowed
    } else {
      s._hover((h2) => {
        h2.backgroundColor._textSecondary.alpha(8)
      })
    }
    applySx(s, props.sxOption)
  })
const sxOptionAttrs = computed(() => extractSxAttrs(props.sxOption))

const clearBtnClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.cursor.pointer
    s.backgroundColor.transparent
    s.borderStyle.none
    s.padding.px(0)
    s.color._textSecondary
    s._hover((h2) => {
      h2.color._text
    })
  }),
)

const arrowClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._textSecondary
    s.transitionProperty._transform
    s.transitionDuration._small
    s.transform(open.value ? 'rotate(180deg)' : 'rotate(0deg)')
  }),
)

const showClear = computed(() => {
  if (!props.clearable || props.disabled) return false
  if (props.multiple) return valueArray.value.length > 0
  return props.value !== null && props.value !== undefined
})

function toggleOpen(): void {
  if (props.disabled) return
  open.value = !open.value
  if (open.value && props.filterable) {
    search.value = ''
  }
}

function selectOption(opt: ZSelectOption): void {
  if (opt.disabled) return
  if (props.multiple) {
    // 多选:toggle 添加/移除,保持下拉打开
    const cur = valueArray.value
    const next = cur.includes(opt.value)
      ? cur.filter((v) => v !== opt.value)
      : [...cur, opt.value]
    emit('update:value', next)
    emit('change', next)
    return
  }
  emit('update:value', opt.value)
  emit('change', opt.value)
  open.value = false
  search.value = ''
}

function onClear(e: Event): void {
  e.stopPropagation()
  const empty = props.multiple ? [] : null
  emit('update:value', empty)
  emit('change', empty)
}

function onFilterInput(e: Event): void {
  const target = e.target as HTMLInputElement
  search.value = target.value
  open.value = true
}

watch(
  () => props.value,
  () => {
    search.value = ''
  },
)

const emptyClass = computed(() =>
  icss(theme.value, (s) => {
    s.padding._small
    s.color._textSecondary
    s.fontSize._small
    s.textAlign.center
  }),
)

const downIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronDown }))
const closeIcon = computed(() => h(ZIcon, { component: BuiltinIcons.close }))
</script>

<template>
  <div
    ref="triggerRef"
    :class="[triggerClass, sxTriggerAttrs.class]"
    :style="sxTriggerAttrs.style"
    role="combobox"
    :aria-expanded="open"
    :aria-disabled="disabled"
    :aria-multiselectable="multiple"
    v-bind="sxTriggerAttrs.attrs"
    @click="toggleOpen"
  >
    <input
      v-if="filterable && open"
      :class="triggerInputClass"
      :value="search"
      :placeholder="placeholder ?? selectedLabel"
      autofocus
      @input="onFilterInput"
      @click.stop
    />
    <span v-else :class="triggerTextClass">
      {{ selectedLabel || placeholder }}
    </span>
    <button
      v-if="showClear"
      type="button"
      :class="clearBtnClass"
      aria-label="清空"
      tabindex="-1"
      @click.stop="onClear"
    >
      <component :is="closeIcon" />
    </button>
    <span :class="arrowClass">
      <component :is="downIcon" />
    </span>
  </div>

  <Teleport to="body">
    <div
      v-if="open"
      ref="dropdownRef"
      :class="[dropdownClass, sxDropdownAttrs.class]"
      :style="[floatingStyles, sxDropdownAttrs.style]"
      role="listbox"
      v-bind="sxDropdownAttrs.attrs"
    >
      <div
        v-for="opt in filteredOptions"
        :key="String(opt.value)"
        :class="[optionClass(opt), sxOptionAttrs.class]"
        :style="sxOptionAttrs.style"
        role="option"
        :aria-selected="isOptionSelected(opt)"
        :aria-disabled="opt.disabled"
        v-bind="sxOptionAttrs.attrs"
        @click="selectOption(opt)"
      >
        <input
          v-if="multiple"
          type="checkbox"
          :checked="isOptionSelected(opt)"
          :disabled="opt.disabled"
          aria-hidden="true"
          tabindex="-1"
          @click.stop="selectOption(opt)"
        />
        <span>{{ opt.label }}</span>
      </div>
      <div v-if="filteredOptions.length === 0" :class="emptyClass">无匹配项</div>
    </div>
  </Teleport>
</template>
