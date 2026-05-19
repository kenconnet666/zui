/**
 * Proxy 拦截开销 bench。
 *
 * 用途：度量 makeChainProxy 拦截器 + prototype 扫描的额外成本。
 * 对比：直接读 plain object 字段 vs 走 Proxy 拦截。
 *
 * 运行：`pnpm --filter @kenconnet666/zui-core bench`
 */
import { bench, describe } from 'vitest'
import { Chain, defaultLight } from '../src'

describe('Proxy 拦截开销', () => {
  bench('proxy chain.toString()（原型方法）', () => {
    const c = new Chain(defaultLight)
    c.toString()
  })

  bench('proxy chain._node（实例字段）', () => {
    const c = new Chain(defaultLight)
    void c._node
  })

  bench('proxy chain.label("x")（原型方法 + 写）', () => {
    const c = new Chain(defaultLight)
    c.label('x')
  })

  bench('proxy chain._hover(noop)（原型方法 + _nest）', () => {
    const c = new Chain(defaultLight)
    c._hover(() => {})
  })

  bench('plain object 同等字段访问（baseline，无 Proxy）', () => {
    const obj = {
      _node: {},
      toString() {
        return ''
      },
    }
    void obj._node
    obj.toString()
  })
})

describe('内建方法调用密度', () => {
  bench('5 个 _hover 嵌套', () => {
    const c = new Chain(defaultLight)
    c._hover((h) => {
      h._focus((f) => {
        f._active((a) => {
          a._disabled((d) => {
            d._checked(() => {})
          })
        })
      })
    })
  })

  bench('10 个并列 _media', () => {
    const c = new Chain(defaultLight)
    c._media('_small', () => {})
    c._media('_middle', () => {})
    c._media('_large', () => {})
    c._media('_huge', () => {})
    c._media('_huge', () => {})
    c._media('(prefers-color-scheme: dark)', () => {})
    c._media('print', () => {})
    c._media('(min-width: 100px)', () => {})
    c._media('(max-width: 999px)', () => {})
    c._media('(orientation: portrait)', () => {})
  })
})
