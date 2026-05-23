<script lang="ts">
/**
 * `ZCode` —— 行内代码(`<code>`),走 schema `fonts.mono` 字体栈。
 *
 * - `inline: boolean` —— 默认 `true`(`<code>`);`false` 走 `<pre><code>` 块级
 * - `color` carrier factory —— 文字色,默认 `_text`
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZCodeProps {
  inline?: boolean
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZCodeProps>(), {
  inline: true,
})

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.fontFamily._mono
    s.backgroundColor._bgMuted
    s.borderRadius._tiny
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    if (props.color) s.color(props.color)
    else s.color._text

    if (props.inline) {
      s.display.inlineBlock
      s.paddingLeft.iem(0.375)
      s.paddingRight.iem(0.375)
      s.paddingTop.iem(0.0625)
      s.paddingBottom.iem(0.0625)
      s.fontSize.iem(0.875)
    } else {
      s.display.block
      s.padding._small
      s.overflowX.auto
      s.whiteSpace.pre
      s.fontSize._small
      s.lineHeight._normal
    }

    props.css?.(s)
  }),
)
</script>

<template>
  <component :is="inline ? 'code' : 'pre'" :class="rootClass">
    <code v-if="!inline"><slot /></code>
    <template v-else><slot /></template>
  </component>
</template>
