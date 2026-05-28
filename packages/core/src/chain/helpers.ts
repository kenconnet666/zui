/**
 * 工具函数集合。移植自 zui-back7 `packages/ui/src/emotion/helpers.ts`，按本仓库需求精修：
 * - `deepMerge` 仍保留旧的"返回新对象"语义（`mergeTheme` 在用）
 * - 新增 `deepMergeInto` 与 `deepClone`（Chain 的 `_use` / 嵌套合并需要原地修改 + 拷贝）
 */

/** 判断纯对象（排除 null / 数组 / Map / Set 等）。 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false
  if (Array.isArray(value)) return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/**
 * 深拷贝纯对象 / 数组；其它值原样返回（不深拷贝 Map / Set / Date）。
 *
 * **行为约定**：跳过 `undefined` 字段（与 JavaScript "undefined = 未设置" 约定一致）。
 * 这意味着 `deepClone({ x: undefined, y: 1 })` 返回 `{ y: 1 }`。
 * `null` 字段保留。
 */
export function deepClone<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(item => deepClone(item)) as T
  }
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {}
    for (const key of Object.keys(value)) {
      const v = value[key]
      if (v !== undefined) out[key] = deepClone(v)
    }
    return out as T
  }
  return value
}

/**
 * 不可变深合并：source 覆盖 target，返回新对象，原对象不变。
 *
 * 仅嵌套纯对象时递归；其他值（含数组）直接覆盖。
 */
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

/**
 * 可变深合并：把 source 的字段写进 target（原地修改）。
 *
 * Chain 的 `_use(input)` / `_nest` 子节点合并需要这个 —— 因为 `_node` 是同一个 emotion
 * `CSSObject` 对象引用，新建对象会丢失父级链路。
 */
export function deepMergeInto(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): void {
  for (const key of Object.keys(source)) {
    const sv = source[key]
    if (sv === undefined) continue
    const tv = target[key]
    if (isPlainObject(tv) && isPlainObject(sv)) {
      deepMergeInto(tv, sv)
    } else {
      target[key] = deepClone(sv)
    }
  }
}
