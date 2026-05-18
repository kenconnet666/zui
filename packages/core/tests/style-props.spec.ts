import { describe, expect, it } from 'vitest'
import { Chain, applyStyleProps, defaultLight } from '../src'
import type { StyleProps, TokenOf } from '../src'

describe('W10 — StyleProps + applyStyleProps', () => {
  it('p (padding) 接 token', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { p: '_md' })
    expect(c._node.padding).toBe('16px')
  })

  it('p 接 number', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { p: 16 })
    expect(c._node.padding).toBe(16)
  })

  it('px 同时设 paddingLeft / paddingRight', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { px: '_lg' })
    expect(c._node.paddingLeft).toBe('24px')
    expect(c._node.paddingRight).toBe('24px')
  })

  it('mx 同时设 marginLeft / marginRight', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { mx: 8 })
    expect(c._node.marginLeft).toBe(8)
    expect(c._node.marginRight).toBe(8)
  })

  it('bg → backgroundColor token', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { bg: '_primary' })
    expect(c._node.backgroundColor).toBe('#2563eb')
  })

  it('color 接 raw value', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { color: '#ff00ff' })
    expect(c._node.color).toBe('#ff00ff')
  })

  it('rounded → borderRadius', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { rounded: '_md' })
    expect(c._node.borderRadius).toBe('8px')
  })

  it('shadow → boxShadow', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { shadow: '_md' })
    expect(c._node.boxShadow).toContain('0 4px 6px')
  })

  it('多 prop 同时应用', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, {
      bg: '_primary',
      color: '_text',
      p: '_md',
      rounded: '_md',
    })
    expect(c._node).toMatchObject({
      backgroundColor: '#2563eb',
      color: '#111827',
      padding: '16px',
      borderRadius: '8px',
    })
  })

  it('忽略 null / undefined', () => {
    const c = new Chain(defaultLight)
    applyStyleProps(c, { p: undefined, bg: '_primary', color: undefined })
    expect(c._node.padding).toBeUndefined()
    expect(c._node.backgroundColor).toBe('#2563eb')
  })

  it('TokenOf<"color"> 类型工具', () => {
    type C = TokenOf<'color'>
    // 编译期：C 应包含 '_primary' / '_danger' 等
    const c1: C = '_primary'
    const c2: C = '_danger'
    expect(c1).toBe('_primary')
    expect(c2).toBe('_danger')
  })

  it('StyleProps<DefaultSchema> 接受所有列举的 prop', () => {
    const props: StyleProps = {
      color: '_primary',
      bg: '_bg',
      p: '_md',
      m: '_sm',
      px: '_lg',
      py: '_xs',
      rounded: '_md',
      shadow: '_lg',
      fontSize: '_md',
      fontWeight: 700,
      display: 'flex',
      zIndex: 10,
      opacity: 0.8,
      flex: 1,
      gap: '_md',
    }
    expect(props.color).toBe('_primary')
  })
})
