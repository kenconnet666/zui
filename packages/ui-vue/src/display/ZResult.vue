<script lang="ts">
/**
 * `ZResult` —— 结果状态展示(类 antd Result)。
 *
 * **API**(B6:删 status 业务语义字符串映射,改 chain color factory + boolean):
 * - `color?: factory` —— 大图标颜色 carrier factory,默认 `_info`
 * - `icon?: Component` —— 自定义大图标(用户传组件;不传则走默认 info 图标)
 * - `notFound?: boolean` —— 404 模式,默认 false;为 true 时默认图标走 `BuiltinIcons.search`
 * - `title?: string` / `description?: string`
 * - slots:`#icon`(覆盖默认大图标 / 优先级高于 `icon` prop)/ default(操作按钮区)
 */
import type { Component } from 'vue'
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZResultProps {
  /** 大图标颜色 carrier factory。默认 `_info`。 */
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  /** 自定义大图标(传 Vue 组件);未传走 BuiltinIcons.info 或 search(notFound 时)。 */
  icon?: Component
  /** 404 模式,默认图标走 `BuiltinIcons.search`。默认 false。 */
  notFound?: boolean
  title?: string
  description?: string
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed, h } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { BuiltinIcons, ZIcon } from '../gene'

const props = withDefaults(defineProps<ZResultProps>(), {
  notFound: false,
})

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.alignItems.center
    s.justifyContent.center
    s.gap._small
    s.padding._huge
    s.color._text
    s.fontSize._middle
    props.css?.(s)
  }),
)

/**
 * 大图标 wrap 盒子模型(iem):font-size = 4iem(撑起 icon 字体)。
 * color 默认 `_info`,可被 `color` factory 覆盖。
 */
const iconWrapClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    if (props.color) {
      props.color(s.color)
    } else {
      s.color._info
    }
    s.fontSize.iem(4)
  }),
)

const titleClass = computed(() =>
  icss(theme.value, (s) => {
    s.fontSize._huge
    s.fontWeight._semibold
    s.color._text
    s.textAlign.center
  }),
)

/**
 * 描述文字盒子模型(iem):
 * - max-width: 30iem(限制段落宽度便于阅读)
 */
const descClass = computed(() =>
  icss(theme.value, (s) => {
    s.fontSize._middle
    s.color._textSecondary
    s.textAlign.center
    s.maxWidth.iem(30)
  }),
)

const actionsClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.gap._small
    s.marginTop._small
  }),
)

/**
 * 默认图标:
 * - 用户传 `icon` prop → 用 prop
 * - 否则 notFound=true → `BuiltinIcons.search`(404 语义)
 * - 否则 → `BuiltinIcons.info`
 */
const iconNode = computed(() => {
  if (props.icon) return h(props.icon)
  const defaultIcon = props.notFound ? BuiltinIcons.search : BuiltinIcons.info
  return h(ZIcon, { component: defaultIcon })
})
</script>

<template>
  <div :class="rootClass" role="status">
    <span :class="iconWrapClass">
      <slot name="icon">
        <component :is="iconNode" />
      </slot>
    </span>
    <div v-if="title" :class="titleClass">{{ title }}</div>
    <div v-if="description" :class="descClass">{{ description }}</div>
    <div v-if="$slots.default" :class="actionsClass">
      <slot />
    </div>
  </div>
</template>
