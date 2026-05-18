import type { ThemeSchema } from '../types'
import type { PaletteToken } from './palette'

/**
 * 语义色 token —— 用户层"主题切换"维度（dark / light / brand 三套语义色相同 key，不同值）。
 */
export type SemanticColorTokens =
  | 'primary'
  | 'primaryHover'
  | 'danger'
  | 'warning'
  | 'success'
  | 'info'
  | 'text'
  | 'textMuted'
  | 'bg'
  | 'bgMuted'
  | 'border'

/**
 * Palette + 语义色合并后的 DefaultSchema color key 集合。
 *
 * 拆开声明的好处：用户自定义 schema 想"只覆盖语义色保留 palette"时，可以分别引用
 * `PaletteToken` / `SemanticColorTokens`，避免一锅煮的 union 推断爆深度。
 */
export type DefaultColorTokens = SemanticColorTokens | PaletteToken

/**
 * 默认 schema 的 **类型签名**：库内置 Tailwind 风格 token 字段。
 * 实际值由 `defaultLight` / `defaultDark` 提供（含完整 22×11=242 色 palette）。
 */
export interface DefaultSchema extends ThemeSchema {
  /** Tailwind 完整 palette（242 色） + 11 个语义色，共 253 个 color token。 */
  color: Record<DefaultColorTokens, string>
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
  blur: {
    none: string
    xs: string
    sm: string
    base: string
    md: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
  }
}
