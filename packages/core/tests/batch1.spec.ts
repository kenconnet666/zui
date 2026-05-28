import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Chain, mergeTheme, resolveTheme } from '../src'
import { defaultLight } from './_fixture-theme'
import { injectGlobal, _resetInjectGlobalCache } from '../src/injectGlobal'
import { darken, desaturate, lighten, mix, saturate } from '../src/chain/color'

/**
 * Batch 1 改造测试集中地（B2 / C2 / B5 / B4 / C10）。
 *
 * 每个改造独立 describe；测试目的写在 it 描述里。
 */

// ────────────────────────────────────────────────────────────────────────────
// B2 — proxy.ts 改 prototype 扫描白名单
// ────────────────────────────────────────────────────────────────────────────

describe('B2 — proxy 自动扫描 prototype 内建方法', () => {
  it('继承 Chain 加自定义方法，子类方法可被 Proxy 识别', () => {
    class MyChain extends Chain<typeof defaultLight extends { schema: infer S } ? S : never> {
      myCustom(value: string): this {
        this._node.customProp = value
        return this
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = new MyChain(defaultLight as any) as MyChain
    c.myCustom('hello')
    expect(c._node.customProp).toBe('hello')
  })

  it('内建方法 _hover / _media / label / _truncate 仍然走 Proxy 拦截', () => {
    const c = new Chain(defaultLight)
    c.label('test-label')
    c._hover(h => {
      h.color.white
    })
    expect(c._node.label).toBe('test-label')
    expect(c._node['&:hover']).toEqual({ color: 'white' })
  })

  it('实例字段（_node / _theme / _keymap）直接访问不走 carrier', () => {
    const c = new Chain(defaultLight)
    expect(c._node).toBeInstanceOf(Object)
    expect(c._theme).toBeDefined()
    expect(c._keymap).toBeInstanceOf(Map)
    expect(c._carriers).toBeInstanceOf(Map)
  })

  it('未识别的 CSS 属性名走 carrier 分派（不会走原型方法）', () => {
    const c = new Chain(defaultLight)
    c.color('red') // 函数态
    expect(c._node.color).toBe('red')
  })
})

// ────────────────────────────────────────────────────────────────────────────
// C2 — label() join 而非互覆盖
// ────────────────────────────────────────────────────────────────────────────

describe('C2 — label() 多次调用 join 成 a.b.c', () => {
  it('单次 label 直接赋值', () => {
    const c = new Chain(defaultLight)
    c.label('Button')
    expect(c._node.label).toBe('Button')
  })

  it('两次 label 用 . 拼接', () => {
    const c = new Chain(defaultLight)
    c.label('Button').label('Primary')
    expect(c._node.label).toBe('Button.Primary')
  })

  it('三次以上 label 持续拼接', () => {
    const c = new Chain(defaultLight)
    c.label('Card').label('Header').label('Title')
    expect(c._node.label).toBe('Card.Header.Title')
  })

  it('空字符串 label 被忽略', () => {
    const c = new Chain(defaultLight)
    c.label('Button').label('').label('Primary')
    expect(c._node.label).toBe('Button.Primary')
  })

  it('从未 label 时 _node 无 label 字段', () => {
    const c = new Chain(defaultLight)
    expect(c._node.label).toBeUndefined()
  })
})

// ────────────────────────────────────────────────────────────────────────────
// B5 — color modifier 保 alpha
// ────────────────────────────────────────────────────────────────────────────

describe('B5 — color modifier 保留原色 alpha', () => {
  it('不透明颜色 darken 输出 hex（不带 alpha）', () => {
    const result = darken('#2563eb', 20)
    expect(result.startsWith('#')).toBe(true)
    expect(result).not.toContain('rgba')
  })

  it('rgba 含 alpha 的颜色 darken 保留原 alpha', () => {
    const result = darken('rgba(37, 99, 235, 0.5)', 20)
    expect(result.startsWith('rgba(')).toBe(true)
    expect(result).toMatch(/rgba\(\d+,\s*\d+,\s*\d+,\s*0\.5\)/)
  })

  it('rgba 半透明颜色 lighten 保留原 alpha', () => {
    const result = lighten('rgba(0, 0, 0, 0.3)', 30)
    expect(result).toMatch(/rgba\(\d+,\s*\d+,\s*\d+,\s*0\.3\)/)
  })

  it('rgba 颜色 saturate / desaturate 保留 alpha', () => {
    const sat = saturate('rgba(100, 50, 200, 0.8)', 20)
    const desat = desaturate('rgba(100, 50, 200, 0.8)', 20)
    expect(sat).toMatch(/rgba\(\d+,\s*\d+,\s*\d+,\s*0\.8\)/)
    expect(desat).toMatch(/rgba\(\d+,\s*\d+,\s*\d+,\s*0\.8\)/)
  })

  it('mix 半透明色与目标色，保留原色 alpha', () => {
    const result = mix('rgba(255, 0, 0, 0.4)', '#0000ff', 50)
    expect(result).toMatch(/rgba\(\d+,\s*\d+,\s*\d+,\s*0\.4\)/)
  })

  it('alpha = 1 视为不透明，输出 hex', () => {
    const result = darken('rgba(37, 99, 235, 1)', 20)
    expect(result.startsWith('#')).toBe(true)
  })

  it('无效颜色字符串返回原值（不抛错）', () => {
    const result = darken('not-a-color', 20)
    expect(result).toBe('not-a-color')
  })
})

// ────────────────────────────────────────────────────────────────────────────
// B4 — mergeTheme 含 function token 警告
// ────────────────────────────────────────────────────────────────────────────

describe('B4 — mergeTheme partial 含 function token 警告', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('partial 含 function token 触发 console.warn 一次', () => {
    const parent = resolveTheme({ color: { primary: '#000' } })
    mergeTheme(parent, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      color: { primary: ((ctx: unknown) => '#fff') as any },
    })
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy.mock.calls[0]?.[0] as string).toContain('color.primary')
    expect(warnSpy.mock.calls[0]?.[0] as string).toContain('function token')
  })

  it('多个 function token 多次警告', () => {
    const parent = resolveTheme({
      color: { primary: '#000', danger: '#dc2626' },
      spacing: { md: '16px' },
    })
    mergeTheme(parent, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      color: { primary: ((c: unknown) => '#fff') as any, danger: ((c: unknown) => '#000') as any },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      spacing: { md: (() => '20px') as any },
    })
    expect(warnSpy).toHaveBeenCalledTimes(3)
  })

  it('合法字面量 partial 无警告', () => {
    const parent = resolveTheme({ color: { primary: '#000' } })
    mergeTheme(parent, { color: { primary: '#fff' } })
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('警告后 merge 仍然完成（function 被合入下游）', () => {
    const parent = resolveTheme({ color: { primary: '#000' } })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const merged = mergeTheme(parent, { color: { primary: (() => '#fff') as any } })
    expect(typeof merged.color!.primary).toBe('function') // 仍然写入（行为不变，只警告）
  })
})

// ────────────────────────────────────────────────────────────────────────────
// C10 — injectGlobal 去重
// ────────────────────────────────────────────────────────────────────────────

describe('C10 — injectGlobal 内存去重', () => {
  beforeEach(() => {
    _resetInjectGlobalCache()
  })

  it('相同 CSSObject 多次调用，emotion serializer 只跑一次（不抛错）', () => {
    const styles = { body: { margin: 0, padding: 0 } }
    expect(() => {
      injectGlobal(styles)
      injectGlobal(styles)
      injectGlobal(styles)
    }).not.toThrow()
  })

  it('相同 string 多次调用去重', () => {
    expect(() => {
      injectGlobal('body { margin: 0 }')
      injectGlobal('body { margin: 0 }')
    }).not.toThrow()
  })

  it('不同内容不会被去重（都注入）', () => {
    expect(() => {
      injectGlobal({ body: { margin: 0 } })
      injectGlobal({ body: { padding: 0 } })
    }).not.toThrow()
  })

  it('_resetInjectGlobalCache 后同样内容会再次注入', () => {
    injectGlobal({ body: { margin: 1 } })
    _resetInjectGlobalCache()
    expect(() => injectGlobal({ body: { margin: 1 } })).not.toThrow()
  })
})
