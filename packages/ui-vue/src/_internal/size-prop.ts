/**
 * size prop 形态:**纯 chain factory**(2026-05-23 撤销 Size5 union)。
 *
 * **设计哲学**:
 * - 用户接口只接 factory:`((c: Chain) => void) | undefined`
 * - 组件 default 提供一个 factory(等价旧 'middle' 档位)
 * - schema sizes token 仍可访问:`(w) => w._middle` 走 schema sizes.middle
 * - 组件内部档位走 makeSizeMap 提供 5 阶 fallback,只在 default factory 中使用
 *
 * 决策文档:`.claude/decisions/2026-05-23-prop-shape-pure-factory.md`
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

// ════════════════════════════════════════════════════════════════════════
// 类型
// ════════════════════════════════════════════════════════════════════════

/** 5 阶 size 枚举档位通用类型 —— **仅用于组件内部 SIZE_MAP**,不暴露给用户 props。 */
export type Size5 = 'tiny' | 'small' | 'middle' | 'large' | 'huge'

/**
 * 单 carrier 维度 size prop 类型 helper(纯 factory)。
 *
 * 用于 ZIcon / ZAvatar 等"size 只影响一个 CSS 属性"的场景。
 *
 * @example
 * size?: SizeProp<'width'>  // ((w: Chain<ZuiSchema>['width']) => void) | undefined
 */
export type SizeProp<K extends keyof Chain<ZuiSchema>> =
  | ((c: Chain<ZuiSchema>[K]) => void)
  | undefined

/**
 * 多 carrier 维度 size prop 类型 helper(纯 factory)。
 *
 * 用于 ZInput / ZButton / ZSelect 等"size 同时影响多个 CSS 属性"的场景。
 * factory 接整个 `Chain<ZuiSchema>`,用户可在 callback 内多行 setter。
 *
 * @example
 * size?: SizePropMulti
 * // ((s: Chain<ZuiSchema>) => void) | undefined
 */
export type SizePropMulti = ((s: Chain<ZuiSchema>) => void) | undefined

/** 5 阶 size 档位 → factory 的映射表类型(组件内部 SIZE_MAP 用)。 */
export type SizeMap<T> = Record<Size5, (target: T) => void>

// ════════════════════════════════════════════════════════════════════════
// 应用 helper
// ════════════════════════════════════════════════════════════════════════

/**
 * 应用 size factory —— 有 size 则调用,无则跳过。
 *
 * 用于组件实现里统一处理 `if (props.size) target(props.size)` 写法。
 *
 * @param size - size factory 函数(`undefined` 表示不写)
 * @param target - 应用目标(单 carrier 或整个 chain)
 *
 * @example
 * ```ts
 * applySizeProp(props.size, s.width)        // 单 carrier(width + height 镜像参见 ZIcon)
 * applySizeProp(props.size, s)              // 多 carrier(整个 chain)
 * ```
 */
export function applySizeProp<T>(
  size: ((target: T) => void) | undefined,
  target: T,
): void {
  if (size === undefined) return
  size(target)
}

// ════════════════════════════════════════════════════════════════════════
// 便捷工厂(只实现部分档位,自动 fallback)
// ════════════════════════════════════════════════════════════════════════

/**
 * 创建一个 5 阶档位 size map,只需写实际想实现的档位,缺的自动 fallback 到最近实现。
 *
 * **fallback 链**(向中间靠拢):
 * - `tiny` → `small` → `middle`
 * - `huge` → `large` → `middle`
 * - `small` / `large` → `middle`
 * - `middle` 缺则空函数(组件作者应至少实现 middle)
 *
 * **用途**:antd-like 3 阶组件(small/middle/large)迁移到 5 阶 union,
 * 不需要为 tiny / huge 显式想新值,自动 fallback 到 small / large。
 *
 * @example
 * ```ts
 * // 只写 3 阶,tiny → small,huge → large
 * const MAP = makeSizeMap<Chain<ZuiSchema>>({
 *   small:  (s) => { s.height.iem(1.75) },
 *   middle: (s) => { s.height.iem(2) },
 *   large:  (s) => { s.height.iem(2.5) },
 * })
 * // MAP.tiny 会 fallback 到 small
 * // MAP.huge 会 fallback 到 large
 * ```
 */
export function makeSizeMap<T>(partial: Partial<SizeMap<T>>): SizeMap<T> {
  const noop = (): void => {}
  const middle = partial.middle ?? noop
  const small = partial.small ?? middle
  const large = partial.large ?? middle
  const tiny = partial.tiny ?? small
  const huge = partial.huge ?? large
  return { tiny, small, middle, large, huge }
}
