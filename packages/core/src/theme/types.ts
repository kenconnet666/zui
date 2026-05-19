/**
 * 主题 schema 的基础形状：每个 category 是 `Record<string, ThemeValue>`。
 * 用户可通过 `interface MySchema extends ThemeSchema` 加自定义 category。
 */
export interface ThemeSchema {
  color?: Record<string, ThemeValue>
  spacing?: Record<string, ThemeValue>
  radius?: Record<string, ThemeValue>
  shadow?: Record<string, ThemeValue>
  fontSize?: Record<string, ThemeValue>
  fontWeight?: Record<string, ThemeValue>
  lineHeight?: Record<string, ThemeValue>
  letterSpacing?: Record<string, ThemeValue>
  fonts?: Record<string, ThemeValue>
  borders?: Record<string, ThemeValue>
  zIndex?: Record<string, ThemeValue>
  duration?: Record<string, ThemeValue>
  easing?: Record<string, ThemeValue>
  opacity?: Record<string, ThemeValue>
  aspectRatio?: Record<string, ThemeValue>
  breakpoint?: Record<string, ThemeValue>
  sizes?: Record<string, ThemeValue>
  cursor?: Record<string, ThemeValue>
  blur?: Record<string, ThemeValue>
  [customCategory: string]: Record<string, ThemeValue> | undefined
}

/** Theme 单格值：字面量或 function token（function token 可访问其它已解析值）。 */
export type ThemeValue = string | number | ((ctx: ResolvedThemeContext) => string | number)

/** function token 求值时拿到的上下文（已解析的其它 category）。 */
export type ResolvedThemeContext = Record<string, Record<string, string | number>>

/** 解析后的主题（function token 已展开）。 */
export type ResolvedTheme<T extends ThemeSchema> = {
  [Cat in keyof T]: T[Cat] extends Record<string, ThemeValue>
    ? { [K in keyof T[Cat]]: string | number }
    : never
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}
