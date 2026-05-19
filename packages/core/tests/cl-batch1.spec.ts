import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  Chain,
  composeVariants,
  defaultLight,
  defineMixin,
  defineParts,
  defineVariants,
  extendVariants,
} from '../src'
import type { VariantPropsOf, VariantPropsOfParts } from '../src'
import type { DefaultSchema } from '../src'

/**
 * CL Batch 1 测试 — 组件库核心 5 项。
 */

// ────────────────────────────────────────────────────────────────────────────
// E5 — defineMixin
// ────────────────────────────────────────────────────────────────────────────

describe('E5 — defineMixin 可重用样式片段', () => {
  it('基础 mixin 在 chain factory 内调用', () => {
    const focusRing = defineMixin<DefaultSchema>(s => {
      s._focusVisible(f => {
        f.outlineColor._primary
        f.outlineStyle('solid')
        f.outlineWidth.px(2)
      })
    })

    const c = new Chain(defaultLight)
    focusRing(c)
    expect(c._node['&:focus-visible']).toBeDefined()
  })

  it('mixin 在 defineVariants base 内调用', () => {
    const elevation = defineMixin<DefaultSchema>(s => {
      s.boxShadow._md
    })

    const button = defineVariants(defaultLight, {
      base: s => {
        elevation(s)
        s.padding.px(12)
      },
      variants: { intent: { primary: () => {} } },
      defaultVariants: { intent: 'primary' },
    })
    const cls = button()
    expect(typeof cls).toBe('string')
    expect(cls.length).toBeGreaterThan(0)
  })

  it('多个 mixin 组合', () => {
    const m1 = defineMixin<DefaultSchema>(s => { s.padding.px(8) })
    const m2 = defineMixin<DefaultSchema>(s => { s.borderRadius._md })
    const c = new Chain(defaultLight)
    m1(c)
    m2(c)
    expect(c._node.padding).toBe('8px')
    expect(c._node.borderRadius).toBeDefined()
  })
})

// ────────────────────────────────────────────────────────────────────────────
// E7 — _state(props, mapping)
// ────────────────────────────────────────────────────────────────────────────

describe('E7 — Chain._state(props, mapping)', () => {
  it('truthy 状态对应 factory 应用', () => {
    const c = new Chain(defaultLight)
    c._state({ loading: true, error: false }, {
      loading: s => { s.opacity._70 },
      error:   s => { s.borderColor._danger },
    })
    expect(c._node.opacity).toBe(0.7)
    expect(c._node.borderColor).toBeUndefined()
  })

  it('所有 false 都不应用', () => {
    const c = new Chain(defaultLight)
    c._state({ a: false, b: 0, c: '', d: null }, {
      a: s => { s.color._danger },
      b: s => { s.color._danger },
      c: s => { s.color._danger },
      d: s => { s.color._danger },
    })
    expect(c._node.color).toBeUndefined()
  })

  it('truthy 但非 bool 值也应用', () => {
    const c = new Chain(defaultLight)
    c._state({ x: 1, y: 'str', z: {} }, {
      x: s => { s.padding.px(8) },
      y: s => { s.margin.px(4) },
      z: s => { s.borderRadius._md },
    })
    expect(c._node.padding).toBe('8px')
    expect(c._node.margin).toBe('4px')
    expect(c._node.borderRadius).toBeDefined()
  })

  it('mapping 中没声明的 key 不应用（即使 props 有）', () => {
    const c = new Chain(defaultLight)
    c._state({ loading: true, extra: true }, {
      loading: s => { s.opacity._50 },
      // extra 没声明
    })
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
      h._state({ active: true }, {
        active: s => { s.backgroundColor._primary },
      })
    })
    const hov = c._node['&:hover'] as Record<string, unknown>
    expect(hov.backgroundColor).toBeDefined()
  })
})

// ────────────────────────────────────────────────────────────────────────────
// E2 — composeVariants
// ────────────────────────────────────────────────────────────────────────────

describe('E2 — composeVariants 变体复合', () => {
  const interactive = defineVariants(defaultLight, {
    variants: {
      state: {
        idle: () => {},
        loading: s => { s.opacity._70 },
        disabled: s => { s.opacity._50 },
      },
    },
    defaultVariants: { state: 'idle' },
  })

  const buttonCore = defineVariants(defaultLight, {
    base: s => { s.padding.px(12) },
    variants: {
      intent: {
        primary: s => { s.backgroundColor._primary },
        danger:  s => { s.backgroundColor._danger },
      },
      size: {
        sm: s => { s.padding.px(8) },
        lg: s => { s.padding.px(16) },
      },
    },
    defaultVariants: { intent: 'primary', size: 'sm' },
  })

  const button = composeVariants(interactive, buttonCore)

  it('两个 variant 工厂合并', () => {
    const cls = button({ state: 'loading', intent: 'danger', size: 'lg' })
    expect(typeof cls).toBe('string')
    // 应包含两个 className（emotion 出两个 hash）
    expect(cls.split(/\s+/).filter(Boolean).length).toBe(2)
  })

  it('未传 props 走两个工厂的 defaults', () => {
    const cls = button()
    expect(typeof cls).toBe('string')
    expect(cls.length).toBeGreaterThan(0)
  })

  it('不同 props 输出不同 className', () => {
    const a = button({ intent: 'primary', state: 'idle' })
    const b = button({ intent: 'danger', state: 'loading' })
    expect(a).not.toBe(b)
  })

  it('三个工厂复合', () => {
    const v3 = defineVariants(defaultLight, {
      variants: { focus: { yes: s => { s.outlineColor._primary } } },
      defaultVariants: { focus: 'yes' },
    })
    const composed = composeVariants(interactive, buttonCore, v3)
    const cls = composed({ state: 'idle', intent: 'primary', size: 'sm', focus: 'yes' })
    expect(cls.split(/\s+/).filter(Boolean).length).toBe(3)
  })

  it('VariantPropsOf<typeof composed> 推断完整 props', () => {
    type Props = VariantPropsOf<typeof button>
    expectTypeOf<Props>().toExtend<{
      state?: 'idle' | 'loading' | 'disabled'
      intent?: 'primary' | 'danger'
      size?: 'sm' | 'lg'
    } | undefined>()
  })
})

// ────────────────────────────────────────────────────────────────────────────
// E3 — VariantPropsOf
// ────────────────────────────────────────────────────────────────────────────

describe('E3 — VariantPropsOf 类型推断', () => {
  it('从 defineVariants 返回值推 props 类型', () => {
    const button = defineVariants(defaultLight, {
      variants: {
        intent: { primary: () => {}, danger: () => {} },
        size: { sm: () => {}, md: () => {}, lg: () => {} },
      },
    })
    type Props = VariantPropsOf<typeof button>
    expectTypeOf<Props>().toExtend<{
      intent?: 'primary' | 'danger'
      size?: 'sm' | 'md' | 'lg'
    } | undefined>()
  })

  it('运行时使用：与组件 props 类型一致', () => {
    const f = defineVariants(defaultLight, {
      variants: { intent: { primary: () => {} } },
    })
    type Props = VariantPropsOf<typeof f>
    // 模拟组件 props
    const useIt = (props?: Props): string => f(props)
    expect(typeof useIt({ intent: 'primary' })).toBe('string')
    expect(typeof useIt()).toBe('string')
  })
})

// ────────────────────────────────────────────────────────────────────────────
// E1 — defineParts 多 slot
// ────────────────────────────────────────────────────────────────────────────

describe('E1 — defineParts 多 slot', () => {
  const dialog = defineParts(defaultLight, {
    slots: ['root', 'overlay', 'content', 'title'] as const,
    base: {
      root: s => { s.position.fixed; s.zIndex._modal },
      overlay: s => { s.position.fixed; s.backgroundColor.black; s.opacity._50 },
      content: s => { s.position.fixed; s.borderRadius._lg },
      title: s => { s.fontWeight._bold },
    },
    variants: {
      size: {
        sm: { content: s => { s.padding.px(8) } },
        md: { content: s => { s.padding.px(16) } },
        lg: { content: s => { s.padding.px(24) } },
      },
    },
    defaultVariants: { size: 'md' },
  })

  it('返回对象有所有 slot key', () => {
    expect(typeof dialog.root).toBe('function')
    expect(typeof dialog.overlay).toBe('function')
    expect(typeof dialog.content).toBe('function')
    expect(typeof dialog.title).toBe('function')
  })

  it('每个 slot 工厂返回 className 字符串', () => {
    expect(typeof dialog.root()).toBe('string')
    expect(typeof dialog.overlay()).toBe('string')
    expect(typeof dialog.content()).toBe('string')
    expect(typeof dialog.title()).toBe('string')
  })

  it('不同 slot 返回不同 className', () => {
    expect(dialog.root()).not.toBe(dialog.overlay())
    expect(dialog.content()).not.toBe(dialog.title())
  })

  it('同 slot 不同 variant 返回不同 className', () => {
    const sm = dialog.content({ size: 'sm' })
    const lg = dialog.content({ size: 'lg' })
    expect(sm).not.toBe(lg)
  })

  it('未声明 variant 的 slot 不受影响', () => {
    // title 没在 variants.size 里声明 → 任何 size 都返回相同 className
    const a = dialog.title({ size: 'sm' })
    const b = dialog.title({ size: 'lg' })
    expect(a).toBe(b)
  })

  it('未传 props 用 defaultVariants', () => {
    const def = dialog.content()
    const md = dialog.content({ size: 'md' })
    expect(def).toBe(md)
  })

  it('同 slot 同 props 缓存命中（==）', () => {
    const a = dialog.content({ size: 'lg' })
    const b = dialog.content({ size: 'lg' })
    expect(a).toBe(b)
  })

  it('compoundVariants 命中', () => {
    const compoundDialog = defineParts(defaultLight, {
      slots: ['root', 'content'] as const,
      base: { root: s => { s.padding.px(8) } },
      variants: {
        size: { sm: { content: () => {} }, lg: { content: () => {} } },
        tone: { warm: { content: () => {} }, cool: { content: () => {} } },
      },
      defaultVariants: { size: 'sm', tone: 'warm' },
      compoundVariants: [
        {
          when: { size: 'lg', tone: 'cool' },
          apply: { content: s => { s.backgroundColor._info } },
        },
      ],
    })
    const a = compoundDialog.content({ size: 'lg', tone: 'cool' })
    const b = compoundDialog.content({ size: 'lg', tone: 'warm' })
    expect(a).not.toBe(b)
  })

  it('VariantPropsOfParts<typeof dialog> 推 props 类型', () => {
    type DialogProps = VariantPropsOfParts<typeof dialog>
    expectTypeOf<DialogProps>().toExtend<{
      size?: 'sm' | 'md' | 'lg'
    }>()
  })

  it('实际应用：dialog 4 slot 组合用', () => {
    const ds = {
      root: dialog.root({ size: 'lg' }),
      overlay: dialog.overlay({ size: 'lg' }),
      content: dialog.content({ size: 'lg' }),
      title: dialog.title({ size: 'lg' }),
    }
    expect(Object.values(ds).every(s => typeof s === 'string' && s.length > 0)).toBe(true)
    // 4 个都不同
    const all = new Set(Object.values(ds))
    expect(all.size).toBe(4)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// extendVariants（顺手测）
// ────────────────────────────────────────────────────────────────────────────

describe('extendVariants 变体继承', () => {
  const button = defineVariants(defaultLight, {
    base: s => { s.padding.px(12); s.borderRadius._md },
    variants: {
      intent: {
        primary: s => { s.backgroundColor._primary; s.color.white },
        danger: s => { s.backgroundColor._danger; s.color.white },
      },
    },
    defaultVariants: { intent: 'primary' },
  })

  it('child base 追加在 parent 之上', () => {
    const outlineButton = extendVariants(defaultLight, button, {
      base: s => { s.borderWidth.px(1); s.backgroundColor.transparent },
      variants: {} as never,
    })
    // 用 as 绕开类型：extendVariants 当前类型推断弱，运行时正确
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cls = (outlineButton as any)({ intent: 'primary' }) as string
    // composed 输出 2 个 className（parent + child）
    expect(cls.split(/\s+/).filter(Boolean).length).toBe(2)
  })

  it('child 不传 variants 也能 work', () => {
    const noopChild = extendVariants(defaultLight, button, {
      base: s => { s.fontFamily('Inter') },
      variants: {} as never,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(typeof (noopChild as any)()).toBe('string')
  })
})
