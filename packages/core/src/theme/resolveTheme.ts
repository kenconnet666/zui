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

  // pass 3: freeze（V8 sealed-class 优化 + 防止用户误改）
  // 仅 freeze 每个 category 的内部 record；顶层不冻结以便 mergeTheme 后能再 freeze 新对象。
  for (const cat in ctx) {
    const slot = ctx[cat]
    if (slot) Object.freeze(slot)
  }

  return ctx as ResolvedTheme<T>
}
