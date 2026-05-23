<script lang="ts">
/**
 * `ZDivider` —— 分隔线(水平 / 垂直,可带中间文字)。
 *
 * **不属于 Typography 家族**(不接 6 维度 + 5 状态),但常跟 Title/Paragraph 配套使用,
 * 因此放在 gene/ 目录。**独立 props 集**。
 *
 * **形态**:
 * - `orientation: 'horizontal'`(默认)+ 无 slot → 单条横线
 * - `orientation: 'horizontal'` + 有 slot → flex 横向,左右两段 border + 中间文字
 * - `orientation: 'vertical'` → 单条竖线(inline,需要父容器有高度)
 *
 * **样式 prop**:
 * - `color` carrier factory 默认 `_border`(schema color token);线条与文字共用此色
 * - `thickness`(`'1px'` / `'2px'` / 任意 CSS 长度字符串)默认 `'1px'`
 * - `dashed: boolean` —— 虚线
 * - `align: 'left' | 'center' | 'right'`(默认 `'center'`)—— 仅横向带文字时生效
 *
 * **a11y**:`role="separator"` + `aria-orientation`,屏读器能跳读。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZDividerProps {
  /** 方向,默认 `'horizontal'`。垂直需父容器有高度(否则 0px)。 */
  orientation?: 'horizontal' | 'vertical'
  /** 虚线。 */
  dashed?: boolean
  /** 中间文字位置(仅 horizontal + 有 slot 时生效)。默认 `'center'`。 */
  align?: 'left' | 'center' | 'right'
  /**
   * 颜色 factory —— 接 `color` carrier。**默认**:`(c) => c._border`。
   *
   * 线条与中间文字共用此色(border 用 `currentColor` 跟 div color 联动)。
   * 想让文字独立色,在 slot 内用 ZText 自带 color。
   *
   * @example
   * <ZDivider :color="(c) => c._danger" />
   * <ZDivider :color="(c) => c('#abc')" />
   */
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  /**
   * 线条粗细。任意 CSS 长度字符串(如 `'2px'` / `'0.1em'`)。默认 `'1px'`。
   *
   * 走字符串而非 carrier:`border-*-width` 极少需要 token 化,直传更轻。
   * 想走 schema 长度(iem 联动)→ css 覆盖 `borderTopWidth` / `borderLeftWidth`。
   */
  thickness?: string
  /** 根元素二次精细覆盖。 */
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
  /** 根元素 tag,默认 `'div'`。 */
  tag?: string
}
</script>

<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZDividerProps>(), {
  orientation: 'horizontal',
  dashed: false,
  align: 'center',
  thickness: '1px',
  tag: 'div',
})

const slots = useSlots()
const theme = useZTheme()

const hasSlot = computed(() => !!slots.default)
const lineStyle = computed(() => (props.dashed ? 'dashed' : 'solid'))

/** 文字侧短边宽度(align=left/right 时短的那一段)。 */
const EDGE_RATIO = '10%'

const className = computed(() =>
  icss(theme.value, (s) => {
    // 颜色:默认 _border,用户 factory 覆盖。线 + 文字同色(border 走 currentColor 联动)
    if (props.color) s.color(props.color)
    else s.color._border

    if (props.orientation === 'vertical') {
      // ─── 垂直单线 ───
      s.display.inlineBlock
      s.width('0')
      s.alignSelf.stretch
      s.borderLeftWidth(props.thickness)
      s.borderLeftStyle(lineStyle.value)
      s.borderLeftColor.currentColor
    } else if (hasSlot.value) {
      // ─── 水平 + 中间文字 ───
      s.display.flex
      s.alignItems.center
      s.width.pct(100)
      s.gap.iem(0.5) // 文字与线之间间隙

      const beforeFlex = props.align === 'left' ? `0 0 ${EDGE_RATIO}` : '1'
      const afterFlex = props.align === 'right' ? `0 0 ${EDGE_RATIO}` : '1'

      s._before((b) => {
        b.content("''")
        b._prop('flex', beforeFlex)
        b._prop('borderTopWidth', props.thickness)
        b._prop('borderTopStyle', lineStyle.value)
        b._prop('borderTopColor', 'currentColor')
      })
      s._after((a) => {
        a.content("''")
        a._prop('flex', afterFlex)
        a._prop('borderTopWidth', props.thickness)
        a._prop('borderTopStyle', lineStyle.value)
        a._prop('borderTopColor', 'currentColor')
      })
    } else {
      // ─── 水平单线 ───
      s.display.block
      s.width.pct(100)
      s.borderTopWidth(props.thickness)
      s.borderTopStyle(lineStyle.value)
      s.borderTopColor.currentColor
    }

    props.css?.(s)
  }),
)
</script>

<template>
  <component
    :is="tag"
    :class="className"
    role="separator"
    :aria-orientation="orientation"
  >
    <slot />
  </component>
</template>
