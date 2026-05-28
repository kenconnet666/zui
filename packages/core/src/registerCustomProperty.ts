import { injectGlobal } from './injectGlobal'

/**
 * W5.5 — `@property` 注册 helper（D12）。
 *
 * 把 CSS Houdini 的 `@property` 通过全局 `injectGlobal`（内置内存去重）注入全局样式表，
 * 让自定义属性可参与 CSS animation（无 `@property` 时 custom property 不可动画）。
 *
 * @example
 * registerCustomProperty('--grad-angle', {
 *   syntax: '<angle>',
 *   inherits: false,
 *   initialValue: '0deg',
 * })
 *
 * // 之后可以用 transition / animation 动画化 --grad-angle
 */
export interface CustomPropertyOptions {
  /** CSS Values 3 syntax 描述，如 `<color>`, `<length>`, `<angle>`, `*` 等。 */
  syntax: string
  /** 是否继承到子元素。 */
  inherits: boolean
  /** 初始值（必须符合 syntax）。 */
  initialValue: string | number
}

function isDevEnv(): boolean {
  return typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production'
}

/** 转义单引号，防止用户传入含 `'` 的字符串破坏 @property block。 */
function escapeSingleQuotes(value: string): string {
  return value.replace(/'/g, "\\'")
}

/** 已知合法 syntax token（粗略，不完整）— dev 模式可疑值 warn 用。 */
const KNOWN_SYNTAX_TOKENS = new Set([
  '*',
  '<angle>',
  '<color>',
  '<custom-ident>',
  '<image>',
  '<integer>',
  '<length>',
  '<length-percentage>',
  '<number>',
  '<percentage>',
  '<resolution>',
  '<string>',
  '<time>',
  '<transform-function>',
  '<transform-list>',
  '<url>',
])

export function registerCustomProperty(name: `--${string}`, options: CustomPropertyOptions): void {
  // S2 防御：检测可疑字符（合法 CSS Syntax 永远不含 ; { }）
  if (isDevEnv()) {
    if (/[;{}]/.test(options.syntax)) {
      console.warn(
        `[zui-core/registerCustomProperty] syntax 含可疑字符（; { }）："${options.syntax}"。` +
          `\n  常见合法值：'<color>' / '<length>' / '<angle>' / '<percentage>' / '<integer>' / '<number>' / '*'`,
      )
    } else if (
      options.syntax.trim() !== '*' &&
      !KNOWN_SYNTAX_TOKENS.has(options.syntax.trim()) &&
      !/^<[^>]+>(\s*\|\s*<[^>]+>)*$/.test(options.syntax.trim())
    ) {
      // 非已知 token + 不符合 <xxx>(|<yyy>)* 模式 → warn 但不阻塞

      console.warn(
        `[zui-core/registerCustomProperty] syntax "${options.syntax}" 非已知 CSS Values 3 token；浏览器可能静默忽略 @property。`,
      )
    }
    if (typeof options.initialValue === 'string' && /[;{}]/.test(options.initialValue)) {
      console.warn(
        `[zui-core/registerCustomProperty] initialValue 含 ;/{/} 字符可能破坏 CSS：${options.initialValue}`,
      )
    }
  }

  const escSyntax = escapeSingleQuotes(options.syntax)
  const escInitial =
    typeof options.initialValue === 'string'
      ? escapeSingleQuotes(options.initialValue)
      : options.initialValue
  const block = `@property ${name} {
  syntax: '${escSyntax}';
  inherits: ${options.inherits};
  initial-value: ${escInitial};
}`
  injectGlobal(block)
}
