<script lang="ts">
/**
 * `ZWatermark` —— 水印(canvas 生成图案 + 平铺背景)。
 *
 * **API**:
 * - `content: string` —— 水印文字
 * - `fontSize?: number` —— 默认 14
 * - `color?: string` —— 默认跟随主题 `_text` 10% alpha(亮/暗自适应;暗色背景下不再不可见)
 * - `gap?: number` —— 水印间距 px,默认 100
 * - `rotate?: number` —— 旋转角度 deg,默认 -22
 *
 * slot `default` —— 被水印覆盖的内容
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZWatermarkProps {
  content: string
  fontSize?: number
  color?: string
  gap?: number
  rotate?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { resolveColor } from '../_internal/color-bridge'

const props = withDefaults(defineProps<ZWatermarkProps>(), {
  fontSize: 14,
  gap: 100,
  rotate: -22,
})

const theme = useZTheme()

const watermarkDataUrl = computed(() => {
  if (typeof document === 'undefined') return ''
  const canvas = document.createElement('canvas')
  const ratio = window.devicePixelRatio || 1
  const fontSize = props.fontSize * ratio
  canvas.width = props.gap * ratio
  canvas.height = props.gap * ratio
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((props.rotate * Math.PI) / 180)
  // 字体跟随主题 fonts.sans(兜底 sans-serif)
  const themeSans: string = theme.value.fonts?.['sans'] ?? 'sans-serif'
  ctx.font = `${fontSize}px ${themeSans}`
  // 默认色跟随主题 _text 10% alpha(亮/暗自适应);用户显式传 color 则优先
  ctx.fillStyle = props.color ?? resolveColor(theme.value, c => c._text.alpha(10), 'rgba(0,0,0,0.10)')
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(props.content, 0, 0)
  return canvas.toDataURL()
})

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.position.relative
    props.css?.(s)
  }),
)

const overlayClass = computed(() =>
  icss(theme.value, s => {
    s.position.absolute
    s.inset.px(0)
    s.pointerEvents.none
    s.backgroundImage(`url(${watermarkDataUrl.value})`)
    s.backgroundRepeat.repeat
    s.backgroundSize(`${props.gap}px ${props.gap}px`)
    s.zIndex._small
  }),
)
</script>

<template>
  <div :class="rootClass">
    <slot />
    <div :class="overlayClass" aria-hidden="true" />
  </div>
</template>
