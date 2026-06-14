import { describe, expect, it } from 'vitest'
import { applyStyleProps, createIcssInstance, icss, presetAnimations } from '../src'
import { defaultLight } from './_fixture-theme'

/**
 * CL Batch 3 — 集成测试。
 *
 * 集成场景：模拟"组件库作者写组件"完整流程，端到端验证：
 * - SSR 多实例：两个 createIcssInstance 互不污染
 * - applyStyleProps 实际组件用例
 * - 预设动画在组件中使用
 */

// ────────────────────────────────────────────────────────────────────────────
// 集成场景 4 — SSR 多 instance 隔离
// ────────────────────────────────────────────────────────────────────────────

describe('集成 — createIcssInstance SSR 隔离', () => {
  function mockEmotion() {
    const cssCalls: object[] = []
    const injectCalls: unknown[] = []
    const kfCalls: object[] = []
    return {
      cssCalls,
      injectCalls,
      kfCalls,
      css: (obj: object) => {
        cssCalls.push(obj)
        return `mock-css-${cssCalls.length}`
      },
      cx: (...a: unknown[]) => a.filter(Boolean).join(' '),
      injectGlobal: (s: unknown) => {
        injectCalls.push(s)
      },
      keyframes: (stops: object) => {
        kfCalls.push(stops)
        return `mock-kf-${kfCalls.length}`
      },
    }
  }

  it('两个 instance 的 injectGlobal 互不污染', () => {
    const m1 = mockEmotion()
    const m2 = mockEmotion()
    const inst1 = createIcssInstance(m1)
    const inst2 = createIcssInstance(m2)
    inst1.injectPreflight()
    inst2.injectPreflight()
    expect(m1.injectCalls.length).toBe(1)
    expect(m2.injectCalls.length).toBe(1)
  })

  it('两个 instance 的 presetAnimations.fadeIn 注册各自一次', () => {
    const m1 = mockEmotion()
    const m2 = mockEmotion()
    const inst1 = createIcssInstance(m1)
    const inst2 = createIcssInstance(m2)
    void inst1.presetAnimations.fadeIn
    void inst2.presetAnimations.fadeIn
    expect(m1.kfCalls.length).toBe(1)
    expect(m2.kfCalls.length).toBe(1)
  })

  it('同 instance 内重复 injectPreflight 只走 emotion 一次', () => {
    const m = mockEmotion()
    const inst = createIcssInstance(m)
    inst.injectPreflight()
    inst.injectPreflight()
    inst.injectPreflight()
    expect(m.injectCalls.length).toBe(1)
  })

  it('instance 的 icss 走自己的 css', () => {
    const m = mockEmotion()
    const inst = createIcssInstance(m)
    inst.icss(defaultLight, s => {
      s.color._primary
    })
    expect(m.cssCalls.length).toBe(1)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// 集成场景 5 — applyStyleProps 端到端
// ────────────────────────────────────────────────────────────────────────────

describe('集成 — applyStyleProps 实际组件用例', () => {
  it('Box 组件：响应式 p + bg + rounded', () => {
    const cls = applyStyleProps(defaultLight, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      p: { base: 4, middle: 8, large: 16 } as any,
      bg: '_primary',
      rounded: '_middle',
      color: 'white',
    })
    expect(typeof cls).toBe('string')
    expect((cls as string).length).toBeGreaterThan(0)
  })

  it('Stack 组件：方向 + 间距', () => {
    const cls = applyStyleProps(defaultLight, {
      display: 'flex',
      flexDirection: 'column',
      gap: '_middle',
    })
    expect(typeof cls).toBe('string')
  })

  it('与 chain 联用：先 applyStyleProps 后追加 _hover', () => {
    const cls = icss(defaultLight, s => {
      applyStyleProps(s, { p: '_middle', bg: '_primary' })
      s._hover(h => {
        h.backgroundColor._primary.alpha(85)
      })
    })
    expect(typeof cls).toBe('string')
  })
})

// ────────────────────────────────────────────────────────────────────────────
// 集成场景 6 — 预设动画 + chain
// ────────────────────────────────────────────────────────────────────────────

describe('集成 — 预设动画在组件中用', () => {
  it('Spinner: spin 动画', () => {
    const cls = icss(defaultLight, s => {
      s.animationName(presetAnimations.spin)
      s.animationDuration._large
      s.animationIterationCount('infinite')
      s.animationTimingFunction('linear')
    })
    expect(typeof cls).toBe('string')
  })

  it('Toast: slideInUp + fadeOut', () => {
    const enter = icss(defaultLight, s => {
      s.animationName(presetAnimations.slideInUp)
      s.animationDuration._middle
      s.animationFillMode('both')
    })
    const exit = icss(defaultLight, s => {
      s.animationName(presetAnimations.fadeOut)
      s.animationDuration._small
    })
    expect(enter).not.toBe(exit)
  })
})
