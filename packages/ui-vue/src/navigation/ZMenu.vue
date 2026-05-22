<script lang="ts">
/**
 * `ZMenu` —— 菜单(horizontal / vertical / inline)。
 *
 * **API**:
 * - `v-model:value`(当前选中项 key)
 * - `items: MenuItem[]` —— 树形或扁平。`children` 数组表示 submenu。
 * - `mode?: 'horizontal' | 'vertical' | 'inline'` —— 默认 `'vertical'`
 * - `collapsed?: boolean` —— inline 模式下收起(只显示 icon)
 * - `disabled?: boolean`
 * - sx:sxItem / sxSubmenu / sxLabel
 *
 * **submenu 行为**:
 * - inline 模式 → 内联展开(点击 toggle children)
 * - horizontal/vertical 模式 → hover/click 弹出浮层(本 v1 简化只支持 inline expand 风格)
 *
 * **a11y**:`role="menu"` / `role="menuitem"` / `aria-expanded`(submenu)。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export type ZMenuMode = 'horizontal' | 'vertical' | 'inline'

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
  mode?: ZMenuMode
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
import { applySx, extractSxAttrs } from '../_internal/sx'
import { BuiltinIcons, ZIcon } from '../gene'

const props = withDefaults(defineProps<ZMenuProps>(), {
  mode: 'vertical',
  collapsed: false,
  disabled: false,
})

const emit = defineEmits<ZMenuEmits>()

const theme = useZTheme()

const expandedKeys = ref<Set<string>>(new Set())

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    if (props.mode === 'horizontal') {
      s.flexDirection.row
      s.gap._tiny
    } else {
      s.flexDirection.column
      s.gap._tiny
    }
    s.color._text
    s.fontSize._middle
    s.backgroundColor._bg
    props.css?.(s)
  }),
)

function itemClass(item: ZMenuItem, isActive: boolean, depth: number): string {
  return icss(theme.value, (s) => {
    s.display.flex
    s.alignItems.center
    s.gap._small
    s.cursor.pointer
    s.borderStyle.none
    s.backgroundColor.transparent
    s.color._text
    s.fontSize._middle
    s.padding._small
    s.paddingLeft.iem(0.75 + depth * 0.75)
    s.paddingRight._small
    s.borderRadius._small
    s.transitionProperty._colors
    s.transitionDuration._small
    s._prop('textAlign', 'left')
    s.width.pct(100)
    if (isActive) {
      s.color._primary
      s.backgroundColor._primary.alpha(8)
      s.fontWeight._medium
    }
    s._hover((h2) => {
      if (!item.disabled && !isActive) h2.backgroundColor._textSecondary.alpha(8)
    })
    if (item.disabled || props.disabled) {
      s.opacity._dim
      s._prop('cursor', 'not-allowed')
    }
    applySx(s, props.sxItem)
  })
}
const sxItemAttrs = computed(() => extractSxAttrs(props.sxItem))

const submenuClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.gap._tiny
    applySx(s, props.sxSubmenu)
  }),
)
const sxSubmenuAttrs = computed(() => extractSxAttrs(props.sxSubmenu))

const labelClass = computed(() =>
  icss(theme.value, (s) => {
    s.flexGrow(1)
    s._prop('overflow', 'hidden')
    s._prop('whiteSpace', 'nowrap')
    s._prop('textOverflow', 'ellipsis')
    applySx(s, props.sxLabel)
  }),
)
const sxLabelAttrs = computed(() => extractSxAttrs(props.sxLabel))

const arrowClass = (expanded: boolean): string =>
  icss(theme.value, (s) => {
    s.color._textSecondary
    s.transitionProperty._transform
    s.transitionDuration._small
    s._prop('transform', expanded ? 'rotate(180deg)' : 'rotate(0deg)')
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
        :class="[
          itemClass(item, value === item.key, 0),
          sxItemAttrs.class,
        ]"
        :style="sxItemAttrs.style"
        role="menuitem"
        :aria-disabled="item.disabled || disabled"
        :aria-expanded="item.children && item.children.length > 0 ? isExpanded(item.key) : undefined"
        v-bind="sxItemAttrs.attrs"
        @click="onItemClick(item)"
      >
        <component v-if="item.icon" :is="h(ZIcon, { component: item.icon })" />
        <span
          v-if="!collapsed"
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
        :class="[submenuClass, sxSubmenuAttrs.class]"
        :style="sxSubmenuAttrs.style"
        role="menu"
        v-bind="sxSubmenuAttrs.attrs"
      >
        <li v-for="child in item.children" :key="child.key" role="none" style="list-style: none">
          <button
            type="button"
            :class="[itemClass(child, value === child.key, 1), sxItemAttrs.class]"
            :style="sxItemAttrs.style"
            role="menuitem"
            :aria-disabled="child.disabled || disabled"
            v-bind="sxItemAttrs.attrs"
            @click="onItemClick(child)"
          >
            <component v-if="child.icon" :is="h(ZIcon, { component: child.icon })" />
            <span
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
