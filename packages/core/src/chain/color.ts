/**
 * 颜色处理工具。供 `carrier.ts` 的颜色 token 分支 + ColorTokenValue 的所有 modifier 使用。
 *
 * 基于 [color2k](https://github.com/ricokahler/color2k)（~2kb gzip）。所有函数解析失败时
 * 都返回原值，避免抛错阻塞 chain。
 *
 * **B5 修复**：darken/lighten/mix/saturate/desaturate 若原色含 alpha（rgba），输出保留原 alpha；
 * 原色不含 alpha 时仍输出 hex 简洁形式。
 */

import {
  adjustHue,
  darken as c2kDarken,
  desaturate as c2kDesaturate,
  lighten as c2kLighten,
  mix as c2kMix,
  parseToRgba,
  saturate as c2kSaturate,
  toHex,
} from 'color2k'

/**
 * 把 0-1（或 0-100 调用方先 / 100 后传入）clamp 成 0-1。
 *
 * **NaN 防御（修 M8）**：`NaN` / `Infinity` / `-Infinity` 等非有限数返回 0，
 * 避免下游输出 `rgba(r,g,b,NaN)` 这种破坏 CSS 的字符串。
 */
function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0
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

/**
 * 把 modifier 处理后的颜色按原色的 alpha 输出：
 * - 原色无 alpha（不透明） → 输出 hex
 * - 原色有 alpha（< 1）    → 输出 rgba(r, g, b, origAlpha)，保留原 alpha
 *
 * 解决 color2k `toHex` 总是丢失 alpha 的问题。
 */
function preserveAlpha(originalColor: string, processedColor: string): string {
  try {
    const orig = parseToRgba(originalColor)
    const origAlpha = orig[3] ?? 1
    if (origAlpha >= 1) {
      return toHex(processedColor)
    }
    const [r, g, b] = parseToRgba(processedColor)
    return `rgba(${r}, ${g}, ${b}, ${clamp01(origAlpha)})`
  } catch {
    return processedColor
  }
}

/** 加深颜色；n 取 0-100（百分比，HSL 亮度）。含 alpha 时保留 alpha。 */
export function darken(color: string, n: number): string {
  try {
    const result = c2kDarken(color, clamp01(n / 100))
    return preserveAlpha(color, result)
  } catch {
    return color
  }
}

/** 提亮颜色；n 取 0-100（百分比）。含 alpha 时保留 alpha。 */
export function lighten(color: string, n: number): string {
  try {
    const result = c2kLighten(color, clamp01(n / 100))
    return preserveAlpha(color, result)
  } catch {
    return color
  }
}

/**
 * 与另一个颜色混合；n 取 0-100（百分比，0 = 完全原色，100 = 完全 other）。
 *
 * `other` 可以是 token 命中后的真值（已展开的 hex）或任意 CSS 颜色字符串。
 * 含 alpha 时保留原色 alpha。
 */
export function mix(color: string, other: string, n: number): string {
  try {
    const result = c2kMix(color, other, clamp01(n / 100))
    return preserveAlpha(color, result)
  } catch {
    return color
  }
}

/** 提高饱和度；n 取 0-100。含 alpha 时保留 alpha。 */
export function saturate(color: string, n: number): string {
  try {
    const result = c2kSaturate(color, clamp01(n / 100))
    return preserveAlpha(color, result)
  } catch {
    return color
  }
}

/** 降低饱和度；n 取 0-100。含 alpha 时保留 alpha。 */
export function desaturate(color: string, n: number): string {
  try {
    const result = c2kDesaturate(color, clamp01(n / 100))
    return preserveAlpha(color, result)
  } catch {
    return color
  }
}

// ════════════════════════════════════════════════════════════════════════
// 扩展 modifier（基于 color2k 已有 API 实现，含 alpha 时保留 alpha）
// ════════════════════════════════════════════════════════════════════════

/**
 * 补色（complementary） —— 色相旋转 180°。
 *
 * @example
 * complement('#2563eb')  // → '#eba125'（蓝的补色 = 橙）
 */
export function complement(color: string): string {
  try {
    const result = adjustHue(color, 180)
    return preserveAlpha(color, result)
  } catch {
    return color
  }
}

/**
 * 任意角度旋转色相；deg 取任意数（自动 mod 360）。
 *
 * @example
 * rotateHue('#2563eb', 90)   // 蓝 → 紫
 * rotateHue('#2563eb', -60)  // 蓝 → 青
 */
export function rotateHue(color: string, deg: number): string {
  try {
    const result = adjustHue(color, deg)
    return preserveAlpha(color, result)
  } catch {
    return color
  }
}

/** 颜色反相（255 - 每个 channel）；含 alpha 时保留 alpha。 */
export function invert(color: string): string {
  try {
    const [r, g, b, a = 1] = parseToRgba(color)
    const inv = `rgba(${255 - r}, ${255 - g}, ${255 - b}, ${clamp01(a)})`
    if (a >= 1) return toHex(inv)
    return inv
  } catch {
    return color
  }
}

/**
 * 加深（shade） —— 与黑色混合；n 取 0-100。
 *
 * 与 `darken` 不同：`darken` 走 HSL 减亮度（可能保留色相），`shade` 走 RGB 混黑（更"重"）。
 */
export function shade(color: string, n: number): string {
  try {
    const result = c2kMix(color, '#000000', clamp01(n / 100))
    return preserveAlpha(color, result)
  } catch {
    return color
  }
}

/**
 * 提亮（tint） —— 与白色混合；n 取 0-100。
 *
 * 与 `lighten` 不同：`lighten` 走 HSL 增亮度，`tint` 走 RGB 混白（更"柔"）。
 */
export function tint(color: string, n: number): string {
  try {
    const result = c2kMix(color, '#ffffff', clamp01(n / 100))
    return preserveAlpha(color, result)
  } catch {
    return color
  }
}
