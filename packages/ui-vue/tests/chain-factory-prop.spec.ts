/**
 * 验证 chain PropFn 重载:同时接受值和 factory(B1 锁定行为)。
 *
 * 这是新 prop 形态(Type A / Type C)的实现基础:
 * - `s.color(props.color)` 当 props.color 是 factory 函数时,chain 通过 overload 派发到 factory 路径
 * - `s.width(props.size); s.height(props.size)` 同 factory 用于多个 CSS 属性,各自传入对应 carrier
 */
import { describe, expect, it } from 'vitest'
import { icss, type Chain } from '@kenconnet666/zui-core'
import { zuiLight, type ZuiSchema } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map(el => el.textContent ?? '')
    .join('\n')
}

describe('chain PropFn — 接受 factory 重载', () => {
  it('s.color(factory) 等价于 s.color._primary', () => {
    const factory = (c: Chain<ZuiSchema>['color']) => {
      c._primary
    }
    const cls = icss(zuiLight, s => {
      s.color(factory)
    })
    const css = getInjectedCss()
    expect(css).toContain(`.${cls}`)
    expect(css).toMatch(/color:/)
  })

  it('s.flexDirection(factory) 接受 factory 写 row/column', () => {
    icss(zuiLight, s => {
      s.flexDirection(d => {
        d.column
      })
    })
    expect(getInjectedCss()).toMatch(/flex-direction:\s*column/)
  })

  it('s.justifyContent(factory) 接受 factory 写 space-between', () => {
    icss(zuiLight, s => {
      s.justifyContent(j => {
        j.spaceBetween
      })
    })
    expect(getInjectedCss()).toMatch(/justify-content:\s*space-between/)
  })

  it('s.alignItems(factory) 接受 factory', () => {
    icss(zuiLight, s => {
      s.alignItems(a => {
        a.center
      })
    })
    expect(getInjectedCss()).toMatch(/align-items:\s*center/)
  })

  it('Type C:同一 factory 复用于 width + height', () => {
    const sizeFactory = (w: Chain<ZuiSchema>['width']) => {
      w.px(20)
    }
    icss(zuiLight, s => {
      s.width(sizeFactory)
      s.height(sizeFactory)
    })
    const css = getInjectedCss()
    expect(css).toMatch(/width:[^;]*20px/)
    expect(css).toMatch(/height:[^;]*20px/)
  })

  it('factory 内可访问 schema token(_middle)', () => {
    icss(zuiLight, s => {
      s.gap(g => {
        g._middle
      })
    })
    expect(getInjectedCss()).toMatch(/gap:/)
  })
})
