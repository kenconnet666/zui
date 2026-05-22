/**
 * `ZLocale` —— ui-vue locale 字典契约。
 *
 * 设计原则：
 * - 扁平 namespace（一级 component name），二级 key（具体文案）。
 * - 不接入 vue-i18n，避免强依赖；用户可在外层包 vue-i18n 把翻译后字符串塞进来。
 * - 用户自定义组件可通过 declaration merging 扩展自己的 namespace：
 *
 *   ```ts
 *   declare module '@kenconnet666/zui-vue' {
 *     interface ZLocaleRegistry {
 *       myCustom: { hello: string }
 *     }
 *   }
 *   ```
 */

/**
 * 公共词条（跨组件复用）。
 */
export interface ZLocaleCommon {
  ok: string
  cancel: string
  confirm: string
  close: string
  clear: string
  reset: string
  search: string
  loading: string
  noData: string
  empty: string
  prev: string
  next: string
  back: string
  more: string
  retry: string
}

export interface ZLocaleButton {
  loading: string
}

export interface ZLocaleInput {
  placeholder: string
  clear: string
}

export interface ZLocaleSelect {
  placeholder: string
  noOptions: string
}

export interface ZLocaleDialog {
  title: string
  ok: string
  cancel: string
}

export interface ZLocalePagination {
  prev: string
  next: string
  page: string
  of: string
  total: string
  jumpTo: string
  goto: string
  pageSize: string
}

export interface ZLocaleForm {
  required: string
  invalid: string
}

export interface ZLocaleDatePicker {
  placeholder: string
  today: string
  now: string
  clear: string
  confirm: string
  weekdaysShort: readonly [string, string, string, string, string, string, string]
  monthsShort: readonly [
    string, string, string, string, string, string,
    string, string, string, string, string, string,
  ]
  months: readonly [
    string, string, string, string, string, string,
    string, string, string, string, string, string,
  ]
}

/**
 * `ZLocaleRegistry` 用 declaration merging 让用户自定义组件扩展自己的 locale namespace。
 * 内建 namespace 必须保留。
 */
export interface ZLocaleRegistry {
  common: ZLocaleCommon
  button: ZLocaleButton
  input: ZLocaleInput
  select: ZLocaleSelect
  dialog: ZLocaleDialog
  pagination: ZLocalePagination
  form: ZLocaleForm
  datePicker: ZLocaleDatePicker
}

/**
 * 完整 locale 对象。
 * `name` 用于调试与缓存 key；保持唯一（IETF BCP47 风格如 'zh-CN' / 'en-US'）。
 */
export interface ZLocale extends ZLocaleRegistry {
  name: string
}

/**
 * `DeepPartialLocale<T>` —— 嵌套 Provider 覆盖时允许只传部分字段。
 */
export type DeepPartialLocale<T> = {
  [K in keyof T]?: T[K] extends ReadonlyArray<unknown>
    ? T[K]
    : T[K] extends object
      ? DeepPartialLocale<T[K]>
      : T[K]
}

export type ZLocalePartial = DeepPartialLocale<ZLocale>
