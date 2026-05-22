/**
 * `@kenconnet666/zui-vue` —— Vue 3 集成层。**单入口**(BREAKING v0.2,2026-05-23)。
 *
 * 不再支持 subpath import(`/provider` / `/locale` / `/composables`)。所有 API 经主入口
 * 透出,tree-shake 由 bundler(rollup `preserveModules`+ pure marker)负责。
 */

// ─── Provider / ZBox ───
export {
  ZBox,
  Z_THEME_KEY,
  Z_LOCALE_KEY,
  Z_DATE_KEY,
  useZTheme,
  useZLocale,
  useZDate,
  ZIemPreset,
  type ZDateConfig,
  type UseZDateReturn,
  type ZIem,
} from './provider'

// ─── 主题(zui 设计系统)───
export {
  zuiLight,
  zuiDark,
  type ZuiSchema,
  type SemanticColorTokens,
  // 用户扩展锚点 —— `declare module '@kenconnet666/zui-vue' { interface UserColorExt {...} }`
  type UserColorExt,
  type UserSpacingExt,
  type UserRadiusExt,
  type UserFontSizeExt,
  type UserFontWeightExt,
  type UserShadowExt,
  type UserBlurExt,
  type UserDurationExt,
  type UserEasingExt,
  type UserBreakpointExt,
  type UserZIndexExt,
  type UserOpacityExt,
  type UserLineHeightExt,
  type UserLetterSpacingExt,
  type UserAspectRatioExt,
  type UserFontsExt,
  type UserSizesExt,
  type UserBordersExt,
  type UserTransitionPropertyExt,
} from './provider/theme'

// ─── Locale ───
export {
  zhCN,
  enUS,
  mergeLocale,
  type ZLocale,
  type ZLocalePartial,
  type ZLocaleRegistry,
  type ZLocaleCommon,
  type ZLocaleButton,
  type ZLocaleInput,
  type ZLocaleSelect,
  type ZLocaleDialog,
  type ZLocalePagination,
  type ZLocaleForm,
  type ZLocaleDatePicker,
  type DeepPartialLocale,
} from './provider/locale'

// ─── Components ───
export * from './gene'
export * from './layout'
export * from './input'
export * from './display'
export * from './feedback'
export * from './navigation'
export * from './tool'

// ─── Core 全量透传 ───
// 装 `@kenconnet666/zui-vue` 即等于装 core:用户可直接从本包 import 任何 core API。
export * from '@kenconnet666/zui-core'
