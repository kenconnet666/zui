<script lang="ts">
/**
 * `ZFlex` —— Flexbox 布局容器。
 *
 * **API**(全 chain factory,Type A);默认行为对齐浏览器原生(row / nowrap / flex-start / stretch):
 * - `direction?: factory` —— `flexDirection` carrier
 * - `wrap?: factory` —— `flexWrap` carrier
 * - `justify?: factory` —— `justifyContent` carrier
 * - `align?: factory` —— `alignItems` carrier
 * - `gap?: factory` —— `gap` carrier
 * - `inline?: boolean` —— `true` → `display: inline-flex`,默认 `false` 走 `display: flex`
 *
 * @example
 * ```vue
 * <ZFlex
 *   :justify="(j) => j.spaceBetween"
 *   :align="(a) => a.center"
 *   :gap="(g) => g._middle"
 * >
 *   <Title />
 *   <Actions />
 * </ZFlex>
 *
 * <ZFlex :direction="(d) => d.column" :gap="(g) => g.iem(1.5)">
 *   <Item />
 * </ZFlex>
 * ```
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZFlexProps {
  /** `flex-direction` carrier factory。 */
  direction?: ((c: Chain<ZuiSchema>['flexDirection']) => void) | undefined
  /** `flex-wrap` carrier factory。 */
  wrap?: ((c: Chain<ZuiSchema>['flexWrap']) => void) | undefined
  /** `justify-content` carrier factory。 */
  justify?: ((c: Chain<ZuiSchema>['justifyContent']) => void) | undefined
  /** `align-items` carrier factory。 */
  align?: ((c: Chain<ZuiSchema>['alignItems']) => void) | undefined
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
  inline: false,
  tag: 'div',
})

const theme = useZTheme()

const className = computed(() =>
  icss(theme.value, s => {
    if (props.inline) s.display.inlineFlex
    else s.display.flex
    if (props.direction) s.flexDirection(props.direction)
    if (props.wrap) s.flexWrap(props.wrap)
    if (props.justify) s.justifyContent(props.justify)
    if (props.align) s.alignItems(props.align)
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
