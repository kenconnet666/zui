import type { ThemeSchema } from '../types'

/**
 * 默认 schema 的 **类型签名**：列出库内置 Tailwind 风格 token 的字段。
 * 实际值由 `defaultLight` / `defaultDark` 提供（Phase 1 起步阶段会从 zui 旧仓库复制）。
 */
export interface DefaultSchema extends ThemeSchema {
  color: {
    primary: string
    primaryHover: string
    danger: string
    warning: string
    success: string
    info: string
    text: string
    textMuted: string
    bg: string
    bgMuted: string
    border: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  radius: {
    sm: string
    md: string
    lg: string
    full: string
  }
  fontSize: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  fontWeight: {
    normal: string | number
    medium: string | number
    bold: string | number
  }
  shadow: {
    sm: string
    md: string
    lg: string
  }
}
