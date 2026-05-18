/**
 * Tailwind 风调色板占位（Phase 1 Day 1 会从 zui 旧仓库 `packages/ui/src/provider/theme/palette.ts`
 * 整套复制并整理到这里）。
 *
 * 暂时给出最小可用集合，保证骨架可编译。
 */
export const palette = {
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  current: 'currentColor',

  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray400: '#9ca3af',
  gray600: '#4b5563',
  gray800: '#1f2937',
  gray900: '#111827',

  blue500: '#3b82f6',
  blue600: '#2563eb',
  red500: '#ef4444',
  red600: '#dc2626',
  yellow500: '#eab308',
  green500: '#22c55e',
  cyan500: '#06b6d4',
} as const

export type Palette = typeof palette
