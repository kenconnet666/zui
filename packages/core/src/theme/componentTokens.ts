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

export type ComponentTokenDeriver<C extends keyof ComponentTokenRegistry, T extends ThemeSchema> = (
  theme: ResolvedTheme<T>,
) => Partial<ComponentTokenRegistry[C]>

export type ComponentTokenDerivers<T extends ThemeSchema> = {
  [C in keyof ComponentTokenRegistry]?: ComponentTokenDeriver<C, T>
}

export type ComponentTokenOverrides = {
  [C in keyof ComponentTokenRegistry]?: Partial<ComponentTokenRegistry[C]>
}

/**
 * F6 — 拿到某 component namespace 下所有 token 的运行时映射。
 *
 * 与 `theme.color._buttonPrimary` 强类型字段访问不同，本 helper 返回**普通 object**
 * 让组件库作者在 runtime 拿 namespace 下完整 token map（如传给 icon 颜色 / 派生其它逻辑）。
 *
 * 自动识别 flatten 命名（`buttonPrimary` / `buttonPrimaryHover`）反推出 `primary` / `primaryHover`。
 *
 * @example
 * declare module '@kenconnet666/zui-core' {
 *   interface ComponentTokenRegistry { button: { primary: string; primaryHover: string } }
 * }
 *
 * const theme = withComponentTokens(defaultLight.resolve(), {
 *   button: t => ({ primary: t.color.primary as string, primaryHover: t.color.primaryHover as string }),
 * })
 * const tokens = componentTokensFor('button', theme)
 * // → { primary: '#2563eb', primaryHover: '#1d4ed8' }
 */
export function componentTokensFor<C extends keyof ComponentTokenRegistry & string, T extends ThemeSchema>(
  component: C,
  theme: ResolvedTheme<T>,
): Partial<ComponentTokenRegistry[C]> {
  const colorSlot = (theme as Record<string, Record<string, string | number> | undefined>).color
  if (!colorSlot) return {} as Partial<ComponentTokenRegistry[C]>
  // 显式 cast 成 string：ComponentTokenRegistry 用户没 augment 时 C 推断为 never，
  // 直接走 .length 会让 dts plugin 报 'Property length does not exist on never'。
  const prefix: string = component as string
  const result: Record<string, string | number> = {}
  for (const flatKey in colorSlot) {
    if (!flatKey.startsWith(prefix)) continue
    const rest = flatKey.slice(prefix.length)
    if (rest.length === 0) continue
    // 反推 camelCase：buttonPrimary -> primary；buttonPrimaryHover -> primaryHover
    const key = rest[0]!.toLowerCase() + rest.slice(1)
    const value = colorSlot[flatKey]
    if (value != null) result[key] = value
  }
  return result as Partial<ComponentTokenRegistry[C]>
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
    const ov = (overrides?.[compName as keyof ComponentTokenRegistry] ?? {}) as Record<
      string,
      string
    >
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
    color: {
      ...(theme as Record<string, Record<string, string | number>>).color,
      ...derivedColors,
    },
  } as ResolvedTheme<T>
}
