import { computed, unref, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import {
  Chain,
  toClassName,
  type ResolvedTheme} from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../theme'
import { useZTheme } from '../provider/useZTheme'

/**
 * `useStyles(factory)` —— 用 inject 进来的当前主题，生成 emotion className 的 ComputedRef。
 *
 * factory 接收 `Chain<ZuiSchema>`，调用者通过 statement-only 方式写样式。
 * 用户工程通过 module augmentation 扩 `ThemeSchema` 即可让 `_brandRoyal` 等扩展
 * token 在 chain 上获得 IDE 补全。
 *
 * @example
 * const cls = useStyles(s => {
 *   s.padding.px(12)
 *   s.color._primary
 *   s._hover(h => { h.backgroundColor._primary.alpha(85) })
 * })
 * // 用法：<div :class="cls">
 *
 * **不要**在 factory 内依赖闭包外的可变 ref —— 那样不会触发重新求值。
 * 需要响应 prop / state 变化时改用 [[useDynamicStyles]]。
 */
export function useStyles(
  factory: (s: Chain<ZuiSchema>) => void,
): ComputedRef<string> {
  const theme = useZTheme()
  return computed(() => {
    const c = new Chain<ZuiSchema>(theme.value)
    factory(c)
    return toClassName(c)
  })
}

/**
 * `useDynamicStyles(factoryGetter)` —— 当 factory 依赖响应式 source 时用本 hook。
 *
 * @example
 * const props = defineProps<{ size: 'small' | 'middle' | 'large' }>()
 * const cls = useDynamicStyles(() => (s) => {
 *   s.fontSize.px(props.size === 'small' ? 12 : props.size === 'middle' ? 14 : 16)
 * })
 */
export function useDynamicStyles(
  factoryGetter: MaybeRefOrGetter<(s: Chain<ZuiSchema>) => void>,
): ComputedRef<string> {
  const theme = useZTheme()
  return computed(() => {
    const factory = typeof factoryGetter === 'function'
      ? (factoryGetter as () => (s: Chain<ZuiSchema>) => void)()
      : unref(factoryGetter)
    const c = new Chain<ZuiSchema>(theme.value)
    factory(c)
    return toClassName(c)
  })
}

/**
 * `chainOf(theme)` —— 创建一个新 Chain，绑定给定 ResolvedTheme。
 *
 * 用于"提前实例化 Chain"再保留引用的场景（少见，多用于 defineVariants 工厂内部）。
 */
export function chainOf(theme: ResolvedTheme<ZuiSchema>): Chain<ZuiSchema> {
  return new Chain<ZuiSchema>(theme)
}
