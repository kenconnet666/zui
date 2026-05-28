import { describe, expect, it } from 'vitest'
import { Chain, icss, presetAnimations } from '../src'
import { defaultLight } from './_fixture-theme'
import type { PresetAnimationName } from '../src'

/**
 * Batch C — 预设动画 + _transition 简写测试。
 *
 * 覆盖：
 * - 15 个预设 keyframes 都返回非空字符串
 * - icss 中 animationName 写入正确
 * - _transition 4 字段全组合
 * - duration / easing token 解析
 * - token 不存在时原样透传
 */

// ─── 预设动画 ──────────────────────────────────────────────────────────────

describe('presetAnimations — 15 个预设可用', () => {
  const expected: PresetAnimationName[] = [
    'fadeIn',
    'fadeOut',
    'slideInUp',
    'slideInDown',
    'slideInLeft',
    'slideInRight',
    'slideOutDown',
    'scaleIn',
    'scaleOut',
    'zoomIn',
    'spin',
    'pulse',
    'bounce',
    'ping',
    'shake',
  ]

  for (const name of expected) {
    it(`presetAnimations.${name} 返回非空字符串`, () => {
      const val = presetAnimations[name]
      expect(typeof val).toBe('string')
      expect(val.length).toBeGreaterThan(0)
    })
  }

  it('所有预设 name 都不同（emotion hash 唯一）', () => {
    const values = Object.values(presetAnimations)
    const unique = new Set(values)
    expect(unique.size).toBe(values.length)
  })
})

describe('预设动画与 chain 集成', () => {
  it('s.animationName(presetAnimations.fadeIn) 写入 _node', () => {
    const c = new Chain(defaultLight)
    c.animationName(presetAnimations.fadeIn)
    expect(c._node.animationName).toBe(presetAnimations.fadeIn)
  })

  it('与 icss 配合：完整 fade-in 动画', () => {
    const cls = icss(defaultLight, s => {
      s.animationName(presetAnimations.fadeIn)
      s.animationDuration('300ms')
      s.animationFillMode('both')
    })
    expect(typeof cls).toBe('string')
    expect(cls.length).toBeGreaterThan(0)
  })

  it('spin 动画典型 spinner 用法', () => {
    const cls = icss(defaultLight, s => {
      s.animationName(presetAnimations.spin)
      s.animationDuration('1s')
      s.animationIterationCount('infinite')
      s.animationTimingFunction('linear')
    })
    expect(typeof cls).toBe('string')
  })
})

// ─── _transition 简写 ─────────────────────────────────────────────────────

describe('_transition — 基础', () => {
  it('默认 property=all', () => {
    const c = new Chain(defaultLight)
    c._transition({ duration: 200 })
    expect(c._node.transition).toBe('all 200ms')
  })

  it('指定 property', () => {
    const c = new Chain(defaultLight)
    c._transition({ property: 'opacity', duration: 200 })
    expect(c._node.transition).toBe('opacity 200ms')
  })

  it('数字 duration 自动加 ms 单位', () => {
    const c = new Chain(defaultLight)
    c._transition({ property: 'opacity', duration: 500 })
    expect(c._node.transition).toBe('opacity 500ms')
  })

  it('字符串 duration 原样', () => {
    const c = new Chain(defaultLight)
    c._transition({ property: 'transform', duration: '0.25s' })
    expect(c._node.transition).toBe('transform 0.25s')
  })

  it('全 4 字段', () => {
    const c = new Chain(defaultLight)
    c._transition({ property: 'opacity', duration: 200, easing: 'ease-out', delay: 100 })
    expect(c._node.transition).toBe('opacity 200ms ease-out 100ms')
  })

  it('仅 property 无其它字段', () => {
    const c = new Chain(defaultLight)
    c._transition({ property: 'color' })
    expect(c._node.transition).toBe('color')
  })
})

describe('_transition — token 解析', () => {
  it('_middle duration 解析（default schema duration.middle = 300ms）', () => {
    const c = new Chain(defaultLight)
    c._transition({ duration: '_middle' })
    expect(c._node.transition).toBe('all 300ms')
  })

  it('_small duration', () => {
    const c = new Chain(defaultLight)
    c._transition({ duration: '_small' })
    expect(c._node.transition).toBe('all 150ms')
  })

  it('_large duration', () => {
    const c = new Chain(defaultLight)
    c._transition({ duration: '_large' })
    expect(c._node.transition).toBe('all 500ms')
  })

  it('_tiny duration（5 阶最小）', () => {
    const c = new Chain(defaultLight)
    c._transition({ duration: '_tiny' })
    expect(c._node.transition).toBe('all 75ms')
  })

  it('_huge duration（5 阶最大）', () => {
    const c = new Chain(defaultLight)
    c._transition({ duration: '_huge' })
    expect(c._node.transition).toBe('all 700ms')
  })

  it('_none duration（瞬时）', () => {
    const c = new Chain(defaultLight)
    c._transition({ duration: '_none' })
    expect(c._node.transition).toBe('all 0ms')
  })

  it('_inOut easing 解析（default schema easing.inOut = cubic-bezier(...)）', () => {
    const c = new Chain(defaultLight)
    c._transition({ duration: '_middle', easing: '_inOut' })
    expect(c._node.transition).toContain('cubic-bezier')
  })

  it('_default easing 解析', () => {
    const c = new Chain(defaultLight)
    c._transition({ easing: '_default' })
    expect(c._node.transition).toContain('cubic-bezier')
  })

  it('_linear easing 解析（default schema easing.linear = linear）', () => {
    const c = new Chain(defaultLight)
    c._transition({ duration: '_small', easing: '_linear' })
    expect(c._node.transition).toBe('all 150ms linear')
  })

  it('delay 也支持 token', () => {
    const c = new Chain(defaultLight)
    c._transition({ duration: 200, delay: '_small' })
    expect(c._node.transition).toBe('all 200ms 150ms')
  })
})

describe('_transition — token 不存在时原样透传', () => {
  it('未知 duration token 原样保留', () => {
    const c = new Chain(defaultLight)
    c._transition({ duration: '_neverdef' })
    expect(c._node.transition).toBe('all _neverdef')
  })

  it('未知 easing token 原样保留', () => {
    const c = new Chain(defaultLight)
    c._transition({ duration: 200, easing: '_neverdef' })
    expect(c._node.transition).toBe('all 200ms _neverdef')
  })
})

describe('_transition — 链式与 statement-only 协调', () => {
  it('链式返回 this', () => {
    const c = new Chain(defaultLight)
    expect(c._transition({ duration: 100 })).toBe(c)
  })

  it('与其它 chain method 联用', () => {
    const c = new Chain(defaultLight)
    c.padding.px(12)
    c._transition({ property: 'all', duration: '_middle', easing: '_inOut' })
    c.color._primary
    expect(c._node.padding).toBe('12px')
    expect(c._node.transition).toContain('300ms')
  })

  it('在 _hover 嵌套内可用', () => {
    const c = new Chain(defaultLight)
    c._hover(h => {
      h._transition({ duration: '_small', easing: '_out' })
      h.backgroundColor._primary
    })
    const hov = c._node['&:hover'] as Record<string, unknown>
    expect(hov.transition).toContain('150ms')
  })
})

describe('Batch C 实际场景', () => {
  it('hover 渐入 + spin loading 联合用法', () => {
    const button = (loading: boolean) =>
      icss(defaultLight, s => {
        s.padding.px(12)
        s.backgroundColor._primary
        s._transition({ property: 'all', duration: '_small', easing: '_inOut' })
        s._hover(h => {
          h.backgroundColor._primary.alpha(85)
        })
        if (loading) {
          s.animationName(presetAnimations.pulse)
          s.animationDuration('1.5s')
          s.animationIterationCount('infinite')
        }
      })
    const idle = button(false)
    const busy = button(true)
    expect(idle).not.toBe(busy)
  })
})
