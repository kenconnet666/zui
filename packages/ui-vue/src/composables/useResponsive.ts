import { computed, type ComputedRef } from 'vue'
import {
  isResponsiveValue,
  type ResponsiveValue,
  type ThemeSchema,
} from '@kenconnet666/zui-core'
import { useZTheme } from '../provider/useZTheme'

/**
 * `useBreakpoints()` —— 从当前 theme 派生出断点 keys 数组（去掉 `base`，因为 `base` 是常量）。
 *
 * 给组件库 prop 解析用：传给 `isResponsiveValue(value, breakpoints)` 启用**严格模式**。
 */
export function useBreakpoints<S extends ThemeSchema = ThemeSchema>(): ComputedRef<string[]> {
  const theme = useZTheme<S>()
  return computed(() => {
    const slot = (theme.value as unknown as { breakpoint?: Record<string, unknown> }).breakpoint
    return slot ? Object.keys(slot) : []
  })
}

/**
 * `useResponsive(value)` —— 把 `T | { base?: T; <bp>?: T }` 归一化为
 * `{ base?: T; <bp>?: T }`（始终对象形式）。
 *
 * 内部走 `isResponsiveValue` 严格模式（用 theme.breakpoint 派生的 breakpoints 列表）。
 *
 * @example
 * const padding = useResponsive(() => props.padding)   // → { base, md, lg, ... } | undefined
 */
export function useResponsive<T, S extends ThemeSchema = ThemeSchema>(
  valueGetter: () => ResponsiveValue<T> | undefined,
): ComputedRef<{ base?: T; [bp: string]: T | undefined } | undefined> {
  const breakpoints = useBreakpoints<S>()
  return computed(() => {
    const v = valueGetter()
    if (v === undefined) return undefined
    if (isResponsiveValue<T>(v, breakpoints.value)) {
      return v as { base?: T; [bp: string]: T | undefined }
    }
    return { base: v as T }
  })
}
