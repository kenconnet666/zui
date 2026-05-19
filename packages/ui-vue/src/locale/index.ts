/**
 * `@kenconnet666/zui-vue/locale` —— 内建 locale 字典 + 合并工具。
 */
export type {
  ZLocale,
  ZLocalePartial,
  ZLocaleRegistry,
  ZLocaleCommon,
  ZLocaleButton,
  ZLocaleInput,
  ZLocaleSelect,
  ZLocaleDialog,
  ZLocalePagination,
  ZLocaleForm,
  ZLocaleDatePicker,
  DeepPartialLocale,
} from './types'

export { zhCN } from './zh-CN'
export { enUS } from './en-US'
export { mergeLocale } from './merge'
