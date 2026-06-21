<script lang="ts">
/**
 * `ZMenu` —— 菜单(横向 / 纵向 / inline)。
 *
 * **API**(2026-05-23 拆 mode → 双 boolean):
 * - `v-model:value`(当前选中项 key)
 * - `items: MenuItem[]` —— 树形或扁平。`children` 数组表示 submenu。
 * - `vertical?: boolean` —— 纵向,默认 `true`。`false` → 横向菜单
 * - `inline?: boolean` —— submenu 内联展开(只对纵向有效),默认 `false`(弹出)
 * - `collapsed?: boolean` —— inline 模式下收起(只显示 icon)
 * - `disabled?: boolean`
 * - sx:sxItem / sxSubmenu / sxLabel
 *
 * **submenu 行为**:
 * - `inline=true` → 内联展开(点击 toggle children)
 * - `inline=false` → hover/click 弹出浮层(本 v1 简化也走内联展开)
 *
 * **a11y**:`role="menu"` / `role="menuitem"` / `aria-expanded`(submenu)。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export interface ZMenuItem {
  key: string
  label: string
  disabled?: boolean
  /** 图标组件(可选,通常 `BuiltinIcons` 中之一)。 */
  icon?: unknown
  /** 子菜单。 */
  children?: ZMenuItem[]
}

export interface ZMenuProps {
  value?: string | null
  items: ZMenuItem[]
  /** 纵向菜单,默认 `true`。`false` → 横向。 */
  vertical?: boolean
  /** submenu 内联展开(仅 vertical=true 生效),默认 `false`(弹出)。 */
  inline?: boolean
  collapsed?: boolean
  disabled?: boolean
  sxItem?: SxObject
  sxSubmenu?: SxObject
  sxLabel?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZMenuEmits {
  (e: 'update:value', key: string): void
  (e: 'select', key: string): void
}
</script>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { sizePx } from '../_internal/sizing'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { BuiltinIcons, ZIcon } from '../gene'

/**
 * 盒子模型(纯 px,1 单位 = 16px):
 *
 *   ┌──────────────────────────────────────────────────┐
 *   │ <ul> root  flex column(vertical=true) 或 row    │   gap _tiny
 *   │   color _text  fontSize _middle  bg _bg          │
 *   │                                                  │
 *   │  ┌────────────────────────────────────────────┐  │   menu item:
 *   │  │ menuitem  flex / center / gap _small        │  │     pad _small
 *   │  │   pad _small                                │  │     pad-left: (0.75 + depth*0.75) × 16px
 *   │  │   pad-left: (0.75 + depth*0.75) × 16px(层级缩进)│  │     pad-right _small
 *   │  │   pad-right _small  border-radius _small    │  │     active: bg _primary.alpha(8)
 *   │  │   active: bg _primary.alpha(8) + _primary  │  │            color _primary _medium
 *   │  │   hover: bg _textSecondary.alpha(8)        │  │
 *   │  │   disabled: opacity _dim                    │  │
 *   │  │  ┌─────┐ ┌──────────┐ ┌──────┐             │  │
 *   │  │  │icon │ │ label    │ │arrow │             │  │   icon(可选)/ label flex-grow /
 *   │  │  │     │ │ ellipsis │ │ ▼    │             │  │   arrow(有 children + 非 collapsed):
 *   │  │  └─────┘ └──────────┘ └──────┘             │  │     rotate 180 on expanded
 *   │  └────────────────────────────────────────────┘  │
 *   │  │                                              │  │
 *   │  └──── submenu(展开时,内嵌 <ul>) ──────────┐  │   submenu:
 *   │                                              │  │     flex column gap _tiny
 *   │  (循环 items,有 children 内联展开 toggle)  │  │
 *   └──────────────────────────────────────────────────┘
 *
 * collapsed=true 时只显示 icon,隐藏 label 和 arrow。
 */
const props = withDefaults(defineProps<ZMenuProps>(), {
  vertical: true,
  inline: false,
  collapsed: false,
  disabled: false,
})

const emit = defineEmits<ZMenuEmits>()

const theme = useZTheme()

const expandedKeys = ref<Set<string>>(new Set())

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    if (props.vertical) {
      s.flexDirection.column
    } else {
      s.flexDirection.row
    }
    s.margin.px(0)
    s.padding.px(0)
    s.gap._tiny
    s.color._text
    s.fontSize._middle
    s.backgroundColor._bg
    props.css?.(s)
  }),
)

const itemClass = (item: ZMenuItem, isActive: boolean, depth: number): string =>
  icss(theme.value, s => {
    s.display.flex
    s.alignItems.center
    s.gap._small
    s.cursor.pointer
    s.borderStyle.none
    s.backgroundColor.transparent
    s.color._text
    s.fontSize._middle
    s.padding._small
    s.paddingLeft.px(sizePx(0.75 + depth * 0.75))
    s.paddingRight._small
    s.borderRadius._small
    s.transitionProperty._colors
    s.transitionDuration._small
    s.textAlign.left
    s.width.pct(100)
    if (isActive) {
      s.color._primary
      s.backgroundColor._selectedBg
      s.fontWeight._medium
    }
    s._hover(h2 => {
      if (!item.disabled && !isActive) h2.backgroundColor._bgHover
    })
    if (item.disabled || props.disabled) {
      s.opacity._dim
      s.cursor.notAllowed
    }
    applySx(s, props.sxItem)
  })
const sxItemAttrs = computed(() => extractSxAttrs(props.sxItem))

const submenuClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.flexDirection.column
    s.gap._tiny
    applySx(s, props.sxSubmenu)
  }),
)
const sxSubmenuAttrs = computed(() => extractSxAttrs(props.sxSubmenu))

const labelClass = computed(() =>
  icss(theme.value, s => {
    s.flexGrow(1)
    s.overflow.hidden
    s.whiteSpace.nowrap
    s.textOverflow.ellipsis
    applySx(s, props.sxLabel)
  }),
)
const sxLabelAttrs = computed(() => extractSxAttrs(props.sxLabel))

const arrowClass = (expanded: boolean): string =>
  icss(theme.value, s => {
    s.color._textSecondary
    s.transitionProperty._transform
    s.transitionDuration._small
    s.transform(expanded ? 'rotate(180deg)' : 'rotate(0deg)')
  })

function isExpanded(key: string): boolean {
  return expandedKeys.value.has(key)
}

function toggleExpand(key: string): void {
  if (expandedKeys.value.has(key)) expandedKeys.value.delete(key)
  else expandedKeys.value.add(key)
  // 强制响应:Set 修改不自动 trigger;重新赋值
  expandedKeys.value = new Set(expandedKeys.value)
}

function onItemClick(item: ZMenuItem): void {
  if (item.disabled || props.disabled) return
  if (item.children && item.children.length > 0) {
    toggleExpand(item.key)
    return
  }
  emit('update:value', item.key)
  emit('select', item.key)
}

const downIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronDown }))
</script>

<template>
  <ul :class="rootClass" role="menu">
    <li v-for="item in items" :key="item.key" role="none" style="list-style: none">
      <button
        type="button"
        :ref="sxItemAttrs.ref"
        :class="[itemClass(item, value === item.key, 0), sxItemAttrs.class]"
        :style="sxItemAttrs.style"
        role="menuitem"
        :aria-disabled="item.disabled || disabled"
        :aria-expanded="
          item.children && item.children.length > 0 ? isExpanded(item.key) : undefined
        "
        v-bind="sxItemAttrs.attrs"
        @click="onItemClick(item)"
      >
        <component v-if="item.icon" :is="h(ZIcon, { component: item.icon })" />
        <span
          v-if="!collapsed"
          :ref="sxLabelAttrs.ref"
          :class="[labelClass, sxLabelAttrs.class]"
          :style="sxLabelAttrs.style"
          v-bind="sxLabelAttrs.attrs"
        >
          {{ item.label }}
        </span>
        <span
          v-if="item.children && item.children.length > 0 && !collapsed"
          :class="arrowClass(isExpanded(item.key))"
        >
          <component :is="downIcon" />
        </span>
      </button>
      <ul
        v-if="item.children && item.children.length > 0 && isExpanded(item.key) && !collapsed"
        :ref="sxSubmenuAttrs.ref"
        :class="[submenuClass, sxSubmenuAttrs.class]"
        :style="sxSubmenuAttrs.style"
        role="menu"
        v-bind="sxSubmenuAttrs.attrs"
      >
        <li v-for="child in item.children" :key="child.key" role="none" style="list-style: none">
          <button
            type="button"
            :ref="sxItemAttrs.ref"
            :class="[itemClass(child, value === child.key, 1), sxItemAttrs.class]"
            :style="sxItemAttrs.style"
            role="menuitem"
            :aria-disabled="child.disabled || disabled"
            v-bind="sxItemAttrs.attrs"
            @click="onItemClick(child)"
          >
            <component v-if="child.icon" :is="h(ZIcon, { component: child.icon })" />
            <span
              :ref="sxLabelAttrs.ref"
              :class="[labelClass, sxLabelAttrs.class]"
              :style="sxLabelAttrs.style"
              v-bind="sxLabelAttrs.attrs"
            >
              {{ child.label }}
            </span>
          </button>
        </li>
      </ul>
    </li>
  </ul>
</template>
