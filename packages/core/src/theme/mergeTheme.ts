import type { DeepPartial, ResolvedTheme, ThemeSchema } from './types'
import { isPlainObject } from '../chain/helpers'

/**
 * 把 `partial` 深合并进 `parent`，返回新的 `ResolvedTheme`。
 *
 * - `parent` 必须是已解析过的（不含 function token）
 * - `partial` 中的 function token 不再支持（嵌套局部覆盖应当直接传字面量）
 */
export function mergeTheme<T extends ThemeSchema, P extends DeepPartial<T>>(
  parent: ResolvedTheme<T>,
  partial: P,
): ResolvedTheme<T> {
  const out: Record<string, Record<string, string | number>> = {}
  for (const cat in parent) {
    out[cat] = { ...(parent[cat] as Record<string, string | number>) }
  }
  for (const cat in partial) {
    const patch = partial[cat]
    if (!isPlainObject(patch)) continue
    out[cat] = { ...(out[cat] ?? {}), ...(patch as Record<string, string | number>) }
  }
  return out as ResolvedTheme<T>
}
