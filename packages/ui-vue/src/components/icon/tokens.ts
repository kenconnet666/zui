/**
 * `ZIcon` —— Component Token 注册 + 默认 deriver。
 *
 * **21 项 token**，遵循 5 阶哲学：
 * - 5 × `sizeXxx`（em，跟父字号缩放）
 * - 6 × `xxxColor`（default + 5 种语义色）
 * - 5 × `depth<intensity>Opacity`（5 阶淡化强度，subtle=0.8 → ghost=0.15）
 * - 5 × `spinXxxDuration`（5 阶旋转周期，0.3s → 3s）
 *
 * 全部经 `withComponentTokens` flatten 到 `theme.color` namespace
 * （`iconSizeTiny` / `iconPrimaryColor` / `iconDepth1Opacity` / `iconSpinMiddleDuration` 等）。
 */

import type {
  ComponentTokenDerivers,
  ResolvedTheme,
  ThemeSchema,
} from '@kenconnet666/zui-core'

export interface ZIconTokens {
  // ─── 5 阶 size（em **倍率**，跟父字号缩放；最终 width = N × font-size） ───
  sizeTiny: number
  sizeSmall: number
  sizeMiddle: number
  sizeLarge: number
  sizeHuge: number

  // ─── 6 种 color（default 走 currentColor，5 种语义派生自 theme.color） ───
  defaultColor: string
  primaryColor: string
  successColor: string
  warningColor: string
  dangerColor: string
  infoColor: string

  // ─── 5 阶 depth opacity（0..1 浮点，由清晰到几乎消失） ───
  depthSubtleOpacity: number
  depthMutedOpacity: number
  depthDimOpacity: number
  depthFadedOpacity: number
  depthGhostOpacity: number

  // ─── 5 阶 spin duration（秒；tiny=快/短周期；huge=慢/长周期） ───
  spinTinyDuration: number
  spinSmallDuration: number
  spinMiddleDuration: number
  spinLargeDuration: number
  spinHugeDuration: number
}

declare module '@kenconnet666/zui-core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ComponentTokenRegistry {
    icon: ZIconTokens
  }
}

/**
 * 派生默认 ZIcon tokens：
 * - size **em 倍率**（width = N × 当前 font-size），不再编码单位字面量
 * - color 从 theme.color 读 5 种语义色（缺失时 fallback 硬编码 hex）
 * - depth 5 阶领域 opacity（subtle 0.8 / muted 0.6 / dim 0.4 / faded 0.25 / ghost 0.15）
 * - spin 5 阶时长（秒；tiny=0.3 极快 → huge=3 极慢）
 *
 * 调用方（`variants.ts`）通过 `s.width.em(n)` / `s.opacity(n)` /
 * `s.animationDuration.s(n)` 等 unit method 把数字转成 CSS 字面量，无需在 token 端预处理。
 */
export function deriveIconTokens(
  theme: ResolvedTheme<ThemeSchema>,
): ZIconTokens {
  const slot = (theme as unknown as { color?: Record<string, string | number> }).color
  const readColor = (key: string, fallback: string): string => {
    const v = slot?.[key]
    return typeof v === 'string' ? v : typeof v === 'number' ? String(v) : fallback
  }
  return {
    // size —— em 倍率（无单位数字）
    sizeTiny: 0.75,
    sizeSmall: 0.875,
    sizeMiddle: 1,
    sizeLarge: 1.25,
    sizeHuge: 1.5,

    // color（字符串，可为 hex / hsl / currentColor / token 等）
    defaultColor: 'currentColor',
    primaryColor: readColor('primary', '#2563eb'),
    successColor: readColor('success', '#22c55e'),
    warningColor: readColor('warning', '#f59e0b'),
    dangerColor: readColor('danger', '#ef4444'),
    infoColor: readColor('info', '#06b6d4'),

    // depth opacity（0..1 浮点）
    depthSubtleOpacity: 0.8,
    depthMutedOpacity: 0.6,
    depthDimOpacity: 0.4,
    depthFadedOpacity: 0.25,
    depthGhostOpacity: 0.15,

    // spin duration（秒）
    spinTinyDuration: 0.3,
    spinSmallDuration: 0.5,
    spinMiddleDuration: 1,
    spinLargeDuration: 2,
    spinHugeDuration: 3,
  }
}

/**
 * 直接喂给 `withComponentTokens` 的 derivers 对象。
 */
export const iconTokenDerivers = {
  icon: deriveIconTokens,
} satisfies ComponentTokenDerivers<ThemeSchema>
