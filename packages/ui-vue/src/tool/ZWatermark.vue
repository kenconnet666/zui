<script lang="ts">
/**
 * `ZWatermark` —— 水印(canvas 生成图案 + 平铺背景)。
 *
 * **API**:
 * - `content: string` —— 水印文字
 * - `fontSize?: number` —— 默认 14
 * - `color?: string` —— 默认 `rgba(0,0,0,0.10)`
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

const props = withDefaults(defineProps<ZWatermarkProps>(), {
  fontSize: 14,
  color: 'rgba(0, 0, 0, 0.10)',
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
  ctx.font = `${fontSize}px sans-serif`
  ctx.fillStyle = props.color
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
