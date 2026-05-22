/**
 * `@kenconnet666/zui-vue/provider` —— ZBox(主题/iem/locale 注入器 + 底层 box)+ composables。
 *
 * **BREAKING(v0.x)**:原 `ZConfigProvider` 改名为 `ZBox`,职能扩展为
 * 「注入器 + 底层带 cssRoot 的 box 容器」。语义化 tag 通过 `tag` prop 切换。
 */
export { default as ZBox } from './ZBox.vue'

export {
  Z_THEME_KEY,
  Z_LOCALE_KEY,
  Z_DATE_KEY,
  type ZDateConfig,
} from './keys'

export { useZTheme } from './useZTheme'
export { useZLocale } from './useZLocale'
export { useZDate, type UseZDateReturn } from './useZDate'

export { ZIemPreset, type ZIem } from './units'
