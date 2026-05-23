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
import type { SizeProp } from '../_internal/size-prop'

export interface ZSpaceProps {
  /** 排列方向,默认 `'horizontal'`。 */
  direction?: 'horizontal' | 'vertical'
  /**
   * 子元素间距 —— `factory | Size5 | undefined` union(2026-05-22 修订)。
   *
   * **默认**:`'small'`(spacing.small,默认 8px,iem 联动)。
   *
   * @example
   * <ZSpace size="middle" />                  <!-- 16px gap -->
   * <ZSpace :size="(g) => g._large" />        <!-- factory 等价 -->
   * <ZSpace :size="(g) => g.iem(2)" />        <!-- 自定义 -->
   */
  size?: SizeProp<'gap'> | undefined
  /** 交叉轴对齐,默认 `'center'`(`horizontal` 时垂直居中,`vertical` 时水平居中)。 */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  /** 是否允许换行(仅 horizontal 有意义),默认 `false`。 */
  wrap?: boolean
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
import { applySizeProp, type SizeMap } from '../_internal/size-prop'

const props = withDefaults(defineProps<ZSpaceProps>(), {
  direction: 'horizontal',
  size: 'small',
  align: 'center',
  wrap: false,
  inline: false,
  tag: 'div',
})

const theme = useZTheme()

const ALIGN_MAP: Record<NonNullable<ZSpaceProps['align']>, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
}

/** ZSpace size 档位 → schema spacing token。 */
const SIZE_MAP: SizeMap<Chain<ZuiSchema>['gap']> = {
  tiny: (g) => {
    g._tiny
  },
  small: (g) => {
    g._small
  },
  middle: (g) => {
    g._middle
  },
  large: (g) => {
    g._large
  },
  huge: (g) => {
    g._huge
  },
}

const className = computed(() =>
  icss(theme.value, (s) => {
    if (props.inline) s.display.inlineFlex
    else s.display.flex
    if (props.direction === 'vertical') s.flexDirection.column
    else s.flexDirection.row
    if (props.wrap) s.flexWrap.wrap
    else s.flexWrap.nowrap
    s.alignItems(ALIGN_MAP[props.align])

    // gap:union(string 走 SIZE_MAP / factory 直接调)
    applySizeProp(props.size, SIZE_MAP, s.gap)

    props.css?.(s)
  }),
)
</script>

<template>
  <component :is="tag" :class="className">
    <slot />
  </component>
</template>
