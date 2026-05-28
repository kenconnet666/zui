import { describe, expect, it } from 'vitest'
import {
  Chain,
  injectPreflight,
  registerCustomProperty,
  injectLayer,
  injectLayerOrder,
  registerFont,
} from '../src'
import { defaultLight } from './_fixture-theme'

/**
 * 全局副作用 helper（W5.4 / W5.5 / W8）测试。
 *
 * 这些 helper 都是无 return / 仅注入到 emotion 全局 cache，不容易断言"注入了什么"。
 * 这里只验证 **不抛错** + 主要分支可调用。
 */

describe('W5.4 — injectPreflight', () => {
  it('调用不抛错', () => {
    expect(() => injectPreflight()).not.toThrow()
  })
})

describe('W5.5 — registerCustomProperty', () => {
  it('注册 angle 类型不抛错', () => {
    expect(() =>
      registerCustomProperty('--zui-test-angle', {
        syntax: '<angle>',
        inherits: false,
        initialValue: '0deg',
      }),
    ).not.toThrow()
  })

  it('注册 color 类型不抛错', () => {
    expect(() =>
      registerCustomProperty('--zui-test-color', {
        syntax: '<color>',
        inherits: true,
        initialValue: '#ffffff',
      }),
    ).not.toThrow()
  })
})

describe('W8.1 — injectLayer / injectLayerOrder', () => {
  it('injectLayerOrder 空数组不抛错', () => {
    expect(() => injectLayerOrder([])).not.toThrow()
  })

  it('injectLayerOrder + injectLayer 联合调用', () => {
    expect(() => {
      injectLayerOrder(['reset', 'base', 'components'])
      injectLayer('components', { '.zui-btn': { padding: '8px' } })
    }).not.toThrow()
  })
})

describe('W8.2 — Chain._layer', () => {
  it('包到 @layer <name> { & { ... } }', () => {
    const c = new Chain(defaultLight)
    c._layer('components', l => {
      l.padding._middle
    })
    expect(c._node['@layer components']).toEqual({ '&': { padding: '16px' } })
  })
})

describe('W8.4 — registerFont', () => {
  it('单 source 不抛错', () => {
    expect(() =>
      registerFont('TestFont', [{ src: '/fonts/test.woff2', format: 'woff2', weight: 400 }]),
    ).not.toThrow()
  })

  it('多 source + 全选项', () => {
    expect(() =>
      registerFont('TestFont', [
        { src: 'url(/a.woff2)', format: 'woff2', weight: 400, style: 'normal', display: 'swap' },
        {
          src: '/b.woff2',
          format: 'woff2',
          weight: 700,
          style: 'italic',
          unicodeRange: 'U+0000-00FF',
        },
      ]),
    ).not.toThrow()
  })
})
