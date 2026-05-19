import { computed, inject, ref, type ComputedRef, type Ref } from 'vue'
import { Z_LOCALE_KEY } from './keys'
import { zhCN } from '../locale/zh-CN'
import type { ZLocale, ZLocaleRegistry } from '../locale/types'

/**
 * `useZLocale()` —— 取当前 ZLocale 全量字典。
 */
export function useZLocale(): Ref<ZLocale>
/**
 * `useZLocale(namespace)` —— 只订阅某个 namespace。
 *
 * @example
 * const t = useZLocale('button')          // ComputedRef<ZLocaleButton>
 * t.value.loading                         // '加载中'
 */
export function useZLocale<NS extends keyof ZLocaleRegistry>(
  namespace: NS,
): ComputedRef<ZLocaleRegistry[NS]>
export function useZLocale<NS extends keyof ZLocaleRegistry>(
  namespace?: NS,
): Ref<ZLocale> | ComputedRef<ZLocaleRegistry[NS]> {
  const injected = inject(Z_LOCALE_KEY, null)
  const source: Ref<ZLocale> = injected ?? ref(zhCN)
  if (namespace === undefined) return source
  return computed(() => source.value[namespace])
}
