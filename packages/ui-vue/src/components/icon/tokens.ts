/**
 * `ZIcon` —— Component Token 注册 + 默认 deriver。
 *
 * **21 项 token**，遵循 5 阶哲学：
 * - 5 × `sizeXxx`（em，跟父字号缩放）
 * - 6 × `xxxColor`（default + 5 种语义色）
 * - 5 × `depthNOpacity`（5 阶不透明度，1.0 → 0.2）
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

  // ─── 5 阶 depth opacity ───
  depth1Opacity: string
  depth2Opacity: string
  depth3Opacity: string
  depth4Opacity: string
  depth5Opacity: string

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
 * - depth 5 阶等差 opacity（1.0 / 0.8 / 0.6 / 0.4 / 0.2）
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

    // depth opacity
    depth1Opacity: '1',
    depth2Opacity: '0.8',
    depth3Opacity: '0.6',
    depth4Opacity: '0.4',
    depth5Opacity: '0.2',

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
