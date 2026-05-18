import type { ResolvedTheme, ThemeSchema } from './types'
import type { ComponentTokenRegistry } from '../types/components'

/**
 * W1.2 — 组件级 token 派生 + override 合并 helper。
 *
 * 把 `derivers`（系统主题派生组件 token）+ `overrides`（用户在 ConfigProvider 给的覆盖）
 * 合并到 theme.color 命名空间（flatten 形式：`buttonPrimary` / `inputBorderFocus`）。
 *
 * 返回**新对象**，原 theme 不变（便于在响应式系统里安全 derive）。
 *
 * @example
 * declare module '@kenconnet666/zui-core' {
 *   interface ComponentTokenRegistry { button: { primary: string; hover: string } }
 * }
 *
 * const baseTheme = defaultLight.resolve()
 * const themedForButton = withComponentTokens(
 *   baseTheme,
 *   { button: t => ({ primary: t.color.primary, hover: t.color.primaryHover }) },
 *   { button: { primary: '#f00' } },   // 可选 override
 * )
 * const c = new Chain(themedForButton)
 * c.color._buttonPrimary  // → '#f00'（override）
 * c.color._buttonHover    // → theme.color.primaryHover（deriver 派生）
 */

export type ComponentTokenDeriver<
  C extends keyof ComponentTokenRegistry,
  T extends ThemeSchema
> = (theme: ResolvedTheme<T>) => Partial<ComponentTokenRegistry[C]>

export type ComponentTokenDerivers<T extends ThemeSchema> = {
  [C in keyof ComponentTokenRegistry]?: ComponentTokenDeriver<C, T>
}

export type ComponentTokenOverrides = {
  [C in keyof ComponentTokenRegistry]?: Partial<ComponentTokenRegistry[C]>
}

export function withComponentTokens<T extends ThemeSchema>(
  theme: ResolvedTheme<T>,
  derivers: ComponentTokenDerivers<T>,
  overrides?: ComponentTokenOverrides,
): ResolvedTheme<T> {
  const derivedColors: Record<string, string> = {}
  for (const compName in derivers) {
    const fn = derivers[compName as keyof ComponentTokenRegistry]
    if (!fn) continue
    const derived = (fn as ComponentTokenDeriver<never, T>)(theme) as Record<string, string>
    const ov = (overrides?.[compName as keyof ComponentTokenRegistry] ?? {}) as Record<string, string>
    // override 覆盖 derived，未声明的 key 沿用 derived
    const merged = { ...derived, ...ov }
    for (const k in merged) {
      const flatKey = `${compName}${k[0]!.toUpperCase()}${k.slice(1)}`
      derivedColors[flatKey] = merged[k]!
    }
  }
  if (Object.keys(derivedColors).length === 0) return theme
  // 因为 W4.3 把 theme.color 给 Object.freeze 了，必须建新对象
  return {
    ...theme,
    color: { ...(theme as Record<string, Record<string, string | number>>).color, ...derivedColors },
  } as ResolvedTheme<T>
}
