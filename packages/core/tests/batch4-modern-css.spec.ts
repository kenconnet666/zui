import { describe, expect, it } from 'vitest'
import { Chain } from '../src'
import { defaultLight } from './_fixture-theme'

/**
 * Batch 4 — 现代 CSS 4 helper 测试（4 个 Chain method）。
 *
 * 覆盖：_safeArea / _scrollSnap / _overscroll / _field
 * 跳过：实验性 _anchor（CSS Anchor Positioning，浏览器支持率太低）
 */

describe('_safeArea', () => {
  it('默认 side=all + property=padding 写 4 个 padding', () => {
    const c = new Chain(defaultLight)
    c._safeArea()
    expect(c._node.paddingTop).toBe('env(safe-area-inset-top)')
    expect(c._node.paddingRight).toBe('env(safe-area-inset-right)')
    expect(c._node.paddingBottom).toBe('env(safe-area-inset-bottom)')
    expect(c._node.paddingLeft).toBe('env(safe-area-inset-left)')
  })

  it('单侧 bottom + 默认 padding', () => {
    const c = new Chain(defaultLight)
    c._safeArea('bottom')
    expect(c._node.paddingBottom).toBe('env(safe-area-inset-bottom)')
    expect(c._node.paddingTop).toBeUndefined()
  })

  it('单侧 top + margin', () => {
    const c = new Chain(defaultLight)
    c._safeArea('top', 'margin')
    expect(c._node.marginTop).toBe('env(safe-area-inset-top)')
  })

  it('all + inset 写 4 个 inset', () => {
    const c = new Chain(defaultLight)
    c._safeArea('all', 'inset')
    expect(c._node.insetTop).toBe('env(safe-area-inset-top)')
    expect(c._node.insetRight).toBe('env(safe-area-inset-right)')
    expect(c._node.insetBottom).toBe('env(safe-area-inset-bottom)')
    expect(c._node.insetLeft).toBe('env(safe-area-inset-left)')
  })

  it('链式返回 this', () => {
    const c = new Chain(defaultLight)
    expect(c._safeArea('top')).toBe(c)
  })
})

describe('_scrollSnap', () => {
  it('容器侧：type + strictness', () => {
    const c = new Chain(defaultLight)
    c._scrollSnap({ type: 'y', strictness: 'mandatory' })
    expect(c._node.scrollSnapType).toBe('y mandatory')
  })

  it('type 单独，不带 strictness', () => {
    const c = new Chain(defaultLight)
    c._scrollSnap({ type: 'x' })
    expect(c._node.scrollSnapType).toBe('x')
  })

  it('type=none', () => {
    const c = new Chain(defaultLight)
    c._scrollSnap({ type: 'none' })
    expect(c._node.scrollSnapType).toBe('none')
  })

  it('block / inline 逻辑轴', () => {
    const c = new Chain(defaultLight)
    c._scrollSnap({ type: 'block', strictness: 'proximity' })
    expect(c._node.scrollSnapType).toBe('block proximity')
  })

  it('both', () => {
    const c = new Chain(defaultLight)
    c._scrollSnap({ type: 'both', strictness: 'mandatory' })
    expect(c._node.scrollSnapType).toBe('both mandatory')
  })

  it('子项侧：align + stop', () => {
    const c = new Chain(defaultLight)
    c._scrollSnap({ align: 'center', stop: 'always' })
    expect(c._node.scrollSnapAlign).toBe('center')
    expect(c._node.scrollSnapStop).toBe('always')
  })

  it('混合：4 个字段同时设', () => {
    const c = new Chain(defaultLight)
    c._scrollSnap({ type: 'y', strictness: 'mandatory', align: 'start', stop: 'normal' })
    expect(c._node.scrollSnapType).toBe('y mandatory')
    expect(c._node.scrollSnapAlign).toBe('start')
    expect(c._node.scrollSnapStop).toBe('normal')
  })

  it('空 opts 不写任何字段', () => {
    const c = new Chain(defaultLight)
    c._scrollSnap({})
    expect(c._node.scrollSnapType).toBeUndefined()
    expect(c._node.scrollSnapAlign).toBeUndefined()
  })
})

describe('_overscroll', () => {
  it('无 axis 写 overscroll-behavior', () => {
    const c = new Chain(defaultLight)
    c._overscroll('contain')
    expect(c._node.overscrollBehavior).toBe('contain')
  })

  it('axis=y 写 overscroll-behavior-y', () => {
    const c = new Chain(defaultLight)
    c._overscroll('none', 'y')
    expect(c._node.overscrollBehaviorY).toBe('none')
    expect(c._node.overscrollBehavior).toBeUndefined()
  })

  it('axis=x', () => {
    const c = new Chain(defaultLight)
    c._overscroll('auto', 'x')
    expect(c._node.overscrollBehaviorX).toBe('auto')
  })

  it('axis=inline 逻辑轴', () => {
    const c = new Chain(defaultLight)
    c._overscroll('contain', 'inline')
    expect(c._node.overscrollBehaviorInline).toBe('contain')
  })

  it('axis=block 逻辑轴', () => {
    const c = new Chain(defaultLight)
    c._overscroll('none', 'block')
    expect(c._node.overscrollBehaviorBlock).toBe('none')
  })

  it('链式返回 this', () => {
    const c = new Chain(defaultLight)
    expect(c._overscroll('contain')).toBe(c)
  })
})

describe('_field', () => {
  it('content 写 field-sizing: content', () => {
    const c = new Chain(defaultLight)
    c._field('content')
    expect(c._node.fieldSizing).toBe('content')
  })

  it('fixed 写 field-sizing: fixed', () => {
    const c = new Chain(defaultLight)
    c._field('fixed')
    expect(c._node.fieldSizing).toBe('fixed')
  })

  it('多次调用，后一次覆盖', () => {
    const c = new Chain(defaultLight)
    c._field('content')._field('fixed')
    expect(c._node.fieldSizing).toBe('fixed')
  })
})

describe('Batch 4 联合使用', () => {
  it('mobile 底栏：safeArea bottom + scrollSnap container', () => {
    const c = new Chain(defaultLight)
    c._safeArea('bottom').overflow('auto')._scrollSnap({ type: 'x', strictness: 'mandatory' })
    expect(c._node.paddingBottom).toBe('env(safe-area-inset-bottom)')
    expect(c._node.overflow).toBe('auto')
    expect(c._node.scrollSnapType).toBe('x mandatory')
  })

  it('chat 输入框：field content + overscroll contain', () => {
    const c = new Chain(defaultLight)
    c._field('content')._overscroll('contain')
    expect(c._node.fieldSizing).toBe('content')
    expect(c._node.overscrollBehavior).toBe('contain')
  })
})
