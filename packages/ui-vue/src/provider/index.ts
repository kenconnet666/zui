/**
 * `@kenconnet666/zui-vue/provider` —— ZBox(主题/iem/locale 注入器 + 底层带 css 的 box 容器)。
 *
 * **子目录拆分(2026-05-23)**:
 * - `./theme/`  —— ZuiSchema / zuiLight / zuiDark / useZTheme
 * - `./locale/` —— ZLocale 字典 / useZLocale / mergeLocale
 * - `./date/`   —— useZDate(timezone + date-fns Locale)
 *
 * Provider 根目录保留:`ZBox.vue` / `keys.ts` / `units.ts` / 本 index。
 */

// ─── ZBox 根注入器 ───
export { default as ZBox } from './ZBox.vue'

// ─── Injection keys + ZDateConfig ───
export {
  Z_THEME_KEY,
  Z_LOCALE_KEY,
  Z_DATE_KEY,
  type ZDateConfig,
} from './keys'

// ─── iem 单位预设 ───
export { ZIemPreset, type ZIem } from './units'

// ─── theme / locale / date hooks(在子目录内,经此 re-export) ───
export { useZTheme } from './theme/useZTheme'
export { useZLocale } from './locale/useZLocale'
export { useZDate, type UseZDateReturn } from './date/useZDate'
