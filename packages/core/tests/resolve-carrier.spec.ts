/**
 * `resolveCarrier` —— carrier factory introspect API spec。
 *
 * 覆盖:token / modifier(立即计算)/ keyword / 字面量 / 字符串逃生舱 /
 * unit method / factory 未传 / 非法 prop / 不污染原 theme。
 */
import { describe, expect, it } from 'vitest'
import { Theme, resolveCarrier } from '../src'

const theme = new Theme({
  color: {
    primary: '#1976d2',
    danger: '#d32f2f',
  },
  spacing: {
    middle: '16px',
  },
}).resolve()

describe('resolveCarrier — token / 字面量 / keyword', () => {
  it('token → primary 色串', () => {
    const v = resolveCarrier(theme, 'color', (c) => {
      ;(c as { _primary: unknown })._primary
    })
    expect(v).toBe('#1976d2')
  })

  it('字面量 c("#abc")', () => {
    const v = resolveCarrier(theme, 'color', (c) => {
      ;(c as (val: string) => void)('#abc')
    })
    expect(v).toBe('#abc')
  })

  it('keyword(currentColor)', () => {
    const v = resolveCarrier(theme, 'color', (c) => {
      ;(c as { currentColor: unknown }).currentColor
    })
    expect(v).toBe('currentColor')
  })
})

describe('resolveCarrier — modifier(立即计算)', () => {
  it('alpha(50) → rgba 字符串', () => {
    const v = resolveCarrier(theme, 'color', (c) => {
      ;(c as { _primary: { alpha: (n: number) => void } })._primary.alpha(50)
    })
    expect(typeof v).toBe('string')
    expect(v as string).toMatch(/rgba?\(/)
    // alpha 50% → 应含 0.5
    expect(v as string).toContain('0.5')
  })

  it('darken(20) → 比原色更暗', () => {
    const v = resolveCarrier(theme, 'color', (c) => {
      ;(c as { _primary: { darken: (n: number) => void } })._primary.darken(20)
    })
    expect(typeof v).toBe('string')
    // darken 后不等于原 token
    expect(v).not.toBe('#1976d2')
  })
})

describe('resolveCarrier — unit method', () => {
  it('width.px(16) → "16px"', () => {
    const v = resolveCarrier(theme, 'width', (c) => {
      ;(c as { px: (n: number) => void }).px(16)
    })
    expect(v).toBe('16px')
  })
})

describe('resolveCarrier — 字符串逃生舱', () => {
  it('c("_primary.alpha(50)") 等价于 chain modifier', () => {
    const direct = resolveCarrier(theme, 'color', (c) => {
      ;(c as { _primary: { alpha: (n: number) => void } })._primary.alpha(50)
    })
    const escape = resolveCarrier(theme, 'color', (c) => {
      ;(c as (val: string) => void)('_primary.alpha(50)')
    })
    expect(escape).toBe(direct)
  })
})

describe('resolveCarrier — 边界', () => {
  it('factory 未传 → undefined', () => {
    expect(resolveCarrier(theme, 'color', undefined)).toBeUndefined()
  })

  it('未知 prop → undefined(不抛错)', () => {
    const v = resolveCarrier(theme, 'nonexistentPropZZZ', (c) => {
      ;(c as { _primary?: unknown })._primary
    })
    expect(v).toBeUndefined()
  })

  it('factory 不写入 → undefined', () => {
    const v = resolveCarrier(theme, 'color', () => {
      // noop
    })
    expect(v).toBeUndefined()
  })

  it('不污染原 theme(每次 new Chain)', () => {
    const before = JSON.stringify(theme)
    resolveCarrier(theme, 'color', (c) => {
      ;(c as { _primary: { alpha: (n: number) => void } })._primary.alpha(80)
    })
    expect(JSON.stringify(theme)).toBe(before)
  })
})

describe('resolveCarrier — 跟 Theme 实例兼容', () => {
  it('传 Theme 实例自动 resolve', () => {
    const t = new Theme({ color: { primary: '#ff00aa' } })
    const v = resolveCarrier(t, 'color', (c) => {
      ;(c as { _primary: unknown })._primary
    })
    expect(v).toBe('#ff00aa')
  })
})
