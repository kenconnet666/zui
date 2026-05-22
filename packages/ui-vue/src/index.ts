/**
 * `@kenconnet666/zui-vue` —— Vue 3 集成层。
 *
 * 主入口聚合 Provider、composables、locale，并 re-export 一部分 core API。
 * 精细 tree-shake 走 subpath：
 * - `@kenconnet666/zui-vue/provider`
 * - `@kenconnet666/zui-vue/composables`
 * - `@kenconnet666/zui-vue/locale`
 */

// ─── Provider ───
export {
  ZConfigProvider,
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

// ─── Composables ───
export {
  useStyles,
  useDynamicStyles,
  chainOf,
  useVariants,
  useParts,
  useBreakpoints,
  useResponsive,
} from './composables'

// ─── Components ───
export {
  ZIcon,
  type ZIconProps,
} from './components'

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
} from './locale'

// ─── 主题（zui 设计系统） ───
export {
  zuiLight,
  zuiDark,
  type ZuiSchema,
  type SemanticColorTokens,
  // 用户扩展锚点 —— 用户工程 `declare module '@kenconnet666/zui-vue' { interface UserColorExt {...} }`
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
} from './theme'

// ─── Core 全量透传 ───
// 装 `@kenconnet666/zui-vue` 即等于装 core：用户可直接从本包 import 任何 core API，
// 无需再依赖 `@kenconnet666/zui-core`。core 与 ui-vue 自身导出无命名冲突。
export * from '@kenconnet666/zui-core'
