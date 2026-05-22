import type { InjectionKey, Ref } from 'vue'
import type { Locale as DateFnsLocale } from 'date-fns'
import type { ResolvedTheme } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../theme'
import type { ZLocale } from '../locale/types'

/**
 * `ZDateConfig` —— Provider 注入的日期 / 时区配置。
 *
 * - `timezone`：IANA 时区字符串（如 `'Asia/Shanghai'` / `'UTC'`），由 date-fns-tz 解析。
 * - `locale`：date-fns Locale 对象，用于 format/parse 时显示本地化字段（星期、月份名等）。
 *
 * timezone 与 dateLocale 分离 —— 用户可在 zh-CN 文本环境下展示日本时区时间。
 */
export interface ZDateConfig {
  timezone: string
  locale: DateFnsLocale | undefined
}

/**
 * Provider 注入 key（symbol 避免与用户自定义冲突）。
 *
 * `Z_THEME_KEY` 退化到 `ResolvedTheme<ZuiSchema>` —— zui-vue 内部组件直接享受
 * 11 个语义色 + 5 阶 scale + UI 角色 zIndex 的 token 补全。用户工程要扩 brand 自家 schema：
 * `interface MySchema extends ZuiSchema { ... }`，在调用处 cast `Ref<ResolvedTheme<MySchema>>`。
 */
export const Z_THEME_KEY: InjectionKey<Ref<ResolvedTheme<ZuiSchema>>> = Symbol('zui:theme')
export const Z_LOCALE_KEY: InjectionKey<Ref<ZLocale>> = Symbol('zui:locale')
export const Z_DATE_KEY: InjectionKey<Ref<ZDateConfig>> = Symbol('zui:date')

/**
 * Dev fallback 标记 —— Provider 未传 theme 且无 parent 时 inject 的 sentinel；
 * 子组件可借此检测是否处在 Provider 之外。
 *
 * 别用 `null`：null 写 Ref 后 `.value` 容易触发空指针；用 sentinel 让类型 narrow 顺畅。
 */
export const Z_NO_PROVIDER_THEME = Symbol('zui:no-provider-theme')
