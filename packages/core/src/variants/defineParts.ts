/**
 * `defineParts` — 多 slot variants（参考 tailwind-variants 的 `slots` API）。
 *
 * 组件库的 Dialog / Select / Tabs / Menu 等有多个内部元素（part），每个 part
 * 要独立 className 但共享 variants（size / intent / state）。本工厂让作者
 * 声明式定义多 part：
 *
 * @example
 * const dialog = defineParts(theme, {
 *   slots: ['root', 'overlay', 'content', 'title'] as const,
 *   base: {
 *     root: s => { s.position.fixed; s.inset(0); s.zIndex._modal },
 *     overlay: s => { s.position.fixed; s.inset(0); s.backgroundColor._black.alpha(50) },
 *     content: s => { s.position.fixed; s.borderRadius._lg; s.padding._lg },
 *     title: s => { s.fontWeight._huge; s.fontSize._huge },
 *   },
 *   variants: {
 *     size: {
 *       sm: { content: s => { s.maxWidth.px(400) } },
 *       md: { content: s => { s.maxWidth.px(600) } },
 *       lg: { content: s => { s.maxWidth.px(900) } },
 *     },
 *   },
 *   defaultVariants: { size: 'md' },
 * })
 *
 * // 用：
 * dialog.root()                    // root className (用 default size)
 * dialog.content({ size: 'lg' })   // content className
 * dialog.title()                   // title className
 *
 * // 类型推断：
 * type DialogProps = VariantPropsOfParts<typeof dialog>
 * // = { size?: 'sm' | 'md' | 'lg' }
 */

import { Chain } from '../chain/Chain'
import { Theme } from '../theme/Theme'
import type { ResolvedTheme, ThemeSchema } from '../theme/types'

/** Slot 内的 factory：接受 chain，写入样式。 */
export type SlotFactory<S extends ThemeSchema> = (s: Chain<S>) => void

/** 每个 part 的全部 slot factory（Partial：未声明的 slot 用空 factory）。 */
export type PartsBase<S extends ThemeSchema, Slot extends string> = {
  [K in Slot]?: SlotFactory<S>
}

/** 单个 variant value 下，所有 slot 的 factory（Partial：未声明的 slot 留空）。 */
export type PartsVariantValue<S extends ThemeSchema, Slot extends string> = {
  [K in Slot]?: SlotFactory<S>
}

/** Parts 变体声明：每个维度 → 每个选项 → 每个 slot 的 factory。 */
export type PartsVariantMap<S extends ThemeSchema, Slot extends string> = Record<
  string,
  Record<string, PartsVariantValue<S, Slot>>
>

/** Parts compound variant：当 when 全匹配时，apply 各 slot 的 factory。 */
export interface PartsCompoundVariant<
  S extends ThemeSchema,
  Slot extends string,
  V extends PartsVariantMap<S, Slot>,
> {
  when: { [K in keyof V]?: keyof V[K] & string }
  apply: PartsVariantValue<S, Slot>
}

/** `defineParts` 全配置。 */
export interface DefinePartsConfig<
  S extends ThemeSchema,
  Slot extends string,
  V extends PartsVariantMap<S, Slot>,
> {
  /** slot 名称列表（必填，用作运行时遍历 + 类型推断锚点）。 */
  slots: readonly Slot[]
  /** 各 slot 的基础样式。 */
  base?: PartsBase<S, Slot>
  /** 变体维度声明。每个 variant value 下分别声明各 slot 的 factory。 */
  variants?: V
  /** 未传 props 时的默认值。 */
  defaultVariants?: { [K in keyof V]?: keyof V[K] & string }
  /** 多 variant 组合时的额外样式。 */
  compoundVariants?: Array<PartsCompoundVariant<S, Slot, V>>
  /** className 缓存上限（per slot）。 */
  cacheLimit?: number
}

/**
 * 单个 slot 的工厂函数。约束放宽到 `Record<string, Record<string, unknown>>`
 * 避免 ThemeSchema 协变冲突（exactOptionalPropertyTypes 严格模式）。
 */
export type PartFactory<V extends Record<string, Record<string, unknown>>> =
  (props?: { [K in keyof V]?: keyof V[K] & string }) => string

/** `defineParts` 返回值：每个 slot 名 → 该 slot 的工厂函数。 */
export type PartsResult<
  Slot extends string,
  V extends Record<string, Record<string, unknown>>,
> = {
  [K in Slot]: PartFactory<V>
}

/**
 * 从 `defineParts` 返回值推 props 类型。
 *
 * @example
 * const dialog = defineParts(theme, { slots: ['root'], variants: { size: { sm: ..., lg: ... } } })
 * type DialogProps = VariantPropsOfParts<typeof dialog>
 * // = { size?: 'sm' | 'lg' }
 */
export type VariantPropsOfParts<P> =
  P extends { [k: string]: (props?: infer Props) => string }
    ? NonNullable<Props>
    : P extends Record<string, (props?: infer Props) => string>
      ? NonNullable<Props>
      : never

/**
 * 把 parts 配置编译成 `{ slot1: factory, slot2: factory, ... }`。
 *
 * 内部为每个 slot 单独跑 `icss` 并独立缓存 className（按 slot × props 缓存）。
 */
export function defineParts<
  S extends ThemeSchema,
  Slot extends string,
  V extends PartsVariantMap<S, Slot>,
>(
  theme: ResolvedTheme<S> | Theme<S>,
  config: DefinePartsConfig<S, Slot, V>,
): PartsResult<Slot, V> {
  const result = {} as PartsResult<Slot, V>
  const cacheLimit = config.cacheLimit ?? 256

  for (const slot of config.slots) {
    // 每个 slot 一个 LRU cache（key = props 的 stable JSON）
    const cache = new Map<string, string>()
    const slotFactory: PartFactory<V> = (props): string => {
      const resolved = resolveProps(props as Record<string, string | undefined> | undefined, config.defaultVariants as Record<string, string | undefined> | undefined)
      const cacheKey = stableKey(resolved)
      const cached = cache.get(cacheKey)
      if (cached !== undefined) {
        cache.delete(cacheKey)
        cache.set(cacheKey, cached)
        return cached
      }

      const chain = new Chain<S>(theme as ResolvedTheme<S> | Theme<S>)

      // ① 该 slot 的 base
      config.base?.[slot]?.(chain)

      // ② 该 slot 在各 variants 命中下的 factory
      for (const variantName of Object.keys(resolved)) {
        const variantValue = resolved[variantName]
        if (variantValue == null) continue
        const variantMap = config.variants?.[variantName as keyof V]
        const slotFactoryInVariant = variantMap?.[variantValue]?.[slot]
        slotFactoryInVariant?.(chain)
      }

      // ③ compoundVariants 命中的 slot factory
      if (config.compoundVariants) {
        for (const compound of config.compoundVariants) {
          if (matchesAll(resolved, compound.when as Record<string, string>)) {
            compound.apply[slot]?.(chain)
          }
        }
      }

      const className = chain.toString()
      cache.set(cacheKey, className)
      if (cache.size > cacheLimit) {
        const oldest = cache.keys().next().value
        if (oldest !== undefined) cache.delete(oldest)
      }
      return className
    }
    result[slot] = slotFactory
  }

  return result
}

function resolveProps(
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

function matchesAll(resolved: Record<string, string>, when: Record<string, string>): boolean {
  for (const [k, v] of Object.entries(when)) {
    if (resolved[k] !== v) return false
  }
  return true
}

function stableKey(resolved: Record<string, string>): string {
  const entries = Object.entries(resolved).sort(([a], [b]) => a.localeCompare(b))
  return JSON.stringify(entries)
}

/**
 * `extendParts` — `defineParts` 版的继承（与 `extendVariants` 对偶）。
 *
 * 复用 parent 的全 slot 工厂，并把 childConfig 在同 slot 上合并：先跑 parent，再跑
 * child（与 `extendVariants` / `composeVariants` 一致：后者通过 chain mutation 覆盖前者）。
 *
 * **同 key 覆盖**：parent 的 `size.sm` 与 child 的 `size.sm` 同时存在时，child 后跑覆盖前者。
 * **新 slot / 新 variant**：child 可以补 parent 未声明的 variant 维度；slot 列表沿用 parent。
 *
 * @example
 * const dialog = defineParts(theme, {
 *   slots: ['root', 'content'] as const,
 *   base: { content: s => { s.padding._md } },
 *   variants: { size: { sm: { content: ... }, lg: { content: ... } } },
 * })
 *
 * const compactDialog = extendParts(theme, dialog, {
 *   base: { content: s => { s.padding._sm } },
 *   variants: { size: { md: { content: s => { s.maxWidth.px(500) } } } },
 * })
 */
export function extendParts<
  S extends ThemeSchema,
  Slot extends string,
  V1 extends Record<string, Record<string, unknown>>,
  V2 extends PartsVariantMap<S, Slot>,
>(
  theme: ResolvedTheme<S> | Theme<S>,
  parent: PartsResult<Slot, V1>,
  childConfig: Partial<Omit<DefinePartsConfig<S, Slot, V2>, 'slots'>> & {
    slots?: readonly Slot[]
  },
): PartsResult<Slot, V1 & V2> {
  const slots = childConfig.slots ?? (Object.keys(parent) as unknown as readonly Slot[])
  const child = defineParts<S, Slot, V2>(theme, {
    slots,
    ...(childConfig.base !== undefined ? { base: childConfig.base } : {}),
    variants: (childConfig.variants ?? ({} as V2)),
    ...(childConfig.defaultVariants !== undefined
      ? { defaultVariants: childConfig.defaultVariants }
      : {}),
    ...(childConfig.compoundVariants !== undefined
      ? { compoundVariants: childConfig.compoundVariants }
      : {}),
    ...(childConfig.cacheLimit !== undefined ? { cacheLimit: childConfig.cacheLimit } : {}),
  })

  const out = {} as PartsResult<Slot, V1 & V2>
  for (const slot of slots) {
    const parentFactory = parent[slot]
    const childFactory = child[slot]
    const composed: PartFactory<V1 & V2> = (props =>
      joinCls(
        parentFactory(props as never),
        childFactory(props as never),
      )) as PartFactory<V1 & V2>
    out[slot] = composed
  }
  return out
}

function joinCls(a: string, b: string): string {
  if (!a) return b
  if (!b) return a
  return `${a} ${b}`
}
