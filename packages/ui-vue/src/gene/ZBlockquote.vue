<script lang="ts">
/**
 * `ZBlockquote` —— 块引用(`<blockquote>`),左侧带强调色边条。
 *
 * - `color` carrier factory —— 边条 + 文字色,默认 `_primary`
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZBlockquoteProps {
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = defineProps<ZBlockquoteProps>()

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.block
    if (props.color) s.color(props.color)
    else s.color._primary
    s._prop('borderLeftWidth', '4px')
    s._prop('borderLeftStyle', 'solid')
    s._prop('borderLeftColor', 'currentColor')
    s.paddingLeft._middle
    s.paddingRight._small
    s.paddingTop._small
    s.paddingBottom._small
    s.margin('0')
    s.backgroundColor.currentColor
    s.opacity._strong
    s.color._text
    s.borderRadius._tiny
    s._prop('fontStyle', 'italic')
    s.lineHeight._relaxed
    // 文字色覆盖 currentColor 背景(text 是 mainstreem 色)
    props.css?.(s)
  }),
)

const innerClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._text
    s._prop('fontStyle', 'normal')
  }),
)

void innerClass
</script>

<template>
  <blockquote :class="rootClass">
    <slot />
  </blockquote>
</template>
