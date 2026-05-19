import type { ThemeSchema } from '../types'
import type { PaletteToken } from './palette'
import type { FlattenComponentTokens } from '../../types/components'

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
  /**
   * Tailwind 完整 palette（242 色） + 11 个语义色 + 用户通过 `ComponentTokenRegistry`
   * 注册的组件级 token（W1.2）。
   *
   * 注：组件级 token 用 `Partial` —— schema 里**不强制**填，由 `withComponentTokens(...)`
   * 在运行时派生并 merge 进 theme。让 `defaultLight` / `defaultDark` 不需要预填所有
   * 组件 token。
   */
  color: Record<DefaultColorTokens, string> & Partial<Record<FlattenComponentTokens, string>>
  /** spacing 5 档（语义化命名，0.6.0 BREAKING）。 */
  spacing: {
    tiny: string
    small: string
    middle: string
    large: string
    huge: string
  }
  /** radius 7 档：5 档 size + none + full（圆形按钮专用）。 */
  radius: {
    none: string
    tiny: string
    small: string
    middle: string
    large: string
    huge: string
    full: string
  }
  /** fontSize 5 档。 */
  fontSize: {
    tiny: string
    small: string
    middle: string
    large: string
    huge: string
  }
  fontWeight: {
    normal: string | number
    medium: string | number
    bold: string | number
  }
  /** shadow 5 档（不含 none：要去阴影用 boxShadow('none')）。 */
  shadow: {
    tiny: string
    small: string
    middle: string
    large: string
    huge: string
  }
  /** blur 6 档：5 档 size + none。 */
  blur: {
    none: string
    tiny: string
    small: string
    middle: string
    large: string
    huge: string
  }
  // ─── W1.8 补充：让 ENHANCED_PROPS 引用的 token category 在 default 主题里有值 ───
  /**
   * 过渡 / 动画时长 token（5 阶 + none，遵循 5 阶哲学）。
   * 0.8.0 BREAKING：旧 `fast / normal / slow` 重命名为 `small / middle / large`，新增 `none / tiny / huge` 拉满 5 阶。
   */
  duration: {
    none: string
    tiny: string
    small: string
    middle: string
    large: string
    huge: string
  }
  /** 缓动函数 token（function 维度，非 size scale，保留原 5 个 key）。 */
  easing: {
    default: string
    linear: string
    in: string
    out: string
    inOut: string
  }
  /** 媒体查询断点 5 档：`_media('_middle', ...)` 等链上简写依赖。 */
  breakpoint: {
    tiny: string
    small: string
    middle: string
    large: string
    huge: string
  }
  /** z-index 语义 token。 */
  zIndex: {
    auto: string | number
    '0': number
    '10': number
    '20': number
    '30': number
    '40': number
    '50': number
    modal: number
    popover: number
    tooltip: number
    toast: number
  }
  /** 透明度 token（0-100 21 阶）。 */
  opacity: {
    '0': number
    '5': number
    '10': number
    '20': number
    '25': number
    '30': number
    '40': number
    '50': number
    '60': number
    '70': number
    '75': number
    '80': number
    '90': number
    '95': number
    '100': number
  }
  /**
   * 行高 token（5 阶 + none，遵循 5 阶哲学）。
   * 0.8.0 BREAKING：`tight / snug / normal / relaxed / loose` 重命名为 `tiny / small / middle / large / huge`。
   */
  lineHeight: {
    none: number
    tiny: number
    small: number
    middle: number
    large: number
    huge: number
  }
  /**
   * 字符间距 token（5 阶，遵循 5 阶哲学）。
   * 0.8.0 BREAKING：`tighter / tight / normal / wide / wider` 重命名为 `tiny / small / middle / large / huge`，
   * `widest` 移除（CSS 字距上没有"满"语义，超大需求建议 inline `letterSpacing('0.1em')`）。
   */
  letterSpacing: {
    tiny: string
    small: string
    middle: string
    large: string
    huge: string
  }
  /** 长宽比 token。 */
  aspectRatio: {
    square: string
    video: string
    portrait: string
    landscape: string
  }
}
