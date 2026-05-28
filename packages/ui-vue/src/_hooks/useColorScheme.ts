/**
 * `useColorScheme` —— 颜色模式切换 + 持久化 + OS 偏好监听。
 *
 * **薄包装** `@vueuse/core` 的 `useColorMode` + `usePreferredDark`,提供 zui-vue
 * 风格的三态偏好(`'light' | 'dark' | 'system'`)+ 解析后的实际生效色调(`active`)。
 *
 * **行为**:
 * 1. 偏好持久化到 `localStorage`(key 默认 `'zui-color-scheme'`)
 * 2. 写 `<html data-theme="light|dark">`(attribute 名可定制;给 shiki、CSS 等用)
 * 3. `'system'` 时跟随 `prefers-color-scheme: dark` media query,OS 主题切换自动响应
 * 4. SSR 安全(VueUse 内部已防御 `window` undefined)
 */
import { computed, type ComputedRef, type WritableComputedRef } from 'vue'
import { useColorMode, usePreferredDark } from '@vueuse/core'

/** 用户偏好三态。`'system'` = 跟随 OS。 */
export type ColorScheme = 'light' | 'dark' | 'system'

export interface UseColorSchemeOptions {
  /** localStorage key。默认 `'zui-color-scheme'`。 */
  storageKey?: string
  /** 写到 `<html>` 的属性名。默认 `'data-theme'`。 */
  attribute?: string
  /** 首次访问默认值。默认 `'system'`。 */
  initialValue?: ColorScheme
}

export interface UseColorSchemeReturn {
  /** 用户偏好(读 + 写;写会自动持久化 + 应用)。 */
  preference: WritableComputedRef<ColorScheme>
  /** 实际生效色调(已 resolve `'system'` 到 `'light' | 'dark'`)。 */
  active: ComputedRef<'light' | 'dark'>
  /** 设置偏好。 */
  set: (s: ColorScheme) => void
  /** 在 light ↔ dark 之间切换。 */
  toggle: () => void
}

export function useColorScheme(opts: UseColorSchemeOptions = {}): UseColorSchemeReturn {
  const mode = useColorMode({
    storageKey: opts.storageKey ?? 'zui-color-scheme',
    attribute: opts.attribute ?? 'data-theme',
    selector: 'html',
    modes: { light: 'light', dark: 'dark' },
    initialValue: opts.initialValue === 'system' ? 'auto' : (opts.initialValue ?? 'auto'),
    emitAuto: true,
  })

  const preferredDark = usePreferredDark()

  const preference = computed<ColorScheme>({
    get: () => (mode.value === 'auto' ? 'system' : (mode.value as 'light' | 'dark')),
    set: v => {
      mode.value = v === 'system' ? 'auto' : v
    },
  })

  const active = computed<'light' | 'dark'>(() => {
    if (mode.value === 'auto') return preferredDark.value ? 'dark' : 'light'
    return mode.value as 'light' | 'dark'
  })

  function set(s: ColorScheme): void {
    preference.value = s
  }

  function toggle(): void {
    set(active.value === 'dark' ? 'light' : 'dark')
  }

  return { preference, active, set, toggle }
}
