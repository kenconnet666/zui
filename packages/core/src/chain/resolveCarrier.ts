import { Chain } from './Chain'
import { Theme } from '../theme/Theme'
import type { ResolvedTheme, ThemeSchema } from '../theme/types'

/**
 * `resolveCarrier` —— **Carrier factory introspect API**(2026-05-25 引入)。
 *
 * 给业务方一个手段:把 carrier factory `(c) => void` 执行一遍,**取出它最终
 * 写入 `_node[prop]` 的值**(string / number)。用于 emotion class 之外的渲染
 * 通道,如:
 *
 * - **SVG 属性**:`<circle :stroke="resolveCarrier(theme, 'color', props.color)" />`
 * - **`<canvas>` 绘制**:`ctx.fillStyle = resolveCarrier(...)`
 * - **ARIA / 内联 style 属性**:需要裸字符串而不是 emotion class
 * - **派生计算**:如 ZButton state layer 取用户色后做 `.alpha(8)` overlay
 *
 * **设计原则**:零侵入。Chain / carrier 类型完全不动,只新增本独立函数;
 * 内部 `new Chain()` 一次执行 factory 然后读 `_node`,~5μs 级别开销。
 * 不能拿到 token 引用、不能拿到中间步骤 —— 只拿"factory 写入的最终值"。
 *
 * @example
 * ```ts
 * // 1. token
 * resolveCarrier(theme, 'color', (c) => c._primary)
 * // → '#1976d2'
 *
 * // 2. modifier(立即计算)
 * resolveCarrier(theme, 'color', (c) => c._primary.alpha(50))
 * // → 'rgba(25, 118, 210, 0.5)'
 *
 * // 3. unit method
 * resolveCarrier(theme, 'width', (c) => c.px(16))
 * // → '16px'
 *
 * // 4. 字面量
 * resolveCarrier(theme, 'color', (c) => c('#abc'))
 * // → '#abc'
 *
 * // 5. 字符串逃生舱
 * resolveCarrier(theme, 'color', (c) => c('_primary.alpha(50)'))
 * // → 'rgba(25, 118, 210, 0.5)'
 *
 * // 6. factory 未传
 * resolveCarrier(theme, 'color', undefined)
 * // → undefined
 *
 * // 7. SVG 用法
 * const stroke = computed(
 *   () => resolveCarrier(theme.value, 'color', props.color) ?? '#1976d2',
 * )
 * ```
 *
 * @param theme - `Theme` 实例或已 resolve 的 `ResolvedTheme`(传 Theme 会自动 resolve)
 * @param prop  - carrier prop 名(`'color'` / `'width'` / `'backgroundColor'` 等)。
 *                必须是 Chain 支持的 carrier 属性,否则 carrier 创建失败返回 undefined
 * @param factory - carrier factory 回调,签名 `(c) => void`。若 `undefined` 直接返回 undefined
 *
 * @returns factory 写入 `_node[prop]` 的最终值,**纯字符串或数字**;未写入或 factory 缺失返回 `undefined`
 */
export function resolveCarrier<T extends ThemeSchema>(
  theme: ResolvedTheme<T> | Theme<T>,
  prop: string,
  factory: ((c: never) => void) | undefined,
): string | number | undefined {
  if (!factory) return undefined
  const chain = new Chain<T>(theme)
  // 访问 carrier(触发 Proxy 创建)→ 把 factory 当 setter 执行 → 读 _node[prop]
  const carrier = (chain as unknown as Record<string, unknown>)[prop]
  if (carrier === undefined) return undefined
  ;(factory as (c: unknown) => void)(carrier)
  const v = chain._node[prop]
  if (typeof v === 'string' || typeof v === 'number') return v
  return undefined
}
