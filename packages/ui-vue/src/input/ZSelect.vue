<script lang="ts">
/**
 * `ZSelect` —— 单选下拉框(Phase α v1)。
 *
 * **API**:
 * - `v-model:value`(单选,Phase β 支持多选)
 * - `options: Array<{ value, label, disabled? }>` —— 必填
 * - `placeholder?: string` —— 未选时占位
 * - `disabled` / `clearable` / `size?: number` —— 字号尺寸(px 倍数,1 单位 = 16px),默认 1(= 16px)
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
  /**
   * 字号尺寸 —— `number`(px 倍数,1 单位 = 16px,默认 1)。同 ZInput。
   *
   * 2026-05-24 B7:数值尺寸 prop 改 `number`。
   */
  size?: number
  /** 高度 —— `number`(px 倍数,1 单位 = 16px,可选,默认 `size * 2`)。 */
  height?: number
  /**
   * 单个 option 行高 —— px 倍数(1 单位 = 16px)。默认 `2`(= 32px)。
   * 浮层 options 由 `ZVirtualList` 渲染(2026-05-24 v2),需要明确行高。
   */
  optionSize?: number
  /**
   * 浮层最大高度 —— px 倍数(1 单位 = 16px)。默认 `15`(= 240px)。
   * options 不足时容器自适应,超过则封顶。
   */
  dropdownMaxHeight?: number
  sxTrigger?: SxObject
  sxDropdown?: SxObject
  sxOption?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZSelectEmits {
  /** 选中值变化(支持 `v-model:value`)。v0.2(2026-05-25)删除了等价的 `change`。 */
  (e: 'update:value', value: ZSelectValue | ZSelectValue[] | null): void
}
</script>

<script lang="ts" setup>
import { computed, h, ref, watch } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { useZLocale } from '../provider/locale/useZLocale'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { applyInputSize } from '../_internal/input-size'
import { BuiltinIcons, ZIcon } from '../gene'
import { usePopper, useEscapeStack } from '../_hooks'
import { sizePx } from '../_internal/sizing'
import { onClickOutside } from '@vueuse/core'
import ZVirtualList from '../display/ZVirtualList.vue'
import { themeColorScheme } from '../_internal/colorScheme'
import { applyUserRef } from '../_internal/merge-ref'

/**
 * 盒子模型(px,1 单位 = 16px;number 是 px 倍数,默认 1 单位=16px):
 *
 *   ┌──────────────────────────────────────────────────┐
 *   │ trigger  inline-flex / center / gap _tiny        │   min-width: 128px(= 8 × 16px)
 *   │   font-size: sizePx(size)                        │   默认 size=1(16px)
 *   │   height: sizePx(height)                         │   默认 height=size*2=32px
 *   │   padding-y: sizePx(size*0.375)                  │   = 6px
 *   │   padding-x: sizePx(size*0.75)                   │   = 12px
 *   │   border-radius: sizePx(size*0.25)               │   = 4px
 *   │   border _thin solid _border / bg _bg / color _text │ open: borderColor _primary
 *   │   disabled: opacity _dim / bg _bgMuted           │
 *   │                                                   │
 *   │  ┌────────────────┐ ┌─────┐ ┌────────┐           │
 *   │  │ text / input   │ │clear│ │ arrow ▼│           │   text: flex-grow 1 / ellipsis
 *   │  │ flex-grow 1    │ │  ×  │ │ rotate │           │   arrow: open 180deg 旋转
 *   │  │ ellipsis       │ │_2nd │ │ on open│           │
 *   │  └────────────────┘ └─────┘ └────────┘           │
 *   └──────────────────────────────────────────────────┘
 *           │ floating-ui 定位(offset 4)
 *           ▼
 *   ┌──────────────────────────────────────────────────┐
 *   │ dropdown(Teleport body)                        │   min-width: 128px
 *   │   min-width: 128px  max-height: 240px           │   max-height: 240px
 *   │   pad _tiny  border _thin _border  boxShadow _middle│ overflow-y auto
 *   │   border-radius _small                          │
 *   │  ┌──────────────────────────────────────────┐   │   option:
 *   │  │ option ✓ label                          │   │     pad _tiny pad-x _small
 *   │  │   pad _tiny pad-x _small                 │   │     selected: bg _primary.alpha(8)
 *   │  │   selected: bg _primary.alpha(8) / _primary│ │     disabled: opacity _dim
 *   │  │   hover: bg _textSecondary.alpha(8)      │   │     hover: bg _textSecondary.alpha(8)
 *   │  └──────────────────────────────────────────┘   │   empty: pad _small / centered
 *   │  (循环 filteredOptions,空 → 显"无匹配项")      │
 *   └──────────────────────────────────────────────────┘
 *
 * 用户改 size 数字 → trigger 所有 px 维度等比缩(dropdown 走固定 spacing token,不缩)。
 * filterable=true 触发器位置渲染 input,实时过滤;multiple=true 选项前 checkbox。
 * 非标准单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZSelectProps>(), {
  disabled: false,
  clearable: false,
  filterable: false,
  multiple: false,
  size: 1,
  optionSize: 2,
  dropdownMaxHeight: 15,
})

const emit = defineEmits<ZSelectEmits>()

const theme = useZTheme()
const selectLocale = useZLocale('select')

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
      .map(v => props.options.find(o => o.value === v)?.label ?? String(v))
      .join(', ')
  }
  if (props.value === null || props.value === undefined || Array.isArray(props.value)) return ''
  return props.options.find(o => o.value === props.value)?.label ?? String(props.value)
})

const filteredOptions = computed(() => {
  if (!props.filterable || !search.value) return props.options
  const q = search.value.toLowerCase()
  return props.options.filter(o => o.label.toLowerCase().includes(q))
})

const triggerClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap._tiny
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.color._text
    applyInputSize(s, props.size, props.height)
    s.cursor.pointer
    s.minWidth.px(sizePx(8))
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
  icss(theme.value, s => {
    s.flexGrow(1)
    s.overflow.hidden
    s.whiteSpace.nowrap
    s.textOverflow.ellipsis
    if (!selectedLabel.value && !search.value) s.color._textSecondary
  }),
)

const triggerInputClass = computed(() =>
  icss(theme.value, s => {
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

const dropdownClass = computed(() =>
  icss(theme.value, s => {
    s.backgroundColor._bg
    s.color._text
    s.borderRadius._small
    s.boxShadow._middle
    s.padding._tiny
    s.zIndex._popover
    s.minWidth.px(sizePx(10))
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    // Teleport 脱离 ZBox DOM 树，需要手动设置 color-scheme 让浏览器用正确模式渲染
    s._prop('colorScheme', themeColorScheme(theme.value))
    applySx(s, props.sxDropdown)
  }),
)

/** 浮层虚拟列表实际高度:options 不足时按 totalSize,超过则封顶 dropdownMaxHeight。 */
const dropdownListHeight = computed<string>(() => {
  const totalPx = filteredOptions.value.length * sizePx(props.optionSize)
  const maxPx = sizePx(props.dropdownMaxHeight)
  return `${Math.min(totalPx, maxPx)}px`
})
const sxDropdownAttrs = computed(() => extractSxAttrs(props.sxDropdown))

const optionClass = (opt: ZSelectOption): string =>
  icss(theme.value, s => {
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
    s.whiteSpace.nowrap
    s.overflow.hidden
    s.textOverflow.ellipsis
    if (isOptionSelected(opt)) {
      s.backgroundColor._primary.alpha(8)
      s.color._primary
    }
    if (opt.disabled) {
      s.opacity._dim
      s.cursor.notAllowed
    } else {
      s._hover(h2 => {
        h2.backgroundColor._textSecondary.alpha(8)
      })
    }
    applySx(s, props.sxOption)
  })
const sxOptionAttrs = computed(() => extractSxAttrs(props.sxOption))

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
  }),
)

const arrowClass = computed(() =>
  icss(theme.value, s => {
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
    const next = cur.includes(opt.value) ? cur.filter(v => v !== opt.value) : [...cur, opt.value]
    emit('update:value', next)
    return
  }
  emit('update:value', opt.value)
  open.value = false
  search.value = ''
}

function onClear(e: Event): void {
  e.stopPropagation()
  const empty = props.multiple ? [] : null
  emit('update:value', empty)
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
  icss(theme.value, s => {
    s.padding._small
    s.color._textSecondary
    s.fontSize._small
    s.textAlign.center
  }),
)

const downIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronDown }))
const closeIcon = computed(() => h(ZIcon, { component: BuiltinIcons.close }))

const rootRef = ref<HTMLDivElement | null>(null)
function bindRoot(el: unknown): void {
  const node = (el as HTMLDivElement | null) ?? null
  rootRef.value = node
  triggerRef.value = node
  applyUserRef(sxTriggerAttrs.value.ref, node)
}
/**
 * dropdown 元素 ref 合并器 —— 同时写入内部 `dropdownRef`(usePopper / onClickOutside)
 * 与用户传入的 `sxDropdown.ref`。
 */
function bindDropdown(el: unknown): void {
  const node = (el as HTMLElement | null) ?? null
  dropdownRef.value = node
  applyUserRef(sxDropdownAttrs.value.ref, node)
}
defineExpose({ rootRef })
</script>

<template>
  <div
    :ref="bindRoot"
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
      aria-label="过滤选项"
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
      :ref="bindDropdown"
      :class="[dropdownClass, sxDropdownAttrs.class]"
      :style="[floatingStyles, sxDropdownAttrs.style]"
      role="listbox"
      v-bind="sxDropdownAttrs.attrs"
    >
      <div v-if="filteredOptions.length === 0" :class="emptyClass">
        {{ selectLocale.noOptions }}
      </div>
      <ZVirtualList
        v-else
        :items="filteredOptions"
        :item-size="optionSize ?? 2"
        :height="dropdownListHeight"
        key-field="value"
      >
        <template #default="{ item: opt }">
          <div
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
        </template>
      </ZVirtualList>
    </div>
  </Teleport>
</template>
