/**
 * Carrier factory 形态测试（2026-05-22）。
 *
 * 验证 `s.color(c => c._primary)` 这条 callable factory 重载在 runtime + 类型层都
 * 正确工作 —— 把 carrier 自身传给用户回调,让组件 prop 直接接 factory 这种范式可用。
 *
 * 等价性原则：`s.color(c => c._primary)` 与 `s.color._primary` 输出的 className 一致,
 * 因为两者最终都走相同的 Proxy.get token 分支。
 *
 * 详见 .claude/decisions/2026-05-22-carrier-factory-prop.md。
 */
import { describe, expect, it } from 'vitest'
import { Chain } from '../src'
import { defaultLight, type TestSchema } from './_fixture-theme'

describe('Carrier factory — ColorPropCarrier', () => {
  it('s.color(c => c._primary) 等价 s.color._primary', () => {
    const c1 = new Chain(defaultLight)
    c1.color((c) => {
      c._primary
    })
    const c2 = new Chain(defaultLight)
    c2.color._primary
    expect(c1._node.color).toBe(c2._node.color)
  })

  it('factory 内调用字面量 c => c("red")', () => {
    const c = new Chain(defaultLight)
    c.color((cc) => {
      cc('red')
    })
    expect(c._node.color).toBe('red')
  })

  it('factory 内命中 CSS keyword c => c.currentColor', () => {
    const c = new Chain(defaultLight)
    c.color((cc) => {
      cc.currentColor
    })
    expect(c._node.color).toBe('currentColor')
  })

  it('factory 内 token + modifier c => c._primary.alpha(50)', () => {
    const c = new Chain(defaultLight)
    c.color((cc) => {
      cc._primary.alpha(50)
    })
    // alpha(50) → rgba 含 50% alpha
    expect(c._node.color).toMatch(/rgba\(/)
    expect(c._node.color).toMatch(/0\.5\)$/)
  })

  it('factory 内字符串逃生舱 c => c("_primary")', () => {
    const c = new Chain(defaultLight)
    c.color((cc) => {
      cc('_primary')
    })
    const c2 = new Chain(defaultLight)
    c2.color._primary
    expect(c.toString()).toBe(c2.toString())
  })

  it('factory 不调用任何东西 → _node 不写入(noop default 场景)', () => {
    const c = new Chain(defaultLight)
    c.color(() => {
      // intentionally empty
    })
    expect(c._node.color).toBeUndefined()
  })

  it('factory 多次调用 — 后者覆盖前者', () => {
    const c = new Chain(defaultLight)
    c.color((cc) => {
      cc._primary
      cc._danger
    })
    const c2 = new Chain(defaultLight)
    c2.color._danger
    expect(c._node.color).toBe(c2._node.color)
  })
})

describe('Carrier factory — PropCarrier (非 color)', () => {
  it('s.padding(c => c._middle) 等价 s.padding._middle', () => {
    const c1 = new Chain(defaultLight)
    c1.padding((p) => {
      p._middle
    })
    const c2 = new Chain(defaultLight)
    c2.padding._middle
    expect(c1._node.padding).toBe(c2._node.padding)
  })

  it('factory 内 unit method c => c.px(8)', () => {
    const c = new Chain(defaultLight)
    c.padding((p) => {
      p.px(8)
    })
    expect(c._node.padding).toBe('8px')
  })

  it('factory 内 zu unit c => c.zu(2)', () => {
    const c = new Chain(defaultLight)
    c.width((w) => {
      w.zu(2)
    })
    expect(c._node.width).toBe('calc(2 * var(--zui-unit, 1px))')
  })

  it('factory 内 keyword c => c.auto', () => {
    const c = new Chain(defaultLight)
    c.margin((m) => {
      m.auto
    })
    expect(c._node.margin).toBe('auto')
  })

  it('opacity factory c => c(0.5) 字面量数字', () => {
    const c = new Chain(defaultLight)
    c.opacity((o) => {
      o(0.5)
    })
    expect(c._node.opacity).toBe(0.5)
  })

  it('opacity factory c => c._half schema token', () => {
    const c = new Chain(defaultLight)
    c.opacity((o) => {
      o._half
    })
    expect(c._node.opacity).toBe(0.5)
  })
})

describe('Carrier factory — PropFn (无 token / unit)', () => {
  it('factory 内 GlobalKw c => c.inherit', () => {
    const c = new Chain(defaultLight)
    c.appearance((a) => {
      a.inherit
    })
    expect(c._node.appearance).toBe('inherit')
  })

  it('factory 内字面量 c => c("none")', () => {
    const c = new Chain(defaultLight)
    c.appearance((a) => {
      a('none')
    })
    expect(c._node.appearance).toBe('none')
  })
})

describe('Carrier factory — 组件 prop 范式集成', () => {
  it('factory 持有外部状态(props.color 形态)', () => {
    // 模拟组件 prop:`color?: (c: Chain<S>['color']) => void`
    const propsColor = (c: Chain<TestSchema>['color']) => {
      c._primary
    }
    const c = new Chain(defaultLight)
    c.color(propsColor)
    const c2 = new Chain(defaultLight)
    c2.color._primary
    expect(c._node.color).toBe(c2._node.color)
  })

  it('factory 闭包外部变量:动态选 token', () => {
    const useDanger = true
    const c = new Chain(defaultLight)
    c.color((cc) => {
      if (useDanger) cc._danger
      else cc._primary
    })
    const c2 = new Chain(defaultLight)
    c2.color._danger
    expect(c._node.color).toBe(c2._node.color)
  })

  it('多个 carrier factory 串联:同 chain 内不同 prop 都用 factory', () => {
    const c = new Chain(defaultLight)
    c.color((cc) => cc._primary)
    c.padding((p) => p.px(12))
    c.width((w) => w.zu(8))
    expect(c._node.color).toBeDefined()
    expect(c._node.padding).toBe('12px')
    expect(c._node.width).toBe('calc(8 * var(--zui-unit, 1px))')
  })
})
