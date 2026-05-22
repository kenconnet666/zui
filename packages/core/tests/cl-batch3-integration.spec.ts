import { describe, expect, it } from 'vitest'
import {
  applyStyleProps,
  composeVariants,
  createIcssInstance,
  defineMixin,
  defineParts,
  defineVariants,
  icss,
  presetAnimations,
} from '../src'
import { defaultDark, defaultLight, type TestSchema } from './_fixture-theme'

/**
 * CL Batch 3 — 集成测试。
 *
 * 集成场景：模拟"组件库作者写 Button / Dialog 等组件"完整流程，端到端验证：
 * - 主题切换：light vs dark 产出不同 className
 * - SSR 多实例：两个 createIcssInstance 互不污染
 * - defineVariants + composeVariants + defineParts + applyStyleProps 联合使用
 */

// ────────────────────────────────────────────────────────────────────────────
// 集成场景 1 — 完整 Button 组件
// ────────────────────────────────────────────────────────────────────────────

describe('集成 — 完整 Button 组件流程', () => {
  // 模拟组件库的 mixin
  const focusRing = defineMixin<TestSchema>(s => {
    s._focusVisible(f => {
      f.outlineColor._primary
      f.outlineStyle('solid')
      f.outlineWidth.px(2)
      f.outlineOffset.px(2)
    })
  })

  // 通用 interactive variants
  const interactive = defineVariants(defaultLight, {
    variants: {
      state: {
        idle: () => {},
        loading: s => { s.opacity._strong; s.cursor.wait },
        disabled: s => { s.opacity._half; s.cursor.notAllowed; s.pointerEvents('none') },
      },
    },
    defaultVariants: { state: 'idle' },
  })

  // Button 自有 variants
  const buttonCore = defineVariants(defaultLight, {
    base: s => {
      s.padding.px(12)
      s.borderRadius._middle
      s.fontWeight._bold
      s.transitionProperty('all')
      s.transitionDuration._small
      focusRing(s)
    },
    variants: {
      intent: {
        primary: s => { s.backgroundColor._primary; s.color.white },
        danger:  s => { s.backgroundColor._danger;  s.color.white },
        ghost:   s => { s.color._primary; s.backgroundColor.transparent },
      },
      size: {
        small: s => { s.padding.px(8); s.fontSize._small },
        middle: s => { s.padding.px(12); s.fontSize._middle },
        large: s => { s.padding.px(16); s.fontSize._large },
      },
      block: {
        true: s => { s.display.block; s.width.pct(100) },
        false: () => {},
      },
    },
    defaultVariants: { intent: 'primary', size: 'middle' },
    compoundVariants: [
      { when: { intent: 'ghost', size: 'small' }, apply: s => { s.padding.px(6) } },
    ],
  })

  const button = composeVariants(interactive, buttonCore)

  it('Button 默认渲染', () => {
    const cls = button()
    expect(typeof cls).toBe('string')
    expect(cls.split(/\s+/).filter(Boolean).length).toBe(2)   // composed 出 2 个 className
  })

  it('Button 全 variant 组合', () => {
    const cls = button({ intent: 'danger', size: 'small', state: 'loading', block: true })
    expect(typeof cls).toBe('string')
  })

  it('Button 18 种 props 组合都返回有效 className', () => {
    const intents: Array<'primary' | 'danger' | 'ghost'> = ['primary', 'danger', 'ghost']
    const sizes: Array<'small' | 'middle' | 'large'> = ['small', 'middle', 'large']
    const states: Array<'idle' | 'loading' | 'disabled'> = ['idle', 'loading', 'disabled']
    const classes = new Set<string>()
    for (const intent of intents) {
      for (const size of sizes) {
        for (const state of states) {
          const cls = button({ intent, size, state })
          expect(typeof cls).toBe('string')
          expect(cls.length).toBeGreaterThan(0)
          classes.add(cls)
        }
      }
    }
    // 3 × 3 × 3 = 27 种组合理论上全唯一（每个 variant 都改样式）
    // 部分 intent + state 可能 className 相似但不同
    expect(classes.size).toBeGreaterThanOrEqual(20)
  })

  it('Button 缓存命中：相同 props 同 className', () => {
    const a = button({ intent: 'primary', size: 'middle' })
    const b = button({ intent: 'primary', size: 'middle' })
    expect(a).toBe(b)
  })

  it('Button 不同 size 用不同的 className', () => {
    const sm = button({ size: 'small' })
    const lg = button({ size: 'large' })
    expect(sm).not.toBe(lg)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// 集成场景 2 — Dialog 多 slot 组件
// ────────────────────────────────────────────────────────────────────────────

describe('集成 — Dialog 多 slot 组件', () => {
  const dialog = defineParts(defaultLight, {
    slots: ['root', 'overlay', 'content', 'title', 'description', 'close'] as const,
    base: {
      root: s => { s.position.fixed; s.inset(0); s.zIndex._modal },
      overlay: s => {
        s.position.absolute
        s.inset(0)
        s.backgroundColor.black
        s.opacity._half
      },
      content: s => {
        s.position.absolute
        s.borderRadius._large
        s.padding._large
        s.backgroundColor._bg
      },
      title: s => { s.fontWeight._bold; s.fontSize._huge },
      description: s => { s.color._textMuted; s.marginTop._small },
      close: s => {
        s.position.absolute
        s.top.px(8)
        s.right.px(8)
        s.cursor.pointer
      },
    },
    variants: {
      size: {
        small: { content: s => { s.maxWidth.px(400) } },
        middle: { content: s => { s.maxWidth.px(600) } },
        large: { content: s => { s.maxWidth.px(900) } },
      },
    },
    defaultVariants: { size: 'middle' },
  })

  it('6 个 slot 都返回有效 className', () => {
    expect(typeof dialog.root()).toBe('string')
    expect(typeof dialog.overlay()).toBe('string')
    expect(typeof dialog.content()).toBe('string')
    expect(typeof dialog.title()).toBe('string')
    expect(typeof dialog.description()).toBe('string')
    expect(typeof dialog.close()).toBe('string')
  })

  it('6 个 slot className 各不相同', () => {
    const all = new Set([
      dialog.root(),
      dialog.overlay(),
      dialog.content(),
      dialog.title(),
      dialog.description(),
      dialog.close(),
    ])
    expect(all.size).toBe(6)
  })

  it('content 在不同 size 下 className 不同', () => {
    expect(dialog.content({ size: 'small' })).not.toBe(dialog.content({ size: 'large' }))
  })

  it('未声明 variant 的 slot 不受 size 影响', () => {
    expect(dialog.title({ size: 'small' })).toBe(dialog.title({ size: 'large' }))
  })
})

// ────────────────────────────────────────────────────────────────────────────
// 集成场景 3 — 主题切换 light vs dark
// ────────────────────────────────────────────────────────────────────────────

describe('集成 — 主题切换 light / dark', () => {
  const button = (theme: typeof defaultLight) =>
    defineVariants(theme, {
      base: s => {
        s.padding.px(12)
        s.backgroundColor._primary
        s.color._text
      },
      variants: { intent: { primary: s => { s.backgroundColor._primary } } },
      defaultVariants: { intent: 'primary' },
    })

  it('light vs dark 输出不同 className（不同主题 token 值）', () => {
    const lightButton = button(defaultLight)
    const darkButton = button(defaultDark)
    const lightCls = lightButton()
    const darkCls = darkButton()
    expect(lightCls).not.toBe(darkCls)
  })

  it('同主题相同 props 重复调用 className 一致', () => {
    const lightButton = button(defaultLight)
    expect(lightButton()).toBe(lightButton())
  })
})

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
      injectGlobal: (s: unknown) => { injectCalls.push(s) },
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
    inst.icss(defaultLight, s => { s.color._primary })
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
      s._hover(h => { h.backgroundColor._primary.alpha(85) })
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
