import { Theme } from '../theme/Theme'
import type { ResolvedTheme, ThemeSchema, ThemeValue } from '../theme/types'

/**
 * 开发态校验：检查 schema 一致性，返回问题列表（空数组表示无问题）。
 *
 * 校验项：
 *  1. 必填语义色（primary / danger / text / bg / border）齐全
 *  2. function token 引用的 category 存在且对应 key 已被定义
 *  3. token key 命名规范（避免与运行时保留字冲突）
 *  4. palette 命名规范（`color-shade` kebab 形式或合法 ident）
 *
 * @example
 * import { assertSchemaConsistency } from '@kenconnet666/zui-core'
 * const issues = assertSchemaConsistency(myTheme)
 * if (issues.length) console.warn('Schema issues:', issues)
 */
export interface SchemaIssue {
  level: 'warn' | 'error'
  category: string
  key?: string
  message: string
}

const RECOMMENDED_SEMANTIC_COLORS = ['primary', 'danger', 'text', 'bg', 'border'] as const

const RESERVED_KEYS = new Set([
  'constructor',
  'prototype',
  '__proto__',
  'toString',
  'toJSON',
  'valueOf',
])

export function assertSchemaConsistency<T extends ThemeSchema>(
  theme: Theme<T> | T | ResolvedTheme<T>,
): SchemaIssue[] {
  const issues: SchemaIssue[] = []

  // 拿到 schema：Theme 实例 → schema 字段；plain object → 当 schema 用
  const schema = theme instanceof Theme ? (theme.schema as T) : (theme as T | ResolvedTheme<T>)

  // 1. 必填语义色齐全
  const colorSlot = (schema as Record<string, unknown>).color as
    | Record<string, ThemeValue>
    | undefined
  if (colorSlot) {
    for (const key of RECOMMENDED_SEMANTIC_COLORS) {
      if (!(key in colorSlot)) {
        issues.push({
          level: 'warn',
          category: 'color',
          key,
          message: `推荐定义语义色 '${key}'（许多组件默认引用）`,
        })
      }
    }
  } else {
    issues.push({
      level: 'warn',
      category: 'color',
      message: 'schema 缺 color category；大多数链式访问会失败',
    })
  }

  // 2 / 3. 遍历所有 category 校验
  for (const cat in schema) {
    const slot = (schema as Record<string, unknown>)[cat]
    if (!slot || typeof slot !== 'object') continue
    for (const key in slot as Record<string, unknown>) {
      if (RESERVED_KEYS.has(key)) {
        issues.push({
          level: 'error',
          category: cat,
          key,
          message: `key '${key}' 与 JS 保留字冲突，可能破坏运行时分派`,
        })
      }
      // 命名规范：允许字母 / 数字 / `-` / `.` / 数字开头（'2xl' 等）
      if (!/^[a-zA-Z0-9._-]+$/.test(key)) {
        issues.push({
          level: 'warn',
          category: cat,
          key,
          message: `key '${key}' 含非标准字符，可能 keymap 转 ident 失败`,
        })
      }
      // 3. function token 引用校验
      const v = (slot as Record<string, ThemeValue>)[key]
      if (typeof v === 'function') {
        try {
          // ResolvedTheme<T> 在 0.7.0 类型保真后 TS 无法直接收敛为 ThemeSchema，
          // 但运行时结构兼容（每个 category 都是 Record<string, ThemeValue>），cast 安全。
          const probe = makeReferenceProbe(schema as ThemeSchema)
          const result = v(probe.ctx)
          if (typeof result !== 'string' && typeof result !== 'number') {
            issues.push({
              level: 'error',
              category: cat,
              key,
              message: `function token 返回 ${typeof result}（必须 string | number）`,
            })
          }
          for (const ref of probe.refs) {
            issues.push({
              level: 'warn',
              category: cat,
              key,
              message: `function token 引用了未定义路径 '${ref}'`,
            })
          }
        } catch (err) {
          issues.push({
            level: 'error',
            category: cat,
            key,
            message: `function token 抛错：${(err as Error).message}`,
          })
        }
      }
    }
  }

  return issues
}

/**
 * 给 function token 投放一个 Proxy 探针 ctx，记录所有访问路径并校验对应 schema 字段存在。
 *
 * **S6 修复**：之前不存在的 category 只 push 半路径（如 `'spacing'`，丢失 `.md`）；
 * 现在内层 Proxy 也记录完整路径（`'spacing.md'`）。
 */
function makeReferenceProbe<T extends ThemeSchema>(
  schema: T,
): {
  ctx: Record<string, Record<string, string | number>>
  refs: string[]
} {
  const refs: string[] = []
  const probe = new Proxy({} as Record<string, Record<string, string | number>>, {
    get(_, cat: string) {
      const slot = (schema as Record<string, unknown>)[cat]
      if (!slot || typeof slot !== 'object') {
        // 不存在的 category：返回 inner Proxy 也记录访问的 key，凑出完整路径
        return new Proxy(
          {},
          {
            get(_inner, key: string) {
              if (typeof key === 'string') refs.push(`${cat}.${key}`)
              return ''
            },
          },
        )
      }
      return new Proxy(slot as Record<string, ThemeValue>, {
        get(target, key: string) {
          if (typeof key !== 'string') return ''
          if (!(key in target)) refs.push(`${cat}.${key}`)
          const v = target[key]
          return typeof v === 'function' ? '0' : (v ?? '')
        },
      }) as never
    },
  })
  return { ctx: probe, refs }
}
