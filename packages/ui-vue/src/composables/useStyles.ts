import { computed, unref, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import {
  Chain,
  toClassName,
  type ResolvedTheme,
  type ThemeSchema,
} from '@kenconnet666/zui-core'
import { useZTheme } from '../provider/useZTheme'

/**
 * `useStyles(factory)` —— 用 inject 进来的当前主题，生成 emotion className 的 ComputedRef。
 *
 * factory 接收 `Chain<S>`，调用者通过 statement-only 方式写样式。
 *
 * @example
 * const cls = useStyles<MySchema>(s => {
 *   s.padding.px(12)
 *   s.color._primary
 *   s._hover(h => { h.backgroundColor._primary.alpha(85) })
 * })
 * // 用法：<div :class="cls">
 *
 * **不要**在 factory 内依赖闭包外的可变 ref —— 那样不会触发重新求值。
 * 需要响应 prop / state 变化时改用 [[useDynamicStyles]]。
 */
export function useStyles<S extends ThemeSchema = ThemeSchema>(
  factory: (s: Chain<S>) => void,
): ComputedRef<string> {
  const theme = useZTheme<S>()
  return computed(() => {
    const c = new Chain<S>(theme.value)
    factory(c)
    return toClassName(c)
  })
}

/**
 * `useDynamicStyles(factoryGetter)` —— 当 factory 依赖响应式 source 时用本 hook。
 *
 * @example
 * const props = defineProps<{ size: 'small' | 'middle' | 'large' }>()
 * const cls = useDynamicStyles<MySchema>(() => (s) => {
 *   s.fontSize.px(props.size === 'small' ? 12 : props.size === 'middle' ? 14 : 16)
 * })
 */
export function useDynamicStyles<S extends ThemeSchema = ThemeSchema>(
  factoryGetter: MaybeRefOrGetter<(s: Chain<S>) => void>,
): ComputedRef<string> {
  const theme = useZTheme<S>()
  return computed(() => {
    const factory = typeof factoryGetter === 'function'
      ? (factoryGetter as () => (s: Chain<S>) => void)()
      : unref(factoryGetter)
    const c = new Chain<S>(theme.value)
    factory(c)
    return toClassName(c)
  })
}

/**
 * `chainOf(theme)` —— 创建一个新 Chain，绑定给定 ResolvedTheme。
 *
 * 用于"提前实例化 Chain"再保留引用的场景（少见，多用于 defineVariants 工厂内部）。
 */
export function chainOf<S extends ThemeSchema>(theme: ResolvedTheme<S>): Chain<S> {
  return new Chain<S>(theme)
}
