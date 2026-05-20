import { Chain } from './chain/Chain'
import { Theme } from './theme/Theme'
import type { ResolvedTheme, ThemeSchema } from './theme/types'

/**
 * 一行 shortcut：传 theme + factory，返回 emotion className。
 *
 * ```ts
 * const cls = icss(paletteLight, s => {
 *   s.color._blue500
 *   s.padding.px(16)
 * })
 * ```
 */
export function icss<T extends ThemeSchema>(
  theme: ResolvedTheme<T> | Theme<T>,
  factory: (s: Chain<T>) => void,
): string {
  const c = new Chain<T>(theme)
  factory(c)
  return c.toString()
}
