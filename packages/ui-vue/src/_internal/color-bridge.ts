/**
 * `_internal/color-bridge` —— 用户 `color` carrier factory 跨 carrier 应用的桥接 helper。
 *
 * **背景**:很多组件接受 `color?: ((c: Chain<ZuiSchema>['color']) => void)` 作 prop,
 * 但运行时常常需要把同一个色应用到 `backgroundColor` / `borderColor` / `borderLeftColor` 等其他
 * carrier。因为 chain carrier 的类型是 carrier-specific 的,跨 carrier 调用需要 type cast。
 *
 * 把所有 cast 集中到本文件,避免每个组件单独写 `as unknown as ...` 噪音。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

type ColorFactory = (c: Chain<ZuiSchema>['color']) => void
type BgFactory = (b: Chain<ZuiSchema>['backgroundColor']) => void
type BorderFactory = (b: Chain<ZuiSchema>['borderColor']) => void
type BorderLeftFactory = (b: Chain<ZuiSchema>['borderLeftColor']) => void
type OutlineFactory = (o: Chain<ZuiSchema>['outlineColor']) => void

/**
 * 把 `color` factory 应用到 `backgroundColor` carrier(如果非 null)。
 *
 * @example
 * applyAsBg(s, props.color)  // 等价于 s.backgroundColor(props.color)(类型层面强 cast)
 */
export function applyAsBg(
  s: Chain<ZuiSchema>,
  factory: ColorFactory | undefined,
): boolean {
  if (!factory) return false
  s.backgroundColor(factory as unknown as BgFactory)
  return true
}

/**
 * 把 `color` factory 应用到 `borderColor` carrier。
 */
export function applyAsBorder(
  s: Chain<ZuiSchema>,
  factory: ColorFactory | undefined,
): boolean {
  if (!factory) return false
  s.borderColor(factory as unknown as BorderFactory)
  return true
}

/**
 * 把 `color` factory 应用到 `borderLeftColor` carrier。
 */
export function applyAsBorderLeft(
  s: Chain<ZuiSchema>,
  factory: ColorFactory | undefined,
): boolean {
  if (!factory) return false
  s.borderLeftColor(factory as unknown as BorderLeftFactory)
  return true
}

/**
 * 把 `color` factory 应用到 `outlineColor` carrier。
 */
export function applyAsOutline(
  s: Chain<ZuiSchema>,
  factory: ColorFactory | undefined,
): boolean {
  if (!factory) return false
  s.outlineColor(factory as unknown as OutlineFactory)
  return true
}

/**
 * `ResolvedColorTheme` —— 仅用于从 `theme.value` 中取 string 色值的弱类型 view。
 *
 * 跟 `ResolvedTheme<ZuiSchema>` 兼容,但避免组件代码每次都写 `as unknown as { color: Record<...> }`。
 */
export type ResolvedColorTheme = { color: Record<string, string> }

/**
 * 从 resolved theme 取 schema 色 token 的字面量(如 `'#1976d2'`)。供 SVG/canvas 等无法走 chain 的场景用。
 */
export function getThemeColor(theme: unknown, key: string, fallback = '#000000'): string {
  return (theme as ResolvedColorTheme | undefined)?.color?.[key] ?? fallback
}
