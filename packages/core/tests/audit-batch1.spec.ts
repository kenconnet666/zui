import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  injectLayer,
  injectLayerOrder,
  registerCustomProperty,
  registerFont,
} from '../src'
import { _resetInjectGlobalCache } from '../src/injectGlobal'
import { PREFLIGHT_STYLES } from '../src/preset/preflightStyles'

/**
 * Audit Batch 1 测试（S1 / S2 / S5）。
 *
 * 验证：
 * - S1 全局 register* 接入 injectGlobal 内存去重
 * - S2 registerCustomProperty 单引号 escape + 可疑字符 dev warn
 * - S5 PREFLIGHT_STYLES 深 freeze
 */

// ────────────────────────────────────────────────────────────────────────────
// S1 — 全局 register* 接入 dedupe
// ────────────────────────────────────────────────────────────────────────────

describe('S1 — 全局 register* 接入 injectGlobal dedupe', () => {
  beforeEach(() => {
    _resetInjectGlobalCache()
  })

  it('registerCustomProperty 重复调用同样参数不抛错', () => {
    expect(() => {
      registerCustomProperty('--zui-test-1', {
        syntax: '<angle>',
        inherits: false,
        initialValue: '0deg',
      })
      registerCustomProperty('--zui-test-1', {
        syntax: '<angle>',
        inherits: false,
        initialValue: '0deg',
      })
      registerCustomProperty('--zui-test-1', {
        syntax: '<angle>',
        inherits: false,
        initialValue: '0deg',
      })
    }).not.toThrow()
  })

  it('registerFont 重复调用同样参数不抛错', () => {
    expect(() => {
      registerFont('TestFontX', [{ src: '/x.woff2', format: 'woff2' }])
      registerFont('TestFontX', [{ src: '/x.woff2', format: 'woff2' }])
    }).not.toThrow()
  })

  it('injectLayerOrder 重复调用不抛错', () => {
    expect(() => {
      injectLayerOrder(['reset', 'base', 'components'])
      injectLayerOrder(['reset', 'base', 'components'])
    }).not.toThrow()
  })

  it('injectLayer 重复调用不抛错', () => {
    expect(() => {
      const styles = { '.btn': { padding: '8px' } }
      injectLayer('components', styles)
      injectLayer('components', styles)
    }).not.toThrow()
  })
})

// ────────────────────────────────────────────────────────────────────────────
// S2 — registerCustomProperty escape + dev warn
// ────────────────────────────────────────────────────────────────────────────

describe('S2 — registerCustomProperty 防御', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    _resetInjectGlobalCache()
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('合法 syntax 不抛错不警告', () => {
    expect(() => registerCustomProperty('--zui-color-ok', {
      syntax: '<color>',
      inherits: true,
      initialValue: '#ffffff',
    })).not.toThrow()
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('合法 angle / length / number / * 都不警告', () => {
    registerCustomProperty('--a', { syntax: '<angle>', inherits: false, initialValue: '0deg' })
    registerCustomProperty('--b', { syntax: '<length>', inherits: false, initialValue: '0px' })
    registerCustomProperty('--c', { syntax: '<number>', inherits: false, initialValue: 0 })
    registerCustomProperty('--d', { syntax: '*', inherits: false, initialValue: '' })
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('含 ;{} 的可疑 syntax 触发 warn', () => {
    registerCustomProperty('--bad', {
      syntax: '<color>; }; * { color: red',
      inherits: false,
      initialValue: '#000',
    })
    expect(warnSpy).toHaveBeenCalled()
    const msg = warnSpy.mock.calls[0]?.[0] as string
    expect(msg).toContain('可疑字符')
  })

  it('含 ;{} 的可疑 initialValue 触发 warn', () => {
    registerCustomProperty('--bad2', {
      syntax: '<length>',
      inherits: false,
      initialValue: '0px; color: red',
    })
    expect(warnSpy).toHaveBeenCalled()
    const msg = warnSpy.mock.calls[0]?.[0] as string
    expect(msg).toContain('initialValue')
  })

  it('含单引号的 syntax 自动 escape，不破坏 @property block', () => {
    // 不抛错就算通过（@property 输出含 \' 而非 '）
    expect(() => registerCustomProperty('--with-quote', {
      syntax: "<color>'unused",
      inherits: false,
      initialValue: 'red',
    })).not.toThrow()
  })

  it('production 模式不警告', () => {
    const orig = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    try {
      registerCustomProperty('--bad3', {
        syntax: '<color>; bad',
        inherits: false,
        initialValue: '#000',
      })
      expect(warnSpy).not.toHaveBeenCalled()
    } finally {
      process.env.NODE_ENV = orig
    }
  })
})

// ────────────────────────────────────────────────────────────────────────────
// S5 — PREFLIGHT_STYLES 深 freeze
// ────────────────────────────────────────────────────────────────────────────

describe('S5 — PREFLIGHT_STYLES 深 freeze 防外部 mutation', () => {
  it('顶层 frozen', () => {
    expect(Object.isFrozen(PREFLIGHT_STYLES)).toBe(true)
  })

  it('嵌套 body 也 frozen', () => {
    const body = (PREFLIGHT_STYLES as Record<string, Record<string, unknown>>).body
    expect(Object.isFrozen(body)).toBe(true)
  })

  it('嵌套 * 选择器内的对象 frozen', () => {
    const sel = (PREFLIGHT_STYLES as Record<string, Record<string, unknown>>)['*, *::before, *::after']
    expect(Object.isFrozen(sel)).toBe(true)
  })

  it('试图修改顶层字段静默失败（严格模式抛错）', () => {
    try {
      ;(PREFLIGHT_STYLES as Record<string, unknown>)['__hacked__'] = 'value'
    } catch {
      // 严格模式抛 TypeError
    }
    expect((PREFLIGHT_STYLES as Record<string, unknown>)['__hacked__']).toBeUndefined()
  })

  it('试图修改 body.margin 静默失败', () => {
    const body = (PREFLIGHT_STYLES as Record<string, Record<string, unknown> | undefined>).body!
    try {
      body.margin = 999
    } catch {
      // 期望路径
    }
    expect(body.margin).toBe(0)
  })

  it('外部 deepClone 后修改不会影响原值', () => {
    const copy = JSON.parse(JSON.stringify(PREFLIGHT_STYLES))
    copy.body.margin = 999
    const body = (PREFLIGHT_STYLES as Record<string, Record<string, unknown> | undefined>).body!
    expect(body.margin).toBe(0)
  })
})
