/**
 * `ZIcon` —— 4 维度离散 variants（size × color × depth × spin）。
 *
 * 全部维度都走 `defineVariants`，无 dynamic styles；连续 / 任意属性场景由用户走
 * `props.css` factory 用 zui-core chain 自由写。
 *
 * **工厂模式**：导出 `createIconVariants(theme)`，**不导出常量**。
 * ZConfigProvider 切主题 / 改 componentTokens 时 ZIcon 会重新调工厂、emotion 自动按内容 hash 复用类名。
 *
 * **token 读取**：`withComponentTokens` 把 21 项 icon token flatten 到 `theme.color` 命名空间
 * （`iconSizeTiny` / `iconPrimaryColor` / `iconDepthDimOpacity` / `iconSpinMiddleDuration` …）。
 * 由于 `width / height / fontSize / opacity / animationDuration` 等 carrier 的 tokenCat 不是 color，
 * **无法**用 `_iconXxx` 形态命中，工厂直接从 slot 取字面量喂 chain method。
 *
 * **预设值固定单位**：5 阶 size = em、depth = 0..1 浮点字符串、spin = s/ms 时长。
 * 用户不通过 props 传任意值（用 css factory 兜底）；缺省走 `??` fallback。
 */
import {
  defineVariants,
  presetAnimations,
  type ResolvedTheme,
  type ThemeSchema,
} from '@kenconnet666/zui-core'
import type { ZIconTokens } from './tokens'

/**
 * `IconSlot` —— flatten 后的 icon namespace token 视图。
 *
 * `withComponentTokens` 把 `ZIconTokens` 各字段以 `icon${PascalCase}` 形式注入到
 * `theme.color` 上；这里用 **mapped type with key remapping** 从 `ZIconTokens`
 * 派生，**保留 per-field 类型**（`iconSizeTiny: number | undefined` /
 * `iconPrimaryColor: string | undefined` / ...），让下面 `slot.iconXxx ?? fallback`
 * 的访问享受：
 *
 * - typos 编译期即报错（`slot.iconSizeTynyy` → TS2339）
 * - `ZIconTokens` 增删字段或改类型时同步收紧
 * - IDE 输入 `slot.icon` 即列出 21 个键
 *
 * 不走 `FlattenComponentTokens<{ icon: ZIconTokens }>` —— 后者约束 `R[C] extends
 * Record<string, unknown>`，而 `interface ZIconTokens` 无 index signature 会落到 `never`。
 */
type IconSlot = {
  [K in keyof ZIconTokens as `icon${Capitalize<K & string>}`]?: ZIconTokens[K]
}

/**
 * 派生 ZIcon 的 variants 工厂。**4 维度全离散**：
 *
 * - `size`: 5 阶 tiny/small/middle/large/huge（em）
 * - `color`: default + primary/success/warning/danger/info
 * - `depth`: none + subtle/muted/dim/faded/ghost（由略淡到几乎消失）
 * - `spin`: none + 5 阶 tiny..huge（tiny 最快 / huge 最慢）
 */
export function createIconVariants(theme: ResolvedTheme<ThemeSchema>) {
  const slot: IconSlot = (theme as { color?: IconSlot }).color ?? {}

  // 21 项 token —— `theme.color.iconXxx`（withComponentTokens flatten 后）+ 字面量 fallback。
  // 数值统一为 number（em 倍率 / 0..1 opacity / 秒）；color 保留 string。
  const t = {
    sizeTiny: slot.iconSizeTiny ?? 0.75,
    sizeSmall: slot.iconSizeSmall ?? 0.875,
    sizeMiddle: slot.iconSizeMiddle ?? 1,
    sizeLarge: slot.iconSizeLarge ?? 1.25,
    sizeHuge: slot.iconSizeHuge ?? 1.5,
    defaultColor: slot.iconDefaultColor ?? 'currentColor',
    primaryColor: slot.iconPrimaryColor ?? '#2563eb',
    successColor: slot.iconSuccessColor ?? '#22c55e',
    warningColor: slot.iconWarningColor ?? '#f59e0b',
    dangerColor: slot.iconDangerColor ?? '#ef4444',
    infoColor: slot.iconInfoColor ?? '#06b6d4',
    depthSubtle: slot.iconDepthSubtleOpacity ?? 0.8,
    depthMuted: slot.iconDepthMutedOpacity ?? 0.6,
    depthDim: slot.iconDepthDimOpacity ?? 0.4,
    depthFaded: slot.iconDepthFadedOpacity ?? 0.25,
    depthGhost: slot.iconDepthGhostOpacity ?? 0.15,
    spinTiny: slot.iconSpinTinyDuration ?? 0.3,
    spinSmall: slot.iconSpinSmallDuration ?? 0.5,
    spinMiddle: slot.iconSpinMiddleDuration ?? 1,
    spinLarge: slot.iconSpinLargeDuration ?? 2,
    spinHuge: slot.iconSpinHugeDuration ?? 3,
  }
  const spinKeyframe = presetAnimations.spin

  /**
   * 5 阶 size：只设 width/height + font-size 均为 N em。
   *
   * - font-size 设为 N em 既让 spec 断言 `font-size:1em` 通过，也让"icon 直观就是
   *   N 倍父字号"的语义成立
   * - width/height 同样 N em → 相对当前 font-size = 1，最终物理尺寸 = N × 父字号
   * - 用户通过 `:base-font-size` prop（ZIcon 上）覆盖根 font-size，决定"1em 等于多少"
   */
  const applySize = (n: number) => (s: import('@kenconnet666/zui-core').Chain<ThemeSchema>) => {
    s.width.em(n)
    s.height.em(n)
    s.fontSize.em(n)
  }
  const applySpin = (dur: number) => (s: import('@kenconnet666/zui-core').Chain<ThemeSchema>) => {
    s.animationName(spinKeyframe)
    s.animationDuration.s(dur)
    s.animationIterationCount.infinite
    // animationTimingFunction.keywords = null（只接受 globalKw + easing token）→ 走函数形式
    s.animationTimingFunction('linear')
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
        default: (s) => {
          s.color(t.defaultColor)
        },
        primary: (s) => {
          s.color(t.primaryColor)
        },
        success: (s) => {
          s.color(t.successColor)
        },
        warning: (s) => {
          s.color(t.warningColor)
        },
        danger: (s) => {
          s.color(t.dangerColor)
        },
        info: (s) => {
          s.color(t.infoColor)
        },
      },
      depth: {
        none: () => {
          /* 不应用 opacity */
        },
        subtle: (s) => {
          s.opacity(t.depthSubtle)
        },
        muted: (s) => {
          s.opacity(t.depthMuted)
        },
        dim: (s) => {
          s.opacity(t.depthDim)
        },
        faded: (s) => {
          s.opacity(t.depthFaded)
        },
        ghost: (s) => {
          s.opacity(t.depthGhost)
        },
      },
      spin: {
        none: () => {
          /* 不旋转 */
        },
        tiny: applySpin(t.spinTiny),
        small: applySpin(t.spinSmall),
        middle: applySpin(t.spinMiddle),
        large: applySpin(t.spinLarge),
        huge: applySpin(t.spinHuge),
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
