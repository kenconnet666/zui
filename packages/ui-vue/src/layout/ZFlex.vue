<script lang="ts">
/**
 * `ZFlex` —— Flexbox 布局容器。
 *
 * **6 个布局 prop**(枚举形式 + gap carrier factory):
 * - `direction`:`'row'` / `'column'` / `'row-reverse'` / `'column-reverse'`(默认 `'row'`)
 * - `wrap`:`true`(→ wrap)/ `false`(→ nowrap,默认)/ `'reverse'`(→ wrap-reverse)
 * - `justify`:`'start'` / `'center'` / `'end'` / `'between'` / `'around'` / `'evenly'`(默认 `'start'`)
 * - `align`:`'start'` / `'center'` / `'end'` / `'stretch'` / `'baseline'`(默认 `'stretch'`)
 * - `gap`:carrier factory → `gap` carrier(spacing token / iem / 字面量)
 * - `inline`:`true` → `display: inline-flex`,默认 `false` 走 `display: flex`
 *
 * **css 兜底**:逃生口,任意 chain 表达式。
 *
 * @example
 * ```vue
 * <ZFlex justify="between" align="center" :gap="(g) => g._middle">
 *   <Title />
 *   <Actions />
 * </ZFlex>
 * ```
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZFlexProps {
  /** `flex-direction`,默认 `'row'`。 */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  /** `flex-wrap`:`true`→wrap / `false`→nowrap(默认)/ `'reverse'`→wrap-reverse。 */
  wrap?: boolean | 'reverse'
  /** `justify-content`(主轴对齐),默认 `'start'`。 */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  /** `align-items`(交叉轴对齐),默认 `'stretch'`。 */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  /** `gap` carrier factory。例:`(g) => g._middle` / `(g) => g.iem(0.5)` / `(g) => g.px(8)`。 */
  gap?: ((g: Chain<ZuiSchema>['gap']) => void) | undefined
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

const props = withDefaults(defineProps<ZFlexProps>(), {
  direction: 'row',
  wrap: false,
  justify: 'start',
  align: 'stretch',
  inline: false,
  tag: 'div',
})

const theme = useZTheme()

const JUSTIFY_MAP: Record<NonNullable<ZFlexProps['justify']>, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
}

const ALIGN_MAP: Record<NonNullable<ZFlexProps['align']>, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
}

const className = computed(() =>
  icss(theme.value, (s) => {
    if (props.inline) s.display.inlineFlex
    else s.display.flex
    s.flexDirection(props.direction)
    s.flexWrap(
      props.wrap === true ? 'wrap' : props.wrap === 'reverse' ? 'wrap-reverse' : 'nowrap',
    )
    s.justifyContent(JUSTIFY_MAP[props.justify])
    s.alignItems(ALIGN_MAP[props.align])
    if (props.gap) s.gap(props.gap)

    props.css?.(s)
  }),
)
</script>

<template>
  <component :is="tag" :class="className">
    <slot />
  </component>
</template>
