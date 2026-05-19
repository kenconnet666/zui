import type { Chain } from '../chain/Chain'
import type { ThemeSchema } from '../theme/types'

/**
 * Mixin 工厂：把一段可重用样式片段包成纯函数，方便在 chain factory 中调用。
 *
 * 等价于直接定义 `(s: Chain<S>) => void`，但 `defineMixin` 给类型提示更友好，
 * 同时表明语义是"可复用的样式片段"。组件库里常见 mixin：focus-ring / elevation /
 * surface / subtle-text 等。
 *
 * @example
 * const focusRing = defineMixin<DefaultSchema>(s => {
 *   s._focusVisible(f => {
 *     f.outlineColor._primary
 *     f.outlineStyle('solid')
 *     f.outlineWidth.px(2)
 *     f.outlineOffset.px(2)
 *   })
 * })
 *
 * const elevation = defineMixin<DefaultSchema>(s => {
 *   s.boxShadow._middle
 *   s.transitionProperty('box-shadow')
 *   s.transitionDuration._small
 *   s._hover(h => { h.boxShadow._large })
 * })
 *
 * // 在 variants 里直接调用：
 * defineVariants(theme, {
 *   base: s => { focusRing(s); elevation(s) },
 *   variants: { ... },
 * })
 *
 * // 或在 _apply 里：
 * icss(theme, s => { s._apply(focusRing) })
 */
export function defineMixin<S extends ThemeSchema>(
  factory: (s: Chain<S>) => void,
): (s: Chain<S>) => void {
  return factory
}
