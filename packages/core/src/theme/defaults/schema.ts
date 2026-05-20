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
  /**
   * fontWeight 9 阶（CSS 标准命名，特例 9 档；本身按粗细顺序自带大小关系）。
   * 0.9.0：thin(100) / extralight(200) / light(300) / normal(400) / medium(500) / semibold(600) / bold(700) / extrabold(800) / black(900)。
   * `normal` / `bold` 同时是 CSS keyword，token 与 keyword 双命中。
   */
  fontWeight: {
    thin: string | number
    extralight: string | number
    light: string | number
    normal: string | number
    medium: string | number
    semibold: string | number
    bold: string | number
    extrabold: string | number
    black: string | number
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
  /**
   * z-index token：5 阶（none + tiny/small/middle/large/huge，0/10/20/30/40/50） + 4 个 UI 语义角色 + `auto`。
   * 0.9.0 BREAKING：`'0'..'50'` 数字 key 移除，统一用 5 阶语义 key；`modal/popover/tooltip/toast/auto` 保留。
   */
  zIndex: {
    auto: string | number
    none: number
    tiny: number
    small: number
    middle: number
    large: number
    huge: number
    modal: number
    popover: number
    tooltip: number
    toast: number
  }
  /**
   * 透明度 token（5 阶 + none + full = 7 阶；领域词按透明度从低到高排列，自带大小关系）。
   * 0.9.0 BREAKING：旧 15 阶 Tailwind 数字 key → `none(0) / faint(0.05) / dim(0.25) / half(0.5) / strong(0.75) / solid(0.95) / full(1)`。
   */
  opacity: {
    none: number
    faint: number
    dim: number
    half: number
    strong: number
    solid: number
    full: number
  }
  /**
   * 行高 token（5 阶 + none = 6 阶；领域词表达紧密度，由紧到松）。
   * 0.9.0：回 Tailwind 标准词 `none(1) / tight(1.25) / snug(1.375) / normal(1.5) / relaxed(1.625) / loose(2)`。
   * `normal` 同时是 CSS keyword（token 与 keyword 双命中）。
   */
  lineHeight: {
    none: number
    tight: number
    snug: number
    normal: number
    relaxed: number
    loose: number
  }
  /**
   * 字符间距 token（5 阶；领域词表达字距松紧）。
   * 0.9.0：回 Tailwind 标准词 `tighter(-0.05em) / tight(-0.025em) / normal(0) / wide(0.025em) / wider(0.05em)`。
   * `normal` 同时是 CSS keyword（token 与 keyword 双命中）。
   */
  letterSpacing: {
    tighter: string
    tight: string
    normal: string
    wide: string
    wider: string
  }
  /** 长宽比 token。 */
  aspectRatio: {
    square: string
    video: string
    portrait: string
    landscape: string
  }
}
