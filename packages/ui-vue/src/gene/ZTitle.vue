<script lang="ts">
/**
 * `ZTitle` —— 标题(`h1`–`h6`)。继承 ZText 6 维度 + 5 状态,新增 `level` 决定默认 tag /
 * 字号 / 字重。
 *
 * **level → 默认尺寸 / 字重映射(用户传 `size` / `weight` factory 直接覆盖)**:
 *
 * | level | fontSize        | fontWeight | 物理(1 单位 = 16px) |
 * |:---:|---|---|:---:|
 * | 1     | `sizePx(2)`     | 700(bold)     | 32px |
 * | 2     | `sizePx(1.75)`  | 700(bold)     | 28px |
 * | 3     | `sizePx(1.5)`   | 600(semibold) | 24px |
 * | 4     | `sizePx(1.25)`  | 600(semibold) | 20px |
 * | 5     | `sizePx(1.125)` | 600(semibold) | 18px |
 * | 6     | `sizePx(1)`     | 600(semibold) | 16px |
 *
 * **默认 `tag` = `h{level}`**,语义化标题。用户可显式传 `tag` 改成 `div` 等中性元素
 * (例:页内"假标题"不参与 outline)。
 *
 * **纯 px 尺寸**:级别字号通过 `sizePx(N)` 直接换算为 px。
 * **schema fontSize 5 阶 token**(`_tiny/_small/_middle/_large/_huge`)主要服务 ZText 正文,
 * 标题 6 级走纯 `sizePx(N)` 不污染 token 表。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

/** ZTitle 支持的标题级别。 */
export type ZTitleLevel = 1 | 2 | 3 | 4 | 5 | 6

/** ZTitle 完整 props。**继承 ZText 全部维度 + 新增 `level`**。 */
export interface ZTitleProps {
  /** 标题级别(决定默认 tag = `h{level}` + 默认 fontSize/fontWeight)。默认 `1`。 */
  level?: ZTitleLevel

  /** 字号 —— `number`(px 倍数,默认 undefined = 跟 level 默认,1 单位 = 16px)。**传了会覆盖 level 默认 fontSize**。 */
  size?: number
  weight?: ((w: Chain<ZuiSchema>['fontWeight']) => void) | undefined
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  depth?: ((o: Chain<ZuiSchema>['opacity']) => void) | undefined
  leading?: ((l: Chain<ZuiSchema>['lineHeight']) => void) | undefined
  tracking?: ((t: Chain<ZuiSchema>['letterSpacing']) => void) | undefined

  italic?: boolean
  underline?: boolean
  underlineOnHover?: boolean
  strikethrough?: boolean
  mono?: boolean
  ellipsis?: boolean | number

  css?: ((s: Chain<ZuiSchema>) => void) | undefined
  /** 根元素 tag,默认 `h{level}`。 */
  tag?: string
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applyTypographyBase } from './_typography-base'
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(number 是 px 倍数,1 单位 = 16px,sizePx(n) = n × 16):
 *
 *   ┌──────────────────────────────────────┐
 *   │ ZTitle (块级,默认 <h{level}>)       │
 *   │   font-size: sizePx(size)            │   默认 size=undefined → 走 level 映射:
 *   │     level=1 → sizePx(2)   = 32px    │
 *   │     level=2 → sizePx(1.75)= 28px    │
 *   │     level=3 → sizePx(1.5) = 24px    │
 *   │     level=4 → sizePx(1.25)= 20px    │
 *   │     level=5 → sizePx(1.125)= 18px   │
 *   │     level=6 → sizePx(1)   = 16px    │
 *   │   line-height: _tight(=1.25,标题偏紧)│   font-weight: 700/600 跟 level
 *   │   margin: 0(重置浏览器默认)         │
 *   └──────────────────────────────────────┘
 *
 * 用户传 size 数字 → 覆盖 level 默认 fontSize,等比缩(无其它 px 维度)。
 * 非 px 单位走 `:css` 兜底:`(s) => s.fontSize.px(40)`。
 */
const props = withDefaults(defineProps<ZTitleProps>(), {
  level: 1,
  italic: false,
  underline: false,
  underlineOnHover: false,
  strikethrough: false,
  mono: false,
  ellipsis: false,
})

const theme = useZTheme()

/** level → 默认 fontSize 倍率(px 倍数,1 = 16px 基准,通过 sizePx 换算)。 */
const LEVEL_FONT_SIZE: Record<ZTitleLevel, number> = {
  1: 2,
  2: 1.75,
  3: 1.5,
  4: 1.25,
  5: 1.125,
  6: 1,
}

/** level → 默认 fontWeight(数值)。1-2 加粗,3-6 半粗。 */
const LEVEL_FONT_WEIGHT: Record<ZTitleLevel, number> = {
  1: 700,
  2: 700,
  3: 600,
  4: 600,
  5: 600,
  6: 600,
}

const effectiveTag = computed(() => props.tag ?? `h${props.level}`)

const className = computed(() =>
  icss(theme.value, s => {
    // 组件级默认(放最前,后续 applyTypographyBase 若 props 传了同名维度会覆盖)
    s.fontSize.px(sizePx(LEVEL_FONT_SIZE[props.level]))
    s.fontWeight(LEVEL_FONT_WEIGHT[props.level])
    // lineHeight._tight = 1.25（标题偏紧，比正文 normal 1.5 更紧凑）
    s.lineHeight._tight
    s.margin.px(0) // 重置浏览器默认 h{N} margin,块级布局由父容器掌控

    applyTypographyBase(s, props)
    props.css?.(s)
  }),
)
</script>

<template>
  <component :is="effectiveTag" :class="className">
    <slot />
  </component>
</template>
