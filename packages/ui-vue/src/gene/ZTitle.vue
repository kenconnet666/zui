<script lang="ts">
/**
 * `ZTitle` —— 标题(`h1`–`h6`)。继承 ZText 6 维度 + 5 状态,新增 `level` 决定默认 tag /
 * 字号 / 字重。
 *
 * **level → 默认尺寸 / 字重映射(用户传 `size` / `weight` factory 直接覆盖)**:
 *
 * | level | fontSize    | fontWeight | 物理(默认 iem=16px) |
 * |:---:|---|---|:---:|
 * | 1     | `iem(2)`    | 700(bold)     | 32px |
 * | 2     | `iem(1.75)` | 700(bold)     | 28px |
 * | 3     | `iem(1.5)`  | 600(semibold) | 24px |
 * | 4     | `iem(1.25)` | 600(semibold) | 20px |
 * | 5     | `iem(1.125)`| 600(semibold) | 18px |
 * | 6     | `iem(1)`    | 600(semibold) | 16px |
 *
 * **默认 `tag` = `h{level}`**,语义化标题。用户可显式传 `tag` 改成 `div` 等中性元素
 * (例:页内"假标题"不参与 outline)。
 *
 * **iem 单位 + Provider 联动**:级别尺寸自动跟 ZBox 字号缩放。
 * **schema fontSize 5 阶 token**(`_tiny/_small/_middle/_large/_huge`)主要服务 ZText 正文,
 * 标题 6 级走纯 `iem(N)` 不污染 token 表。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SizeProp } from '../_internal/size-prop'

/** ZTitle 支持的标题级别。 */
export type ZTitleLevel = 1 | 2 | 3 | 4 | 5 | 6

/** ZTitle 完整 props。**继承 ZText 全部维度 + 新增 `level`**。 */
export interface ZTitleProps {
  /** 标题级别(决定默认 tag = `h{level}` + 默认 fontSize/fontWeight)。默认 `1`。 */
  level?: ZTitleLevel

  /** 字号(factory|Size5|undefined union)。**传了会覆盖 level 默认 fontSize**。 */
  size?: SizeProp<'fontSize'> | undefined
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

/** level → 默认 fontSize 倍率(iem 单位,1 = 16px 基准)。 */
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

/** level → 默认 lineHeight(标题不该太松,1.25 比正文 1.5 紧)。 */
const LEVEL_LINE_HEIGHT = 1.25

const effectiveTag = computed(() => props.tag ?? `h${props.level}`)

const className = computed(() =>
  icss(theme.value, (s) => {
    // 组件级默认(放最前,后续 applyTypographyBase 若 props 传了同名维度会覆盖)
    s.fontSize.iem(LEVEL_FONT_SIZE[props.level])
    s.fontWeight(LEVEL_FONT_WEIGHT[props.level])
    s.lineHeight(LEVEL_LINE_HEIGHT)
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
