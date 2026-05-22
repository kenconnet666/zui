import { Theme, FLAT_PALETTE, tw } from '@kenconnet666/zui-core'
import { zuiLight } from './zui-light'
import type { ZuiSchema } from './schema'

/**
 * zui 默认深色主题 —— 与 `zuiLight` 共享 palette 与设计 scale；语义色 alias 到暗色 shade，
 * `bg` 反色，`text` 用浅灰。
 *
 * 复用 light 的 schema 字段（spacing/radius/fontSize 等不随主题切换），只覆盖语义色。
 */
export const zuiDark = new Theme<ZuiSchema>({
  color: {
    ...FLAT_PALETTE,
    primary: tw('blue', '500'),
    primaryHover: tw('blue', '600'),
    danger: tw('red', '500'),
    warning: tw('yellow', '500'),
    success: tw('green', '500'),
    info: tw('cyan', '500'),
    text: tw('gray', '100'),
    textMuted: tw('gray', '400'),
    bg: tw('gray', '900'),
    bgMuted: tw('gray', '800'),
    border: tw('gray', '600'),
  },
  spacing: zuiLight.schema.spacing,
  radius: zuiLight.schema.radius,
  fontSize: zuiLight.schema.fontSize,
  fontWeight: zuiLight.schema.fontWeight,
  shadow: zuiLight.schema.shadow,
  blur: zuiLight.schema.blur,
  duration: zuiLight.schema.duration,
  easing: zuiLight.schema.easing,
  breakpoint: zuiLight.schema.breakpoint,
  zIndex: zuiLight.schema.zIndex,
  opacity: zuiLight.schema.opacity,
  lineHeight: zuiLight.schema.lineHeight,
  letterSpacing: zuiLight.schema.letterSpacing,
  aspectRatio: zuiLight.schema.aspectRatio,
  fonts: zuiLight.schema.fonts,
})
