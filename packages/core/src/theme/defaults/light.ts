import { Theme } from '../Theme'
import { palette } from './palette'
import type { DefaultSchema } from './schema'

/**
 * 内置浅色主题（占位实现 — Phase 1 Day 1 会替换成 zui 旧仓库 `light.ts` 的完整版本）。
 */
export const defaultLight = new Theme<DefaultSchema>({
  color: {
    primary: palette.blue600,
    primaryHover: palette.blue500,
    danger: palette.red600,
    warning: palette.yellow500,
    success: palette.green500,
    info: palette.cyan500,
    text: palette.gray900,
    textMuted: palette.gray600,
    bg: palette.white,
    bgMuted: palette.gray50,
    border: palette.gray200,
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    bold: 700,
  },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  blur: {
    none: '0',
    xs: '2px',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '40px',
    '3xl': '64px',
  },
})
