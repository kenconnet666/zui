import type { ZLocale, ZLocalePartial } from './types'

/**
 * `mergeLocale` —— 子 ZBox 嵌套时把 partial 浅合并到父 locale。
 *
 * 约定（与 ZBox 文档保持一致）：
 * - 顶层 namespace 浅合并：父字典 + 子字典各自存在的 namespace 用子覆盖父。
 * - namespace 内部走"字段级"浅合并：同 namespace 同 key 子覆盖父；缺失字段继承父。
 * - 数组（如 `weekdaysShort`）整体替换，不做下标级合并。
 * - `name` 子覆盖父；如未传则保留父名称。
 */
export function mergeLocale(parent: ZLocale, partial?: ZLocalePartial): ZLocale {
  if (!partial) return parent
  const out: Record<string, unknown> = { ...parent }
  for (const ns in partial) {
    if (!Object.prototype.hasOwnProperty.call(partial, ns)) continue
    const childNs = (partial as Record<string, unknown>)[ns]
    if (childNs == null) continue
    if (ns === 'name') {
      out.name = childNs
      continue
    }
    const parentNs = (parent as unknown as Record<string, unknown>)[ns]
    if (
      typeof childNs === 'object' &&
      !Array.isArray(childNs) &&
      typeof parentNs === 'object' &&
      parentNs !== null &&
      !Array.isArray(parentNs)
    ) {
      out[ns] = { ...(parentNs as object), ...(childNs as object) }
    } else {
      out[ns] = childNs
    }
  }
  return out as unknown as ZLocale
}
