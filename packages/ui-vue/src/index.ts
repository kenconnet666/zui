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
  Z_OVERRIDES_KEY,
  Z_LOCALE_KEY,
  Z_DATE_KEY,
  useZTheme,
  useZComponentTokens,
  useZComponentTokenSlice,
  useZLocale,
  useZDate,
  type ZDateConfig,
  type UseZDateReturn,
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
  createIconVariants,
  deriveIconTokens,
  iconTokenDerivers,
  type ZIconTokens,
  type ZIconProps,
  type ZIconSize,
  type ZIconColor,
  type ZIconDepth,
  type ZIconSpin,
  type ZIconSpinPreset,
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

// ─── Core re-export（便利） ───
export {
  Theme,
  Chain,
  icss,
  toClassName,
  mergeTheme,
  resolveTheme,
  defaultLight,
  defaultDark,
} from '@kenconnet666/zui-core'

export type {
  ThemeSchema,
  ResolvedTheme,
  DeepPartial,
  ComponentTokenOverrides,
} from '@kenconnet666/zui-core'
