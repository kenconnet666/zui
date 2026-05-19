import { computed, inject, ref, type ComputedRef } from 'vue'
import type { Locale as DateFnsLocale } from 'date-fns'
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz'
import { Z_DATE_KEY, type ZDateConfig } from './keys'

/**
 * `useZDate()` —— Provider 注入的时区 + locale 配置 + 常用日期操作。
 *
 * 返回对象方法（非 ComputedRef），调用时再读 ref（保证响应式跟 Provider 切换同步）。
 *
 * - `format(date, fmt)`：按当前时区 + locale 格式化，等价 `formatInTimeZone(date, tz, fmt, { locale })`。
 * - `toZoned(date)`：UTC → 当前时区（返回的 Date 各字段是本地化值）。
 * - `fromZoned(date)`：当前时区"本地化字段值"→ UTC。
 *
 * @example
 * const d = useZDate()
 * d.format(new Date(), 'yyyy-MM-dd HH:mm:ss')   // → '2026-05-19 14:30:00'
 * d.format(Date.now(), 'PPpp')
 */
export interface UseZDateReturn {
  timezone: ComputedRef<string>
  locale: ComputedRef<DateFnsLocale | undefined>
  format: (date: Date | number | string, fmt: string) => string
  toZoned: (date: Date | number | string) => Date
  fromZoned: (date: Date | number | string) => Date
}

export function useZDate(): UseZDateReturn {
  const injected = inject(Z_DATE_KEY, null)
  const cfg = injected ?? ref<ZDateConfig>({ timezone: 'UTC', locale: undefined })

  const timezone = computed(() => cfg.value.timezone)
  const locale = computed(() => cfg.value.locale)

  return {
    timezone,
    locale,
    format(date, fmt) {
      const opts = cfg.value.locale ? { locale: cfg.value.locale } : undefined
      return formatInTimeZone(date, cfg.value.timezone, fmt, opts)
    },
    toZoned(date) {
      return toZonedTime(date, cfg.value.timezone)
    },
    fromZoned(date) {
      return fromZonedTime(date, cfg.value.timezone)
    },
  }
}
