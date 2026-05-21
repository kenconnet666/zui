import { describe, expect, it } from 'vitest'
import { Theme, assertSchemaConsistency } from '../src'
import { defaultLight } from './_fixture-theme'

describe('assertSchemaConsistency', () => {
  it('defaultLight 应无 issue', () => {
    const issues = assertSchemaConsistency(defaultLight)
    expect(issues).toEqual([])
  })

  it('缺语义色 → warn', () => {
    const t = new Theme({
      color: { primary: '#000' }, // 缺 danger / text / bg / border
    })
    const issues = assertSchemaConsistency(t)
    const keys = issues.map((i) => i.key)
    expect(keys).toContain('danger')
    expect(keys).toContain('text')
    expect(keys).toContain('bg')
    expect(keys).toContain('border')
  })

  it('保留字 key → error', () => {
    const t = new Theme({
      color: { primary: '#000', toString: '#fff' as never },
    })
    const issues = assertSchemaConsistency(t)
    const err = issues.find((i) => i.key === 'toString')
    expect(err?.level).toBe('error')
  })

  it('function token 引用未定义路径 → warn', () => {
    const t = new Theme({
      color: {
        primary: '#000',
        danger: '#dc2626',
        text: '#000',
        bg: '#fff',
        border: '#ddd',
        derived: (ctx) =>
          (ctx as Record<string, Record<string, string | number>>).nonexistent?.foo ?? '#fff',
      },
    })
    const issues = assertSchemaConsistency(t)
    const refIssue = issues.find((i) => i.message.includes('未定义路径'))
    expect(refIssue).toBeDefined()
  })
})
