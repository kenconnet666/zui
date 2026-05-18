import type { DeepPartial, ResolvedTheme, ThemeSchema } from './types'
import { deepMerge } from '../chain/helpers'

/**
 * 把 `partial` 深合并进 `parent`，返回新的 `ResolvedTheme`。
 *
 * - `parent` 必须是已解析过的（不含 function token）
 * - `partial` 中的 function token 不再支持（嵌套局部覆盖应当直接传字面量）
 * - 深合并：每个 category 内部按 key 覆盖；未在 partial 出现的 category / key 沿用 parent
 * - 返回新对象，**parent 不变**（便于在响应式系统里安全 derive）
 */
export function mergeTheme<T extends ThemeSchema, P extends DeepPartial<T>>(
  parent: ResolvedTheme<T>,
  partial: P,
): ResolvedTheme<T> {
  return deepMerge(parent, partial as unknown as Partial<ResolvedTheme<T>>) as ResolvedTheme<T>
}
