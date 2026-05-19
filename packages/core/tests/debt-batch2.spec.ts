import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  Chain,
  Theme,
  applyStyleProps,
  cx,
  defaultLight,
} from '../src'
import { deepClone } from '../src/chain/helpers'
import { darken, lighten, setAlpha } from '../src/chain/color'
import type { StyleProps } from '../src'

/**
 * Debt Batch 2 测试（M4 / M5 / M7 / M8 / L1 / L3）。
 */

// ────────────────────────────────────────────────────────────────────────────
// M5 — cx 支持 object / array
// ────────────────────────────────────────────────────────────────────────────

describe('M5 — cx 多形态入参', () => {
  it('字符串拼接（基础）', () => {
    const r = cx('foo', 'bar')
    expect(typeof r).toBe('string')
    expect(r).toContain('foo')
    expect(r).toContain('bar')
  })

  it('falsy 跳过：false / null / undefined / 0 / ""', () => {
    const r = cx('foo', false, null, undefined, 0, '', 'bar')
    expect(r).toContain('foo')
    expect(r).toContain('bar')
  })

  it('对象形 `{ active: true }`', () => {
    const r = cx({ active: true, disabled: false, hidden: 1 })
    expect(r).toContain('active')
    expect(r).toContain('hidden')
    expect(r).not.toContain('disabled')
  })

  it('数组嵌套递归扁平', () => {
    const r = cx(['a', 'b', ['c', ['d']]], 'e')
    expect(r).toContain('a')
    expect(r).toContain('b')
    expect(r).toContain('c')
    expect(r).toContain('d')
    expect(r).toContain('e')
  })

  it('混合 string / object / array', () => {
    const r = cx('base', { active: true }, ['utility', { disabled: false }])
    expect(r).toContain('base')
    expect(r).toContain('active')
    expect(r).toContain('utility')
    expect(r).not.toContain('disabled')
  })

  it('数字入参转为字符串', () => {
    const r = cx(42, 'foo')
    expect(r).toContain('42')
    expect(r).toContain('foo')
  })

  it('空入参返回空字符串', () => {
    expect(cx()).toBe('')
  })

  it('全 falsy 返回空字符串', () => {
    expect(cx(false, null, undefined, '')).toBe('')
  })
})

// ────────────────────────────────────────────────────────────────────────────
// M4 — Theme 构造 dev warn function token
// ────────────────────────────────────────────────────────────────────────────

describe('M4 — Theme 构造对 function token 发警告', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('schema 含 function token → 警告一次', () => {
    new Theme({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      color: { primary: '#000', danger: ((ctx: unknown) => '#dc2626') as any },
    })
    expect(warnSpy).toHaveBeenCalledTimes(1)
    const msg = warnSpy.mock.calls[0]?.[0] as string
    expect(msg).toContain('color.danger')
    expect(msg).toContain('theme.resolve()')
  })

  it('多个 function token → 只警告一次（防刷屏）', () => {
    new Theme({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      color: { a: (() => '#000') as any, b: (() => '#fff') as any },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      spacing: { md: (() => '16px') as any },
    })
    expect(warnSpy).toHaveBeenCalledTimes(1)
  })

  it('字面量 schema 无警告', () => {
    new Theme({ color: { primary: '#2563eb' } })
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('production 模式不警告', () => {
    const orig = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    try {
      new Theme({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        color: { primary: (() => '#000') as any },
      })
      expect(warnSpy).not.toHaveBeenCalled()
    } finally {
      process.env.NODE_ENV = orig
    }
  })
})

// ────────────────────────────────────────────────────────────────────────────
// M7 — deepClone 跳 undefined 字段（JSDoc 约定）
// ────────────────────────────────────────────────────────────────────────────

describe('M7 — deepClone undefined 字段行为', () => {
  it('undefined 字段被跳过', () => {
    const src = { a: 1, b: undefined, c: 3 }
    const out = deepClone(src) as Record<string, unknown>
    expect(out).toEqual({ a: 1, c: 3 })
    expect('b' in out).toBe(false)
  })

  it('null 字段保留', () => {
    const src = { a: 1, b: null, c: 3 }
    const out = deepClone(src) as Record<string, unknown>
    expect(out).toEqual({ a: 1, b: null, c: 3 })
  })

  it('嵌套对象内的 undefined 也跳过', () => {
    const src = { x: { a: 1, b: undefined } }
    const out = deepClone(src) as Record<string, Record<string, unknown>>
    expect(out.x).toEqual({ a: 1 })
  })

  it('数组中的 undefined 项保留（避免索引漂移）', () => {
    const src = [1, undefined, 3]
    const out = deepClone(src) as unknown[]
    expect(out.length).toBe(3)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// M8 — color clamp NaN 防御
// ────────────────────────────────────────────────────────────────────────────

describe('M8 — color clamp NaN / Infinity 防御', () => {
  it('setAlpha NaN → alpha 0', () => {
    const r = setAlpha('#2563eb', NaN)
    expect(r).toMatch(/rgba\([^)]*,\s*0\)/)
    expect(r).not.toContain('NaN')
  })

  it('setAlpha Infinity → clamp 到 1（先变 0 因 isFinite=false）', () => {
    const r = setAlpha('#2563eb', Infinity)
    expect(r).not.toContain('Infinity')
    expect(r).not.toContain('NaN')
  })

  it('darken NaN → 安全返回（不带 NaN）', () => {
    const r = darken('#2563eb', NaN)
    expect(r).not.toContain('NaN')
  })

  it('lighten Infinity → 安全（不带 Infinity）', () => {
    const r = lighten('#2563eb', Infinity)
    expect(r).not.toContain('Infinity')
  })

  it('正常 alpha 仍工作', () => {
    const r = setAlpha('#2563eb', 0.5)
    expect(r).toMatch(/rgba\([^)]*,\s*0\.5\)/)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// L1 — _node readonly 防止 reassign
// ────────────────────────────────────────────────────────────────────────────

describe('L1 — Chain._node readonly 兼容性', () => {
  it('_node mutation 仍允许（escape hatch 保留）', () => {
    const c = new Chain(defaultLight)
    ;(c._node as Record<string, unknown>).customColor = '#abc'
    expect(c._node.customColor).toBe('#abc')
  })

  it('_node 通过 carrier 正常写入', () => {
    const c = new Chain(defaultLight)
    c.color._primary
    expect(c._node.color).toBeDefined()
  })

  it('_nest 切换 _node 引用仍工作（内部 cast）', () => {
    const c = new Chain(defaultLight)
    c._hover(h => { h.color.white })
    expect((c._node['&:hover'] as Record<string, unknown>).color).toBe('white')
  })

  it('_node 是同一引用（不会无意创建新对象）', () => {
    const c = new Chain(defaultLight)
    const ref1 = c._node
    c.padding.px(8)
    const ref2 = c._node
    expect(ref1).toBe(ref2)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// L3 — applyStyleProps 运行时测试
// ────────────────────────────────────────────────────────────────────────────

describe('L3 — applyStyleProps 运行时分派', () => {
  it('alias 单 prop：p → padding', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { p: '_md' })
    expect(c._node.padding).toBeDefined()
  })

  it('alias 多 prop：px → paddingLeft + paddingRight', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { px: '_md' })
    expect(c._node.paddingLeft).toBeDefined()
    expect(c._node.paddingRight).toBeDefined()
  })

  it('alias bg → backgroundColor', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { bg: '_primary' })
    expect(c._node.backgroundColor).toBeDefined()
  })

  it('color token 走 carrier 命中', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { color: '_primary' })
    expect(c._node.color).toBeDefined()
  })

  it('字面量 string 走函数态', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { color: '#ff0000' })
    expect(c._node.color).toBe('#ff0000')
  })

  it('字面量 number 走函数态（emotion 自动加 px）', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { p: 16 })
    expect(c._node.padding).toBe(16)
  })

  it('混合 props 一次性 apply', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, {
      color: '_primary',
      bg: '_bg',
      p: '_md',
      rounded: 8,
    })
    expect(c._node.color).toBeDefined()
    expect(c._node.backgroundColor).toBeDefined()
    expect(c._node.padding).toBeDefined()
    expect(c._node.borderRadius).toBe(8)
  })

  it('undefined / null 值跳过', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { p: undefined, color: '_primary' } as StyleProps)
    expect(c._node.padding).toBeUndefined()
    expect(c._node.color).toBeDefined()
  })

  it('rounded → borderRadius', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { rounded: '_md' })
    expect(c._node.borderRadius).toBeDefined()
  })

  it('shadow → boxShadow', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { shadow: '0 2px 4px rgba(0,0,0,0.1)' })
    expect(c._node.boxShadow).toBe('0 2px 4px rgba(0,0,0,0.1)')
  })

  it('w / h → width / height（数字）', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { w: 100, h: 200 })
    expect(c._node.width).toBe(100)
    expect(c._node.height).toBe(200)
  })

  it('mt / mr / mb / ml → 四角 margin', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { mt: 4, mr: 8, mb: 12, ml: 16 })
    expect(c._node.marginTop).toBe(4)
    expect(c._node.marginRight).toBe(8)
    expect(c._node.marginBottom).toBe(12)
    expect(c._node.marginLeft).toBe(16)
  })

  it('zIndex / opacity 直传', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { zIndex: 10, opacity: 0.5 })
    expect(c._node.zIndex).toBe(10)
    expect(c._node.opacity).toBe(0.5)
  })

  it('gap token 解析', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { gap: '_md' })
    expect(c._node.gap).toBeDefined()
  })
})
