/**
 * `ZIcon` —— 类型定义。
 *
 * **设计哲学（v0.0.5）**：所有维度都是**离散枚举**，遵循 5 阶哲学（tiny/small/middle/large/huge），
 * 必要时 + `none`。size / color / depth / spin **四个维度全是 variants**，无 dynamic styles。
 * 复杂场景（hover / 媒体查询 / 任意属性覆盖）一律走 `:css` factory，用 zui-core chain 自由写。
 */
import type { Chain, ThemeSchema } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../../theme'
import type { Component } from 'vue'

/**
 * size —— 5 阶 em 单位（跟父字号缩放）。默认 `'middle'`。
 *
 * 通过 `icon.sizeXxx` token 控制具体值（默认 0.75em / 0.875em / 1em / 1.25em / 1.5em）。
 */
export type ZIconSize = 'tiny' | 'small' | 'middle' | 'large' | 'huge'

/**
 * color —— 6 种语义色预设。默认 `'default'`（不修改 currentColor）。
 *
 * 命中 `icon.xxxColor` token；非 default 之外的 5 种语义色都从 `theme.color.<semantic>` 派生。
 * 想要 palette 任意色 / 自定义色 → 走 `css` factory。
 */
export type ZIconColor = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

/**
 * depth —— 5 阶 + none 的"淡化程度"（领域词，由清晰到几乎消失）。默认 `'none'`。
 *
 * - `'none'` 不应用 opacity，颜色完整呈现
 * - `'subtle'` → opacity 0.8（略微淡化）
 * - `'muted'` → opacity 0.6
 * - `'dim'` → opacity 0.4
 * - `'faded'` → opacity 0.25
 * - `'ghost'` → opacity 0.15（几乎消失）
 */
export type ZIconDepth = 'none' | 'subtle' | 'muted' | 'dim' | 'faded' | 'ghost'

/**
 * spin —— 旋转速度预设（5 阶 + none/隐含 boolean 兼容）。
 *
 * - `false`（默认）→ 不旋转
 * - `true` 等价于 `'middle'`（1s 周期）
 * - 5 阶 `'tiny'..'huge'` 由慢到快"反"还是由快到慢？—— 与 size/duration 保持哲学一致：
 *   `tiny` = 短周期 = 快；`huge` = 长周期 = 慢。
 */
export type ZIconSpinPreset = 'tiny' | 'small' | 'middle' | 'large' | 'huge'
export type ZIconSpin = boolean | ZIconSpinPreset

/**
 * ZIcon props 完整签名。
 *
 * `css` 回调里的 `Chain<ZuiSchema>` 通过 module augmentation 即可获得用户扩展 token
 * 的 IDE 补全 —— 不再向上层穿透 generic。
 */
export interface ZIconProps {
  size?: ZIconSize
  color?: ZIconColor
  depth?: ZIconDepth
  spin?: ZIconSpin

  /**
   * 二次精细覆盖 —— 用 zui-core chain 自由写任意样式。
   *
   * 在 variants 之后应用，可覆盖 size / color / depth / spin 的任何属性，
   * 也可写 `_hover` 等伪类、`_media(...)` 媒体查询、其它 chain 内建方法。
   * 这是"任何不在四个枚举维度里的需求"的统一逃生口。
   *
   * @example
   * <ZIcon
   *   :component="HeartIcon"
   *   :css="s => {
   *     s.cursor.pointer
   *     s._hover(h => { h.color._primary })
   *     s._media('_middle', m => { m.fontSize._iconSizeLarge })
   *   }"
   * />
   */
  css?: (s: Chain<ZuiSchema>) => void

  /**
   * 根元素 `font-size`，即"**1em 等于多少**"的基准值。
   *
   * - 未传 → 不写 inline style，跟随父元素 `font-size`（默认行为）
   * - 传 → 通过 inline `style="font-size:..."` 写到根元素上；inline style
   *   覆盖 variants 设的 `font-size: Nem`，让 width/height 的 em 单位
   *   resolved 到这个绝对值
   *
   * 接受任何合法 CSS length：`'16px'` / `'1.5rem'` / `'2vw'` /
   * `'clamp(12px, 1vw + 6px, 24px)'` 等；判断与拼写都由用户负责。
   *
   * @example
   * &lt;ZIcon :component="HeartIcon" base-font-size="24px" size="large" /&gt;
   * // → font-size:24px（inline）→ width = 1.25em = 30px
   */
  baseFontSize?: string

  /** 直接以图标组件作为 prop 传入（与 default slot 互斥；slot 优先）。 */
  component?: Component
  /** 根元素 tag，默认 `'i'`（Ionic / FontAwesome 习惯）。 */
  tag?: string
  /**
   * a11y 标签。
   * - 传 → `aria-label={label}` + `role="img"`
   * - 不传 → `aria-hidden="true"`
   */
  label?: string
}
