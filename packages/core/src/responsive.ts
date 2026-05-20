/**
 * E4 — 响应式 prop 解析（Chakra / Mantine / Theme UI 风）。
 *
 * 把对象形式 `{ base: ..., middle: ..., large: ... }` 解析成 chain 上的多个 `_media('_middle', ...)` 调用。
 *
 * @example
 * applyResponsive(chain, { base: 8, small: 16, middle: 24 }, (s, v) => s.padding.px(v))
 * // → padding: 8px;
 * //   @media (min-width: 768px) { padding: 16px; }     // _small = theme.breakpoint.small
 * //   @media (min-width: 1024px) { padding: 24px; }    // _middle = theme.breakpoint.middle
 *
 * 响应式 value 形式：
 * - 普通值（非对象 / 非 plain object）→ 直接 apply
 * - `{ base?: T, tiny?: T, small?: T, ... }` → base 写顶层，其它 key 走 `_media('_<key>')`
 *
 * 断点 key 应是 theme.breakpoint 中存在的：
 * default schema 提供 tiny / small / middle / large / huge（5 阶语义化）。
 */

import type { Chain } from './chain/Chain'
import type { ThemeSchema } from './theme/types'

/** 响应式值：可能是 `T` 或 `{ base?: T; tiny?: T; small?: T; middle?: T; large?: T; huge?: T }`。 */
export type ResponsiveValue<T> = T | ResponsiveObject<T>

export interface ResponsiveObject<T> {
  /** 顶层值（无 media query）。 */
  base?: T
  /** 在 `_media('_<key>')` 下应用。`<key>` 需在 theme.breakpoint 中存在。 */
  [breakpoint: string]: T | undefined
}

/**
 * 判断是否是响应式对象（plain object with `base` / 断点 key）。
 *
 * 两种模式：
 * - **严格模式**（推荐，传 `breakpoints`）：仅当 **所有** key ∈ `['base', ...breakpoints]` 才返回 true。
 *   组件库应从 `theme.breakpoint` keys 派生 breakpoints 数组传入，避免误判。
 * - **启发模式**（默认）：plain object + 全部 key 是 letter-prefixed ident（兜底兼容旧用法）。
 *
 * @example
 * isResponsiveValue({ base: 4, middle: 8 }, ['small', 'middle', 'large'])  // true
 * isResponsiveValue({ name: 'x' }, ['small', 'middle', 'large'])           // false（严格）
 * isResponsiveValue({ name: 'x' })                                         // true（启发，已知误判）
 */
export function isResponsiveValue<T>(
  value: unknown,
  breakpoints?: readonly string[],
): value is ResponsiveObject<T> {
  if (value == null) return false
  if (typeof value !== 'object') return false
  if (Array.isArray(value)) return false
  const proto = Object.getPrototypeOf(value)
  if (proto !== Object.prototype && proto !== null) return false
  const keys = Object.keys(value)
  if (keys.length === 0) return false
  if (breakpoints !== undefined) {
    // 严格模式：所有 key 必须是 base 或 breakpoints 之一
    const allowed = new Set<string>(['base', ...breakpoints])
    return keys.every(k => allowed.has(k))
  }
  // 启发模式（向后兼容）：letter-prefixed ident
  return keys.every(k => /^[a-zA-Z][\w-]*$/.test(k) || k === '2xl' || /^\d+xl$/.test(k))
}

/**
 * 把响应式 value 应用到 chain。
 *
 * - 普通值：直接 `apply(chain, value)`
 * - 响应式对象：base 在顶层，其它 key 包进 `chain._media('_<key>', s => apply(s, v))`
 *
 * @example
 * applyResponsive(chain, props.padding, (s, v) => s.padding.px(v))
 *
 * @example
 * applyResponsive(chain, { base: 'red', middle: 'blue' }, (s, v) => s.color(v))
 */
export function applyResponsive<S extends ThemeSchema, T>(
  chain: Chain<S>,
  value: ResponsiveValue<T> | undefined,
  apply: (s: Chain<S>, v: T) => void,
): void {
  if (value === undefined) return
  if (!isResponsiveValue<T>(value)) {
    apply(chain, value)
    return
  }
  // 响应式对象
  for (const [bp, v] of Object.entries(value as ResponsiveObject<T>)) {
    if (v === undefined) continue
    if (bp === 'base') {
      apply(chain, v)
    } else {
      const token = `_${bp}`
      chain._media(token, s => apply(s, v))
    }
  }
}
