// ─── Theme ───
export { Theme } from './theme/Theme'
export { resolveTheme } from './theme/resolveTheme'
export { mergeTheme } from './theme/mergeTheme'
export { buildKeymap } from './theme/keymap'

// ─── Chain ───
export { Chain } from './chain/Chain'
export { resolveCarrier } from './chain/resolveCarrier'

// ─── 单位 helper ───
export { iem, iemWith } from './chain/units'

// ─── 字符串逃生舱(carrier 内部使用,顶层 re-export 供高级用户独立调用) ───
export { resolveStringValue } from './chain/escape'

// ─── 顶层工具 ───
export { icss } from './icss'
export { toClassName } from './toClassName'
export { ikeyframes } from './ikeyframes'
export { cx } from './cx'
export type { ClassInput } from './cx'
export { injectGlobal } from './injectGlobal'

// ─── W5.4 / W5.5 / W8 全局副作用工具 ───
export { injectPreflight } from './preflight'
export { registerCustomProperty } from './registerCustomProperty'
export type { CustomPropertyOptions } from './registerCustomProperty'
export { injectLayer, injectLayerOrder } from './layer'
export { registerFont } from './registerFont'
export type { FontFaceSource } from './registerFont'

// ─── 默认主题（仅 palette，无 semantic / 5 阶 scale） ───
// 业务侧消费推荐 `zuiLight` / `zuiDark`（来自 @kenconnet666/zui-vue），含完整设计系统 token。
export { paletteLight, paletteDark } from './theme/defaults'
export type { BaseSchema } from './theme/defaults/schema'
export {
  tw,
  TAILWIND_PALETTE,
  FLAT_PALETTE,
  PALETTE_NAMES,
  PALETTE_SHADES,
} from './theme/defaults/palette'
export type { PaletteName, PaletteShade, PaletteToken } from './theme/defaults/palette'

// ─── 开发态工具（dev-only helpers） ───
export { assertSchemaConsistency } from './dev/assertSchemaConsistency'
export type { SchemaIssue } from './dev/assertSchemaConsistency'
export {
  makeCallsiteLabel,
  parseStackLine,
  findUserCallsite,
  isProductionEnv,
} from './dev/stackTrace'
export type { StackFrame } from './dev/stackTrace'

// ─── 类型 ───
export type {
  ThemeSchema,
  ThemeValue,
  ResolvedTheme,
  ResolvedThemeContext,
  DeepPartial,
  DeepMergeSchema,
  SchemaOf,
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
export type { StyleProps, ResponsiveStyleProps, TokenOf } from './types/styleProps'

// ─── CL Batch 2 — 响应式 prop 解析 ───
export { applyResponsive, isResponsiveValue } from './responsive'
export type { ResponsiveValue, ResponsiveObject } from './responsive'

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

// ─── CL Batch 1 — 组件库核心：parts / compose / extends / mixin / VariantPropsOf ───
export { defineMixin } from './variants/defineMixin'
export { composeVariants, extendVariants } from './variants/composeVariants'
export type { VariantPropsOf } from './variants/composeVariants'
export { defineParts, extendParts } from './variants/defineParts'
export type {
  SlotFactory,
  PartsBase,
  PartsVariantValue,
  PartsVariantMap,
  PartsCompoundVariant,
  DefinePartsConfig,
  PartFactory,
  PartsResult,
  VariantPropsOfParts,
} from './variants/defineParts'

// ─── Batch C — 预设资源（动画 keyframes / preflight reset 等） ───
export { presetAnimations, PRESET_ANIMATION_DEFS, PREFLIGHT_STYLES } from './preset'
export type { PresetAnimationName, KeyframeStops } from './preset'
