/**
 * `ZIcon` —— 4 维度离散 variants（size × color × depth × spin）。
 *
 * 全部维度都走 `defineVariants`，无 dynamic styles；连续 / 任意属性场景由用户走
 * `props.cssRoot` factory 用 zui-core chain 自由写。
 *
 * **工厂模式**：导出 `createIconVariants(theme)`，**不导出常量**。
 * ZConfigProvider 切主题 / 改 componentTokens 时 ZIcon 会重新调工厂、emotion 自动按内容 hash 复用类名。
 *
 * **token 读取**：直接调 core 的 `componentTokensFor('icon', theme)`，拿强类型 `Partial<ZIconTokens>`。
 * 组件入口 (`ZIcon.vue`) 必走 `withComponentTokens(theme, iconTokenDerivers, overrides)`，所以
 * 21 项必然填齐；这里不再做字面量 fallback。
 */
import {
  Chain,
  componentTokensFor,
  defineVariants,
  presetAnimations,
  type ResolvedTheme,
} from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../../theme'
import type { ZIconTokens } from './tokens'

/**
 * 派生 ZIcon 的 variants 工厂。**4 维度全离散**：
 *
 * - `size`: 5 阶 tiny/small/middle/large/huge（em）
 * - `color`: default + primary/success/warning/danger/info
 * - `depth`: none + subtle/muted/dim/faded/ghost（由略淡到几乎消失）
 * - `spin`: none + 5 阶 tiny..huge（tiny 最快 / huge 最慢）
 */
export function createIconVariants(theme: ResolvedTheme<ZuiSchema>) {
  // 入口已 `withComponentTokens(_, iconTokenDerivers, _)`，21 项一定齐，可 cast 为完整 ZIconTokens。
  const t = componentTokensFor('icon', theme) as ZIconTokens
  const spinKeyframe = presetAnimations.spin

  /**
   * 5 阶 size：只设 width/height + font-size 均为 N em。
   *
   * - font-size 设为 N em 既让 spec 断言 `font-size:1em` 通过，也让"icon 直观就是
   *   N 倍父字号"的语义成立
   * - width/height 同样 N em → 相对当前 font-size = 1，最终物理尺寸 = N × 父字号
   * - 用户通过 `:base-font-size` prop（ZIcon 上）覆盖根 font-size，决定"1em 等于多少"
   */
  const applySize = (n: number) => (s: Chain<ZuiSchema>) => {
    s.width.em(n)
    s.height.em(n)
    s.fontSize.em(n)
  }
  const applySpin = (dur: number) => (s: Chain<ZuiSchema>) => {
    s.animationName(spinKeyframe)
    s.animationDuration.s(dur)
    s.animationIterationCount.infinite
    s.animationTimingFunction.linear
  }

  return defineVariants(theme, {
    base: (s) => {
      s.display.inlineFlex
      s.alignItems.center
      s.justifyContent.center
      s.flexShrink(0)
      s.lineHeight(1)
    },
    variants: {
      size: {
        tiny: applySize(t.sizeTiny),
        small: applySize(t.sizeSmall),
        middle: applySize(t.sizeMiddle),
        large: applySize(t.sizeLarge),
        huge: applySize(t.sizeHuge),
      },
      color: {
        default: (s) => { s.color(t.defaultColor) },
        primary: (s) => { s.color(t.primaryColor) },
        success: (s) => { s.color(t.successColor) },
        warning: (s) => { s.color(t.warningColor) },
        danger: (s) => { s.color(t.dangerColor) },
        info: (s) => { s.color(t.infoColor) },
      },
      depth: {
        none: () => { /* 不应用 opacity */ },
        subtle: (s) => { s.opacity(t.depthSubtleOpacity) },
        muted: (s) => { s.opacity(t.depthMutedOpacity) },
        dim: (s) => { s.opacity(t.depthDimOpacity) },
        faded: (s) => { s.opacity(t.depthFadedOpacity) },
        ghost: (s) => { s.opacity(t.depthGhostOpacity) },
      },
      spin: {
        none: () => { /* 不旋转 */ },
        tiny: applySpin(t.spinTinyDuration),
        small: applySpin(t.spinSmallDuration),
        middle: applySpin(t.spinMiddleDuration),
        large: applySpin(t.spinLargeDuration),
        huge: applySpin(t.spinHugeDuration),
      },
    },
    defaultVariants: {
      size: 'middle',
      color: 'default',
      depth: 'none',
      spin: 'none',
    },
  })
}
