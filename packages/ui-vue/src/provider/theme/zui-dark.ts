import { Theme, FLAT_PALETTE } from '@kenconnet666/zui-core'
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
  /**
   * **Material Design dark 配色**(Stage 4 / 2026-05-23):
   * - primary / danger / warning / success / info 走 Material 200 shade(暗背景上更柔和、对比度更高)
   * - text / textSecondary 用 grey-300 / grey-500(避开纯白,降低瞳孔疲劳)
   * - bg `#121212`(M3 dark surface 推荐基色)/ bgMuted `#1e1e1e`(M3 surface +1)/ border grey-700
   * - focusRing 同 primary;overlayBg `#000` 同 light(透明度让位 alpha modifier)
   */
  color: {
    ...FLAT_PALETTE,
    primary: '#90caf9', // Material Blue 200
    danger: '#ef5350', // Red 400
    warning: '#ffa726', // Orange 400
    success: '#66bb6a', // Green 400
    info: '#4fc3f7', // Light Blue 300
    text: '#e0e0e0', // grey-300
    textSecondary: '#9e9e9e', // grey-500
    textTertiary: '#757575', // grey-600 —— 三级文本(暗背景下更收敛)
    bg: '#121212', // M3 dark surface
    bgMuted: '#1e1e1e', // M3 surface +1
    border: '#424242', // grey-800
    focusRing: '#90caf9', // 同 primary
    overlayBg: '#000000',
  },
  spacing: zuiLight.schema.spacing,
  radius: zuiLight.schema.radius,
  fontSize: zuiLight.schema.fontSize,
  fontWeight: zuiLight.schema.fontWeight,
  /**
   * **M3 Elevation dark 双层阴影**(Stage 4 / 2026-05-23):
   * 跟 light 同结构(key + ambient),但不透明度提高到 0.5~0.8 范围(深色 bg 上需要更强阴影才能
   * 制造"浮起"视觉)。
   */
  shadow: {
    tiny: '0px 1px 2px rgba(0,0,0,0.60), 0px 1px 3px 1px rgba(0,0,0,0.40)', // level 1 dark
    small: '0px 1px 2px rgba(0,0,0,0.60), 0px 2px 6px 2px rgba(0,0,0,0.40)', // level 2 dark
    middle: '0px 4px 8px 3px rgba(0,0,0,0.40), 0px 1px 3px rgba(0,0,0,0.60)', // level 3 dark
    large: '0px 6px 10px 4px rgba(0,0,0,0.40), 0px 2px 3px rgba(0,0,0,0.65)', // level 4 dark
    huge: '0px 8px 12px 6px rgba(0,0,0,0.45), 0px 4px 4px rgba(0,0,0,0.70)', // level 5 dark
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
