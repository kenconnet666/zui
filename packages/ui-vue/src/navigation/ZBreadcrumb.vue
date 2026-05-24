<script lang="ts">
/**
 * `ZBreadcrumb` —— 面包屑导航。
 *
 * 两种使用形态:
 * 1. **配置式**:`items: Array<{ label, href?, onClick? }>` —— 一行带过
 * 2. **slot 式**:`#default` 内嵌 `<ZBreadcrumbItem>`(单组件挂在 ZBreadcrumb 默认 slot,
 *    手动写分隔符走 `separator` prop)
 *
 * **API**:
 * - `items?: BreadcrumbItem[]`
 * - `separator?: string` —— 默认 `'/'`
 * - sx:sxItem / sxSeparator
 *
 * **a11y**:`<nav aria-label="breadcrumb">` + 当前项 `aria-current="page"`。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export interface ZBreadcrumbItem {
  label: string
  href?: string
  onClick?: (e: MouseEvent) => void
}

export interface ZBreadcrumbProps {
  items?: ZBreadcrumbItem[]
  separator?: string
  sxItem?: SxObject
  sxSeparator?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'

const props = withDefaults(defineProps<ZBreadcrumbProps>(), {
  separator: '/',
})

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.flexWrap.wrap
    s.gap._tiny
    s.fontSize._small
    s.color._textSecondary
    props.css?.(s)
  }),
)

const itemClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.color.currentColor
    s.cursor.pointer
    s.textDecorationLine.none
    s._hover((h) => {
      h.color._primary
    })
    applySx(s, props.sxItem)
  }),
)
const sxItemAttrs = computed(() => extractSxAttrs(props.sxItem))

const lastItemClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._text
    s.fontWeight._medium
    s.cursor.default
    applySx(s, props.sxItem)
  }),
)

const separatorClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._textSecondary
    s.userSelect.none
    s.opacity._strong
    applySx(s, props.sxSeparator)
  }),
)
const sxSeparatorAttrs = computed(() => extractSxAttrs(props.sxSeparator))

const safeItems = computed<ZBreadcrumbItem[]>(() => props.items ?? [])

function onItemClick(item: ZBreadcrumbItem, e: MouseEvent): void {
  if (item.onClick) item.onClick(e)
}
</script>

<template>
  <nav :class="rootClass" aria-label="breadcrumb">
    <template v-if="safeItems.length > 0">
      <template v-for="(item, i) in safeItems" :key="i">
        <a
          v-if="i < safeItems.length - 1"
          :ref="sxItemAttrs.ref"
          :class="[itemClass, sxItemAttrs.class]"
          :style="sxItemAttrs.style"
          :href="item.href"
          v-bind="sxItemAttrs.attrs"
          @click="onItemClick(item, $event)"
        >
          {{ item.label }}
        </a>
        <span
          v-else
          :ref="sxItemAttrs.ref"
          :class="[lastItemClass, sxItemAttrs.class]"
          :style="sxItemAttrs.style"
          aria-current="page"
          v-bind="sxItemAttrs.attrs"
        >
          {{ item.label }}
        </span>
        <span
          v-if="i < safeItems.length - 1"
          :ref="sxSeparatorAttrs.ref"
          :class="[separatorClass, sxSeparatorAttrs.class]"
          :style="sxSeparatorAttrs.style"
          aria-hidden="true"
          v-bind="sxSeparatorAttrs.attrs"
        >
          {{ separator }}
        </span>
      </template>
    </template>
    <slot v-else />
  </nav>
</template>
