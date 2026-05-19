import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Theme, assertSchemaConsistency, buildKeymap, resolveTheme } from '../src'
import { toIdent } from '../src/theme/keymap'

/**
 * Audit Batch 2 测试（S3 / S6）。
 */

// ────────────────────────────────────────────────────────────────────────────
// S3 — toIdent 非法字符 sanitize + warn
// ────────────────────────────────────────────────────────────────────────────

describe('S3 — toIdent 非法字符防御', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('合法 key 不警告', () => {
    expect(toIdent('primary')).toBe('_primary')
    expect(toIdent('blue-600')).toBe('_blue600')
    expect(toIdent('brand.primary')).toBe('_brand_primary')
    expect(toIdent('2xl')).toBe('_2xl')
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('含空格的 key → sanitize + warn', () => {
    const r = toIdent('foo bar')
    expect(r).toBe('_foobar')   // 空格被移除
    expect(warnSpy).toHaveBeenCalled()
    expect(warnSpy.mock.calls[0]?.[0] as string).toContain('foo bar')
  })

  it('含特殊符号 → sanitize + warn', () => {
    const r = toIdent('foo$bar')
    expect(r).toBe('_foobar')
    expect(warnSpy).toHaveBeenCalled()
  })

  it('含 emoji → sanitize + warn', () => {
    const r = toIdent('foo🚀bar')
    expect(r.startsWith('_')).toBe(true)
    expect(/^[a-zA-Z0-9_]+$/.test(r.slice(1))).toBe(true)
    expect(warnSpy).toHaveBeenCalled()
  })

  it('production 模式不警告但仍 sanitize', () => {
    const orig = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    try {
      const r = toIdent('foo bar')
      expect(r).toBe('_foobar')
      expect(warnSpy).not.toHaveBeenCalled()
    } finally {
      process.env.NODE_ENV = orig
    }
  })

  it('全 invalid 字符 → 退化成 _', () => {
    const r = toIdent('@@@')
    expect(r).toBe('_')   // 全被 sanitize
  })

  it('buildKeymap 跨 key sanitize 冲突 → warn', () => {
    const r = resolveTheme({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      color: { 'foo bar': '#000', 'foobar': '#fff' } as any,
    })
    buildKeymap(r)
    // 应警告 ident 撞车
    const ok = warnSpy.mock.calls.some(args =>
      typeof args[0] === 'string' && (args[0] as string).includes('转 ident 后都是'),
    )
    expect(ok).toBe(true)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// S6 — assertSchemaConsistency makeReferenceProbe 内层路径
// ────────────────────────────────────────────────────────────────────────────

describe('S6 — function token 引用未定义路径记录完整路径', () => {
  it('引用不存在的 category 内的 key → ref 含完整路径', () => {
    const issues = assertSchemaConsistency(new Theme({
      color: {
        primary: '#2563eb',
        danger: '#dc2626',
        text: '#000',
        bg: '#fff',
        border: '#ccc',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        derived: ((ctx: any) => ctx.spacing.md as string) as any,
      },
    }))
    // 应找到 spacing.md 未定义的 warning
    const ref = issues.find(i =>
      i.message.includes('spacing.md') && i.level === 'warn',
    )
    expect(ref).toBeDefined()
  })

  it('引用已存在 category 的不存在 key → ref 含完整路径', () => {
    const issues = assertSchemaConsistency(new Theme({
      color: {
        primary: '#2563eb',
        danger: '#dc2626',
        text: '#000',
        bg: '#fff',
        border: '#ccc',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        derived: ((ctx: any) => ctx.color.nonExistent as string) as any,
      },
    }))
    const ref = issues.find(i =>
      i.message.includes('color.nonExistent'),
    )
    expect(ref).toBeDefined()
  })

  it('多个未定义路径都被记录', () => {
    const issues = assertSchemaConsistency(new Theme({
      color: {
        primary: '#000',
        danger: '#000',
        text: '#000',
        bg: '#000',
        border: '#000',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        m: ((ctx: any) => `${ctx.spacing.unknownX as string} ${ctx.spacing.unknownY as string}`) as any,
      },
    }))
    const refs = issues.filter(i => i.message.includes('引用了未定义路径'))
    expect(refs.length).toBeGreaterThanOrEqual(2)
    const pathsMentioned = refs.map(r => r.message).join(' ')
    expect(pathsMentioned).toContain('spacing.unknownX')
    expect(pathsMentioned).toContain('spacing.unknownY')
  })

  it('合法 function token 不报路径未定义', () => {
    const issues = assertSchemaConsistency(new Theme({
      color: {
        primary: '#2563eb',
        danger: '#dc2626',
        text: '#000',
        bg: '#fff',
        border: '#ccc',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        primaryHover: ((ctx: any) => ctx.color.primary as string) as any,
      },
    }))
    const pathIssues = issues.filter(i => i.message.includes('引用了未定义路径'))
    expect(pathIssues).toHaveLength(0)
  })

  it('function token 返回非 string|number → error 级别', () => {
    const issues = assertSchemaConsistency(new Theme({
      color: {
        primary: '#2563eb',
        danger: '#dc2626',
        text: '#000',
        bg: '#fff',
        border: '#ccc',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bad: (() => ({ wrong: 'type' })) as any,
      },
    }))
    const bad = issues.find(i => i.key === 'bad' && i.level === 'error')
    expect(bad).toBeDefined()
  })
})
