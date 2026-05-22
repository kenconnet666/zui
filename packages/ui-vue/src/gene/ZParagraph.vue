<script lang="ts">
/**
 * `ZParagraph` —— 段落(块级 + 段间距 + 舒适行高)。继承 ZText 6 维度 + 5 状态。
 *
 * **跟 ZText 的差异**(组件级默认):
 * - `display: block` —— 块级布局
 * - `margin: 0` + `margin-bottom: spacing._middle`(默认 16px,Provider 联动)—— 段间距走
 *   schema spacing token,统一节奏;重置浏览器默认 `p` 元素 `margin-block`
 * - 默认 `lineHeight: _normal`(1.5)—— 段落舒适行高,正文阅读体验
 * - `tag` 默认 `'p'` —— 语义化段落元素
 *
 * **schema 联动**:`margin-bottom` 用 `spacing._middle`,用户 `<ZBox :iem="large">`
 * 时段间距同步放大;想自定义间距走 css:`(s) => s.marginBottom._large`。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

/** ZParagraph 完整 props。**继承 ZText 全部维度**(同 props 接口,默认值不同)。 */
export interface ZParagraphProps {
  size?: ((f: Chain<ZuiSchema>['fontSize']) => void) | undefined
  weight?: ((w: Chain<ZuiSchema>['fontWeight']) => void) | undefined
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  depth?: ((o: Chain<ZuiSchema>['opacity']) => void) | undefined
  leading?: ((l: Chain<ZuiSchema>['lineHeight']) => void) | undefined
  tracking?: ((t: Chain<ZuiSchema>['letterSpacing']) => void) | undefined

  italic?: boolean
  underline?: 'always' | 'hover' | 'none'
  strikethrough?: boolean
  mono?: boolean
  ellipsis?: boolean | number

  css?: ((s: Chain<ZuiSchema>) => void) | undefined
  /** 根元素 tag,默认 `'p'`。 */
  tag?: string
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applyTypographyBase } from './_typography-base'

const props = withDefaults(defineProps<ZParagraphProps>(), {
  italic: false,
  underline: 'none',
  strikethrough: false,
  mono: false,
  ellipsis: false,
  tag: 'p',
})

const theme = useZTheme()

const className = computed(() =>
  icss(theme.value, (s) => {
    // ─── 组件默认(放最前,后续 applyTypographyBase 中传 props 时会覆盖) ───
    s.display.block
    s.margin('0') // 重置浏览器默认 <p> margin-block,统一由 schema spacing 接管
    s.marginBottom._middle // 默认 16px(schema spacing token,Provider 联动)
    if (!props.leading) s.lineHeight._normal // 段落舒适行高 1.5

    applyTypographyBase(s, props)
    props.css?.(s)
  }),
)
</script>

<template>
  <component :is="tag" :class="className">
    <slot />
  </component>
</template>
