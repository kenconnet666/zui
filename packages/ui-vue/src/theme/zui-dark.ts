import { Theme, FLAT_PALETTE, tw } from '@kenconnet666/zui-core'
import { zuiLight } from './zui-light'
import type { ZuiSchema } from './schema'

/**
 * zui 默认深色主题 —— 与 `zuiLight` 共享 palette 与设计 scale；语义色 alias 到暗色 shade，
 * `bg` 反色，`text` 用浅灰。
 *
 * **复用 light 的 sizing / borders / typography / motion / size schema 字段**(这些不随主题切换),
 * **独立覆盖 color + shadow**:
 * - color:语义 alias 用暗色 shade,`bg` 反色,`text` 用浅灰
 * - shadow:dark 模式 bg 深,需要更强阴影才有"浮起"感(rgba 黑色不透明度提升)
 */
export const zuiDark = new Theme<ZuiSchema>({
  color: {
    ...FLAT_PALETTE,
    primary: tw('blue', '500'),
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
  /**
   * dark 模式专属 shadow —— 比 light 加深 2-3 倍(0.1 → 0.4),才能在深色 bg 上看到"浮起"。
   * 也可考虑加 `inset 0 0 0 1px rgba(255,255,255,0.04)` 做"亮缘"效果,这里先简版只调不透明度。
   */
  shadow: {
    tiny: '0 1px 1px 0 rgb(0 0 0 / 0.3)',
    small: '0 1px 2px 0 rgb(0 0 0 / 0.4)',
    middle: '0 4px 6px -1px rgb(0 0 0 / 0.5)',
    large: '0 10px 15px -3px rgb(0 0 0 / 0.6)',
    huge: '0 25px 50px -12px rgb(0 0 0 / 0.7)',
  },
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
  sizes: zuiLight.schema.sizes,
  borders: zuiLight.schema.borders,
  transitionProperty: zuiLight.schema.transitionProperty,
})
