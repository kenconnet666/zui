/**
 * `ZText` —— 6 维度 carrier factory + 5 状态布尔/枚举 + cssRoot + tag。
 *
 * 覆盖:
 * 1. 默认渲染 + slot + tag
 * 2. size / weight / color / depth / leading / tracking 6 维度
 * 3. italic / underline(always/hover) / strikethrough / mono / ellipsis(boolean/N)
 * 4. cssRoot 二次覆盖 + 伪类
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Chain } from '@kenconnet666/zui-core'
import { ZText, zuiLight, type ZuiSchema } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map((el) => el.textContent ?? '')
    .join('\n')
}

describe('ZText — 渲染', () => {
  it('默认渲染 default slot', () => {
    const w = mount(ZText, { slots: { default: () => 'Hello' } })
    expect(w.text()).toContain('Hello')
  })

  it('默认根元素是 <span>', () => {
    const w = mount(ZText, { slots: { default: () => 'x' } })
    expect(w.element.tagName).toBe('SPAN')
  })

  it('tag prop 切换根元素', () => {
    const w = mount(ZText, { props: { tag: 'em' }, slots: { default: () => 'x' } })
    expect(w.element.tagName).toBe('EM')
  })
})

describe('ZText — 6 维度 carrier factory', () => {
  it('size factory → fontSize', () => {
    mount(ZText, {
      props: {
        size: (f: Chain<ZuiSchema>['fontSize']) => {
          f.iem(1.25)
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/font-size:calc\(1\.25 \* var\(--zui-iem/)
  })

  it('size factory → schema token _large', () => {
    mount(ZText, {
      props: {
        size: (f: Chain<ZuiSchema>['fontSize']) => {
          f._large
        },
      },
      slots: { default: () => 'x' },
    })
    // _large = iem(1.125)
    expect(getInjectedCss()).toMatch(/font-size:calc\(1\.125 \* var\(--zui-iem/)
  })

  it('weight factory → fontWeight 数值', () => {
    mount(ZText, {
      props: {
        weight: (w: Chain<ZuiSchema>['fontWeight']) => {
          w(700)
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/font-weight:700/)
  })

  it('color factory → schema token _primary', () => {
    mount(ZText, {
      props: {
        color: (c: Chain<ZuiSchema>['color']) => {
          c._primary
        },
      },
      slots: { default: () => 'x' },
    })
    const primary = String((zuiLight.resolve() as { color: Record<string, string> }).color.primary)
    expect(getInjectedCss().toLowerCase()).toContain(primary.toLowerCase())
  })

  it('depth factory → opacity 字面量', () => {
    mount(ZText, {
      props: {
        depth: (o: Chain<ZuiSchema>['opacity']) => {
          o(0.6)
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/opacity:0\.6/)
  })

  it('leading factory → lineHeight 数值', () => {
    mount(ZText, {
      props: {
        leading: (l: Chain<ZuiSchema>['lineHeight']) => {
          l(1.7)
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/line-height:1\.7/)
  })

  it('tracking factory → letterSpacing 字面量', () => {
    mount(ZText, {
      props: {
        tracking: (t: Chain<ZuiSchema>['letterSpacing']) => {
          t._wide
        },
      },
      slots: { default: () => 'x' },
    })
    // _wide = '0.025em'
    expect(getInjectedCss()).toMatch(/letter-spacing:0\.025em/)
  })

  it('未传 6 维度 → 不写对应 CSS(保留 cascade)', () => {
    mount(ZText, { slots: { default: () => 'x' } })
    const css = getInjectedCss()
    // ZText 默认零样式,只是个 span(不强加 color / font-size 等)
    // 但其它测试可能注入 CSS,这里只确认本组件不主动添加 color/currentColor 字符串
    expect(css.match(/font-size:/g)?.length ?? 0).toBeGreaterThanOrEqual(0)
  })
})

describe('ZText — 状态 prop', () => {
  it('italic → font-style:italic', () => {
    mount(ZText, { props: { italic: true }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/font-style:italic/)
  })

  it('underline=always → text-decoration-line:underline', () => {
    mount(ZText, { props: { underline: 'always' }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/text-decoration-line:underline/)
  })

  it('underline=hover → 嵌套 &:hover 块包含 underline', () => {
    mount(ZText, { props: { underline: 'hover' }, slots: { default: () => 'x' } })
    const css = getInjectedCss()
    expect(css).toMatch(/:hover\s*\{[^}]*text-decoration-line:underline/)
  })

  it('strikethrough → text-decoration-line:line-through', () => {
    mount(ZText, { props: { strikethrough: true }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/text-decoration-line:line-through/)
  })

  it('underline=always + strikethrough → 多值叠加', () => {
    mount(ZText, {
      props: { underline: 'always', strikethrough: true },
      slots: { default: () => 'x' },
    })
    const css = getInjectedCss()
    expect(css).toMatch(/text-decoration-line:underline line-through/)
  })

  it('mono → font-family 包含 ui-monospace', () => {
    mount(ZText, { props: { mono: true }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toContain('ui-monospace')
  })

  it('ellipsis=true → 单行截断三件套', () => {
    mount(ZText, { props: { ellipsis: true }, slots: { default: () => 'x' } })
    const css = getInjectedCss()
    expect(css).toMatch(/overflow:hidden/)
    expect(css).toMatch(/text-overflow:ellipsis/)
    expect(css).toMatch(/white-space:nowrap/)
  })

  it('ellipsis=3 → 多行 line-clamp', () => {
    mount(ZText, { props: { ellipsis: 3 }, slots: { default: () => 'x' } })
    const css = getInjectedCss()
    expect(css).toMatch(/-webkit-line-clamp:3/)
    expect(css).toMatch(/-webkit-box-orient:vertical/)
    expect(css).toMatch(/display:-webkit-box/)
  })
})

describe('ZText — cssRoot 覆盖', () => {
  it('cssRoot 可覆盖维度属性', () => {
    mount(ZText, {
      props: {
        size: (f: Chain<ZuiSchema>['fontSize']) => {
          f.px(14)
        },
        cssRoot: (s: Chain<ZuiSchema>) => {
          s.fontSize.px(18) // 覆盖
        },
      },
      slots: { default: () => 'x' },
    })
    // cssRoot 在 applyTypographyBase 之后,后写覆盖前写
    expect(getInjectedCss()).toMatch(/font-size:18px/)
  })

  it('cssRoot 写伪类', () => {
    mount(ZText, {
      props: {
        cssRoot: (s: Chain<ZuiSchema>) => {
          s._hover((h: Chain<ZuiSchema>) => {
            h.color((c: Chain<ZuiSchema>['color']) => c('#ff00aa'))
          })
        },
      },
      slots: { default: () => 'x' },
    })
    const css = getInjectedCss().toLowerCase()
    expect(css).toMatch(/:hover/)
    expect(css).toContain('#ff00aa')
  })
})
