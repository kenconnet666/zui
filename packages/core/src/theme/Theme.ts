import { resolveTheme } from './resolveTheme'
import { mergeTheme } from './mergeTheme'
import { buildKeymap } from './keymap'
import type { DeepPartial, ResolvedTheme, ThemeSchema } from './types'

/**
 * 主题类的运行时实体（internal）。
 *
 * 用户不直接接触此 class —— 对外暴露的 `Theme` 是 `_ThemeClass<T> & ResolvedTheme<T>`
 * 的 type alias（见文件底部）。
 *
 * 设计动机：`interface Theme<T> extends ResolvedTheme<T>` 在 `verbatimModuleSyntax` /
 * 严格模式下不被允许（interface 不能 extend mapped type）。改用 type intersection +
 * const 强转的方式同时保留：
 *   - `new Theme(schema)` 构造
 *   - `class MyTheme extends Theme<MySchema>` 继承
 *   - `theme.color.primary` schema 字段强类型访问（通过 intersection）
 *   - `theme.resolve() / theme.merge() / theme.getKeymap()` 方法
 */
class _ThemeClass<T extends ThemeSchema> {
  /** 内部缓存：已解析的 ResolvedTheme，由 `resolve()` 懒构建。 */
  private _resolved: ResolvedTheme<T> | null = null
  /**
   * 内部缓存：ident → originalKey 映射表，由 `getKeymap()` 懒构建。
   *
   * Theme 实例级缓存，多个 Chain 共享同一份 keymap，避免每个 Chain 重建 O(n) 遍历
   * 所有 token。修复 §十五.18 B3。
   */
  private _keymap: Map<string, Map<string, string>> | null = null

  constructor(public schema: T) {
    // 把 schema 各 category 直接挂到 this 上，配合 type intersection 即可强类型访问。
    // 注意：schema 含 function token 时，instance 上拿到的是函数（未求值）；
    // 类型上是 string | number。访问真值请走 `theme.resolve()` 或 Chain 内部 `_theme`。
    Object.assign(this, schema)
    if (isDevEnv()) warnFunctionTokensOnInstance(schema)
  }

  /** 把 schema（含 function token）求值成 `ResolvedTheme`，结果会被缓存。 */
  resolve(): ResolvedTheme<T> {
    if (this._resolved === null) {
      this._resolved = resolveTheme(this.schema)
    }
    return this._resolved
  }

  /** 拿到 keymap（懒构建 + 缓存）。Chain 构造时优先调用此方法。 */
  getKeymap(): Map<string, Map<string, string>> {
    if (this._keymap === null) {
      this._keymap = buildKeymap(this.resolve())
    }
    return this._keymap
  }

  /** 用 `partial` 局部覆盖父主题，返回一个新 Theme 实例。父主题不变。 */
  merge<P extends DeepPartial<T>>(partial: P): Theme<T> {
    const next = mergeTheme(this.resolve(), partial) as unknown as T
    return new Theme(next) as Theme<T>
  }

  /**
   * `fork()` — `merge()` 的别名（推荐入口）。
   *
   * 语义"派生子主题"比"合并"更贴合 ZConfigProvider 嵌套覆盖场景：
   *
   * @example
   * const dark = light.fork({ color: { background: '#000', text: '#fff' } })
   */
  fork<P extends DeepPartial<T>>(partial: P): Theme<T> {
    return this.merge(partial)
  }
}

function isDevEnv(): boolean {
  return typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production'
}

/**
 * Dev 警告（修 M4）：schema 含 function token 时 `Object.assign(this, schema)` 把函数
 * 也挂到 instance 上，访问 `theme.color.primary` 会拿到 function 而不是值；类型签名却是
 * `string | number`。提醒用户通过 `theme.resolve()` / `icss(theme, ...)` 获取真值。
 */
function warnFunctionTokensOnInstance(schema: unknown): void {
  if (schema == null || typeof schema !== 'object') return
  for (const cat in schema as Record<string, unknown>) {
    const slot = (schema as Record<string, unknown>)[cat]
    if (slot == null || typeof slot !== 'object') continue
    for (const key in slot as Record<string, unknown>) {
      const v = (slot as Record<string, unknown>)[key]
      if (typeof v === 'function') {
        // eslint-disable-next-line no-console
        console.warn(
          `[zui-core/Theme] schema 含 function token "${cat}.${key}"。` +
            `\n  通过 instance 直接访问（theme.${cat}.${key}）会拿到 function 引用而非值；` +
            `\n  类型签名是 string | number 但运行时是 function，不一致。` +
            `\n  建议：用 theme.resolve() / icss(theme, ...) / new Chain(theme) 获取展开后的真值。`,
        )
        return // 只警告一次，避免多 token 时刷屏
      }
    }
  }
}

/** 主题类型（intersection 注入 schema 字段强类型）。 */
export type Theme<T extends ThemeSchema> = _ThemeClass<T> & ResolvedTheme<T>

/**
 * 主题构造器（运行时值）。
 *
 * - `new Theme(schema)` 创建实例
 * - `class MyTheme extends Theme<MySchema> { ... }` 继承扩展
 *
 * 类型签名通过 const 强转把 `_ThemeClass` 替换成 `Theme<T>`（含 ResolvedTheme<T> 字段）。
 */
export const Theme = _ThemeClass as unknown as {
  new <T extends ThemeSchema>(schema: T): Theme<T>
  readonly prototype: _ThemeClass<ThemeSchema>
}
