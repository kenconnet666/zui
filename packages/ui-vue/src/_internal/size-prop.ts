/**
 * size prop 形态:`factory | Size5 枚举档位 | undefined` union 的类型 + 应用 helper。
 *
 * **设计哲学**(2026-05-22 决策,撤销 roadmap §1 L15 "chain factory only"):
 * - happy path:99% 的业务方写 `<ZInput size="middle">`,一行表达
 * - 逃生口:复杂需求走 `(s) => { s.height.iem(2.5); s.fontSize.iem(1.1) }`
 * - theme 干净:档位值写在组件内 const map,不污染主题 schema
 * - iem 联动:枚举档位内部用 `s.height.iem(N)`,ZBox `:iem` 全站缩放生效
 *
 * 决策文档:`.claude/decisions/2026-05-22-prop-shape-union.md`
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

// ════════════════════════════════════════════════════════════════════════
// 类型
// ════════════════════════════════════════════════════════════════════════

/** 5 阶 size 枚举档位通用类型,跟 theme schema 5 阶 size scale 对齐。 */
export type Size5 = 'tiny' | 'small' | 'middle' | 'large' | 'huge'

/**
 * 单 carrier 维度 size prop 类型 helper。
 *
 * 用于 ZIcon / ZAvatar 等"size 只影响一个 CSS 属性"的场景。
 *
 * @example
 * size?: SizeProp<'width'>  // ((w: Chain<ZuiSchema>['width']) => void) | Size5
 */
export type SizeProp<K extends keyof Chain<ZuiSchema>> =
  | ((c: Chain<ZuiSchema>[K]) => void)
  | Size5

/**
 * 多 carrier 维度 size prop 类型 helper。
 *
 * 用于 ZInput / ZButton / ZSelect 等"size 同时影响多个 CSS 属性"的场景。
 * factory 接整个 `Chain<ZuiSchema>`,用户可在 callback 内多行 setter。
 *
 * @example
 * size?: SizePropMulti
 * // ((s: Chain<ZuiSchema>) => void) | Size5
 */
export type SizePropMulti = ((s: Chain<ZuiSchema>) => void) | Size5

/** 5 阶 size 档位 → factory 的映射表类型。 */
export type SizeMap<T> = Record<Size5, (target: T) => void>

// ════════════════════════════════════════════════════════════════════════
// 应用 helper
// ════════════════════════════════════════════════════════════════════════

/**
 * 应用 size prop —— 字符串档位走 map,factory 直接调。
 *
 * @param size - size prop 值(`Size5` 字符串 或 factory 函数)
 * @param map - 5 阶档位 → factory 映射表(组件内 const 定义)
 * @param target - 应用目标(单 carrier 或整个 chain)
 *
 * @example
 * ```ts
 * // 单 carrier 维度(ZIcon)
 * const SIZE_MAP_WIDTH: SizeMap<Chain<ZuiSchema>['width']> = {
 *   tiny:   (w) => { w.iem(0.75) },
 *   small:  (w) => { w.iem(1) },
 *   middle: (w) => { w.iem(1.25) },
 *   large:  (w) => { w.iem(1.5) },
 *   huge:   (w) => { w.iem(2) },
 * }
 * applySizeProp(props.size, SIZE_MAP_WIDTH, s.width)
 *
 * // 多 carrier 维度(ZInput)
 * const SIZE_MAP_INPUT: SizeMap<Chain<ZuiSchema>> = {
 *   tiny:   (s) => { s.paddingTop.iem(0.125); s.fontSize._tiny },
 *   small:  (s) => { s.paddingTop.iem(0.25);  s.fontSize._small },
 *   middle: (s) => { s.paddingTop.iem(0.375); s.fontSize._middle },
 *   large:  (s) => { s.paddingTop.iem(0.5);   s.fontSize._large },
 *   huge:   (s) => { s.paddingTop.iem(0.625); s.fontSize._huge },
 * }
 * applySizeProp(props.size, SIZE_MAP_INPUT, s)
 * ```
 */
export function applySizeProp<T>(
  size: ((target: T) => void) | Size5 | undefined,
  map: SizeMap<T>,
  target: T,
): void {
  if (size === undefined) return
  if (typeof size === 'string') {
    map[size](target)
  } else {
    size(target)
  }
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
