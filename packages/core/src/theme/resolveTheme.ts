import type { ResolvedTheme, ResolvedThemeContext, ThemeSchema, ThemeValue } from './types'

/**
 * 把 `ThemeSchema` 解析成 `ResolvedTheme`，展开所有 function token。
 *
 * function token 会按需懒求值，结果会回写到上下文供其它 token 引用。
 * 简单两遍扫描：第一遍收集字面量，第二遍求值函数；不解析跨函数依赖环。
 */
export function resolveTheme<T extends ThemeSchema>(schema: T): ResolvedTheme<T> {
  const ctx: ResolvedThemeContext = {}

  // pass 1: 字面量值直接拷贝
  for (const cat in schema) {
    const slot = schema[cat]
    if (!slot) continue
    const out: Record<string, string | number> = {}
    for (const key in slot) {
      const v = slot[key] as ThemeValue
      if (typeof v !== 'function') out[key] = v as string | number
    }
    ctx[cat] = out
  }

  // pass 2: function token 求值
  for (const cat in schema) {
    const slot = schema[cat]
    if (!slot) continue
    for (const key in slot) {
      const v = slot[key] as ThemeValue
      if (typeof v === 'function') {
        ctx[cat]![key] = v(ctx)
      }
    }
  }

  return ctx as ResolvedTheme<T>
}
