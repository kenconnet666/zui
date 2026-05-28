<script lang="ts">
/**
 * `ZSpacer` —— flex 容器内的「占位推开」组件,默认 `flex: 1 1 auto`,把同行的兄弟元素推到两侧。
 *
 * **使用场景**:工具栏左边按钮 + 右边按钮,中间用 `<ZSpacer />` 推开。
 * 等价于手写 `<div style="flex: 1" />`,但语义化 + 可主题化。
 *
 * @example
 * ```vue
 * <ZFlex>
 *   <Title />
 *   <ZSpacer />
 *   <Actions />
 * </ZFlex>
 * ```
 *
 * **可选定制**:
 * - `grow` / `shrink`:flex 子项 grow/shrink 数值(默认都 1)
 * - `basis`:carrier factory → `flex-basis`(默认 `'auto'`)
 *
 * **注意**:必须放在 flex 容器内才有效(`<ZFlex>` / `<ZSpace>` / 任何 `display: flex` 父级)。
 * 在 grid / block 容器内 `flex: 1 1 auto` 无效果。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZSpacerProps {
  /** flex-grow,默认 `1`。 */
  grow?: number
  /** flex-shrink,默认 `1`。 */
  shrink?: number
  /** flex-basis carrier factory(默认 `'auto'`)。 */
  basis?: ((b: Chain<ZuiSchema>['flexBasis']) => void) | undefined
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

const props = withDefaults(defineProps<ZSpacerProps>(), {
  grow: 1,
  shrink: 1,
  tag: 'div',
  // flex-basis 默认 `auto`(占位推开行为)
  basis: (b: Chain<ZuiSchema>['flexBasis']) => {
    b.auto
  },
})

const theme = useZTheme()

const className = computed(() =>
  icss(theme.value, s => {
    s.flexGrow(props.grow)
    s.flexShrink(props.shrink)
    // basis 默认 `auto`(从 withDefaults 提供)
    s.flexBasis(props.basis)

    props.css?.(s)
  }),
)
</script>

<template>
  <component :is="tag" :class="className" aria-hidden="true" />
</template>
