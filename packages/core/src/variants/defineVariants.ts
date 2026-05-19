/**
 * `defineVariants` — 变体抽象（参考 cva / tv 风格 + 适配 zui-core statement-only chain）。
 *
 * 用户在 component 库里声明 base + variants + defaults + compoundVariants，
 * 返回的函数接受 props 输出 emotion className。
 *
 * @example
 * const button = defineVariants(defaultLight, {
 *   base: s => { s.padding.px(12); s.borderRadius._md },
 *   variants: {
 *     intent: {
 *       primary: s => { s.backgroundColor._primary; s.color.white },
 *       danger:  s => { s.backgroundColor._danger;  s.color.white },
 *     },
 *     size: {
 *       sm: s => { s.padding.px(8) },
 *       md: s => { s.padding.px(12) },
 *     },
 *   },
 *   defaultVariants: { intent: 'primary', size: 'md' },
 *   compoundVariants: [
 *     { when: { intent: 'primary', size: 'sm' }, apply: s => { s.fontSize._xs } },
 *   ],
 * })
 *
 * button({ intent: 'danger', size: 'sm' })   // → className
 * button()                                   // 全 defaults
 */

import { Chain } from '../chain/Chain'
import { Theme } from '../theme/Theme'
import type { ResolvedTheme, ThemeSchema } from '../theme/types'

/** 单个 variant 维度：name → factory。 */
export type VariantOptions<S extends ThemeSchema> = Record<string, (s: Chain<S>) => void>

/** variants 总声明：维度名 → 选项映射。 */
export type VariantMap<S extends ThemeSchema> = Record<string, VariantOptions<S>>

/** 入参 props 类型：每个维度的可选 key（字符串字面量推断）。 */
export type VariantProps<V extends VariantMap<ThemeSchema>> = {
  [K in keyof V]?: keyof V[K] & string
}

/** Compound variant 命中条件 + apply factory。 */
export interface CompoundVariant<S extends ThemeSchema, V extends VariantMap<S>> {
  when: { [K in keyof V]?: keyof V[K] & string }
  apply: (s: Chain<S>) => void
}

/** `defineVariants` 全配置。 */
export interface DefineVariantsConfig<S extends ThemeSchema, V extends VariantMap<S>> {
  /** 所有 variant 共享的基础样式。 */
  base?: (s: Chain<S>) => void
  /** 变体维度声明。 */
  variants: V
  /** 未传 props 时的默认值。 */
  defaultVariants?: { [K in keyof V]?: keyof V[K] & string }
  /** 多变体组合时的额外样式（命中所有 when 字段才 apply）。 */
  compoundVariants?: Array<CompoundVariant<S, V>>
}

/**
 * 把变体配置编译成 (props) => className 的工厂函数。
 *
 * 内部用 `icss(theme, ...)` 调度 chain，相同 props 输入命中缓存避免重复 chain 与
 * emotion serialize。
 */
export function defineVariants<S extends ThemeSchema, V extends VariantMap<S>>(
  theme: ResolvedTheme<S> | Theme<S>,
  config: DefineVariantsConfig<S, V>,
): (props?: VariantProps<V>) => string {
  // className 缓存：key 是 resolved props 的 stable JSON
  const cache = new Map<string, string>()

  return function variantsFn(props): string {
    const resolved = resolvePropsWithDefaults(props, config.defaultVariants)
    const cacheKey = stableKey(resolved)
    const cached = cache.get(cacheKey)
    if (cached !== undefined) return cached

    // 用 icss 跑完整 chain（base → variants → compoundVariants）
    const chain = new Chain<S>(theme as ResolvedTheme<S> | Theme<S>)

    // ① base
    config.base?.(chain)

    // ② variants（按 resolved 中存在的 key 来应用，顺序与 variants 声明无关）
    for (const variantName of Object.keys(resolved)) {
      const variantValue = resolved[variantName]
      if (variantValue == null) continue
      const variantFn = config.variants[variantName]?.[variantValue]
      variantFn?.(chain)
    }

    // ③ compoundVariants（按声明顺序，命中即 apply）
    if (config.compoundVariants) {
      for (const compound of config.compoundVariants) {
        if (matchesAll(resolved, compound.when as Record<string, string>)) {
          compound.apply(chain)
        }
      }
    }

    const className = chain.toString()
    cache.set(cacheKey, className)
    return className
  }
}

/**
 * 合并 `defaults` 与 `props`，props 中明确赋值的覆盖 defaults。
 * `null` / `undefined` 不算 props（沿用 defaults）。
 */
function resolvePropsWithDefaults(
  props: Record<string, string | undefined> | undefined,
  defaults: Record<string, string | undefined> | undefined,
): Record<string, string> {
  const out: Record<string, string> = {}
  if (defaults) {
    for (const [k, v] of Object.entries(defaults)) {
      if (v != null) out[k] = v
    }
  }
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v != null) out[k] = v
    }
  }
  return out
}

/** 命中所有 `when` 字段才返回 true（部分匹配不算）。 */
function matchesAll(
  resolved: Record<string, string>,
  when: Record<string, string>,
): boolean {
  for (const [k, v] of Object.entries(when)) {
    if (resolved[k] !== v) return false
  }
  return true
}

/**
 * 把 resolved props 生成稳定的 cache key。
 * key 按 alphabet 排序，避免 `{ a, b }` 与 `{ b, a }` 不同。
 */
function stableKey(resolved: Record<string, string>): string {
  const entries = Object.entries(resolved).sort(([a], [b]) => a.localeCompare(b))
  return JSON.stringify(entries)
}
