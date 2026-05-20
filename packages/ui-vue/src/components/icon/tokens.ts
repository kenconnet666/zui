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
  // ─── 5 阶 size（em 单位，跟父字号缩放） ───
  sizeTiny: string
  sizeSmall: string
  sizeMiddle: string
  sizeLarge: string
  sizeHuge: string

  // ─── 6 种 color（default 走 currentColor，5 种语义派生自 theme.color） ───
  defaultColor: string
  primaryColor: string
  successColor: string
  warningColor: string
  dangerColor: string
  infoColor: string

  // ─── 5 阶 depth opacity（领域词，由清晰到几乎消失） ───
  depthSubtleOpacity: string
  depthMutedOpacity: string
  depthDimOpacity: string
  depthFadedOpacity: string
  depthGhostOpacity: string

  // ─── 5 阶 spin duration（tiny=快/短周期；huge=慢/长周期） ───
  spinTinyDuration: string
  spinSmallDuration: string
  spinMiddleDuration: string
  spinLargeDuration: string
  spinHugeDuration: string
}

declare module '@kenconnet666/zui-core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ComponentTokenRegistry {
    icon: ZIconTokens
  }
}

/**
 * 派生默认 ZIcon tokens：
 * - size 用 em（响应父字号）
 * - color 从 theme.color 读 5 种语义色（缺失时 fallback 硬编码）
 * - depth 5 阶领域 opacity（subtle 0.8 / muted 0.6 / dim 0.4 / faded 0.25 / ghost 0.15）
 * - spin 5 阶时长（tiny=0.3s 极快 → huge=3s 极慢）
 */
export function deriveIconTokens<S extends ThemeSchema>(
  theme: ResolvedTheme<S>,
): ZIconTokens {
  const slot = (theme as unknown as { color?: Record<string, string | number> }).color
  const read = (key: string, fallback: string): string => {
    const v = slot?.[key]
    return typeof v === 'string' || typeof v === 'number' ? String(v) : fallback
  }
  return {
    // size —— em
    sizeTiny: '0.75em',
    sizeSmall: '0.875em',
    sizeMiddle: '1em',
    sizeLarge: '1.25em',
    sizeHuge: '1.5em',

    // color
    defaultColor: 'currentColor',
    primaryColor: read('primary', '#2563eb'),
    successColor: read('success', '#22c55e'),
    warningColor: read('warning', '#f59e0b'),
    dangerColor: read('danger', '#ef4444'),
    infoColor: read('info', '#06b6d4'),

    // depth opacity（领域词 5 阶，subtle 最浅 / ghost 最深淡化）
    depthSubtleOpacity: '0.8',
    depthMutedOpacity: '0.6',
    depthDimOpacity: '0.4',
    depthFadedOpacity: '0.25',
    depthGhostOpacity: '0.15',

    // spin duration（5 阶：快 → 慢）
    spinTinyDuration: '0.3s',
    spinSmallDuration: '0.5s',
    spinMiddleDuration: '1s',
    spinLargeDuration: '2s',
    spinHugeDuration: '3s',
  }
}

/**
 * 直接喂给 `withComponentTokens` 的 derivers 对象。
 */
export const iconTokenDerivers = {
  icon: deriveIconTokens,
} satisfies ComponentTokenDerivers<ThemeSchema>
