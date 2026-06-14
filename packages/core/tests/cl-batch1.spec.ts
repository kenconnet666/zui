import { describe, expect, it } from 'vitest'
import { Chain } from '../src'
import { defaultLight } from './_fixture-theme'

/**
 * CL Batch 1 测试 — 组件库核心 5 项。
 */

// ────────────────────────────────────────────────────────────────────────────
// E7 — _state(props, mapping)
// ────────────────────────────────────────────────────────────────────────────

describe('E7 — Chain._state(props, mapping)', () => {
  it('truthy 状态对应 factory 应用', () => {
    const c = new Chain(defaultLight)
    c._state(
      { loading: true, error: false },
      {
        loading: s => {
          s.opacity._strong
        },
        error: s => {
          s.borderColor._danger
        },
      },
    )
    expect(c._node.opacity).toBe(0.75)
    expect(c._node.borderColor).toBeUndefined()
  })

  it('所有 false 都不应用', () => {
    const c = new Chain(defaultLight)
    c._state(
      { a: false, b: 0, c: '', d: null },
      {
        a: s => {
          s.color._danger
        },
        b: s => {
          s.color._danger
        },
        c: s => {
          s.color._danger
        },
        d: s => {
          s.color._danger
        },
      },
    )
    expect(c._node.color).toBeUndefined()
  })

  it('truthy 但非 bool 值也应用', () => {
    const c = new Chain(defaultLight)
    c._state(
      { x: 1, y: 'str', z: {} },
      {
        x: s => {
          s.padding.px(8)
        },
        y: s => {
          s.margin.px(4)
        },
        z: s => {
          s.borderRadius._middle
        },
      },
    )
    expect(c._node.padding).toBe('8px')
    expect(c._node.margin).toBe('4px')
    expect(c._node.borderRadius).toBeDefined()
  })

  it('mapping 中没声明的 key 不应用（即使 props 有）', () => {
    const c = new Chain(defaultLight)
    c._state(
      { loading: true, extra: true },
      {
        loading: s => {
          s.opacity._half
        },
        // extra 没声明
      },
    )
    expect(c._node.opacity).toBe(0.5)
  })

  it('chained 返回 this', () => {
    const c = new Chain(defaultLight)
    const r = c._state({ x: true }, { x: () => {} })
    expect(r).toBe(c)
  })

  it('在 _hover 嵌套内可用', () => {
    const c = new Chain(defaultLight)
    c._hover(h => {
      h._state(
        { active: true },
        {
          active: s => {
            s.backgroundColor._primary
          },
        },
      )
    })
    const hov = c._node['&:hover'] as Record<string, unknown>
    expect(hov.backgroundColor).toBeDefined()
  })
})
