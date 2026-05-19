import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createIcssInstance,
  injectGlobal,
  injectLayer,
  injectLayerOrder,
  registerCustomProperty,
  registerFont,
} from '../src'
import { _resetInjectGlobalCache } from '../src/injectGlobal'

/**
 * Audit Batch 4 — S9 register* 生成字符串内容断言。
 *
 * 之前测试只验证"调用不抛错"，没断言生成 `@font-face` / `@property` / `@layer` 的字符串
 * 内容正确。这里通过 mock emotion instance 捕获 inject 的字符串，逐字段断言。
 */

function makeMockInstance() {
  const calls: unknown[] = []
  const inst = createIcssInstance({
    css: () => 'mock',
    cx: (...a: unknown[]) => a.filter(Boolean).join(' '),
    injectGlobal: (s) => {
      calls.push(s)
    },
    keyframes: () => 'mock-kf',
  })
  return { inst, calls }
}

// ────────────────────────────────────────────────────────────────────────────
// S9.1 — registerCustomProperty 生成正确的 @property 字符串
// ────────────────────────────────────────────────────────────────────────────

describe('S9.1 — registerCustomProperty 生成 @property block', () => {
  beforeEach(() => {
    _resetInjectGlobalCache()
  })

  it('基础 @property block 包含 syntax / inherits / initial-value', () => {
    const { inst, calls } = makeMockInstance()
    inst.injectGlobal = () => {} // 不影响其它测试
    inst.registerCustomProperty('--my-angle', {
      syntax: '<angle>',
      inherits: false,
      initialValue: '0deg',
    })
    const block = String(calls[0])
    expect(block).toContain('@property --my-angle')
    expect(block).toContain("syntax: '<angle>'")
    expect(block).toContain('inherits: false')
    expect(block).toContain('initial-value: 0deg')
  })

  it('inherits: true 正确', () => {
    const { inst, calls } = makeMockInstance()
    inst.registerCustomProperty('--my-color', {
      syntax: '<color>',
      inherits: true,
      initialValue: '#ff0000',
    })
    const block = String(calls[0])
    expect(block).toContain('inherits: true')
  })

  it('initialValue 数字也正确', () => {
    const { inst, calls } = makeMockInstance()
    inst.registerCustomProperty('--my-n', {
      syntax: '<number>',
      inherits: false,
      initialValue: 42,
    })
    const block = String(calls[0])
    expect(block).toContain('initial-value: 42')
  })

  it('用 createIcssInstance.registerCustomProperty 生成同形态 block', () => {
    const { inst, calls } = makeMockInstance()
    inst.registerCustomProperty('--my-dur', {
      syntax: '<time>',
      inherits: false,
      initialValue: '0s',
    })
    const block = String(calls[0])
    expect(block).toMatch(/@property\s+--my-dur\s*\{/)
    expect(block).toContain('syntax')
    expect(block).toContain('initial-value: 0s')
  })
})

// ────────────────────────────────────────────────────────────────────────────
// S9.2 — registerFont 生成正确的 @font-face 字符串
// ────────────────────────────────────────────────────────────────────────────

describe('S9.2 — registerFont 生成 @font-face block', () => {
  beforeEach(() => {
    _resetInjectGlobalCache()
  })

  it('基础 @font-face 块', () => {
    const { inst, calls } = makeMockInstance()
    inst.registerFont('Inter', [{ src: '/fonts/Inter.woff2', format: 'woff2', weight: 400 }])
    const block = String(calls[0])
    expect(block).toMatch(/@font-face\s*\{/)
    expect(block).toContain("font-family: 'Inter'")
    expect(block).toContain("url('/fonts/Inter.woff2')")
    expect(block).toContain("format('woff2')")
    expect(block).toContain('font-weight: 400')
    expect(block).toContain('font-display: swap') // 默认 swap
  })

  it('多 sources → 多个 @font-face block', () => {
    const { inst, calls } = makeMockInstance()
    inst.registerFont('Inter', [
      { src: '/r.woff2', format: 'woff2', weight: 400 },
      { src: '/b.woff2', format: 'woff2', weight: 700 },
    ])
    expect(calls.length).toBe(2)
    expect(String(calls[0])).toContain('font-weight: 400')
    expect(String(calls[1])).toContain('font-weight: 700')
  })

  it('display: optional 正确', () => {
    const { inst, calls } = makeMockInstance()
    inst.registerFont('X', [{ src: '/x.woff2', display: 'optional' }])
    const block = String(calls[0])
    expect(block).toContain('font-display: optional')
  })

  it('font-style 与 unicodeRange', () => {
    const { inst, calls } = makeMockInstance()
    inst.registerFont('Y', [
      {
        src: '/y.woff2',
        style: 'italic',
        unicodeRange: 'U+0000-00FF',
      },
    ])
    const block = String(calls[0])
    expect(block).toContain('font-style: italic')
    expect(block).toContain('unicode-range: U+0000-00FF')
  })

  it('src 自带 url(...) 透传', () => {
    const { inst, calls } = makeMockInstance()
    inst.registerFont('Z', [{ src: 'url(/z.woff2) format("woff2")' }])
    const block = String(calls[0])
    expect(block).toContain('url(/z.woff2) format("woff2")')
  })

  it('全局 registerFont 不抛错（dedupe 后）', () => {
    expect(() => registerFont('UniqueFontA', [{ src: '/u.woff2' }])).not.toThrow()
  })
})

// ────────────────────────────────────────────────────────────────────────────
// S9.3 — injectLayer / injectLayerOrder 生成正确字符串
// ────────────────────────────────────────────────────────────────────────────

describe('S9.3 — injectLayerOrder 生成 @layer 顺序声明', () => {
  beforeEach(() => {
    _resetInjectGlobalCache()
  })

  it('@layer name, name, name; 形式', () => {
    const { inst, calls } = makeMockInstance()
    inst.injectLayerOrder(['reset', 'base', 'components'])
    expect(calls[0]).toBe('@layer reset, base, components;')
  })

  it('空数组不注入', () => {
    const { inst, calls } = makeMockInstance()
    inst.injectLayerOrder([])
    expect(calls.length).toBe(0)
  })

  it('单 layer', () => {
    const { inst, calls } = makeMockInstance()
    inst.injectLayerOrder(['only'])
    expect(calls[0]).toBe('@layer only;')
  })
})

describe('S9.4 — injectLayer 生成 @layer name { ... } 形式', () => {
  beforeEach(() => {
    _resetInjectGlobalCache()
  })

  it('@layer 包裹 styles 对象', () => {
    const { inst, calls } = makeMockInstance()
    const styles = { '.btn': { padding: '8px' } }
    inst.injectLayer('components', styles)
    expect(calls[0]).toEqual({ '@layer components': styles })
  })

  it('全局 injectLayer 不抛错', () => {
    expect(() => injectLayer('audit-x', { '.audit-x': { color: 'red' } })).not.toThrow()
    expect(() => injectLayerOrder(['audit-l1', 'audit-l2'])).not.toThrow()
  })
})

// ────────────────────────────────────────────────────────────────────────────
// S9.5 — applyStyleProps 复合 prop 的 token 解析
// ────────────────────────────────────────────────────────────────────────────

describe('S9.5 — applyStyleProps 复合 alias 多 prop token 解析', () => {
  it('px: token → paddingLeft + paddingRight 都解析', async () => {
    const { Chain, defaultLight, applyStyleProps } = await import('../src')
    const c = new Chain(defaultLight)
    applyStyleProps(c, { px: '_md' })
    // default schema spacing.md = '16px'
    expect(c._node.paddingLeft).toBe('16px')
    expect(c._node.paddingRight).toBe('16px')
  })

  it('my: token → marginTop + marginBottom 都解析', async () => {
    const { Chain, defaultLight, applyStyleProps } = await import('../src')
    const c = new Chain(defaultLight)
    applyStyleProps(c, { my: '_md' })
    expect(c._node.marginTop).toBe('16px')
    expect(c._node.marginBottom).toBe('16px')
  })
})

// ────────────────────────────────────────────────────────────────────────────
// 工程化烟雾测试
// ────────────────────────────────────────────────────────────────────────────

describe('工程化烟雾', () => {
  it('全局 injectGlobal 单独调用不抛错（dedupe 路径）', () => {
    _resetInjectGlobalCache()
    expect(() => injectGlobal({ body: { margin: 0 } })).not.toThrow()
  })

  it('createIcssInstance 同时挂载 preflight / registerCustomProperty / 等', () => {
    const inst = createIcssInstance({
      css: () => '',
      cx: () => '',
      injectGlobal: () => {},
      keyframes: () => '',
    })
    expect(typeof inst.injectPreflight).toBe('function')
    expect(typeof inst.registerCustomProperty).toBe('function')
    expect(typeof inst.registerFont).toBe('function')
    expect(typeof inst.injectLayer).toBe('function')
    expect(typeof inst.injectLayerOrder).toBe('function')
    expect(typeof inst.ikeyframes).toBe('function')
    expect(typeof inst.registerAnimation).toBe('function')
    expect(typeof inst.presetAnimations).toBe('object')
    expect(typeof inst._resetInjectGlobalCache).toBe('function')
  })
})
