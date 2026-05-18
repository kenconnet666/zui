import { css } from '@emotion/css'
import type { CSSObject } from '@emotion/css/create-instance'
import { Theme } from '../theme/Theme'
import { buildKeymap } from '../theme/keymap'
import type { ResolvedTheme, ThemeSchema } from '../theme/types'
import type { DefaultSchema } from '../theme/defaults/schema'
import type { IcxPropMethods } from '../types/properties.generated'
import { makeChainProxy } from './proxy'
import { deepClone, deepMergeInto } from './helpers'

// ─── 内部工具 ───

function normalizeSelector(selectorTail: string): string {
  const trimmed = selectorTail.trim()
  if (!trimmed) return '&'
  return trimmed.startsWith('&') ? trimmed : `&${trimmed}`
}

function normalizeAtRule(prefix: '@media' | '@supports' | '@container', query: string): string {
  const trimmed = query.trim()
  if (!trimmed) return prefix
  return trimmed.startsWith(prefix) ? trimmed : `${prefix} ${trimmed}`
}

/**
 * `_token` 简写 → 完整 media / container 查询。
 * - `_md` → `(min-width: <theme.breakpoint.md>)`
 * - 不以 `_` 开头 → 原样
 * - 找不到 token → 原样字符串透传（让用户立刻发现）
 */
function resolveBreakpointQuery(query: string, theme: ResolvedTheme<ThemeSchema>): string {
  const trimmed = query.trim()
  if (!trimmed.startsWith('_')) return trimmed
  const name = trimmed.slice(1)
  const slot = (theme as Record<string, Record<string, string | number> | undefined>).breakpoint
  const value = slot?.[name]
  if (value == null) return trimmed
  return `(min-width: ${value})`
}

/**
 * 链式样式 builder。核心入口。
 *
 * 通过 declaration merging（见文件底部）注入所有 `IcxPropMethods` 的 carrier / fn 属性，
 * 让 `chain.color._primary` / `chain.padding.px(16)` 全部强类型。
 *
 * Statement-only：fn 回调签名是 `(s: this) => void`，不要求返回 chain；嵌套上下文由
 * `_nest` 在 try/finally 内切换 `_node`。
 */
export class Chain<T extends ThemeSchema = DefaultSchema> {
  /** 累计的 emotion `CSSObject`（含嵌套）。 */
  public _node: Record<string, unknown> = {}
  public _theme: ResolvedTheme<T>
  public _keymap: Map<string, Map<string, string>>
  /** carrier 缓存（避免 chain.color 多次访问反复建 Proxy）。 */
  public _carriers: Map<string, unknown> = new Map()

  constructor(theme: ResolvedTheme<T> | Theme<T>) {
    this._theme = theme instanceof Theme ? theme.resolve() : theme
    this._keymap = buildKeymap(this._theme)
    return makeChainProxy(this as unknown as Chain<never>) as unknown as Chain<T>
  }

  // ─── 属性设置 / 逃生舱 ───

  /** emotion `label`：给生成的 className 加语义后缀。 */
  label(name: string): this {
    this._node.label = name
    return this
  }

  /** 直接写任意 CSS 属性（绕过类型层）；逃生舱。 */
  _prop(name: string, value: unknown): this {
    if (value === undefined) {
      delete this._node[name]
    } else {
      this._node[name] = value
    }
    return this
  }

  /** 写 CSS 自定义属性（`--xxx`）。 */
  _var(name: `--${string}`, value: string | number): this {
    this._node[name] = value
    return this
  }

  /** 深合并外部 `CSSObject`（用于复用片段、消费 design tokens 等）。 */
  _use(input: CSSObject): this {
    deepMergeInto(this._node, deepClone(input as Record<string, unknown>))
    return this
  }

  /** 复用样式片段：把 chain 作为入参传给 fn，让 fn 决定写什么。 */
  _apply(fn: (s: this) => void): this {
    fn(this)
    return this
  }

  // ─── 伪类（状态） ───

  _hover(fn: (s: this) => void): this { return this._nest('&:hover', fn) }
  _active(fn: (s: this) => void): this { return this._nest('&:active', fn) }
  _focus(fn: (s: this) => void): this { return this._nest('&:focus', fn) }
  _focusVisible(fn: (s: this) => void): this { return this._nest('&:focus-visible', fn) }
  _focusWithin(fn: (s: this) => void): this { return this._nest('&:focus-within', fn) }
  _disabled(fn: (s: this) => void): this { return this._nest('&:disabled', fn) }
  _checked(fn: (s: this) => void): this { return this._nest('&:checked', fn) }
  _enabled(fn: (s: this) => void): this { return this._nest('&:enabled', fn) }

  // ─── 伪类（表单状态） ───

  _required(fn: (s: this) => void): this { return this._nest('&:required', fn) }
  _optional(fn: (s: this) => void): this { return this._nest('&:optional', fn) }
  _valid(fn: (s: this) => void): this { return this._nest('&:valid', fn) }
  _invalid(fn: (s: this) => void): this { return this._nest('&:invalid', fn) }
  _readOnly(fn: (s: this) => void): this { return this._nest('&:read-only', fn) }
  _placeholderShown(fn: (s: this) => void): this { return this._nest('&:placeholder-shown', fn) }
  _inRange(fn: (s: this) => void): this { return this._nest('&:in-range', fn) }
  _outOfRange(fn: (s: this) => void): this { return this._nest('&:out-of-range', fn) }

  // ─── 伪类（链接 / 目标） ───

  _link(fn: (s: this) => void): this { return this._nest('&:link', fn) }
  _visited(fn: (s: this) => void): this { return this._nest('&:visited', fn) }
  _target(fn: (s: this) => void): this { return this._nest('&:target', fn) }
  /** CSS Selectors 4 `:dir(rtl)` / `:dir(ltr)`。 */
  _dir(direction: 'rtl' | 'ltr', fn: (s: this) => void): this {
    return this._nest(`&:dir(${direction})`, fn)
  }

  // ─── 伪元素 ───

  _before(fn: (s: this) => void): this { return this._nest('&::before', fn) }
  _after(fn: (s: this) => void): this { return this._nest('&::after', fn) }
  _placeholder(fn: (s: this) => void): this { return this._nest('&::placeholder', fn) }
  _selection(fn: (s: this) => void): this { return this._nest('&::selection', fn) }
  /** `::marker` 列表项 marker。 */
  _marker(fn: (s: this) => void): this { return this._nest('&::marker', fn) }

  // ─── 结构伪类 ───

  _firstChild(fn: (s: this) => void): this { return this._nest('&:first-child', fn) }
  _lastChild(fn: (s: this) => void): this { return this._nest('&:last-child', fn) }
  _only(fn: (s: this) => void): this { return this._nest('&:only-child', fn) }
  _empty(fn: (s: this) => void): this { return this._nest('&:empty', fn) }
  _nthChild(arg: number | string, fn: (s: this) => void): this {
    return this._nest(`&:nth-child(${arg})`, fn)
  }
  _nthOfType(arg: number | string, fn: (s: this) => void): this {
    return this._nest(`&:nth-of-type(${arg})`, fn)
  }

  // ─── 组合选择器（Tailwind group / peer 风格） ───

  /** 父级带 `.group` class 且 hover 时（`:where(.group):hover &`）。 */
  _groupHover(fn: (s: this) => void): this { return this._nest(':where(.group):hover &', fn) }
  _groupFocus(fn: (s: this) => void): this { return this._nest(':where(.group):focus &', fn) }
  _groupActive(fn: (s: this) => void): this { return this._nest(':where(.group):active &', fn) }
  /** 兄弟节点带 `.peer` 且 hover 时（`:where(.peer):hover ~ &`）。 */
  _peerHover(fn: (s: this) => void): this { return this._nest(':where(.peer):hover ~ &', fn) }
  _peerFocus(fn: (s: this) => void): this { return this._nest(':where(.peer):focus ~ &', fn) }
  _peerChecked(fn: (s: this) => void): this { return this._nest(':where(.peer):checked ~ &', fn) }

  // ─── 选择器 / 条件 ───

  _selector(selector: string, fn: (s: this) => void): this {
    return this._nest(selector, fn)
  }
  /** 拼接选择器后缀（自动补 `&` 前缀）。 */
  _and(selectorTail: string, fn: (s: this) => void): this {
    return this._nest(normalizeSelector(selectorTail), fn)
  }
  _when(cond: unknown, fn: (s: this) => void): this {
    if (cond) fn(this)
    return this
  }
  _unless(cond: unknown, fn: (s: this) => void): this {
    if (!cond) fn(this)
    return this
  }

  // ─── At 规则 ───

  /**
   * 媒体查询；支持 `_md` 等断点 token 简写（解析自 `theme.breakpoint`）。
   *
   * @example
   * s._media('_md', m => m.flexDirection('row'))
   * s._media('(prefers-color-scheme: dark)', m => m.color._textOnDark)
   */
  _media(query: string, fn: (s: this) => void): this {
    const resolved = resolveBreakpointQuery(query, this._theme as ResolvedTheme<ThemeSchema>)
    return this._nest(normalizeAtRule('@media', resolved), fn)
  }
  _supports(query: string, fn: (s: this) => void): this {
    return this._nest(normalizeAtRule('@supports', query), fn)
  }
  /** 容器查询；同 `_media`，支持 token 简写。 */
  _container(query: string, fn: (s: this) => void): this {
    const resolved = resolveBreakpointQuery(query, this._theme as ResolvedTheme<ThemeSchema>)
    return this._nest(normalizeAtRule('@container', resolved), fn)
  }

  // ─── 媒体修饰符简写 ───

  _dark(fn: (s: this) => void): this { return this._nest('@media (prefers-color-scheme: dark)', fn) }
  _light(fn: (s: this) => void): this { return this._nest('@media (prefers-color-scheme: light)', fn) }
  _motionSafe(fn: (s: this) => void): this {
    return this._nest('@media (prefers-reduced-motion: no-preference)', fn)
  }
  _motionReduce(fn: (s: this) => void): this {
    return this._nest('@media (prefers-reduced-motion: reduce)', fn)
  }
  _print(fn: (s: this) => void): this { return this._nest('@media print', fn) }
  _rtl(fn: (s: this) => void): this { return this._nest(':where([dir="rtl"]) &', fn) }
  _ltr(fn: (s: this) => void): this { return this._nest(':where([dir="ltr"]) &', fn) }

  // ─── 工具组合（Tailwind 招牌 "合并写法"） ───

  /** 单行截断：`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`。 */
  _truncate(): this {
    this._node.overflow = 'hidden'
    this._node.textOverflow = 'ellipsis'
    this._node.whiteSpace = 'nowrap'
    return this
  }

  /** 多行截断（`-webkit-box` + `-webkit-line-clamp`）。 */
  _lineClamp(lines: number): this {
    this._node.display = '-webkit-box'
    this._node.overflow = 'hidden'
    this._node.WebkitBoxOrient = 'vertical'
    this._node.WebkitLineClamp = lines
    return this
  }

  /** 屏读器可读、视觉隐藏（`sr-only`）。 */
  _srOnly(): this {
    this._node.position = 'absolute'
    this._node.width = '1px'
    this._node.height = '1px'
    this._node.padding = '0'
    this._node.margin = '-1px'
    this._node.overflow = 'hidden'
    this._node.clip = 'rect(0, 0, 0, 0)'
    this._node.whiteSpace = 'nowrap'
    this._node.border = '0'
    return this
  }

  /** flex 居中三件套。 */
  _centered(): this {
    this._node.display = 'flex'
    this._node.alignItems = 'center'
    this._node.justifyContent = 'center'
    return this
  }

  /** absolute 居中（top/left 50% + translate -50%）。 */
  _absoluteCenter(): this {
    this._node.position = 'absolute'
    this._node.top = '50%'
    this._node.left = '50%'
    this._node.transform = 'translate(-50%, -50%)'
    return this
  }

  // ─── filter 简写 ───

  /**
   * `filter: blur(<value>)`。token 名解析自 `theme.blur` 表；未找到则原字符串透传。
   * @example s._blur('_md') → filter: blur(12px)
   */
  _blur(token: string): this {
    return this._prop('filter', this._resolveBlurValue(token))
  }

  /**
   * `backdrop-filter: blur(<value>)`。用于毛玻璃效果。
   * @example s._backdropBlur('_md') → backdrop-filter: blur(12px)
   */
  _backdropBlur(token: string): this {
    return this._prop('backdropFilter', this._resolveBlurValue(token))
  }

  private _resolveBlurValue(token: string): string {
    const name = token.startsWith('_') ? token.slice(1) : token
    const slot = (this._theme as Record<string, Record<string, string | number> | undefined>).blur
    const value = slot?.[name]
    if (value == null) return token
    return `blur(${value})`
  }

  // ─── 输出 ───

  toCSSObject(): CSSObject {
    return this._node as CSSObject
  }

  toString(): string {
    return css(this._node as CSSObject)
  }

  // ─── 内部 ───

  /**
   * 切换 `_node` 引用到子节点执行 fn，再还原。
   * 子节点已有内容时复用（避免覆盖同名 selector 的前次写入）；fn 抛错也保证 `_node` 还原。
   */
  _nest(selector: string, fn: (s: this) => void): this {
    const prev = this._node
    const existing = prev[selector]
    const child: Record<string, unknown> =
      existing && typeof existing === 'object' && existing !== null
        ? (existing as Record<string, unknown>)
        : {}
    this._node = child
    try {
      fn(this)
    } finally {
      this._node = prev
    }
    // fn 内部什么都没写时，不把空对象留在父节点上
    if (Object.keys(child).length === 0) {
      delete prev[selector]
    } else {
      prev[selector] = child
    }
    return this
  }
}

// declaration merging: 把 IcxPropMethods 的所有 declare 字段拼进 Chain 实例类型
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Chain<T extends ThemeSchema = DefaultSchema>
  extends IcxPropMethods<Chain<T>, T> {}
