<script lang="ts">
/**
 * `ZQRCode` —— 二维码(基于 `qrcode` 生成 base64 data URL,内置 `<img>` 渲染)。
 *
 * **API**:
 * - `value: string` —— 二维码内容
 * - `pixelSize?: number` —— 尺寸 px(默认 160)。**故意不叫 `size`** —— zui 全栈 `size`
 *   是 px 倍数(响应式),但 QR 编码本身基于像素栅格,固定 px 才能保证码字清晰。
 * - `color?: string` —— 前景色(码点),默认跟随主题 `_text`(暗色自动反相)
 * - `bgColor?: string` —— 背景色,默认跟随主题 `_bg`
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
import { computed, ref, watchEffect } from 'vue'
import QRCode from 'qrcode'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { getThemeColor } from '../_internal/color-bridge'

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
 *   │  │   qrcode gen   │  │   qrcode.toDataURL + watchEffect 响应式生成 data URL
 *   │  └────────────────┘  │
 *   └──────────────────────┘
 *
 * 尺寸走 px(QR 编码本身基于像素)。
 */
const props = withDefaults(defineProps<ZQRCodeProps>(), {
  pixelSize: 160,
  margin: 4,
})

const theme = useZTheme()

// 默认前景/背景跟随主题(_text / _bg);暗色主题下二维码自动反相(浅码点 + 深底),
// 与所在 surface 一致。显式传 color / bgColor 时优先(如需固定黑白保证旧扫码器兼容)。
const fgColor = computed(() => props.color ?? getThemeColor(theme.value, 'text', '#000000'))
const bgFill = computed(() => props.bgColor ?? getThemeColor(theme.value, 'bg', '#ffffff'))

// 用 qrcode 直接生成 data URL + watchEffect 响应 value / 尺寸 / 颜色变化。
// ⚠️ 原先在 computed 里调用 `useQRCode` 组合式 —— 其内部异步 ref 更新会反复让该 computed 失效,
// 造成无限重渲染、页面卡死。改为把异步结果写入独立 `qrSrc` ref(watchEffect 不读取它),杜绝自激环。
const qrSrc = ref('')
watchEffect(() => {
  const text = props.value
  const opts = {
    width: props.pixelSize,
    margin: props.margin,
    color: { dark: fgColor.value, light: bgFill.value },
  }
  if (!text) {
    qrSrc.value = ''
    return
  }
  QRCode.toDataURL(text, opts).then(
    url => {
      qrSrc.value = url
    },
    () => {
      qrSrc.value = ''
    },
  )
})

const wrapClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineBlock
    s.width.px(props.pixelSize)
    s.height.px(props.pixelSize)
    s.backgroundColor(bgFill.value)
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
