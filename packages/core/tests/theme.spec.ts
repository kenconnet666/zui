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
        // noUncheckedIndexedAccess 让 ctx.color!.primary 含 undefined；这里我们清楚它有值
        primaryHover: ctx => ctx.color!.primary as string,
      },
    })
    expect(r.color!.primaryHover).toBe('#2563eb')
  })

  it('mergeTheme 局部覆盖父主题', () => {
    const parent = resolveTheme({ color: { primary: '#000' } })
    const merged = mergeTheme(parent, { color: { primary: '#fff' } })
    expect(merged.color!.primary).toBe('#fff')
  })

  it('mergeTheme 保留未覆盖的兄弟字段（深合并）', () => {
    const parent = resolveTheme({
      color: { primary: '#000', danger: '#dc2626' },
      spacing: { md: '16px', lg: '24px' },
    })
    const merged = mergeTheme(parent, {
      color: { primary: '#fff' },
      spacing: { lg: '32px' },
    })
    expect(merged.color!.primary).toBe('#fff')
    expect(merged.color!.danger).toBe('#dc2626') // 保留
    expect(merged.spacing!.md).toBe('16px') // 保留
    expect(merged.spacing!.lg).toBe('32px')
  })

  it('mergeTheme 不修改 parent（immutable）', () => {
    const parent = resolveTheme({ color: { primary: '#000' } })
    mergeTheme(parent, { color: { primary: '#fff' } })
    expect(parent.color!.primary).toBe('#000')
  })
})
