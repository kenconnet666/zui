<script lang="ts">
/**
 * `ZBlockquote` —— 块引用(`<blockquote>`),左侧带强调色边条 + 中性背景 + 正文色文字。
 *
 * **视觉**:
 * - 左侧 4px border-color = `_primary`(或 user color)
 * - 内部背景 = `_bgMuted`(中性浅灰,不被强调色污染)
 * - 文字 = `_text`(主色文字,不被 opacity 淡化)
 *
 * `color` carrier factory 仅作用于 border 颜色。文字色独立。
 *
 * **(2026-05-23 技术债务修复:之前 `backgroundColor.currentColor; opacity._strong; color._text`
 * 三层导致整个元素淡化,且 currentColor 在 paint 时 resolve 当前 color 值,被后续 color._text 改写)。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZBlockquoteProps {
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZBlockquoteProps>(), {
  // border-left 颜色默认 `_primary`(可被 user factory 覆盖)
  color: (c: Chain<ZuiSchema>['color']) => {
    c._primary
  },
})

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.block
    s.margin.px(0)
    s.color._text
    s.backgroundColor._bgMuted
    s.borderRadius._tiny
    s.fontStyle('italic')
    s.lineHeight._relaxed
    s.paddingLeft._middle
    s.paddingRight._small
    s.paddingTop._small
    s.paddingBottom._small
    s.borderLeftWidth.px(4)
    s.borderLeftStyle.solid
    // border-left 用 user color factory(默认 `_primary`,从 withDefaults 提供),桥接到 borderLeftColor;不影响文字
    s.borderLeftColor(props.color)
    props.css?.(s)
  }),
)
</script>

<template>
  <blockquote :class="rootClass">
    <slot />
  </blockquote>
</template>
