/**
 * E4 — 响应式 prop 解析（Chakra / Mantine / Theme UI 风）。
 *
 * 把对象形式 `{ base: ..., md: ..., lg: ... }` 解析成 chain 上的多个 `_media('_md', ...)` 调用。
 *
 * @example
 * applyResponsive(chain, { base: 8, md: 16, lg: 24 }, (s, v) => s.padding.px(v))
 * // → padding: 8px;
 * //   @media (min-width: 768px) { padding: 16px; }
 * //   @media (min-width: 1024px) { padding: 24px; }
 *
 * 响应式 value 形式：
 * - 普通值（非对象 / 非 plain object）→ 直接 apply
 * - `{ base?: T, sm?: T, md?: T, ... }` → base 写顶层，其它 key 走 `_media('_<key>')`
 *
 * 断点 key 应是 theme.breakpoint 中存在的：
 * default schema 提供 sm / md / lg / xl / 2xl。
 */

import type { Chain } from './chain/Chain'
import type { ThemeSchema } from './theme/types'

/** 响应式值：可能是 `T` 或 `{ base?: T; sm?: T; md?: T; lg?: T; xl?: T; '2xl'?: T }`。 */
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
 * 检查规则：
 * - 必须是 plain object（非 null / 非数组 / 非 function / 非其它类）
 * - 至少有一个 key 是 'base' 或常见断点（'sm' / 'md' / 'lg' / 'xl' / '2xl' / 自定义）
 */
export function isResponsiveValue<T>(value: unknown): value is ResponsiveObject<T> {
  if (value == null) return false
  if (typeof value !== 'object') return false
  if (Array.isArray(value)) return false
  const proto = Object.getPrototypeOf(value)
  if (proto !== Object.prototype && proto !== null) return false
  // 简单启发：含 'base' 或不是空对象（认为是响应式 mapping）
  const keys = Object.keys(value)
  if (keys.length === 0) return false
  // 排除 schema-like object（如 emotion CSS object 含 selector key）
  // 响应式对象的 key 通常是 breakpoint 名（'base' / 'sm' / 'md' / ...）
  // 简单粗粒：全部 key 都不是 ${X}px / ${X}rem / 不含特殊字符
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
 * applyResponsive(chain, { base: 'red', md: 'blue' }, (s, v) => s.color(v))
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
