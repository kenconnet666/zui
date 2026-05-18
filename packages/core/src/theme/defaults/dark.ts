import { Theme } from '../Theme'
import { palette } from './palette'
import type { DefaultSchema } from './schema'

/**
 * 内置深色主题（占位实现 — Phase 1 Day 1 会替换成 zui 旧仓库 `dark.ts` 的完整版本）。
 */
export const defaultDark = new Theme<DefaultSchema>({
  color: {
    primary: palette.blue500,
    primaryHover: palette.blue600,
    danger: palette.red500,
    warning: palette.yellow500,
    success: palette.green500,
    info: palette.cyan500,
    text: palette.gray100,
    textMuted: palette.gray400,
    bg: palette.gray900,
    bgMuted: palette.gray800,
    border: palette.gray600,
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
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.4)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.4)',
  },
})
