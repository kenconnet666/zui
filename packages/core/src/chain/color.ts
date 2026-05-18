/**
 * 颜色处理工具。仅供 `carrier.ts` 的 alpha 简写分支使用。
 *
 * 基于 [color2k](https://github.com/ricokahler/color2k) 的 `parseToRgba` —— 支持
 * hex / rgb / hsl / oklch 等所有 CSS 颜色字符串，体积 ~2kb gzip。
 */

import { parseToRgba } from 'color2k'

/**
 * 把颜色字符串重写为带 alpha 的 rgba(...)。
 *
 * - `alpha` 入参 0-1（已在 `carrier.ts` 中由 0-100 百分比转换）
 * - 越界自动 clamp 到 [0, 1]
 * - 解析失败原样返回（avoid 抛错阻塞 chain 写入；用户会看到原 token 颜色）
 *
 * @example
 * setAlpha('#2563eb', 0.5)            // 'rgba(37, 99, 235, 0.5)'
 * setAlpha('rgb(0, 0, 0)', 0.8)       // 'rgba(0, 0, 0, 0.8)'
 * setAlpha('hsl(220 90% 56%)', 0.3)   // 'rgba(37, 99, 235, 0.3)'
 */
export function setAlpha(color: string, alpha: number): string {
  try {
    const [r, g, b] = parseToRgba(color)
    const clamped = Math.max(0, Math.min(1, alpha))
    return `rgba(${r}, ${g}, ${b}, ${clamped})`
  } catch {
    return color
  }
}
