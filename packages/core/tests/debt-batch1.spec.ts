import { describe, expect, it, vi } from 'vitest'
import { Chain, createIcssInstance, injectPreflight, zu } from '../src'
import { defaultLight } from './_fixture-theme'
import { GLOBAL_KEYWORDS } from '../src/chain/keywords'
import { LENGTH_UNITS, TIME_UNITS, ANGLE_UNITS } from '../src/chain/units'
import { PREFLIGHT_STYLES } from '../src/preset/preflightStyles'

/**
 * Debt Batch 1 回归测试（R1 - R5）。
 *
 * 验证：
 * - R1 carrier 单位列表使用 units.ts single source，所有 30 个 length unit 都工作
 * - R2 carrier isGlobalKeyword 使用 keywords.ts 的 GLOBAL_KEYWORDS 常量
 * - R3 createIcssInstance 内的 injectGlobal 实例级 dedupe（不污染 emotion serializer）
 * - R4 preflight single source 在全局版与 instance 版一致
 * - R5 keywords.ts 不再有 leftPage / rightPage 重复
 */

// ────────────────────────────────────────────────────────────────────────────
// R1 — carrier 单位列表 single source
// ────────────────────────────────────────────────────────────────────────────

describe('R1 — carrier unit 方法覆盖 LENGTH_UNITS 全部 30 个', () => {
  it('容器查询单位 cqw / cqh / cqi / cqb / cqmin / cqmax 全部可用', () => {
    const c = new Chain(defaultLight)
    c.padding.cqw(10)
    expect(c._node.padding).toBe('10cqw')

    const c2 = new Chain(defaultLight)
    c2.padding.cqh(20)
    expect(c2._node.padding).toBe('20cqh')

    const c3 = new Chain(defaultLight)
    c3.padding.cqi(30)
    expect(c3._node.padding).toBe('30cqi')

    const c4 = new Chain(defaultLight)
    c4.padding.cqb(40)
    expect(c4._node.padding).toBe('40cqb')

    const c5 = new Chain(defaultLight)
    c5.padding.cqmin(50)
    expect(c5._node.padding).toBe('50cqmin')

    const c6 = new Chain(defaultLight)
    c6.padding.cqmax(60)
    expect(c6._node.padding).toBe('60cqmax')
  })

  it('小视口单位 svw / svh / svmin / svmax', () => {
    const c1 = new Chain(defaultLight)
    c1.width.svw(50)
    expect(c1._node.width).toBe('50svw')

    const c2 = new Chain(defaultLight)
    c2.height.svh(100)
    expect(c2._node.height).toBe('100svh')

    const c3 = new Chain(defaultLight)
    c3.width.svmin(25)
    expect(c3._node.width).toBe('25svmin')

    const c4 = new Chain(defaultLight)
    c4.width.svmax(75)
    expect(c4._node.width).toBe('75svmax')
  })

  it('大视口单位 lvw / lvh / lvmin / lvmax', () => {
    const c1 = new Chain(defaultLight)
    c1.width.lvw(50)
    expect(c1._node.width).toBe('50lvw')

    const c2 = new Chain(defaultLight)
    c2.height.lvh(100)
    expect(c2._node.height).toBe('100lvh')

    const c3 = new Chain(defaultLight)
    c3.width.lvmin(25)
    expect(c3._node.width).toBe('25lvmin')

    const c4 = new Chain(defaultLight)
    c4.width.lvmax(75)
    expect(c4._node.width).toBe('75lvmax')
  })

  it('动态视口单位 dvw / dvh / dvmin / dvmax', () => {
    const c1 = new Chain(defaultLight)
    c1.width.dvw(50)
    expect(c1._node.width).toBe('50dvw')

    const c2 = new Chain(defaultLight)
    c2.height.dvh(100)
    expect(c2._node.height).toBe('100dvh')

    const c3 = new Chain(defaultLight)
    c3.width.dvmin(25)
    expect(c3._node.width).toBe('25dvmin')

    const c4 = new Chain(defaultLight)
    c4.width.dvmax(75)
    expect(c4._node.width).toBe('75dvmax')
  })

  it('栅格 fr 单位', () => {
    const c = new Chain(defaultLight)
    c.width.fr(2)
    expect(c._node.width).toBe('2fr')
  })

  it('百分比 pct 单位（特殊 ident → %）', () => {
    const c = new Chain(defaultLight)
    c.width.pct(50)
    expect(c._node.width).toBe('50%')
  })

  it('回归：传统单位仍工作（px / rem / em / vw / vh）', () => {
    const c1 = new Chain(defaultLight)
    c1.padding.px(16)
    expect(c1._node.padding).toBe('16px')

    const c2 = new Chain(defaultLight)
    c2.fontSize.rem(1.5)
    expect(c2._node.fontSize).toBe('1.5rem')

    const c3 = new Chain(defaultLight)
    c3.width.vw(100)
    expect(c3._node.width).toBe('100vw')
  })

  it('zui 逻辑单位 zu → calc(N * var(--zui-unit, 1px))', () => {
    const c1 = new Chain(defaultLight)
    c1.padding.zu(8)
    expect(c1._node.padding).toBe('calc(8 * var(--zui-unit, 1px))')

    const c2 = new Chain(defaultLight)
    c2.width.zu(16)
    expect(c2._node.width).toBe('calc(16 * var(--zui-unit, 1px))')

    const c3 = new Chain(defaultLight)
    c3.fontSize.zu(20)
    expect(c3._node.fontSize).toBe('calc(20 * var(--zui-unit, 1px))')
  })

  it('zu() helper 单独导出（供 theme token 使用）', () => {
    expect(zu(1)).toBe('calc(1 * var(--zui-unit, 1px))')
    expect(zu(0)).toBe('calc(0 * var(--zui-unit, 1px))')
    expect(zu(16)).toBe('calc(16 * var(--zui-unit, 1px))')
    expect(zu(0.5)).toBe('calc(0.5 * var(--zui-unit, 1px))')
  })

  it('LENGTH_UNITS 总数 = 35（含 34 个常规 + zu 逻辑单位）', () => {
    expect(LENGTH_UNITS.length).toBe(35)
    expect(LENGTH_UNITS).toContain('zu')
  })

  it('TIME_UNITS / ANGLE_UNITS 合法 unit 都可用', () => {
    const c1 = new Chain(defaultLight)
    c1.transitionDuration.ms(200)
    expect(c1._node.transitionDuration).toBe('200ms')

    const c2 = new Chain(defaultLight)
    c2.transitionDuration.s(0.5)
    expect(c2._node.transitionDuration).toBe('0.5s')

    expect(TIME_UNITS).toContain('ms')
    expect(TIME_UNITS).toContain('s')
    expect(ANGLE_UNITS).toEqual(['deg', 'rad', 'grad', 'turn'])
  })
})

// ────────────────────────────────────────────────────────────────────────────
// R2 — GLOBAL_KEYWORDS single source
// ────────────────────────────────────────────────────────────────────────────

describe('R2 — carrier isGlobalKeyword 用 GLOBAL_KEYWORDS', () => {
  it('全部 5 个 global keyword 都被识别（不在 enhanced-props.keywords 名单也命中）', () => {
    // 任意非 enhanced 属性都应允许 global keyword
    const c1 = new Chain(defaultLight)
    c1.color.inherit
    expect(c1._node.color).toBe('inherit')

    const c2 = new Chain(defaultLight)
    c2.color.unset
    expect(c2._node.color).toBe('unset')

    const c3 = new Chain(defaultLight)
    c3.color.initial
    expect(c3._node.color).toBe('initial')

    const c4 = new Chain(defaultLight)
    c4.color.revert
    expect(c4._node.color).toBe('revert')

    const c5 = new Chain(defaultLight)
    c5.color.revertLayer
    expect(c5._node.color).toBe('revert-layer')
  })

  it('GLOBAL_KEYWORDS 常量内容稳定', () => {
    expect(GLOBAL_KEYWORDS).toEqual(['inherit', 'unset', 'initial', 'revert', 'revertLayer'])
  })
})

// ────────────────────────────────────────────────────────────────────────────
// R3 — createIcssInstance injectGlobal instance 级 dedupe
// ────────────────────────────────────────────────────────────────────────────

describe('R3 — createIcssInstance instance 级 injectGlobal dedupe', () => {
  function mockEmotion() {
    const calls: Array<unknown> = []
    return {
      calls,
      css: () => 'mock-css',
      cx: (...args: unknown[]) => args.filter(Boolean).join(' '),
      injectGlobal: (s: unknown) => {
        calls.push(s)
      },
      keyframes: () => 'mock-kf',
      flush: () => {},
    }
  }

  it('相同 CSSObject 重复 injectGlobal 只穿透 emotion 一次', () => {
    const m = mockEmotion()
    const inst = createIcssInstance(m)
    const styles = { body: { margin: 0 } }
    inst.injectGlobal(styles)
    inst.injectGlobal(styles)
    inst.injectGlobal(styles)
    expect(m.calls.length).toBe(1)
  })

  it('相同 string 重复 injectGlobal 只穿透一次', () => {
    const m = mockEmotion()
    const inst = createIcssInstance(m)
    inst.injectGlobal('body { margin: 0 }')
    inst.injectGlobal('body { margin: 0 }')
    expect(m.calls.length).toBe(1)
  })

  it('不同内容都注入', () => {
    const m = mockEmotion()
    const inst = createIcssInstance(m)
    inst.injectGlobal({ body: { margin: 0 } })
    inst.injectGlobal({ body: { padding: 0 } })
    expect(m.calls.length).toBe(2)
  })

  it('injectPreflight 多次调用只注入一次', () => {
    const m = mockEmotion()
    const inst = createIcssInstance(m)
    inst.injectPreflight()
    inst.injectPreflight()
    inst.injectPreflight()
    expect(m.calls.length).toBe(1)
  })

  it('_resetInjectGlobalCache 后同样内容再次穿透 emotion', () => {
    const m = mockEmotion()
    const inst = createIcssInstance(m)
    inst.injectGlobal({ body: { margin: 0 } })
    inst._resetInjectGlobalCache()
    inst.injectGlobal({ body: { margin: 0 } })
    expect(m.calls.length).toBe(2)
  })

  it('SSR 隔离：两个 instance 独立 dedupe，互不污染', () => {
    const m1 = mockEmotion()
    const m2 = mockEmotion()
    const inst1 = createIcssInstance(m1)
    const inst2 = createIcssInstance(m2)
    const styles = { body: { margin: 0 } }
    inst1.injectGlobal(styles)
    inst2.injectGlobal(styles)
    // instance1 走过一次，但 instance2 第一次仍应注入
    expect(m1.calls.length).toBe(1)
    expect(m2.calls.length).toBe(1)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// R4 — preflight single source
// ────────────────────────────────────────────────────────────────────────────

describe('R4 — preflight 全局版与 instance 版共享 single source', () => {
  it('PREFLIGHT_STYLES 包含全部关键条目', () => {
    expect(PREFLIGHT_STYLES['*, *::before, *::after']).toEqual({ boxSizing: 'border-box' })
    expect(PREFLIGHT_STYLES.body).toMatchObject({
      margin: 0,
      lineHeight: 1.5,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
    })
  })

  it('全局 injectPreflight() 不抛错', () => {
    expect(() => injectPreflight()).not.toThrow()
  })

  it('instance 版 injectPreflight 注入与 PREFLIGHT_STYLES 等价的 styles', () => {
    const calls: unknown[] = []
    const inst = createIcssInstance({
      css: () => 'x',
      cx: () => 'x',
      injectGlobal: (s) => {
        calls.push(s)
      },
      keyframes: () => 'kf',
    })
    inst.injectPreflight()
    expect(calls[0]).toBe(PREFLIGHT_STYLES)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// R5 — keywords 不再有 leftPage / rightPage
// ────────────────────────────────────────────────────────────────────────────

describe('R5 — keywords.ts 不再有 leftPage / rightPage 歧义条目', () => {
  it('break-before: left / right 通过 keywords.left / keywords.right 直接命中', () => {
    const c = new Chain(defaultLight)
    c.breakBefore.left
    expect(c._node.breakBefore).toBe('left')

    const c2 = new Chain(defaultLight)
    c2.breakBefore.right
    expect(c2._node.breakBefore).toBe('right')
  })

  it('keywords.ts 的 KEYWORD_TO_CSS 不再 export leftPage / rightPage', async () => {
    // dynamic import 内省
    const mod = await import('../src/chain/keywords')
    expect(mod.KEYWORD_TO_CSS.leftPage).toBeUndefined()
    expect(mod.KEYWORD_TO_CSS.rightPage).toBeUndefined()
  })
})
