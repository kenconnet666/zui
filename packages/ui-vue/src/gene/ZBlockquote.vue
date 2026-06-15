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
  /**
   * 尺寸 —— `number`(iem 倍数,默认 1 = 16px @ 16px iem)。
   *
   * 内部按比例:
   * - `padding-y` = `size * 0.5`
   * - `padding-x` = `size * 0.75`
   * - `border-left-width` = `size * 0.25`
   *
   * 2026-05-24 B7:数值尺寸 prop 改 `number`。
   */
  size?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(iem,Provider 控制基准;number 是 iem 倍数,默认 1iem=16px @ 1080p):
 *
 *   ┌────────────────────────────────────────┐
 *   │ ZBlockquote (block,<blockquote>)       │
 *   │   font-size: `size` iem                │   默认 size=1(16px @ 1080p)
 *   │   padding-y: size*0.5 iem              │   = 0.5iem(8px)
 *   │   padding-x: size*0.75 iem             │   = 0.75iem(12px)
 *   │   border-left-width: size*0.25 iem     │   = 0.25iem(4px)左侧强调边条
 *   │   border-radius: _tiny                 │
 *   │   bg: _bgMuted   color: _text          │   borderLeftColor: 用户 color 或 _primary
 *   │   font-style: italic                   │
 *   └────────────────────────────────────────┘
 *
 * 用户改 size 数字 → padding / border-left-width / fontSize 等比缩(整体比例不变)。
 * 非 iem 单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZBlockquoteProps>(), {
  size: 1,
  // border-left 颜色默认 `_primary`(可被 user factory 覆盖)
  color: (c: Chain<ZuiSchema>['color']) => {
    c._primary
  },
})

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, s => {
    const size = props.size ?? 1
    s.display.block
    s.margin.px(0)
    s.color._text
    s.backgroundColor._bgMuted
    s.borderRadius._tiny
    s.fontStyle('italic')
    s.lineHeight._relaxed
    s.fontSize.px(sizePx(size))
    s.paddingTop.px(sizePx(size * 0.5))
    s.paddingBottom.px(sizePx(size * 0.5))
    s.paddingLeft.px(sizePx(size * 0.75))
    s.paddingRight.px(sizePx(size * 0.75))
    s.borderLeftWidth.px(sizePx(size * 0.25))
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
