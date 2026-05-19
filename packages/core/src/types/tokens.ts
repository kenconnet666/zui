import type { ThemeSchema } from '../theme/types'

/** 把字符串中所有 `-` 去掉。 */
export type RemoveHyphen<S extends string> = S extends `${infer A}-${infer B}`
  ? `${A}${RemoveHyphen<B>}`
  : S
/** 把字符串中所有 `.` 替换为 `_`。 */
export type DotToUnderscore<S extends string> = S extends `${infer A}.${infer B}`
  ? `${A}_${DotToUnderscore<B>}`
  : S

/** token key → 安全标识符（`'blue-600'` → `'_blue600'`）。 */
export type ToIdent<K extends string> = `_${RemoveHyphen<DotToUnderscore<K>>}`

type Keys<T, Cat extends keyof ThemeSchema> = T extends ThemeSchema
  ? T[Cat] extends Record<string, unknown>
    ? keyof T[Cat] & string
    : never
  : never

export type ColorTokens<T extends ThemeSchema> = ToIdent<Keys<T, 'color'>>
export type SpacingTokens<T extends ThemeSchema> = ToIdent<Keys<T, 'spacing'>>
export type RadiusTokens<T extends ThemeSchema> = ToIdent<Keys<T, 'radius'>>
export type ShadowTokens<T extends ThemeSchema> = ToIdent<Keys<T, 'shadow'>>
export type FontSizeTokens<T extends ThemeSchema> = ToIdent<Keys<T, 'fontSize'>>
export type FontWeightTokens<T extends ThemeSchema> = ToIdent<Keys<T, 'fontWeight'>>
export type LineHeightTokens<T extends ThemeSchema> = ToIdent<Keys<T, 'lineHeight'>>
export type LetterSpacingTokens<T extends ThemeSchema> = ToIdent<Keys<T, 'letterSpacing'>>
export type FontsTokens<T extends ThemeSchema> = ToIdent<Keys<T, 'fonts'>>
export type BordersTokens<T extends ThemeSchema> = ToIdent<Keys<T, 'borders'>>
export type ZIndexTokens<T extends ThemeSchema> = ToIdent<Keys<T, 'zIndex'>>
export type OpacityTokens<T extends ThemeSchema> = ToIdent<Keys<T, 'opacity'>>
export type DurationTokens<T extends ThemeSchema> = ToIdent<Keys<T, 'duration'>>
export type EasingTokens<T extends ThemeSchema> = ToIdent<Keys<T, 'easing'>>
export type AspectRatioTokens<T extends ThemeSchema> = ToIdent<Keys<T, 'aspectRatio'>>
export type SizeTokens<T extends ThemeSchema> = ToIdent<Keys<T, 'sizes'>>
export type CursorTokens<T extends ThemeSchema> = ToIdent<Keys<T, 'cursor'>>
export type TransitionPropertyTokens<T extends ThemeSchema> = ToIdent<Keys<T, 'transitionProperty'>>
