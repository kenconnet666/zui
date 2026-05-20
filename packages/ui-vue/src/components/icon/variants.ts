/**
 * `ZIcon` —— 4 维度离散 variants（size × color × depth × spin）。
 *
 * 全部维度都走 `defineVariants`，无 dynamic styles。所有连续 / 任意属性场景由用户走
 * `props.css` factory 用 zui-core chain 自由写。
 *
 * **工厂模式**：导出 `createIconVariants(theme)`，**不导出常量**。
 * ZConfigProvider 切主题时 useVariants 会重新调工厂、emotion 自动按内容 hash 复用类名。
 *
 * **token 读取**：`withComponentTokens` 把所有 component token flatten 到 `theme.color`
 * 命名空间（`iconSizeTiny` / `iconPrimaryColor` / `iconDepthDimOpacity` / `iconSpinMiddleDuration` 等）。
 * 由于 `width/height/fontSize/opacity/animationDuration` 等 carrier 的 tokenCat 不是 color，
 * 本工厂直接从 `theme.color.iconXxx` 读字面量再喂 chain method（与 v1 同策略）。
 */
import { defineVariants, presetAnimations, type ResolvedTheme, type ThemeSchema } from '@kenconnet666/zui-core'

interface IconTokenSnapshot {
  // size em
  sizeTiny: string
  sizeSmall: string
  sizeMiddle: string
  sizeLarge: string
  sizeHuge: string
  // color
  defaultColor: string
  primaryColor: string
  successColor: string
  warningColor: string
  dangerColor: string
  infoColor: string
  // depth opacity（5 阶领域词）
  depthSubtle: number
  depthMuted: number
  depthDim: number
  depthFaded: number
  depthGhost: number
  // spin
  spinTiny: string
  spinSmall: string
  spinMiddle: string
  spinLarge: string
  spinHuge: string
}

/**
 * 从 `theme.color` slot 读 21 项 icon token，缺失项 fallback 到 deriveIconTokens 同样的硬编码。
 */
function readIconTokens<S extends ThemeSchema>(theme: ResolvedTheme<S>): IconTokenSnapshot {
  const slot = (theme as unknown as { color?: Record<string, string | number> }).color ?? {}
  const read = (key: string, fallback: string): string => {
    const v = slot[key]
    return typeof v === 'string' || typeof v === 'number' ? String(v) : fallback
  }
  const readNum = (key: string, fallback: number): number => {
    const v = slot[key]
    if (typeof v === 'number') return v
    if (typeof v === 'string') {
      const n = parseFloat(v)
      if (!Number.isNaN(n)) return n
    }
    return fallback
  }
  return {
    sizeTiny: read('iconSizeTiny', '0.75em'),
    sizeSmall: read('iconSizeSmall', '0.875em'),
    sizeMiddle: read('iconSizeMiddle', '1em'),
    sizeLarge: read('iconSizeLarge', '1.25em'),
    sizeHuge: read('iconSizeHuge', '1.5em'),
    defaultColor: read('iconDefaultColor', 'currentColor'),
    primaryColor: read('iconPrimaryColor', '#2563eb'),
    successColor: read('iconSuccessColor', '#22c55e'),
    warningColor: read('iconWarningColor', '#f59e0b'),
    dangerColor: read('iconDangerColor', '#ef4444'),
    infoColor: read('iconInfoColor', '#06b6d4'),
    depthSubtle: readNum('iconDepthSubtleOpacity', 0.8),
    depthMuted: readNum('iconDepthMutedOpacity', 0.6),
    depthDim: readNum('iconDepthDimOpacity', 0.4),
    depthFaded: readNum('iconDepthFadedOpacity', 0.25),
    depthGhost: readNum('iconDepthGhostOpacity', 0.15),
    spinTiny: read('iconSpinTinyDuration', '0.3s'),
    spinSmall: read('iconSpinSmallDuration', '0.5s'),
    spinMiddle: read('iconSpinMiddleDuration', '1s'),
    spinLarge: read('iconSpinLargeDuration', '2s'),
    spinHuge: read('iconSpinHugeDuration', '3s'),
  }
}

/**
 * 派生 ZIcon 的 variants 工厂。**4 维度全离散**：
 *
 * - `size`: 5 阶 tiny/small/middle/large/huge（em）
 * - `color`: default + primary/success/warning/danger/info
 * - `depth`: none + subtle/muted/dim/faded/ghost（5 阶淡化，由略淡到几乎消失）
 * - `spin`: none + 5 阶 tiny..huge（旋转周期，tiny 最快 huge 最慢）
 *
 * base：inline-flex 居中 + 默认 color。size / spin / depth 通过 variants 注入。
 */
export function createIconVariants<S extends ThemeSchema = ThemeSchema>(theme: ResolvedTheme<S>) {
  const t = readIconTokens(theme)
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
