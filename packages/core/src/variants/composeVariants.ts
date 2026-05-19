import type { Chain } from '../chain/Chain'
import type { ThemeSchema } from '../theme/types'
import type { ResolvedTheme } from '../theme/types'
import { Theme } from '../theme/Theme'
import { defineVariants, type DefineVariantsConfig, type VariantMap, type VariantProps } from './defineVariants'

/**
 * `VariantPropsOf<typeof factory>` — 从 `defineVariants` / `composeVariants` 返回的工厂函数推 props 类型。
 *
 * @example
 * const button = defineVariants(theme, {
 *   variants: {
 *     intent: { primary: ..., danger: ... },
 *     size: { sm: ..., lg: ... },
 *   },
 * })
 *
 * type ButtonProps = VariantPropsOf<typeof button>
 * // = { intent?: 'primary' | 'danger'; size?: 'sm' | 'lg' } | undefined
 *
 * function Button(props: ButtonProps & { children: React.ReactNode }) {
 *   const cls = button(props)
 *   ...
 * }
 */
export type VariantPropsOf<F> = F extends (props?: infer P) => string ? P : never

/**
 * 把多个 variants 工厂合并成一个。后传入的 variants 覆盖前者同 key 维度；
 * 每次调用合并产物时，**所有源工厂依次跑**，className 拼接（emotion cx 风格）。
 *
 * @example
 * const interactive = defineVariants(theme, {
 *   variants: {
 *     state: {
 *       idle: () => {},
 *       loading: s => { s.opacity._large; s.pointerEvents('none') },
 *       disabled: s => { s.opacity._middle },
 *     },
 *   },
 * })
 *
 * const buttonCore = defineVariants(theme, {
 *   base: s => { s.padding.px(12); s.borderRadius._md },
 *   variants: {
 *     intent: { primary: ..., danger: ... },
 *     size: { sm: ..., lg: ... },
 *   },
 * })
 *
 * const button = composeVariants(interactive, buttonCore)
 * button({ intent: 'danger', size: 'sm', state: 'loading' })
 * //   ^ 三个 variant 同时生效
 *
 * type ButtonProps = VariantPropsOf<typeof button>
 * // = { state?: 'idle'|'loading'|'disabled'; intent?: 'primary'|'danger'; size?: 'sm'|'lg' }
 */
export function composeVariants<
  F1 extends (props?: Record<string, string | undefined>) => string,
  F2 extends (props?: Record<string, string | undefined>) => string,
>(
  f1: F1,
  f2: F2,
): (props?: VariantPropsOf<F1> & VariantPropsOf<F2>) => string
export function composeVariants<
  F1 extends (props?: Record<string, string | undefined>) => string,
  F2 extends (props?: Record<string, string | undefined>) => string,
  F3 extends (props?: Record<string, string | undefined>) => string,
>(
  f1: F1,
  f2: F2,
  f3: F3,
): (props?: VariantPropsOf<F1> & VariantPropsOf<F2> & VariantPropsOf<F3>) => string
export function composeVariants<
  F1 extends (props?: Record<string, string | undefined>) => string,
  F2 extends (props?: Record<string, string | undefined>) => string,
  F3 extends (props?: Record<string, string | undefined>) => string,
  F4 extends (props?: Record<string, string | undefined>) => string,
>(
  f1: F1,
  f2: F2,
  f3: F3,
  f4: F4,
): (props?: VariantPropsOf<F1> & VariantPropsOf<F2> & VariantPropsOf<F3> & VariantPropsOf<F4>) => string
export function composeVariants(
  ...factories: Array<(props?: Record<string, string | undefined>) => string>
): (props?: Record<string, string | undefined>) => string {
  return function composed(props): string {
    // 每个 factory 独立跑，className 拼接（空格分隔）
    return factories
      .map(f => f(props ?? {}))
      .filter(Boolean)
      .join(' ')
  }
}

/**
 * `extends` 风格的 variants 继承：复用 parent 的 base / variants / compounds，
 * 然后 child 覆盖 base 或追加 variants。
 *
 * **同 key 覆盖**：parent 的 `intent.primary` 与 child 的 `intent.primary` 同时存在时，
 * child 后跑覆盖前者（用 chain 的 mutation 语义）。
 *
 * **新 key 追加**：child 加 `intent.ghost`，parent 没有的 key 会出现在合并产物里。
 *
 * @example
 * const button = defineVariants(theme, {
 *   base: s => { s.padding.px(12) },
 *   variants: { intent: { primary: ..., danger: ... } },
 * })
 *
 * const outlineButton = extendVariants(theme, button, {
 *   base: s => { s.borderWidth.px(1); s.backgroundColor.transparent },  // 追加 base
 *   variants: {
 *     intent: {
 *       primary: s => { s.borderColor._primary; s.color._primary },  // 覆盖 primary
 *     },
 *   },
 * })
 */
export function extendVariants<
  S extends ThemeSchema,
  V1 extends VariantMap<S>,
  V2 extends VariantMap<S>,
>(
  theme: ResolvedTheme<S> | Theme<S>,
  parent: (props?: VariantProps<V1>) => string,
  childConfig: Partial<DefineVariantsConfig<S, V2>>,
): (props?: VariantProps<V1> & VariantProps<V2>) => string {
  // 把 parent + childConfig.base 串成一个 base
  const mergedConfig: DefineVariantsConfig<S, V2> = {
    base: (s: Chain<S>) => {
      // parent 先跑（通过调用 parent({}) 不能拿样式，要用 base 函数）
      // 简化：让 child 的 base 直接跑（parent 通过 composeVariants 串）
      childConfig.base?.(s)
    },
    variants: (childConfig.variants ?? {} as V2),
    ...(childConfig.defaultVariants !== undefined
      ? { defaultVariants: childConfig.defaultVariants }
      : {}),
    ...(childConfig.compoundVariants !== undefined
      ? { compoundVariants: childConfig.compoundVariants }
      : {}),
    ...(childConfig.cacheLimit !== undefined
      ? { cacheLimit: childConfig.cacheLimit }
      : {}),
  }
  const child = defineVariants(theme, mergedConfig)
  // 用 composeVariants 让 parent 先跑、child 后跑（child 的 mutation 覆盖前者）
  return composeVariants(parent, child) as unknown as (
    props?: VariantProps<V1> & VariantProps<V2>,
  ) => string
}
