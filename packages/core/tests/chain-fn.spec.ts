import { describe, expect, it } from 'vitest'
import { Chain } from '../src'
import { defaultLight } from './_fixture-theme'

describe('Chain — 函数调用形态 (逃生舱)', () => {
  it('s.color("red") 生效', () => {
    const c = new Chain(defaultLight)
    c.color('red')
    expect(c._node.color).toBe('red')
  })

  it('toString 返回 emotion className', () => {
    const c = new Chain(defaultLight)
    c.color('red')
    const cls = c.toString()
    expect(typeof cls).toBe('string')
    expect(cls.length).toBeGreaterThan(0)
  })
})
