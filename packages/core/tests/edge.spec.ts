import { describe, expect, it } from 'vitest'
import { Chain, Theme, icss, mergeTheme, resolveTheme } from '../src'
import { defaultLight } from './_fixture-theme'

/**
 * Edge case 集中地（Batch 5）。
 *
 * 验证已知陷阱与边界条件，防止回归：
 * - function token 顺序与循环引用
 * - blur key '2xl' / '3xl' 非合法 ident 访问
 * - proxy bind receiver 行为（_when / _apply 闭包传出仍是 proxy）
 * - carrier 缓存命中（连续访问相同 carrier 引用相同）
 * - alpha clamp 边界（< 0 / > 100）
 * - resolveTheme freeze immutable
 * - 保留属性名容错（schema 起名 label / constructor 时的行为）
 * - noUncheckedIndexedAccess narrow 后 undefined 处理
 * - 空 schema / 空 partial
 */

describe('function token: 求值顺序', () => {
  it('function token 引用同 category 字面量', () => {
    const r = resolveTheme({
      color: { primary: '#2563eb', primaryHover: (ctx) => ctx.color!.primary as string },
    })
    expect(r.color!.primaryHover).toBe('#2563eb')
  })

  it('function token 引用跨 category 字面量', () => {
    const r = resolveTheme({
      color: { brand: '#7c3aed' },
      shadow: { brandGlow: (ctx) => `0 0 10px ${ctx.color!.brand}` },
    })
    expect(r.shadow!.brandGlow).toBe('0 0 10px #7c3aed')
  })

  it('function token 两两互相引用（环）取后跑那个的当前值', () => {
    // pass 2 顺序：按 Object.keys 顺序求值；env 里前者的值在它求值后才更新到 ctx
    // 这里只保证不抛错 + 结果可预测
    const r = resolveTheme({
      color: {
        a: (ctx) => (ctx.color!.b as string | undefined) ?? '#000',
        b: '#fff',
      },
    })
    expect(typeof r.color!.a).toBe('string')
  })

  it('function token 引用不存在的 category 默认安全（用户 cast 兜底）', () => {
    const r = resolveTheme({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      color: { x: (ctx: any) => (ctx.spacing?.md ?? '0') as string },
    })
    expect(r.color!.x).toBe('0')
  })
})

describe('resolveTheme freeze immutable', () => {
  it('每个 category 被 Object.freeze', () => {
    const r = resolveTheme({ color: { primary: '#000' } })
    expect(Object.isFrozen(r.color)).toBe(true)
  })

  it('试图修改 frozen category 静默失败（严格模式抛错）', () => {
    const r = resolveTheme({ color: { primary: '#000' } })
    // 严格模式 (TS / 'use strict') 下抛 TypeError；非严格模式静默
    try {
      ;(r.color as Record<string, string>).primary = '#fff'
    } catch {
      // 期望路径
    }
    expect(r.color!.primary).toBe('#000')
  })

  it('mergeTheme 返回的新对象，原 parent freeze 仍然有效', () => {
    const parent = resolveTheme({ color: { primary: '#000' } })
    mergeTheme(parent, { color: { primary: '#fff' } })
    expect(parent.color!.primary).toBe('#000')
    expect(Object.isFrozen(parent.color)).toBe(true)
  })
})

describe('blur 6 档（0.6.0 重命名）', () => {
  it('用 defaultLight 主题访问 blur.huge', () => {
    const blur = (defaultLight as unknown as { blur?: Record<string, string> }).blur
    expect(blur?.huge).toBeDefined()
  })

  it("Chain._blur('huge') 命中（不带 _ 前缀）", () => {
    const c = new Chain(defaultLight)
    c._blur('huge')
    // 已映射成 blur(<value>) 形式
    expect(typeof c._node.filter).toBe('string')
    expect((c._node.filter as string).startsWith('blur(')).toBe(true)
  })

  it("Chain._blur('_huge') 也命中（带 _ 前缀；resolveBlurValue 兼容）", () => {
    const c = new Chain(defaultLight)
    c._blur('_huge')
    expect(typeof c._node.filter).toBe('string')
    expect((c._node.filter as string).startsWith('blur(')).toBe(true)
  })

  it('未知 blur token 原样透传', () => {
    const c = new Chain(defaultLight)
    c._blur('nonexistent')
    expect(c._node.filter).toBe('nonexistent')
  })
})

describe('proxy bind receiver — _when / _apply 内 fn(this) 仍是 proxy', () => {
  it('_when 内回调可继续走 carrier', () => {
    const c = new Chain(defaultLight)
    c._when(true, (s) => {
      s.color._primary // 必须能命中 token
      s.padding.px(8)
    })
    expect(c._node.color).toBeDefined()
    expect(c._node.padding).toBe('8px')
  })

  it('_apply 同上', () => {
    const c = new Chain(defaultLight)
    c._apply((s) => {
      s.fontWeight._bold
      s._hover((h) => h.color.white)
    })
    expect(c._node.fontWeight).toBeDefined()
    expect((c._node['&:hover'] as Record<string, unknown>).color).toBe('white')
  })

  it('_unless 否定路径不执行', () => {
    const c = new Chain(defaultLight)
    c._unless(true, (s) => {
      s.color('red')
    }) // 不应执行
    expect(c._node.color).toBeUndefined()
  })
})

describe('carrier 缓存命中', () => {
  it('连续访问相同 carrier 引用相等（_carriers Map 命中）', () => {
    const c = new Chain(defaultLight)
    const a = c.color
    const b = c.color
    expect(a).toBe(b)
  })

  it('不同 chain 实例的 carrier 不复用', () => {
    const a = new Chain(defaultLight)
    const b = new Chain(defaultLight)
    expect(a.color).not.toBe(b.color)
  })

  it('一次 carrier 访问写入 _carriers Map', () => {
    const c = new Chain(defaultLight)
    expect(c._carriers.size).toBe(0)
    void c.color
    expect(c._carriers.has('color')).toBe(true)
    expect(c._carriers.size).toBe(1)
  })
})

describe('alpha clamp 边界', () => {
  it('alpha < 0 视为 0', () => {
    const c = new Chain(defaultLight)
    c.color._primary.alpha(-50)
    expect(c._node.color).toMatch(/rgba\([^)]*,\s*0\)/)
  })

  it('alpha > 100 视为 1', () => {
    const c = new Chain(defaultLight)
    c.color._primary.alpha(200)
    expect(c._node.color).toMatch(/rgba\([^)]*,\s*1\)/)
  })

  it('alpha = 0', () => {
    const c = new Chain(defaultLight)
    c.color._primary.alpha(0)
    expect(c._node.color).toMatch(/rgba\([^)]*,\s*0\)/)
  })

  it('alpha = 100', () => {
    const c = new Chain(defaultLight)
    c.color._primary.alpha(100)
    expect(c._node.color).toMatch(/rgba\([^)]*,\s*1\)/)
  })
})

describe('保留属性名容错', () => {
  it("schema 起名 'label' 不会破坏 Chain（用户自己负责）", () => {
    // 我们不强制 Exclude，只在 README 警告；运行时不崩
    expect(() => {
      const t = new Theme({
        color: { primary: '#000' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        label: { x: '1' } as any,
      })
      new Chain(t as unknown as Theme<typeof defaultLight extends Theme<infer S> ? S : never>)
    }).not.toThrow()
  })

  it('chain.label() 不被 schema 的 label category 干扰', () => {
    const c = new Chain(defaultLight)
    c.label('Button')
    expect(c._node.label).toBe('Button')
  })
})

describe('icss 接受 Theme / ResolvedTheme 两种形式', () => {
  it('Theme 实例', () => {
    const cls = icss(defaultLight, (s) => {
      s.color._primary
    })
    expect(typeof cls).toBe('string')
    expect(cls.length).toBeGreaterThan(0)
  })

  it('裸 ResolvedTheme（无 Theme.getKeymap 缓存）', () => {
    const r = defaultLight.resolve()
    const cls = icss(r, (s) => {
      s.color._primary
    })
    expect(typeof cls).toBe('string')
  })

  it('factory 内嵌套 _hover', () => {
    const cls = icss(defaultLight, (s) => {
      s.color.white
      s._hover((h) => {
        h.color._primary
      })
    })
    expect(typeof cls).toBe('string')
  })
})

describe('空 schema / 空 partial', () => {
  it('空 schema resolveTheme', () => {
    const r = resolveTheme({})
    expect(r).toEqual({})
  })

  it('mergeTheme 空 partial 返回新对象但内容等价', () => {
    const parent = resolveTheme({ color: { primary: '#000' } })
    const merged = mergeTheme(parent, {})
    expect(merged.color!.primary).toBe('#000')
  })

  it('Chain 用空 schema 的 Theme 构造不抛', () => {
    const t = new Theme({})
    expect(() => new Chain(t)).not.toThrow()
  })
})

describe('Chain.toString() 多次调用返回相同 className', () => {
  it('emotion hash by content', () => {
    const c1 = new Chain(defaultLight)
    c1.color('red')
    c1.padding.px(8)
    const cls1 = c1.toString()

    const c2 = new Chain(defaultLight)
    c2.color('red')
    c2.padding.px(8)
    const cls2 = c2.toString()

    // emotion 按内容 hash 相同
    expect(cls1).toBe(cls2)
  })
})

describe('_nest try/finally 还原 _node', () => {
  it('fn 内抛错时 _node 仍恢复到父节点', () => {
    const c = new Chain(defaultLight)
    expect(() => {
      c._hover(() => {
        throw new Error('boom')
      })
    }).toThrow('boom')
    // 抛错后 _node 仍指向顶层；用 _prop 逃生舱写一个属性验证
    c._prop('color', 'red')
    expect(c._node.color).toBe('red')
  })

  it('_nest 同名 selector 多次进入合并而非覆盖', () => {
    const c = new Chain(defaultLight)
    c._hover((h) => {
      h.color._primary
    })
    c._hover((h) => {
      h.padding.px(8)
    })
    const hov = c._node['&:hover'] as Record<string, unknown>
    expect(hov.color).toBeDefined()
    expect(hov.padding).toBe('8px')
  })

  it('空 fn 不在父节点留空 selector', () => {
    const c = new Chain(defaultLight)
    c._hover(() => {})
    expect(c._node['&:hover']).toBeUndefined()
  })
})
