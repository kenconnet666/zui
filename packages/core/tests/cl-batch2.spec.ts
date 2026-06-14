import { describe, expect, it } from 'vitest'
import { Chain, applyResponsive, applyStyleProps, isResponsiveValue } from '../src'
import { defaultLight } from './_fixture-theme'

/**
 * CL Batch 2 测试 — 响应式 + applyStyleProps API 统一 + boolean variants。
 */

// ────────────────────────────────────────────────────────────────────────────
// E4 — applyResponsive
// ────────────────────────────────────────────────────────────────────────────

describe('E4 — applyResponsive 响应式值解析', () => {
  it('普通值直接 apply', () => {
    const c = new Chain(defaultLight)
    applyResponsive(c, 16, (s, v: number) => s.padding.px(v))
    expect(c._node.padding).toBe('16px')
  })

  it('响应式对象：base + middle', () => {
    const c = new Chain(defaultLight)
    applyResponsive(c, { base: 8, middle: 16 }, (s, v: number) => s.padding.px(v))
    expect(c._node.padding).toBe('8px')
    // middle 走 _media('_middle', ...)
    const mediaKey = Object.keys(c._node).find(k => k.startsWith('@media'))
    expect(mediaKey).toBeDefined()
    const inner = c._node[mediaKey as string] as Record<string, unknown>
    expect(inner.padding).toBe('16px')
  })

  it('全响应式断点（base + tiny + small + middle + large + huge）', () => {
    const c = new Chain(defaultLight)
    applyResponsive(
      c,
      { base: 4, tiny: 6, small: 8, middle: 10, large: 12, huge: 14 },
      (s, v: number) => s.padding.px(v),
    )
    expect(c._node.padding).toBe('4px')
    // 5 个 @media（tiny/small/middle/large/huge）
    const mediaKeys = Object.keys(c._node).filter(k => k.startsWith('@media'))
    expect(mediaKeys.length).toBe(5)
  })

  it('undefined 值跳过整个 apply', () => {
    const c = new Chain(defaultLight)
    applyResponsive(c, undefined, (s, v: number) => s.padding.px(v))
    expect(c._node.padding).toBeUndefined()
  })

  it('对象内 undefined 字段跳过', () => {
    const c = new Chain(defaultLight)
    applyResponsive(c, { base: 8, middle: undefined, large: 16 }, (s, v: number) => s.padding.px(v))
    expect(c._node.padding).toBe('8px')
    const mediaKeys = Object.keys(c._node).filter(k => k.startsWith('@media'))
    expect(mediaKeys.length).toBe(1) // 只 large
  })

  it('字符串值也能响应式', () => {
    const c = new Chain(defaultLight)
    applyResponsive(c, { base: 'red', middle: 'blue' }, (s, v) => s.color(v as string))
    expect(c._node.color).toBe('red')
  })
})

describe('isResponsiveValue 判断', () => {
  it('普通值不是响应式', () => {
    expect(isResponsiveValue(16)).toBe(false)
    expect(isResponsiveValue('red')).toBe(false)
    expect(isResponsiveValue(null)).toBe(false)
    expect(isResponsiveValue(undefined)).toBe(false)
    expect(isResponsiveValue([1, 2, 3])).toBe(false)
  })

  it('plain object with base / breakpoint keys 是响应式', () => {
    expect(isResponsiveValue({ base: 16 })).toBe(true)
    expect(isResponsiveValue({ base: 4, middle: 8 })).toBe(true)
    expect(isResponsiveValue({ small: 4 })).toBe(true)
  })

  it('空对象不是响应式', () => {
    expect(isResponsiveValue({})).toBe(false)
  })

  it('含非合法 ident key 的对象不是响应式（防误判）', () => {
    expect(isResponsiveValue({ '.btn': 'red' })).toBe(false)
    expect(isResponsiveValue({ '@media': 'red' })).toBe(false)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// F1 — applyStyleProps (theme, props) 新签名
// ────────────────────────────────────────────────────────────────────────────

describe('F1 — applyStyleProps 双签名', () => {
  it('旧签名 (chain, props) 返回 void', () => {
    const c = new Chain(defaultLight)
    const result = applyStyleProps(c, { p: '_middle' })
    expect(result).toBeUndefined()
    expect(c._node.padding).toBeDefined()
  })

  it('新签名 (theme, props) 返回 className', () => {
    const cls = applyStyleProps(defaultLight, { p: '_middle', color: '_primary' })
    expect(typeof cls).toBe('string')
    expect((cls as string).length).toBeGreaterThan(0)
  })

  it('新签名同样 props 输出相同 className（emotion content hash）', () => {
    const a = applyStyleProps(defaultLight, { p: '_middle', bg: '_primary' })
    const b = applyStyleProps(defaultLight, { p: '_middle', bg: '_primary' })
    expect(a).toBe(b)
  })
})

describe('F1 + E4 — applyStyleProps 响应式 prop', () => {
  it('p: { base: 4, middle: 8 } 自动 _media 嵌套（middle = theme.breakpoint.middle）', () => {
    const c = new Chain(defaultLight)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    applyStyleProps(c, { p: { base: 4, middle: 8 } as any })
    expect(c._node.padding).toBe(4)
    const mediaKeys = Object.keys(c._node).filter(k => k.startsWith('@media'))
    expect(mediaKeys.length).toBeGreaterThan(0)
  })

  it('px: { base, md } → 同时响应式两个 cssProp（paddingLeft + paddingRight）', () => {
    const c = new Chain(defaultLight)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    applyStyleProps(c, { px: { base: 4, middle: 8 } as any })
    expect(c._node.paddingLeft).toBe(4)
    expect(c._node.paddingRight).toBe(4)
    const mediaKeys = Object.keys(c._node).filter(k => k.startsWith('@media'))
    expect(mediaKeys.length).toBeGreaterThan(0)
  })

  it('color: { base, md } 响应式 color', () => {
    const c = new Chain(defaultLight)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    applyStyleProps(c, { color: { base: 'red', middle: 'blue' } as any })
    expect(c._node.color).toBe('red')
  })

  it('混合响应式与普通值', () => {
    const c = new Chain(defaultLight)

    applyStyleProps(c, {
      p: { base: 4, middle: 8 } as any,
      bg: '_primary',
      rounded: 4,
    })
    expect(c._node.padding).toBe(4)
    expect(c._node.backgroundColor).toBeDefined()
    expect(c._node.borderRadius).toBe(4)
  })
})
