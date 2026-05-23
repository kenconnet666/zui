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
import { getThemeColor } from '../_internal/color-bridge'

const props = withDefaults(defineProps<ZGradientTextProps>(), {
  tag: 'span',
})

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    const primary = getThemeColor(theme.value, 'primary', '#1976d2')
    const info = getThemeColor(theme.value, 'info', '#0288d1')
    const defaultGradient = `linear-gradient(135deg, ${primary}, ${info})`
    const grad = props.gradient ?? defaultGradient
    s.backgroundImage(grad)
    s.WebkitBackgroundClip('text')
    s.backgroundClip.text
    s.WebkitTextFillColor('transparent')
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
