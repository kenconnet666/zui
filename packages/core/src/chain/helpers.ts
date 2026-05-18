/**
 * 工具函数集合。`chain/helpers.ts` 后续会按 Plan.md 第十节从 zui 旧仓库
 * `packages/ui/src/emotion/helpers.ts` 直接复制更完整的版本。
 */

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/** 深合并：source 覆盖 target，原对象不变。 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    return (source ?? target) as T
  }
  const out: Record<string, unknown> = { ...target }
  for (const key in source) {
    const sv = (source as Record<string, unknown>)[key]
    const tv = (target as Record<string, unknown>)[key]
    if (isPlainObject(tv) && isPlainObject(sv)) {
      out[key] = deepMerge(tv, sv)
    } else if (sv !== undefined) {
      out[key] = sv
    }
  }
  return out as T
}
