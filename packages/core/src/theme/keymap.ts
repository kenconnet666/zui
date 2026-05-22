import type { ResolvedTheme, ThemeSchema } from './types'

/**
 * 合法 JavaScript identifier 字符集（不含 `_` 前缀本身）。
 *
 * 我们允许的 token key 字符：字母 / 数字 / `-`（移除） / `.`（转 `_`）。
 * 其它字符（空格 / 特殊符号）应当被 `assertSchemaConsistency` 提前 warn 用户；
 * 这里运行时 sanitize 以避免生成非法 ident（虽然用户访问时仍会 TS 飘红）。
 */
const VALID_IDENT_RE = /^[a-zA-Z0-9_]+$/

function isDevEnv(): boolean {
  return typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production'
}

/**
 * 把 token key（如 `'blue-600'` / `'2xl'`）转换为合法 JS 标识符（`'_blue600'` / `'_2xl'`）。
 *
 * 规则：
 * - 去 `-`（`blue-600` → `blue600`）
 * - `.` → `_`（`brand.primary` → `brand_primary`）
 * - 前缀 `_`
 *
 * **S3 防御**：剩余字符若仍含非法 ident 字符（空格 / 特殊符号），dev 模式 console.warn；
 * 同时静默移除非法字符（最大化"用户写 schema 别太离谱仍能跑"的兼容性）。
 */
export function toIdent(key: string): string {
  const stripped = key.replace(/-/g, '').replace(/\./g, '_')
  // 检测非法字符
  if (!VALID_IDENT_RE.test(stripped)) {
    if (isDevEnv()) {
       
      console.warn(
        `[zui-core/toIdent] key "${key}" 含非法 ident 字符；keymap 转 "${'_' + stripped}" 可能让 carrier 无法命中。` +
          '\n  推荐：token key 仅用 字母 / 数字 / `-` / `.`',
      )
    }
    // 兜底：移除非合法字符，让运行时仍能匹配到一个 ident（可能与其他 key 冲突，但不抛错）
    const sanitized = stripped.replace(/[^a-zA-Z0-9_]/g, '')
    return '_' + sanitized
  }
  return '_' + stripped
}

/**
 * 构建每个 category 的 `ident → originalKey` 映射，供 carrier proxy 的 `_xxx` 访问还原原 key。
 *
 * 同 category 内 ident 冲突时 dev 模式 warn（保留最后一个 key，可能让前者无法访问）。
 */
export function buildKeymap<T extends ThemeSchema>(
  resolved: ResolvedTheme<T>,
): Map<string, Map<string, string>> {
  const result = new Map<string, Map<string, string>>()
  const dev = isDevEnv()
  for (const cat in resolved) {
    const slot = (resolved as Record<string, Record<string, string | number>>)[cat]
    if (!slot) continue
    const inner = new Map<string, string>()
    for (const key in slot) {
      const ident = toIdent(key)
      // S3 配套：同一 category 不同 key sanitize 后 ident 撞车 → dev warn
      if (dev && inner.has(ident)) {
         
        console.warn(
          `[zui-core/buildKeymap] ${cat} category 中 keys "${inner.get(ident)}" 与 "${key}" ` +
            `转 ident 后都是 "${ident}"，后者覆盖前者。请重命名其中一个。`,
        )
      }
      inner.set(ident, key)
    }
    result.set(cat, inner)
  }
  return result
}
