<script lang="ts">
/**
 * `ZQRCode` —— 二维码(基于 `@vueuse/integrations/useQRCode` 生成 base64 data URL,内置 `<img>` 渲染)。
 *
 * **API**:
 * - `value: string` —— 二维码内容
 * - `pixelSize?: number` —— 尺寸 px(默认 160)。**故意不叫 `size`** —— zui 全栈 `size`
 *   是 px 倍数(响应式),但 QR 编码本身基于像素栅格,固定 px 才能保证码字清晰。
 * - `color?: string` —— 前景色,默认 `#000`
 * - `bgColor?: string` —— 背景色,默认 `#fff`
 * - `margin?: number` —— 边距 px,默认 4
 *
 * **依赖**:`qrcode`(`@vueuse/integrations` 同套依赖),业务方需 `pnpm add qrcode`(zui-vue peerDep)
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZQRCodeProps {
  value: string
  /**
   * 二维码物理像素尺寸(width = height = pixelSize px)。默认 `160`。
   *
   * 不使用 `size`(px 倍数)是因为 QR 编码基于像素栅格,固定 px 保证扫码清晰。
   */
  pixelSize?: number
  color?: string
  bgColor?: string
  margin?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

/**
 * 盒子模型(px,固定像素尺寸):
 *
 *   ┌──────────────────────┐
 *   │ wrap  inline-block   │   width/height: pixelSize px(默认 160,prop 可改)
 *   │   width:  pixelSize px│   bg: bgColor prop(默认 #fff)
 *   │   height: pixelSize px│   border-radius: _tiny
 *   │   bg: bgColor        │
 *   │   border-radius _tiny│
 *   │  ┌────────────────┐  │
 *   │  │  <img> QR data │  │   img: width 100% / height 100% / display block
 *   │  │   100% × 100%  │  │
 *   │  │   useQRCode    │  │   useQRCode @vueuse/integrations 生成 data URL
 *   │  └────────────────┘  │
 *   └──────────────────────┘
 *
 * 尺寸走 px(QR 编码本身基于像素)。
 */
const props = withDefaults(defineProps<ZQRCodeProps>(), {
  pixelSize: 160,
  color: '#000000',
  bgColor: '#ffffff',
  margin: 4,
})

const theme = useZTheme()

const qrOptions = computed(() => ({
  width: props.pixelSize,
  margin: props.margin,
  color: {
    dark: props.color,
    light: props.bgColor,
  },
}))

// useQRCode 不接 ref options;每次 compute 时调一次,自动响应 props 变化
const qrSrc = computed(() => useQRCode(props.value, qrOptions.value).value)

const wrapClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineBlock
    s.width.px(props.pixelSize)
    s.height.px(props.pixelSize)
    s.backgroundColor(props.bgColor)
    s.borderRadius._tiny
    props.css?.(s)
  }),
)

const imgClass = computed(() =>
  icss(theme.value, s => {
    s.width.pct(100)
    s.height.pct(100)
    s.display.block
  }),
)
</script>

<template>
  <div :class="wrapClass">
    <img :src="qrSrc" :alt="`QR code for ${value}`" :class="imgClass" />
  </div>
</template>
