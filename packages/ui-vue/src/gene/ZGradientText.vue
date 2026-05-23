<script lang="ts">
/**
 * `ZGradientText` —— 渐变文字(linear-gradient + `-webkit-background-clip: text`)。
 *
 * - `gradient?: string` —— 自定义 CSS gradient,默认 `linear-gradient(135deg, _primary, _info)`
 * - `tag?: string` —— 根元素,默认 `'span'`
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZGradientTextProps {
  gradient?: string
  tag?: string
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZGradientTextProps>(), {
  tag: 'span',
})

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    const resolved = theme.value as unknown as { color: Record<string, string> }
    const defaultGradient = `linear-gradient(135deg, ${resolved.color.primary ?? '#1976d2'}, ${resolved.color.info ?? '#0288d1'})`
    const grad = props.gradient ?? defaultGradient
    s._prop('backgroundImage', grad)
    s._prop('WebkitBackgroundClip', 'text')
    s._prop('backgroundClip', 'text')
    s._prop('WebkitTextFillColor', 'transparent')
    s.color.transparent
    s.fontWeight._semibold
    s.display.inlineBlock
    props.css?.(s)
  }),
)
</script>

<template>
  <component :is="tag" :class="rootClass">
    <slot />
  </component>
</template>
