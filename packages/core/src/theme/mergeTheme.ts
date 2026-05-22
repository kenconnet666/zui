import type { DeepPartial, ResolvedTheme, ThemeSchema } from './types'
import { deepMerge } from '../chain/helpers'

/**
 * 把 `partial` 深合并进 `parent`，返回新的 `ResolvedTheme`。
 *
 * - `parent` 必须是已解析过的（不含 function token）
 * - `partial` 中的 function token 不再支持（嵌套局部覆盖应当直接传字面量）
 * - 深合并：每个 category 内部按 key 覆盖；未在 partial 出现的 category / key 沿用 parent
 * - 返回新对象，**parent 不变**（便于在响应式系统里安全 derive）
 *
 * **B4**：dev 模式（NODE_ENV !== 'production'）扫描 partial，遇 function 值时 `console.warn` 警示
 * —— mergeTheme 期望已解析过的字面量；function 被合入后下游拿到 function 实例，违反 ResolvedTheme
 * 形状假设。
 */
export function mergeTheme<T extends ThemeSchema, P extends DeepPartial<T>>(
  parent: ResolvedTheme<T>,
  partial: P,
): ResolvedTheme<T> {
  if (isDevEnv()) {
    scanForFunctionTokens(partial as unknown, '')
  }
  return deepMerge(parent, partial as unknown as Partial<ResolvedTheme<T>>) as ResolvedTheme<T>
}

function isDevEnv(): boolean {
  return typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production'
}

function scanForFunctionTokens(obj: unknown, path: string): void {
  if (obj == null || typeof obj !== 'object') return
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const p = path ? `${path}.${key}` : key
    if (typeof value === 'function') {
       
      console.warn(
        `[zui-core/mergeTheme] partial 含 function token "${p}"; mergeTheme 期望已解析过的字面量。` +
          `function 会被原样合入，破坏下游 ResolvedTheme<T> 形状。请在传入前 resolveTheme()。`,
      )
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      scanForFunctionTokens(value, p)
    }
  }
}
