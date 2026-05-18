import { describe, expect, it } from 'vitest'
import { Theme, resolveTheme, mergeTheme } from '../src'

describe('Theme', () => {
  it('实例化后可直接访问 schema 各 category', () => {
    const t = new Theme({
      color: { primary: '#2563eb', danger: '#dc2626' },
      spacing: { md: '16px' },
    })
    expect(t.color!.primary).toBe('#2563eb')
    expect(t.spacing!.md).toBe('16px')
  })

  it('resolveTheme 展开 function token', () => {
    const r = resolveTheme({
      color: {
        primary: '#2563eb',
        primaryHover: (ctx) => ctx.color!.primary,
      },
    })
    expect(r.color!.primaryHover).toBe('#2563eb')
  })

  it('mergeTheme 局部覆盖父主题', () => {
    const parent = resolveTheme({ color: { primary: '#000' } })
    const merged = mergeTheme(parent, { color: { primary: '#fff' } })
    expect(merged.color!.primary).toBe('#fff')
  })
})
