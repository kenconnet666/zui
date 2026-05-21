/**
 * `ZIcon` —— 类型定义。
 *
 * **设计哲学**：遵循 ui-vue 组件四件套（详见 `skill/zui.md §13.0`）：
 *
 * 1. **离散预设 · 无连续输入** —— 所有 props 都是有限枚举档位（5 阶哲学
 *    `tiny / small / middle / large / huge`，必要时 `none` / `full`），**不**接受
 *    任意 CSS 数值、色值、字符串。本组件 4 维度全离散：
 *    - `size` 5 阶 / `color` 6 种语义 / `depth` 6 阶 / `spin` 6 阶
 * 2. **em 优先 · 跟随父字号** —— 5 阶 size 用 em 倍率
 *    （`tiny=0.75` / `middle=1` / `large=1.25` / `huge=1.5`），物理尺寸 = N × 父字号。
 *    用户调"1em 等于多少"走 `:css-root="s => s.fontSize.px(N)"`，**不**为此开 inline-style prop
 * 3. **`cssRoot` 是唯一逃生口** —— 任意值 / 伪类 / 媒体查询 / 嵌套选择器等需求一律走
 *    `:css-root="s => { ... }"` 用 zui-core chain 自由写；在 variants 之后应用可覆盖任何属性
 * 4. **完整 21 项 token · Provider 可全量覆盖** —— size 5 + color 6 + depth 5 + spin 5
 *    全部注册到 `ComponentTokenRegistry.icon`，可被 `<ZConfigProvider :component-tokens>` 嵌套覆盖
 *
 * **命名约定**：精细覆盖 prop 用 `cssRoot` —— 名字里带"哪个节点"，为后续多 slot 组件（Dialog /
 * Tabs / Select 等）预留 `cssHeader` / `cssBody` / `cssItem` 等并列命名空间。
 */
import type { Chain } from '@kenconnet666/zui-core'
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
 * 想要 palette 任意色 / 自定义色 → 走 `cssRoot` factory。
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
 * spin —— 旋转速度预设（none + 5 阶）。默认 `'none'`。
 *
 * - `'none'` 不旋转
 * - 5 阶 `'tiny'..'huge'` 与 duration 哲学一致：tiny = 短周期 = 快；huge = 长周期 = 慢。
 *   tiny 0.3s · small 0.5s · middle 1s · large 2s · huge 3s
 */
export type ZIconSpin = 'none' | 'tiny' | 'small' | 'middle' | 'large' | 'huge'

/**
 * ZIcon props 完整签名。
 *
 * `cssRoot` 回调里的 `Chain<ZuiSchema>` 通过 module augmentation 即可获得用户扩展 token
 * 的 IDE 补全 —— 不再向上层穿透 generic。
 */
export interface ZIconProps {
  size?: ZIconSize
  color?: ZIconColor
  depth?: ZIconDepth
  spin?: ZIconSpin

  /**
   * 根元素二次精细覆盖 —— 用 zui-core chain 自由写任意样式。
   *
   * 在 variants 之后应用到根元素，可覆盖 size / color / depth / spin 的任何属性，
   * 也可写 `_hover` 等伪类、`_media(...)` 媒体查询、其它 chain 内建方法。
   * 这是"任何不在四个枚举维度里的需求"的统一逃生口。
   *
   * **命名**：`cssRoot` 而非 `css` —— ZIcon 单节点目前只有"根"一个目标；后续多 slot
   * 组件（Dialog / Tabs / Select 等）会有 `cssHeader` / `cssBody` / `cssItem` 等并列
   * prop，保持"`css<NodeName>`"统一命名空间。
   *
   * @example
   * <ZIcon
   *   :component="HeartIcon"
   *   :css-root="s => {
   *     s.cursor.pointer
   *     s._hover(h => { h.color._primary })
   *     s._media('_middle', m => { m.fontSize._iconSizeLarge })
   *   }"
   * />
   */
  cssRoot?: (s: Chain<ZuiSchema>) => void

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
