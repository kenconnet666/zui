import type { InjectionKey, Ref } from 'vue'
import type { Locale as DateFnsLocale } from 'date-fns'
import type {
  ComponentTokenOverrides,
  ResolvedTheme,
  ThemeSchema,
} from '@kenconnet666/zui-core'
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
 * 之所以全部退化到 `ThemeSchema` 而非保留泛型 `S`：
 * Vue 3 的 `InjectionKey<T>` 不支持泛型 — 必须用具体类型。
 * 子组件 `useZTheme<S>()` 拿到后再 cast 回具体 schema，类型由 ZConfigProvider 内部 generic
 * 保证；运行时一致即可。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Z_THEME_KEY: InjectionKey<Ref<ResolvedTheme<any>>> = Symbol('zui:theme')
export const Z_OVERRIDES_KEY: InjectionKey<Ref<ComponentTokenOverrides>> = Symbol(
  'zui:componentTokens',
)
export const Z_LOCALE_KEY: InjectionKey<Ref<ZLocale>> = Symbol('zui:locale')
export const Z_DATE_KEY: InjectionKey<Ref<ZDateConfig>> = Symbol('zui:date')

/**
 * Dev fallback 标记 —— Provider 未传 theme 且无 parent 时 inject 的 sentinel；
 * 子组件可借此检测是否处在 Provider 之外。
 *
 * 别用 `null`：null 写 Ref 后 `.value` 容易触发空指针；用 sentinel 让类型 narrow 顺畅。
 */
export const Z_NO_PROVIDER_THEME = Symbol('zui:no-provider-theme')

export type ThemeForSchema<S extends ThemeSchema> = ResolvedTheme<S>
