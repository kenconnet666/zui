import { injectGlobal as emotionInjectGlobal } from '@emotion/css'
import type { CSSObject } from '@emotion/css/create-instance'

/**
 * 已注入内容的指纹集合。emotion 自己内部按内容 hash 不会重复注入 DOM 节点，但每次调用仍会
 * 反序列化 + 走 emotion serializer 一遍；这里按内容指纹去重，**避免重复 CPU 开销**。
 */
const injectedHashes = new Set<string>()

function fingerprint(styles: CSSObject | string): string {
  if (typeof styles === 'string') return `s:${styles}`
  try {
    return `o:${JSON.stringify(styles)}`
  } catch {
    // CSSObject 含循环引用 / Symbol 等不可序列化值；退回原样不去重
    return `_${Math.random()}`
  }
}

/**
 * 透传 emotion `injectGlobal`。**C10**：内存级去重，重复内容不会再次走 emotion serializer。
 *
 * 注意：去重粒度是"内容相同 = 跳过"，不影响 DOM 状态（emotion 自己保证不重复 append style）。
 */
export function injectGlobal(styles: CSSObject | string): void {
  const key = fingerprint(styles)
  if (injectedHashes.has(key)) return
  injectedHashes.add(key)
  emotionInjectGlobal(styles as never)
}

/**
 * 测试用：清空 injectGlobal 的去重缓存。仅清记忆，**不能撤销已注入的样式**。
 * 不挂在 index.ts 上导出（避免误用）；测试通过相对路径 import。
 */
export function _resetInjectGlobalCache(): void {
  injectedHashes.clear()
}
