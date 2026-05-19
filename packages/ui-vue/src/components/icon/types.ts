/**
 * `ZIcon` —— 类型定义。
 *
 * 设计哲学：
 * - **尺寸 / 颜色 / spin** 是连续 / 响应式维度 → 走 dynamic styles
 * - **intent / depth** 是离散语义维度 → 走 variants
 * - 与图标库解耦：内容通过 `slot` 或 `component` prop 注入（双模式）
 */
import type { Component } from 'vue'
import type { ResponsiveValue } from '@kenconnet666/zui-core'

/**
 * intent —— 语义色阶（5 种 + default）。
 * `default` 表示不应用语义色，由 `color` prop 或 `currentColor` 决定。
 */
export type ZIconIntent = 'default' | 'success' | 'warning' | 'danger' | 'info'

/**
 * depth —— 不透明度阶（5 阶 + none，遵循 5 阶哲学）。
 *
 * - `'none'`（默认）：不应用 opacity 修饰，由颜色本身决定
 * - `'1'`：最显著（opacity 1.0，primary 级文本）
 * - `'2'`：较显著（opacity 0.8，secondary）
 * - `'3'`：中等（opacity 0.6，tertiary）
 * - `'4'`：较弱（opacity 0.4，quaternary）
 * - `'5'`：最弱（opacity 0.2，placeholder 级）
 *
 * 默认 token 值见 [[deriveIconTokens]]；可通过 ZConfigProvider componentTokens 覆盖。
 */
export type ZIconDepth = 'none' | '1' | '2' | '3' | '4' | '5'

/**
 * size —— 图标尺寸。可接：
 * - 数字：自动 `px` 单位（`24` → `'24px'`）
 * - 字符串：原样（`'1.5em'` / `'2rem'` / `'48px'`）
 * - `ResponsiveValue<...>`：`{ base: 16, _middle: 24, _large: 32 }`
 *
 * 未传时回落到 `icon.defaultSize` token（默认 `'1em'`）。
 */
export type ZIconSize = ResponsiveValue<string | number>

/**
 * color —— 图标颜色。可接：
 * - 任意 CSS color 字面量（`'#ff0000'` / `'red'` / `'rgb(...)'`）
 * - 主题 color token 名（带 `_` 前缀，如 `'_primary'` / `'_buttonBg'`）
 * - `ResponsiveValue<...>` 响应式
 *
 * 未传时回落到 `icon.defaultColor` token（默认 `'currentColor'`）。
 * 设置 `intent` 时 color prop 仍可覆盖（color 优先级 > intent）。
 */
export type ZIconColor = ResponsiveValue<string>

/**
 * spin —— 旋转动画。
 * - `false`（默认）：不旋转
 * - `true`：用 `icon.spinDuration` token 周期
 * - `number`：秒数
 * - `string`：CSS duration 字符串（`'1.5s'` / `'500ms'`）
 */
export type ZIconSpin = boolean | number | string

/**
 * ZIcon props 完整签名。
 *
 * 内容注入两种方式（**双模式**）：
 * 1. default slot：`<ZIcon><HomeOutline /></ZIcon>`
 * 2. `component` prop：`<ZIcon :component="HomeOutline" />`
 *
 * 同时给时 slot 优先；推荐根据使用场景任选其一保持一致风格。
 */
export interface ZIconProps {
  size?: ZIconSize
  color?: ZIconColor
  intent?: ZIconIntent
  depth?: ZIconDepth
  spin?: ZIconSpin
  /** 直接以图标组件作为 prop 传入（与 default slot 互斥；slot 优先）。 */
  component?: Component
  /** 根元素 tag，默认 `'i'`（Ionic / FontAwesome 习惯）。 */
  tag?: string
  /**
   * a11y 标签。
   * - 传入字符串：自动生成 `aria-label={label}` + `role="img"`
   * - 未传：默认 `aria-hidden="true"`（装饰性图标）
   */
  label?: string
}
