import { css } from '@emotion/css'
import type { CSSObject } from '@emotion/css/create-instance'
import { Theme } from '../theme/Theme'
import { buildKeymap } from '../theme/keymap'
import type { ResolvedTheme, ThemeSchema } from '../theme/types'
import type { DefaultSchema } from '../theme/defaults/schema'
import type { IcxPropMethods } from '../types/properties.generated'
import { makeChainProxy } from './proxy'

/**
 * 链式样式 builder。核心入口。
 *
 * 通过 declaration merging（见文件底部）注入所有 `IcxPropMethods` 的 carrier / fn 属性，
 * 让 `chain.color._primary` / `chain.padding.px(16)` 全部强类型。
 */
export class Chain<T extends ThemeSchema = DefaultSchema> {
  /** 累计的 emotion `CSSObject`（含嵌套）。 */
  public _node: Record<string, unknown> = {}
  public _theme: ResolvedTheme<T>
  public _keymap: Map<string, Map<string, string>>

  constructor(theme: ResolvedTheme<T> | Theme<T>) {
    this._theme = theme instanceof Theme ? theme.resolve() : theme
    this._keymap = buildKeymap(this._theme)
    return makeChainProxy(this as unknown as Chain<never>) as unknown as Chain<T>
  }

  // ─── 内建嵌套方法（Phase 1 Day 2 会移植完整实现） ───

  label(name: string): this {
    this._node.label = name
    return this
  }

  _hover(fn: (s: this) => void): this {
    return this._nest('&:hover', fn)
  }

  _focus(fn: (s: this) => void): this {
    return this._nest('&:focus', fn)
  }

  _media(query: string, fn: (s: this) => void): this {
    const sel = query.startsWith('@media') ? query : `@media ${query}`
    return this._nest(sel, fn)
  }

  _when(cond: unknown, fn: (s: this) => void): this {
    if (cond) fn(this)
    return this
  }

  _selector(sel: string, fn: (s: this) => void): this {
    return this._nest(sel, fn)
  }

  /** 单行/多行截断（Phase 2 完善）。 */
  _truncate(lines = 1): this {
    if (lines <= 1) {
      Object.assign(this._node, {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      })
    } else {
      Object.assign(this._node, {
        display: '-webkit-box',
        WebkitLineClamp: lines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      })
    }
    return this
  }

  // ─── 输出 ───

  toCSSObject(): CSSObject {
    return this._node as CSSObject
  }

  toString(): string {
    return css(this._node as CSSObject)
  }

  // ─── 内部 ───

  private _nest(sel: string, fn: (s: this) => void): this {
    const prev = this._node
    const child: Record<string, unknown> = {}
    prev[sel] = child
    this._node = child
    try {
      fn(this)
    } finally {
      this._node = prev
    }
    return this
  }
}

// declaration merging: 把 IcxPropMethods 的所有 declare 字段拼进 Chain 实例类型
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Chain<T extends ThemeSchema = DefaultSchema>
  extends IcxPropMethods<Chain<T>, T> {}
