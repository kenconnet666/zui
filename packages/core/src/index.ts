// ─── Theme ───
export { Theme } from './theme/Theme'
export { resolveTheme } from './theme/resolveTheme'
export { mergeTheme } from './theme/mergeTheme'
export { buildKeymap } from './theme/keymap'

// ─── Chain ───
export { Chain } from './chain/Chain'

// ─── 顶层工具 ───
export { icss } from './icss'
export { toClassName } from './toClassName'
export { ikeyframes } from './ikeyframes'
export { cx } from './cx'
export { injectGlobal } from './injectGlobal'

// ─── W5.4 / W5.5 / W8 全局副作用工具 ───
export { injectPreflight } from './preflight'
export { registerCustomProperty } from './registerCustomProperty'
export type { CustomPropertyOptions } from './registerCustomProperty'
export { injectLayer, injectLayerOrder } from './layer'
export { registerFont } from './registerFont'
export type { FontFaceSource } from './registerFont'

// ─── 默认主题 ───
export { defaultLight, defaultDark } from './theme/defaults'
export type { DefaultSchema } from './theme/defaults/schema'
export { tw, TAILWIND_PALETTE, FLAT_PALETTE, PALETTE_NAMES, PALETTE_SHADES } from './theme/defaults/palette'
export type { PaletteName, PaletteShade, PaletteToken } from './theme/defaults/palette'

// ─── 开发态工具（dev-only helpers） ───
export { assertSchemaConsistency } from './dev/assertSchemaConsistency'
export type { SchemaIssue } from './dev/assertSchemaConsistency'
export { makeCallsiteLabel, parseStackLine, findUserCallsite, isProductionEnv } from './dev/stackTrace'
export type { StackFrame } from './dev/stackTrace'

// ─── 类型 ───
export type {
  ThemeSchema,
  ThemeValue,
  ResolvedTheme,
  ResolvedThemeContext,
  DeepPartial,
} from './theme/types'

export type {
  PropCarrier,
  PropFn,
  ColorPropCarrier,
  ColorTokenValue,
  GlobalKw,
  LengthUnits,
  TimeUnits,
  AngleUnits,
} from './types/carrier'

export type {
  ToIdent,
  ColorTokens,
  SpacingTokens,
  RadiusTokens,
  ShadowTokens,
  FontSizeTokens,
  FontWeightTokens,
  LineHeightTokens,
  LetterSpacingTokens,
  FontsTokens,
  BordersTokens,
  ZIndexTokens,
  OpacityTokens,
  DurationTokens,
  EasingTokens,
  AspectRatioTokens,
  SizeTokens,
  CursorTokens,
  TransitionPropertyTokens,
} from './types/tokens'

export type { IcxPropMethods } from './types/properties.generated'

// ─── W10 类型工具 + 应用 helper ───
export { applyStyleProps } from './types/styleProps'
export type { StyleProps, TokenOf } from './types/styleProps'

// ─── W1.2 ComponentTokenRegistry ───
export type {
  ComponentTokenRegistry,
  FlattenComponentTokens,
  ComponentTokenNames,
} from './types/components'
export { withComponentTokens } from './theme/componentTokens'
export type {
  ComponentTokenDeriver,
  ComponentTokenDerivers,
  ComponentTokenOverrides,
} from './theme/componentTokens'

// ─── W5.1 SSR / 多实例 wrapper ───
export { createIcssInstance } from './createIcssInstance'
export type {
  EmotionLikeInstance,
  IcssInstance,
  KeyframesBuilder as IcssKeyframesBuilder,
} from './createIcssInstance'

// ─── Chain 构造可选项 ───
export type { ChainOptions } from './chain/Chain'

// ─── Batch A — defineVariants 变体抽象（cva / tv 风格 + zui 协调） ───
export { defineVariants } from './variants/defineVariants'
export type {
  VariantOptions,
  VariantMap,
  VariantProps,
  CompoundVariant,
  DefineVariantsConfig,
} from './variants/defineVariants'
