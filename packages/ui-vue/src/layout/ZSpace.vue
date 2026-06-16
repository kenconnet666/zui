<script lang="ts">
/**
 * `ZSpace` —— 等间距布局(类似 antd `Space`)。横/竖排同款 API,gap 走 schema spacing token。
 *
 * **跟 `ZFlex` 的区别**:`ZSpace` 默认 `align: 'center'` + 不 wrap + 主轴 `flex-start`,
 * 是「行内一组元素自动留固定间距」的封装(场景:工具栏按钮组、表单字段组、Tag 列表)。
 * `ZFlex` 是通用 flex 容器。
 *
 * @example
 * ```vue
 * <ZSpace :size="(g) => g._small">
 *   <ZButton>Save</ZButton>
 *   <ZButton>Cancel</ZButton>
 * </ZSpace>
 *
 * <ZSpace direction="vertical" :size="(g) => g._middle">
 *   <Item v-for="i in items" :key="i.id" :item="i" />
 * </ZSpace>
 * ```
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZSpaceProps {
  /** 排列方向 carrier factory(`flexDirection`),默认不写 = 浏览器原生 `row`。 */
  direction?: ((c: Chain<ZuiSchema>['flexDirection']) => void) | undefined
  /**
   * 子元素间距 —— `gap` carrier factory(2026-05-23 撤销 Size5 union)。
   *
   * @example
   * <ZSpace :size="(g) => g._middle" />
   * <ZSpace :size="(g) => g.px(32)" />
   */
  size?: ((g: Chain<ZuiSchema>['gap']) => void) | undefined
  /** 交叉轴对齐 carrier factory(`alignItems`),默认 `center`。 */
  align?: ((c: Chain<ZuiSchema>['alignItems']) => void) | undefined
  /** 换行 carrier factory(`flexWrap`),默认不写 = 浏览器原生 `nowrap`。 */
  wrap?: ((c: Chain<ZuiSchema>['flexWrap']) => void) | undefined
  /** `display: inline-flex`(默认 `flex`)。 */
  inline?: boolean
  /** 根元素二次精细覆盖。 */
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
  /** 根元素 tag,默认 `'div'`。 */
  tag?: string
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZSpaceProps>(), {
  inline: false,
  tag: 'div',
  // gap 默认 `_small`(ZSpace 卖点是等间距)
  size: (g: Chain<ZuiSchema>['gap']) => {
    g._small
  },
  // 交叉轴默认 `center`(ZSpace 卖点是行内对齐)
  align: (c: Chain<ZuiSchema>['alignItems']) => {
    c.center
  },
})

const theme = useZTheme()

const className = computed(() =>
  icss(theme.value, s => {
    if (props.inline) s.display.inlineFlex
    else s.display.flex
    if (props.direction) s.flexDirection(props.direction)
    if (props.wrap) s.flexWrap(props.wrap)
    // align 默认 `center`(从 withDefaults 提供)
    s.alignItems(props.align)
    // gap 默认 `_small`(从 withDefaults 提供)
    s.gap(props.size)

    props.css?.(s)
  }),
)
</script>

<template>
  <component :is="tag" :class="className">
    <slot />
  </component>
</template>
