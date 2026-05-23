<script lang="ts">
/**
 * `ZQRCode` —— 二维码(基于 `@vueuse/integrations/useQRCode` 生成 base64 data URL,内置 `<img>` 渲染)。
 *
 * **API**:
 * - `value: string` —— 二维码内容
 * - `size?: number` —— 尺寸 px(默认 160)
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
  size?: number
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

const props = withDefaults(defineProps<ZQRCodeProps>(), {
  size: 160,
  color: '#000000',
  bgColor: '#ffffff',
  margin: 4,
})

const theme = useZTheme()

const qrOptions = computed(() => ({
  width: props.size,
  margin: props.margin,
  color: {
    dark: props.color,
    light: props.bgColor,
  },
}))

// useQRCode 不接 ref options;每次 compute 时调一次,自动响应 props 变化
const qrSrc = computed(() => useQRCode(props.value, qrOptions.value).value)

const wrapClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineBlock
    s._prop('width', `${props.size}px`)
    s._prop('height', `${props.size}px`)
    s.backgroundColor(props.bgColor)
    s.borderRadius._tiny
    props.css?.(s)
  }),
)

const imgStyle = computed(() => ({
  width: '100%',
  height: '100%',
  display: 'block',
}))
</script>

<template>
  <div :class="wrapClass">
    <img :src="qrSrc" :alt="`QR code for ${value}`" :style="imgStyle" />
  </div>
</template>
