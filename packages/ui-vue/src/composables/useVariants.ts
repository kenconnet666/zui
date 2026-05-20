import { computed, type ComputedRef } from 'vue'
import type { ResolvedTheme, ThemeSchema } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider/useZTheme'

/**
 * `useVariants(factory, props)` —— 包装 `defineVariants` / `defineParts` 工厂的 composable。
 *
 * 期望传入：
 * - `factory(theme)` —— 返回 variants 函数（即 `defineVariants(theme, ...)` 的产物）。
 * - `props` —— 响应式 prop（可计算属性 / reactive object）。
 *
 * 返回 `ComputedRef<string>`（多 slot 用 [[useParts]]）。
 *
 * @example
 * const buttonVariants = (theme: ResolvedTheme<S>) =>
 *   defineVariants(theme, { base: ..., variants: { size: { small: ..., middle: ... } } })
 *
 * const cls = useVariants(buttonVariants, () => ({ size: props.size }))
 *
 * **关键 — 工厂模式而非常量**：core skill §13.4 强调 variants 工厂应"每次主题变化时重建"，
 * 这样 ConfigProvider 嵌套覆盖 theme 时新主题色立即生效，emotion 内部按内容 hash 自动复用 CSS。
 */
export function useVariants<S extends ThemeSchema, P extends Record<string, unknown>>(
  factory: (theme: ResolvedTheme<S>) => (props: P) => string,
  propsGetter: () => P,
): ComputedRef<string> {
  const theme = useZTheme<S>()
  const variants = computed(() => factory(theme.value))
  return computed(() => variants.value(propsGetter()))
}

/**
 * `useParts(factory, props)` —— 多 slot 版本，返回各 slot 的 className map。
 *
 * @example
 * const dialogParts = (theme: ResolvedTheme<S>) =>
 *   defineParts(theme, { slots: ['root', 'header', 'body'], base: { ... }, variants: { ... } })
 *
 * const parts = useParts(dialogParts, () => ({ size: props.size }))
 * // parts.value.root / parts.value.header / parts.value.body
 */
export function useParts<
  S extends ThemeSchema,
  P extends Record<string, unknown>,
  Slot extends string,
>(
  factory: (theme: ResolvedTheme<S>) => Record<Slot, (props: P) => string>,
  propsGetter: () => P,
): ComputedRef<Record<Slot, string>> {
  const theme = useZTheme<S>()
  const parts = computed(() => factory(theme.value))
  return computed(() => {
    const props = propsGetter()
    const result = {} as Record<Slot, string>
    for (const slot in parts.value) {
      result[slot] = parts.value[slot](props)
    }
    return result
  })
}
