import type { ResolvedTheme, ThemeSchema } from './types'

/**
 * 把 token key（如 `'blue-600'` / `'2xl'`）转换为合法 JS 标识符（`'_blue600'` / `'_2xl'`）。
 * 规则: 去 `-`，`.` → `_`，前缀 `_`。
 */
export function toIdent(key: string): string {
  return '_' + key.replace(/-/g, '').replace(/\./g, '_')
}

/**
 * 构建每个 category 的 `ident → originalKey` 映射，供 carrier proxy 的 `_xxx` 访问还原原 key。
 */
export function buildKeymap<T extends ThemeSchema>(
  resolved: ResolvedTheme<T>,
): Map<string, Map<string, string>> {
  const result = new Map<string, Map<string, string>>()
  for (const cat in resolved) {
    const slot = (resolved as Record<string, Record<string, string | number>>)[cat]
    if (!slot) continue
    const inner = new Map<string, string>()
    for (const key in slot) {
      inner.set(toIdent(key), key)
    }
    result.set(cat, inner)
  }
  return result
}
