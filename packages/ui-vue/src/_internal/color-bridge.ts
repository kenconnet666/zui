/**
 * `_internal/color-bridge` —— 用户 `color` carrier factory 跨 carrier 应用的桥接 helper。
 *
 * **背景**:很多组件接受 `color?: ((c: Chain<ZuiSchema>['color']) => void)` 作 prop,
 * 但运行时常常需要把同一个色应用到 `backgroundColor` / `borderColor` / `borderLeftColor` /
 * `stroke` / `fill` 等其他 carrier。因为 chain carrier 的类型是 carrier-specific 的,
 * 跨 carrier 调用需要 type cast。
 *
 * **规约**:所有跨 carrier cast 集中到本文件;**业务组件不允许内联** `as unknown as ...`
 * cast 跨 carrier。需要 carrier 没列出 → 来这里补 helper。
 *
 * **取最终色串**:见 `resolveColor()`(基于 zui-core `resolveCarrier`,可拿到 token /
 * `.alpha(N)` modifier / 字面量等任意写入值的字符串形式,用于 SVG / canvas / ARIA 等
 * 无法走 emotion class 的场景)。
 */
import { resolveCarrier, type Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

type ColorFactory = (c: Chain<ZuiSchema>['color']) => void
type BgFactory = (b: Chain<ZuiSchema>['backgroundColor']) => void
type BorderFactory = (b: Chain<ZuiSchema>['borderColor']) => void
type BorderLeftFactory = (b: Chain<ZuiSchema>['borderLeftColor']) => void
type OutlineFactory = (o: Chain<ZuiSchema>['outlineColor']) => void
type StrokeFactory = (s: Chain<ZuiSchema>['stroke']) => void
type FillFactory = (f: Chain<ZuiSchema>['fill']) => void
type CaretFactory = (c: Chain<ZuiSchema>['caretColor']) => void

/**
 * 把 `color` factory 应用到 `backgroundColor` carrier(如果非 null)。
 *
 * @example
 * applyAsBg(s, props.color)  // 等价于 s.backgroundColor(props.color)(类型层面强 cast)
 */
export function applyAsBg(s: Chain<ZuiSchema>, factory: ColorFactory | undefined): boolean {
  if (!factory) return false
  s.backgroundColor(factory as unknown as BgFactory)
  return true
}

/**
 * 把 `color` factory 应用到 `borderColor` carrier。
 */
export function applyAsBorder(s: Chain<ZuiSchema>, factory: ColorFactory | undefined): boolean {
  if (!factory) return false
  s.borderColor(factory as unknown as BorderFactory)
  return true
}

/**
 * 把 `color` factory 应用到 `borderLeftColor` carrier。
 */
export function applyAsBorderLeft(s: Chain<ZuiSchema>, factory: ColorFactory | undefined): boolean {
  if (!factory) return false
  s.borderLeftColor(factory as unknown as BorderLeftFactory)
  return true
}

/**
 * 把 `color` factory 应用到 `outlineColor` carrier。
 */
export function applyAsOutline(s: Chain<ZuiSchema>, factory: ColorFactory | undefined): boolean {
  if (!factory) return false
  s.outlineColor(factory as unknown as OutlineFactory)
  return true
}

/**
 * 把 `color` factory 应用到 `stroke` carrier(SVG)。
 */
export function applyAsStroke(s: Chain<ZuiSchema>, factory: ColorFactory | undefined): boolean {
  if (!factory) return false
  s.stroke(factory as unknown as StrokeFactory)
  return true
}

/**
 * 把 `color` factory 应用到 `fill` carrier(SVG)。
 */
export function applyAsFill(s: Chain<ZuiSchema>, factory: ColorFactory | undefined): boolean {
  if (!factory) return false
  s.fill(factory as unknown as FillFactory)
  return true
}

/**
 * 把 `color` factory 应用到 `caretColor` carrier(input caret 光标色)。
 */
export function applyAsCaret(s: Chain<ZuiSchema>, factory: ColorFactory | undefined): boolean {
  if (!factory) return false
  s.caretColor(factory as unknown as CaretFactory)
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

/**
 * 把 `color` factory 投射(probe)一遍,取出最终色字符串。
 *
 * 基于 zui-core `resolveCarrier`,支持 token / `.alpha(N)` modifier / keyword /
 * 字面量 / 字符串逃生舱等所有 carrier 写入路径。**用于 SVG `stroke` / `fill` /
 * `<canvas>` / ARIA 等无法走 emotion class 的场景**。
 *
 * @param theme   - `theme.value`(ResolvedTheme<ZuiSchema>)
 * @param factory - `color` carrier factory(`(c) => void`),未传或 resolve 失败走 fallback
 * @param fallback - 默认 `'#000000'`
 *
 * @example
 * const stroke = computed(() =>
 *   resolveColor(theme.value, props.color, '#1976d2'),
 * )
 * // <circle :stroke="stroke" ...
 */
export function resolveColor(
  theme: unknown,
  factory: ColorFactory | undefined,
  fallback = '#000000',
): string {
  const v = resolveCarrier(theme as never, 'color', factory as never)
  if (typeof v === 'string') return v
  return fallback
}
