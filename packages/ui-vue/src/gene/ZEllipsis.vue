<script lang="ts">
/**
 * `ZEllipsis` —— 受控省略(单行 / 多行)。
 *
 * 跟 `ZText :ellipsis` prop 区别:`ZEllipsis` 是独立组件,可在任意位置包一层,
 * 不污染父级布局(ZText 的 ellipsis 影响 fontFamily 等其它 props)。
 *
 * - `lines?: number` —— 行数(默认 `1`)
 * - `tag?: string` —— 根元素 tag,默认 `'span'`
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZEllipsisProps {
  lines?: number
  tag?: string
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZEllipsisProps>(), {
  lines: 1,
  tag: 'span',
})

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    if (props.lines === 1) {
      s.display.inlineBlock
      s._prop('overflow', 'hidden')
      s._prop('textOverflow', 'ellipsis')
      s._prop('whiteSpace', 'nowrap')
      s._prop('maxWidth', '100%')
    } else {
      s.display('-webkit-box' as never)
      s._prop('overflow', 'hidden')
      s._prop('textOverflow', 'ellipsis')
      s._prop('WebkitLineClamp', String(props.lines))
      s._prop('WebkitBoxOrient', 'vertical')
    }
    props.css?.(s)
  }),
)
</script>

<template>
  <component :is="tag" :class="rootClass">
    <slot />
  </component>
</template>
