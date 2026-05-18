/**
 * 颜色处理工具。供 `carrier.ts` 的颜色 token 分支 + ColorTokenValue 的所有 modifier 使用。
 *
 * 基于 [color2k](https://github.com/ricokahler/color2k)（~2kb gzip）。所有函数解析失败时
 * 都返回原值，避免抛错阻塞 chain。
 */

import {
  darken as c2kDarken,
  desaturate as c2kDesaturate,
  lighten as c2kLighten,
  mix as c2kMix,
  parseToRgba,
  saturate as c2kSaturate,
  toHex,
} from 'color2k'

/** 把 0-100 (%) 入参 clamp 成 0-1。 */
function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}

/** 把 color 重写为带 alpha 的 rgba(...)；alpha 入参 0-1。 */
export function setAlpha(color: string, alpha: number): string {
  try {
    const [r, g, b] = parseToRgba(color)
    return `rgba(${r}, ${g}, ${b}, ${clamp01(alpha)})`
  } catch {
    return color
  }
}

/** 加深颜色；n 取 0-100（百分比，HSL 亮度）。返回 hex 字符串。 */
export function darken(color: string, n: number): string {
  try {
    return toHex(c2kDarken(color, clamp01(n / 100)))
  } catch {
    return color
  }
}

/** 提亮颜色；n 取 0-100（百分比）。 */
export function lighten(color: string, n: number): string {
  try {
    return toHex(c2kLighten(color, clamp01(n / 100)))
  } catch {
    return color
  }
}

/**
 * 与另一个颜色混合；n 取 0-100（百分比，0 = 完全原色，100 = 完全 other）。
 *
 * `other` 可以是 token 命中后的真值（已展开的 hex）或任意 CSS 颜色字符串。
 */
export function mix(color: string, other: string, n: number): string {
  try {
    return toHex(c2kMix(color, other, clamp01(n / 100)))
  } catch {
    return color
  }
}

/** 提高饱和度；n 取 0-100。 */
export function saturate(color: string, n: number): string {
  try {
    return toHex(c2kSaturate(color, clamp01(n / 100)))
  } catch {
    return color
  }
}

/** 降低饱和度；n 取 0-100。 */
export function desaturate(color: string, n: number): string {
  try {
    return toHex(c2kDesaturate(color, clamp01(n / 100)))
  } catch {
    return color
  }
}
