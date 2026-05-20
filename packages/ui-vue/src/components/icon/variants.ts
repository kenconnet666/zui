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
import { defineVariants, presetAnimations, type ResolvedTheme, type ThemeSchema } from '@kenconnet666/zui-core'

/**
 * 派生 ZIcon 的 variants 工厂。**4 维度全离散**：
 *
 * - `size`: 5 阶 tiny/small/middle/large/huge（em）
 * - `color`: default + primary/success/warning/danger/info
 * - `depth`: none + subtle/muted/dim/faded/ghost（由略淡到几乎消失）
 * - `spin`: none + 5 阶 tiny..huge（tiny 最快 / huge 最慢）
 */
export function createIconVariants<S extends ThemeSchema = ThemeSchema>(theme: ResolvedTheme<S>) {
  const slot = (theme as unknown as { color?: Record<string, string> }).color ?? {}

  // 21 项 token —— `theme.color.iconXxx`（withComponentTokens flatten 后）+ 字面量 fallback。
  // 全部 string：chain method 接受 string；opacity 走 '0.4' 这样的 CSS 字符串值。
  const t = {
    sizeTiny: slot.iconSizeTiny ?? '0.75em',
    sizeSmall: slot.iconSizeSmall ?? '0.875em',
    sizeMiddle: slot.iconSizeMiddle ?? '1em',
    sizeLarge: slot.iconSizeLarge ?? '1.25em',
    sizeHuge: slot.iconSizeHuge ?? '1.5em',
    defaultColor: slot.iconDefaultColor ?? 'currentColor',
    primaryColor: slot.iconPrimaryColor ?? '#2563eb',
    successColor: slot.iconSuccessColor ?? '#22c55e',
    warningColor: slot.iconWarningColor ?? '#f59e0b',
    dangerColor: slot.iconDangerColor ?? '#ef4444',
    infoColor: slot.iconInfoColor ?? '#06b6d4',
    depthSubtle: slot.iconDepthSubtleOpacity ?? '0.8',
    depthMuted: slot.iconDepthMutedOpacity ?? '0.6',
    depthDim: slot.iconDepthDimOpacity ?? '0.4',
    depthFaded: slot.iconDepthFadedOpacity ?? '0.25',
    depthGhost: slot.iconDepthGhostOpacity ?? '0.15',
    spinTiny: slot.iconSpinTinyDuration ?? '0.3s',
    spinSmall: slot.iconSpinSmallDuration ?? '0.5s',
    spinMiddle: slot.iconSpinMiddleDuration ?? '1s',
    spinLarge: slot.iconSpinLargeDuration ?? '2s',
    spinHuge: slot.iconSpinHugeDuration ?? '3s',
  }
  const spinKeyframe = presetAnimations.spin

  const applySize = (px: string) => (s: import('@kenconnet666/zui-core').Chain<S>) => {
    s.width(px)
    s.height(px)
    s.fontSize(px)
  }
  const applySpin = (dur: string) => (s: import('@kenconnet666/zui-core').Chain<S>) => {
    s.animationName(spinKeyframe)
    s.animationDuration(dur)
    s.animationIterationCount('infinite')
    s.animationTimingFunction('linear')
  }

  return defineVariants(theme, {
    base: (s) => {
      s.display('inline-flex')
      s.alignItems('center')
      s.justifyContent('center')
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
