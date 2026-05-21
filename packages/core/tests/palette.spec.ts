import { describe, expect, it } from 'vitest'
import { Chain } from '../src'
import { defaultLight, defaultDark } from './_fixture-theme'

describe('Palette tokens（242 色 + 11 语义色）', () => {
  it('palette token 可访问：chain.color._blue600', () => {
    const c = new Chain(defaultLight)
    c.color._blue600
    expect(c._node.color).toBe('#2563eb')
  })

  it('palette token：chain.backgroundColor._slate50', () => {
    const c = new Chain(defaultLight)
    c.backgroundColor._slate50
    expect(c._node.backgroundColor).toBe('#f8fafc')
  })

  it('palette token：chain.borderColor._rose500', () => {
    const c = new Chain(defaultLight)
    c.borderColor._rose500
    expect(c._node.borderColor).toBe('#f43f5e')
  })

  it('语义色仍在：chain.color._primary', () => {
    const c = new Chain(defaultLight)
    c.color._primary
    expect(c._node.color).toBe('#2563eb')
  })

  it('alpha 简写在 palette token 上工作', () => {
    const c = new Chain(defaultLight)
    c.color._emerald500.alpha(50)
    expect(c._node.color).toBe('rgba(16, 185, 129, 0.5)')
  })

  it('defaultDark palette + 语义色', () => {
    const c = new Chain(defaultDark)
    c.backgroundColor._gray900
    c.color._primary
    expect(c._node.backgroundColor).toBe('#111827')
    expect(c._node.color).toBe('#3b82f6') // dark mode primary = blue500
  })

  it('keys 950 极端 shade 也可用', () => {
    const c = new Chain(defaultLight)
    c.color._slate950
    expect(c._node.color).toBe('#020617')
  })
})
