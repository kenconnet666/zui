import { css } from '@emotion/css'
import type { CSSObject } from '@emotion/css/create-instance'
import { Theme } from '../theme/Theme'
import { buildKeymap } from '../theme/keymap'
import type { ResolvedTheme, ThemeSchema } from '../theme/types'
import type { DefaultSchema } from '../theme/defaults/schema'
import type { IcxPropMethods } from '../types/properties.generated'
import { makeChainProxy } from './proxy'
import { deepClone, deepMergeInto } from './helpers'
import { isProductionEnv, makeCallsiteLabel } from '../dev/stackTrace'

// ─── 内部工具 ───

/** _inspect 用：把 _node 渲染成嵌套 CSS 风字符串。 */
function inspectCss(node: Record<string, unknown>, depth: number): string {
  const indent = '  '.repeat(depth)
  const lines: string[] = []
  for (const key in node) {
    const v = node[key]
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      lines.push(`${indent}${key} {`)
      lines.push(inspectCss(v as Record<string, unknown>, depth + 1))
      lines.push(`${indent}}`)
    } else {
      const cssKey = key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())
      lines.push(`${indent}${cssKey}: ${v as string};`)
    }
  }
  return lines.join('\n')
}

/** _inspect 用：把 _node 渲染成树状字符串。 */
function inspectTree(node: Record<string, unknown>, depth: number): string {
  const indent = '  '.repeat(depth)
  const lines: string[] = []
  for (const key in node) {
    const v = node[key]
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      lines.push(`${indent}${key}/`)
      lines.push(inspectTree(v as Record<string, unknown>, depth + 1))
    } else {
      lines.push(`${indent}${key} = ${String(v)}`)
    }
  }
  return lines.join('\n')
}

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
/** Chain 构造可选项（W5.1 SSR / W3.2 debug 共享）。 */
export interface ChainOptions {
  /**
   * 自定义 css 编译函数（用于 SSR / 多实例隔离场景）。
   * 不传则用 `@emotion/css` 默认 instance 的 `css`。
   */
  cssFn?: (obj: CSSObject) => string
  /**
   * 开发态自动给 chain 加 label 前缀。生产构建（NODE_ENV === 'production'）下忽略。
   * Plan §15.6 D7 opt-in。
   */
  debug?: boolean
}

export class Chain<T extends ThemeSchema = DefaultSchema> {
  /** 累计的 emotion `CSSObject`（含嵌套）。 */
  public _node: Record<string, unknown> = {}
  public _theme: ResolvedTheme<T>
  public _keymap: Map<string, Map<string, string>>
  /** carrier 缓存（避免 chain.color 多次访问反复建 Proxy）。 */
  public _carriers: Map<string, unknown> = new Map()
  /** 自定义 css 编译函数（W5.1，SSR 用户传入；不传走默认 emotion css）。 */
  public _cssFn: (obj: CSSObject) => string

  constructor(theme: ResolvedTheme<T> | Theme<T>, options: ChainOptions = {}) {
    if (theme instanceof Theme) {
      this._theme = theme.resolve()
      // ★ 复用 Theme 实例上的 keymap 缓存（W4.1 / 修 B3）
      this._keymap = theme.getKeymap()
    } else {
      this._theme = theme
      this._keymap = buildKeymap(this._theme)
    }
    this._cssFn = options.cssFn ?? css
    if (options.debug && !isProductionEnv()) {
      // W3.2 完整版：跨 runtime 抽 callsite（dev/stackTrace.ts）
      const label = makeCallsiteLabel(new Error().stack)
      if (label != null) this._node.label = label
    }
    return makeChainProxy(this as unknown as Chain<never>) as unknown as Chain<T>
  }

  // ─── 属性设置 / 逃生舱 ───

  /**
   * emotion `label`：给生成的 className 加语义后缀。
   *
   * **C2**：多次调用会 join 成 `a.b.c`（不再互相覆盖）。
   * 空字符串入参被忽略。重复同名也保留（用户责任）。
   */
  label(name: string): this {
    if (!name) return this
    const existing = this._node.label
    this._node.label = typeof existing === 'string' && existing.length > 0
      ? `${existing}.${name}`
      : name
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

  // ─── W2.1 通用属性选择器（Tailwind v4 风） ───

  /**
   * `&[data-<attr>]` / `&[data-<attr>="<value>"]`。
   *
   * @example
   * s._data('state', 'open', open => { open.color._primary })   // &[data-state="open"]
   * s._data('disabled', undefined, d => { d.opacity._50 })      // &[data-disabled]
   */
  _data(attr: string, value: string | undefined, fn: (s: this) => void): this {
    const sel = value === undefined ? `&[data-${attr}]` : `&[data-${attr}="${value}"]`
    return this._nest(sel, fn)
  }

  /** `&[aria-<attr>]` / `&[aria-<attr>="<value>"]`。 */
  _aria(attr: string, value: string | undefined, fn: (s: this) => void): this {
    const sel = value === undefined ? `&[aria-${attr}]` : `&[aria-${attr}="${value}"]`
    return this._nest(sel, fn)
  }

  /** `&:has(<selector>)`。父级根据子级状态。 */
  _has(selector: string, fn: (s: this) => void): this {
    return this._nest(`&:has(${selector})`, fn)
  }

  /** `&:not(<selector>)`。 */
  _not(selector: string, fn: (s: this) => void): this {
    return this._nest(`&:not(${selector})`, fn)
  }

  /** `&:is(<selector-list>)`。 */
  _is(selectorList: string, fn: (s: this) => void): this {
    return this._nest(`&:is(${selectorList})`, fn)
  }

  /** `&:where(<selector-list>)`。零特异性版 `:is`。 */
  _where(selectorList: string, fn: (s: this) => void): this {
    return this._nest(`&:where(${selectorList})`, fn)
  }

  // ─── W2.2 状态属性 variant ───

  /** `&[open], &[data-state="open"]`（details / dialog / popover 通用）。 */
  _open(fn: (s: this) => void): this {
    return this._nest('&[open], &[data-state="open"]', fn)
  }

  /** `&:not([open]), &[data-state="closed"]`。 */
  _closed(fn: (s: this) => void): this {
    return this._nest('&:not([open]), &[data-state="closed"]', fn)
  }

  /** `&[data-loading="true"]`。 */
  _loading(fn: (s: this) => void): this {
    return this._nest('&[data-loading="true"]', fn)
  }

  /** `&[inert]`。 */
  _inert(fn: (s: this) => void): this {
    return this._nest('&[inert]', fn)
  }

  /** `@media (forced-colors: active)`。Windows 高对比度模式。 */
  _forcedColors(fn: (s: this) => void): this {
    return this._nest('@media (forced-colors: active)', fn)
  }

  // ─── W2.3 @starting-style ───

  /**
   * `@starting-style { & { ... } }`。
   *
   * 配合 `interpolate-size: allow-keywords` 可实现 `height: 0 → height: auto` 动画。
   */
  _starting(fn: (s: this) => void): this {
    return this._nest('@starting-style', s => s._nest('&', fn))
  }

  // ─── W2.4 Container query variant 简写 ───

  /** `@container (min-width: theme.breakpoint.sm)`。 */
  _containerSm(fn: (s: this) => void): this { return this._container('_sm', fn) }
  _containerMd(fn: (s: this) => void): this { return this._container('_md', fn) }
  _containerLg(fn: (s: this) => void): this { return this._container('_lg', fn) }
  _containerXl(fn: (s: this) => void): this { return this._container('_xl', fn) }
  _container2xl(fn: (s: this) => void): this { return this._container('_2xl', fn) }

  // ─── W2.5 group / peer data 变种 ───

  /** `:where(.group)[data-<attr>="<value>"] &`。 */
  _groupData(attr: string, value: string | undefined, fn: (s: this) => void): this {
    const matcher = value === undefined ? `[data-${attr}]` : `[data-${attr}="${value}"]`
    return this._nest(`:where(.group)${matcher} &`, fn)
  }

  /** `:where(.peer)[data-<attr>="<value>"] ~ &`。 */
  _peerData(attr: string, value: string | undefined, fn: (s: this) => void): this {
    const matcher = value === undefined ? `[data-${attr}]` : `[data-${attr}="${value}"]`
    return this._nest(`:where(.peer)${matcher} ~ &`, fn)
  }

  /** `:where(.group)[aria-<attr>="<value>"] &`。 */
  _groupAria(attr: string, value: string | undefined, fn: (s: this) => void): this {
    const matcher = value === undefined ? `[aria-${attr}]` : `[aria-${attr}="${value}"]`
    return this._nest(`:where(.group)${matcher} &`, fn)
  }

  /** `:where(.peer)[aria-<attr>="<value>"] ~ &`。 */
  _peerAria(attr: string, value: string | undefined, fn: (s: this) => void): this {
    const matcher = value === undefined ? `[aria-${attr}]` : `[aria-${attr}="${value}"]`
    return this._nest(`:where(.peer)${matcher} ~ &`, fn)
  }

  // ─── W8.2 @layer chain method ───

  /** `@layer <name> { & { ... } }`。配合 W8.1 `injectLayerOrder` 控制级联优先级。 */
  _layer(name: string, fn: (s: this) => void): this {
    return this._nest(`@layer ${name}`, s => s._nest('&', fn))
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

  // ─── W7 Pattern 库（Panda / Chakra 风组合 helper） ───

  /**
   * Flex stack 布局简写。
   *
   * @example
   * s._stack({ direction: 'row', gap: '_md', align: 'center', justify: 'spaceBetween' })
   */
  _stack(opts: {
    direction?: 'row' | 'column' | 'rowReverse' | 'columnReverse'
    gap?: string | number
    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
    justify?: 'start' | 'center' | 'end' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly'
    inline?: boolean
  } = {}): this {
    this._node.display = opts.inline ? 'inline-flex' : 'flex'
    const dirMap: Record<string, string> = { row: 'row', column: 'column', rowReverse: 'row-reverse', columnReverse: 'column-reverse' }
    if (opts.direction) this._node.flexDirection = dirMap[opts.direction]
    if (opts.gap !== undefined) {
      const g = opts.gap
      if (typeof g === 'string' && g.startsWith('_')) {
        const name = g.slice(1)
        const slot = (this._theme as Record<string, Record<string, string | number> | undefined>).spacing
        const value = slot?.[name]
        this._node.gap = value ?? g
      } else {
        this._node.gap = g
      }
    }
    const alignMap: Record<string, string> = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch', baseline: 'baseline' }
    const justifyMap: Record<string, string> = {
      start: 'flex-start', center: 'center', end: 'flex-end',
      spaceBetween: 'space-between', spaceAround: 'space-around', spaceEvenly: 'space-evenly',
    }
    if (opts.align) this._node.alignItems = alignMap[opts.align]
    if (opts.justify) this._node.justifyContent = justifyMap[opts.justify]
    return this
  }

  /**
   * Grid 简写。
   *
   * @example
   * s._grid({ cols: 3, gap: '_md' })          // 3 列等宽
   * s._grid({ cols: 'auto 1fr auto' })        // 字面 template
   */
  _grid(opts: {
    cols?: number | string
    rows?: number | string
    gap?: string | number
    inline?: boolean
  } = {}): this {
    this._node.display = opts.inline ? 'inline-grid' : 'grid'
    if (opts.cols !== undefined) {
      this._node.gridTemplateColumns = typeof opts.cols === 'number' ? `repeat(${opts.cols}, minmax(0, 1fr))` : opts.cols
    }
    if (opts.rows !== undefined) {
      this._node.gridTemplateRows = typeof opts.rows === 'number' ? `repeat(${opts.rows}, minmax(0, 1fr))` : opts.rows
    }
    if (opts.gap !== undefined) {
      const g = opts.gap
      if (typeof g === 'string' && g.startsWith('_')) {
        const name = g.slice(1)
        const slot = (this._theme as Record<string, Record<string, string | number> | undefined>).spacing
        const value = slot?.[name]
        this._node.gap = value ?? g
      } else {
        this._node.gap = g
      }
    }
    return this
  }

  /** `aspect-ratio: 16 / 9`（video）。 */
  _aspectVideo(): this { this._node.aspectRatio = '16 / 9'; return this }
  /** `aspect-ratio: 1 / 1`（square）。 */
  _aspectSquare(): this { this._node.aspectRatio = '1 / 1'; return this }
  /** `aspect-ratio: 3 / 4`（portrait）。 */
  _aspectPortrait(): this { this._node.aspectRatio = '3 / 4'; return this }
  /** `aspect-ratio: 4 / 3`（landscape）。 */
  _aspectLandscape(): this { this._node.aspectRatio = '4 / 3'; return this }

  /**
   * a11y 焦点环（`:focus-visible` 内设 outline）。
   *
   * @example
   * s._focusRing({ color: '_primary', width: 2, offset: 2 })
   */
  _focusRing(opts: {
    color?: string  // token (e.g. '_primary') 或字面 css color
    width?: number
    offset?: number
    style?: 'solid' | 'dashed' | 'dotted' | 'double'
  } = {}): this {
    const width = opts.width ?? 2
    const offset = opts.offset ?? 2
    const style = opts.style ?? 'solid'
    let color: string | number = 'currentColor'
    if (opts.color) {
      if (opts.color.startsWith('_')) {
        const name = opts.color.slice(1)
        const slot = (this._theme as Record<string, Record<string, string | number> | undefined>).color
        color = slot?.[name] ?? opts.color
      } else {
        color = opts.color
      }
    }
    return this._nest('&:focus-visible', s => {
      s._node.outline = `${width}px ${style} ${color}`
      s._node.outlineOffset = `${offset}px`
    })
  }

  /**
   * 视觉隐藏但屏读器可读（与 `_srOnly` 等价；语义化别名，修 C12）。
   */
  _visuallyHidden(): this { return this._srOnly() }

  /** 绝对铺满父级（`position: absolute; inset: 0`）。 */
  _fillParent(): this {
    this._node.position = 'absolute'
    this._node.inset = '0'
    return this
  }

  /** 跳过链接（典型 a11y "skip to content"）。 */
  _skipLink(): this {
    this._node.position = 'absolute'
    this._node.left = '-9999px'
    this._node.zIndex = 999
    return this._nest('&:focus', s => {
      s._node.left = '50%'
      s._node.translate = '-50% 0'
    })
  }

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

  /**
   * absolute 居中（top/left 50% + translate -50%）。
   *
   * 使用 CSS 标准 `translate` longhand（与 W1.3 Transform helpers 一致），不拼 transform shorthand。
   */
  _absoluteCenter(): this {
    this._node.position = 'absolute'
    this._node.top = '50%'
    this._node.left = '50%'
    this._node.translate = '-50% -50%'
    return this
  }

  // ─── W1.3 Transform longhand helpers（CSS Working Group / Tailwind v4 风） ───
  //
  // 设计：用 CSS 标准的 `translate` / `rotate` / `scale` longhand 独立属性，不拼 `transform` shorthand。
  // 数值类参数支持 `number`（自动加 px / deg）或 `string`（直接用）。

  /** `translate: <x> [<y>]`。number → px。 */
  _translate(x: number | string, y?: number | string): this {
    const xv = typeof x === 'number' ? `${x}px` : x
    const yv = y === undefined ? '' : (typeof y === 'number' ? ` ${y}px` : ` ${y}`)
    this._node.translate = `${xv}${yv}`
    return this
  }
  _translateX(v: number | string): this {
    this._node.translate = typeof v === 'number' ? `${v}px` : v
    return this
  }
  _translateY(v: number | string): this {
    const yv = typeof v === 'number' ? `${v}px` : v
    this._node.translate = `0 ${yv}`
    return this
  }
  _translateZ(v: number | string): this {
    const zv = typeof v === 'number' ? `${v}px` : v
    this._node.translate = `0 0 ${zv}`
    return this
  }

  /** `rotate: <deg>deg`。 */
  _rotate(deg: number | string): this {
    this._node.rotate = typeof deg === 'number' ? `${deg}deg` : deg
    return this
  }
  _rotateX(deg: number | string): this {
    const d = typeof deg === 'number' ? `${deg}deg` : deg
    this._node.rotate = `x ${d}`
    return this
  }
  _rotateY(deg: number | string): this {
    const d = typeof deg === 'number' ? `${deg}deg` : deg
    this._node.rotate = `y ${d}`
    return this
  }
  _rotateZ(deg: number | string): this {
    const d = typeof deg === 'number' ? `${deg}deg` : deg
    this._node.rotate = `z ${d}`
    return this
  }

  /** `scale: <n> [<ny>]`。 */
  _scale(n: number, ny?: number): this {
    this._node.scale = ny === undefined ? `${n}` : `${n} ${ny}`
    return this
  }
  _scaleX(n: number): this { this._node.scale = `${n} 1`; return this }
  _scaleY(n: number): this { this._node.scale = `1 ${n}`; return this }
  _scaleZ(n: number): this { this._node.scale = `1 1 ${n}`; return this }

  /**
   * `transform: skew(<x>deg [, <y>deg])`。
   *
   * CSS 没有 `skew` longhand，只能走 transform shorthand。
   */
  _skew(x: number, y?: number): this {
    this._node.transform = y === undefined ? `skew(${x}deg)` : `skew(${x}deg, ${y}deg)`
    return this
  }

  /** `perspective: <length>` 独立 property。 */
  _perspective(v: number | string): this {
    this._node.perspective = typeof v === 'number' ? `${v}px` : v
    return this
  }

  /** `transform-origin: <value>` 独立 property。 */
  _transformOrigin(v: string): this {
    this._node.transformOrigin = v
    return this
  }

  /** `transform-style: preserve-3d`（3D 嵌套场景必须）。 */
  _preserve3d(): this {
    this._node.transformStyle = 'preserve-3d'
    return this
  }

  // ─── W1.4 Filter / Backdrop filter 二级 helpers ───
  //
  // CSS `filter` 没有 longhand 替代，本质上 = 函数 list 累加。多次调用按声明顺序拼接。

  private _appendFilter(prop: 'filter' | 'backdropFilter', segment: string): this {
    const existing = this._node[prop]
    this._node[prop] = existing ? `${existing} ${segment}` : segment
    return this
  }

  /** `filter: blur(<px>px)`。沿用 token 风格的 W1.4 helper。 */
  _filterBlur(px: number): this { return this._appendFilter('filter', `blur(${px}px)`) }
  _filterBrightness(pct: number): this { return this._appendFilter('filter', `brightness(${pct}%)`) }
  _filterContrast(pct: number): this { return this._appendFilter('filter', `contrast(${pct}%)`) }
  _filterGrayscale(pct: number): this { return this._appendFilter('filter', `grayscale(${pct}%)`) }
  _filterHueRotate(deg: number): this { return this._appendFilter('filter', `hue-rotate(${deg}deg)`) }
  _filterInvert(pct: number): this { return this._appendFilter('filter', `invert(${pct}%)`) }
  _filterSaturate(pct: number): this { return this._appendFilter('filter', `saturate(${pct}%)`) }
  _filterSepia(pct: number): this { return this._appendFilter('filter', `sepia(${pct}%)`) }
  _filterDropShadow(spec: string): this { return this._appendFilter('filter', `drop-shadow(${spec})`) }

  _backdropFilterBlur(px: number): this { return this._appendFilter('backdropFilter', `blur(${px}px)`) }
  _backdropFilterBrightness(pct: number): this { return this._appendFilter('backdropFilter', `brightness(${pct}%)`) }
  _backdropFilterContrast(pct: number): this { return this._appendFilter('backdropFilter', `contrast(${pct}%)`) }
  _backdropFilterGrayscale(pct: number): this { return this._appendFilter('backdropFilter', `grayscale(${pct}%)`) }
  _backdropFilterHueRotate(deg: number): this { return this._appendFilter('backdropFilter', `hue-rotate(${deg}deg)`) }
  _backdropFilterInvert(pct: number): this { return this._appendFilter('backdropFilter', `invert(${pct}%)`) }
  _backdropFilterSaturate(pct: number): this { return this._appendFilter('backdropFilter', `saturate(${pct}%)`) }
  _backdropFilterSepia(pct: number): this { return this._appendFilter('backdropFilter', `sepia(${pct}%)`) }

  // ─── 既有 _blur / _backdropBlur 保留（token 风的简写，比新增 _filterBlur 更高语义） ───

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

  // ─── W1.5 Gradient helpers ───
  //
  // 设 `_node.backgroundImage = '<gradient>'`，不做 token 解析（stops 由用户提供 raw string）。

  /** `background-image: linear-gradient(<angle>, <stops...>)`。 */
  _linearGradient(angle: number | string, stops: string[]): this {
    const a = typeof angle === 'number' ? `${angle}deg` : angle
    this._node.backgroundImage = `linear-gradient(${a}, ${stops.join(', ')})`
    return this
  }

  /** `background-image: radial-gradient(<shape>, <stops...>)`. */
  _radialGradient(shape: string, stops: string[]): this {
    this._node.backgroundImage = `radial-gradient(${shape}, ${stops.join(', ')})`
    return this
  }

  /** `background-image: conic-gradient(from <angle>, <stops...>)`. */
  _conicGradient(angle: number | string, stops: string[]): this {
    const a = typeof angle === 'number' ? `from ${angle}deg` : `from ${angle}`
    this._node.backgroundImage = `conic-gradient(${a}, ${stops.join(', ')})`
    return this
  }

  // ─── Batch C — Transition 简写 helper ───

  /**
   * Transition 简写。token 名（`_normal` / `_inOut` 等）自动解析到 `theme.duration` /
   * `theme.easing`；字面量字符串 / 数字（视为 ms）原样透传。
   *
   * @example
   * s._transition({ property: 'all', duration: '_normal', easing: '_inOut' })
   * // → transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1)
   *
   * s._transition({ property: 'opacity', duration: 200, easing: 'ease-out' })
   * // → transition: opacity 200ms ease-out
   *
   * s._transition({ duration: '_fast' })
   * // → transition: all 150ms
   */
  _transition(opts: {
    property?: string
    duration?: `_${string}` | string | number
    easing?: `_${string}` | string
    delay?: `_${string}` | string | number
  }): this {
    const parts: string[] = [opts.property ?? 'all']
    if (opts.duration !== undefined) parts.push(this._resolveDurationToken(opts.duration))
    if (opts.easing !== undefined) parts.push(this._resolveEasingToken(opts.easing))
    if (opts.delay !== undefined) parts.push(this._resolveDurationToken(opts.delay))
    this._node.transition = parts.join(' ')
    return this
  }

  /** `_normal` → `theme.duration.normal`；数字 → `${n}ms`；其它原样。 */
  private _resolveDurationToken(value: string | number): string {
    if (typeof value === 'number') return `${value}ms`
    if (value.startsWith('_')) {
      const name = value.slice(1)
      const slot = (this._theme as Record<string, Record<string, string | number> | undefined>).duration
      const v = slot?.[name]
      return v != null ? String(v) : value
    }
    return value
  }

  /** `_inOut` → `theme.easing.inOut`；其它原样。 */
  private _resolveEasingToken(value: string): string {
    if (value.startsWith('_')) {
      const name = value.slice(1)
      const slot = (this._theme as Record<string, Record<string, string | number> | undefined>).easing
      const v = slot?.[name]
      return v != null ? String(v) : value
    }
    return value
  }

  // ─── Batch 4 — 现代 CSS 4 helper（实用主义筛选，跳过实验性 anchor）───

  /**
   * 写 safe area inset（iOS notch / home indicator / Android nav bar 留白）。
   *
   * 默认写 padding，第二参可改 `margin` / `inset`。`'all'` 一次写 4 边。
   *
   * @example
   * s._safeArea('bottom')          // padding-bottom: env(safe-area-inset-bottom)
   * s._safeArea('all')             // padding-{top,right,bottom,left}
   * s._safeArea('top', 'margin')   // margin-top: env(safe-area-inset-top)
   * s._safeArea('all', 'inset')    // inset-block-start/end + inset-inline-start/end
   */
  _safeArea(
    side: 'top' | 'right' | 'bottom' | 'left' | 'all' = 'all',
    property: 'padding' | 'margin' | 'inset' = 'padding',
  ): this {
    const sides = side === 'all' ? (['top', 'right', 'bottom', 'left'] as const) : [side]
    for (const s of sides) {
      const cssKey = property === 'inset' ? `inset-${s}` : `${property}-${s}`
      // camelCase
      const camel = cssKey.replace(/-([a-z])/g, (_, c) => (c as string).toUpperCase())
      this._node[camel] = `env(safe-area-inset-${s})`
    }
    return this
  }

  /**
   * 滚动捕捉简写。CSS Scroll Snap Level 1。
   *
   * - `type` 写到当前元素的 `scroll-snap-type`（容器侧）
   * - `align` / `stop` 写到当前元素的 `scroll-snap-align` / `scroll-snap-stop`（子项侧）
   * - 实际用法：父容器用 `type` + `strictness`，子项用 `align` + `stop`，按需取舍
   *
   * @example
   * // 容器
   * s._scrollSnap({ type: 'y', strictness: 'mandatory' })
   * // 子项
   * s._scrollSnap({ align: 'center', stop: 'always' })
   */
  _scrollSnap(opts: {
    type?: 'x' | 'y' | 'both' | 'block' | 'inline' | 'none'
    strictness?: 'mandatory' | 'proximity'
    align?: 'start' | 'end' | 'center' | 'none'
    stop?: 'normal' | 'always'
  }): this {
    if (opts.type !== undefined) {
      const strict = opts.strictness ? ` ${opts.strictness}` : ''
      this._node.scrollSnapType = `${opts.type}${strict}`
    }
    if (opts.align !== undefined) this._node.scrollSnapAlign = opts.align
    if (opts.stop !== undefined) this._node.scrollSnapStop = opts.stop
    return this
  }

  /**
   * 设置 overscroll-behavior。控制滚动到边界时是否传播给父级 / 触发刷新等。
   *
   * @example
   * s._overscroll('contain')         // overscroll-behavior: contain（防止页面下拉刷新）
   * s._overscroll('none', 'y')       // overscroll-behavior-y: none（仅纵向）
   * s._overscroll('auto', 'inline')  // overscroll-behavior-inline: auto
   */
  _overscroll(
    behavior: 'auto' | 'contain' | 'none',
    axis?: 'x' | 'y' | 'inline' | 'block',
  ): this {
    if (axis === undefined) {
      this._node.overscrollBehavior = behavior
    } else {
      const key = `overscrollBehavior${axis.charAt(0).toUpperCase()}${axis.slice(1)}` as
        | 'overscrollBehaviorX'
        | 'overscrollBehaviorY'
        | 'overscrollBehaviorInline'
        | 'overscrollBehaviorBlock'
      this._node[key] = behavior
    }
    return this
  }

  /**
   * Field sizing — 让 `<input>` / `<textarea>` / `<select>` 按内容自适应尺寸。
   *
   * - `'content'` → 元素跟随内容长度自动伸缩
   * - `'fixed'`（默认浏览器行为）→ 元素保持固定尺寸
   *
   * CSS Working Group 草案，2024+ Chromium / Firefox 实现中。
   *
   * @example
   * s._field('content')   // field-sizing: content
   * s._field('fixed')     // field-sizing: fixed
   */
  _field(sizing: 'content' | 'fixed'): this {
    this._node.fieldSizing = sizing
    return this
  }

  // ─── 输出 ───

  toCSSObject(): CSSObject {
    return this._node as CSSObject
  }

  toString(): string {
    return this._cssFn(this._node as CSSObject)
  }

  /**
   * W3.1 — debug 工具：把当前 `_node` 树打印为可读字符串。
   *
   * @example
   * console.log(c._inspect())              // 默认 css 风
   * console.log(c._inspect({ format: 'json' }))
   * console.log(c._inspect({ format: 'tree' }))
   */
  _inspect(options: { format?: 'css' | 'json' | 'tree' } = {}): string {
    const format = options.format ?? 'css'
    if (format === 'json') return JSON.stringify(this._node, null, 2)
    if (format === 'tree') return inspectTree(this._node, 0)
    return inspectCss(this._node, 0)
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
