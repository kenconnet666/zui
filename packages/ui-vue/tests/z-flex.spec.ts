/**
 * `ZFlex` —— Flexbox 布局容器。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Chain } from '@kenconnet666/zui-core'
import { ZFlex, type ZuiSchema } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map(el => el.textContent ?? '')
    .join('\n')
}

describe('ZFlex — 默认', () => {
  it('默认 display:flex(不带 direction/wrap/justify/align,留给浏览器默认)', () => {
    const w = mount(ZFlex, { slots: { default: () => 'x' } })
    const css = getInjectedCss()
    expect(css).toMatch(/display:flex/)
    // 默认不主动写 direction/wrap/justify/align —— 验证本组件 class 的规则里没这些
    const cls = w.classes().find(c => c.startsWith('css-'))
    expect(cls).toBeTruthy()
    const re = new RegExp(`\\.${cls}\\s*\\{([^}]*)\\}`)
    const m = css.match(re)
    expect(m).toBeTruthy()
    const ownRule = m![1]
    expect(ownRule).not.toMatch(/flex-direction/)
    expect(ownRule).not.toMatch(/flex-wrap/)
    expect(ownRule).not.toMatch(/justify-content/)
    expect(ownRule).not.toMatch(/align-items/)
  })

  it('默认 tag=div', () => {
    const w = mount(ZFlex, { slots: { default: () => 'x' } })
    expect(w.element.tagName).toBe('DIV')
  })

  it('tag prop 切换根元素', () => {
    const w = mount(ZFlex, { props: { tag: 'section' }, slots: { default: () => 'x' } })
    expect(w.element.tagName).toBe('SECTION')
  })
})

describe('ZFlex — 布局 props', () => {
  it('direction=column → flex-direction:column', () => {
    mount(ZFlex, {
      props: {
        direction: (d: Chain<ZuiSchema>['flexDirection']) => {
          d.column
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/flex-direction:column/)
  })

  it('wrap=true → flex-wrap:wrap', () => {
    mount(ZFlex, {
      props: {
        wrap: (w: Chain<ZuiSchema>['flexWrap']) => {
          w.wrap
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/flex-wrap:wrap[;}]/)
  })

  it('wrap=reverse → wrap-reverse', () => {
    mount(ZFlex, {
      props: {
        wrap: (w: Chain<ZuiSchema>['flexWrap']) => {
          w.wrapReverse
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/flex-wrap:wrap-reverse/)
  })

  it('justify=between → space-between', () => {
    mount(ZFlex, {
      props: {
        justify: (j: Chain<ZuiSchema>['justifyContent']) => {
          j.spaceBetween
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/justify-content:space-between/)
  })

  it('align=center → center', () => {
    mount(ZFlex, {
      props: {
        align: (a: Chain<ZuiSchema>['alignItems']) => {
          a.center
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/align-items:center/)
  })

  it('gap factory → gap CSS', () => {
    mount(ZFlex, {
      props: {
        gap: (g: Chain<ZuiSchema>['gap']) => {
          g.px(12)
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/gap:12px/)
  })

  it('inline=true → inline-flex', () => {
    mount(ZFlex, { props: { inline: true }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/display:inline-flex/)
  })
})

describe('ZFlex — css 兜底', () => {
  it('css 可加任意样式', () => {
    mount(ZFlex, {
      props: {
        css: (s: Chain<ZuiSchema>) => {
          s.padding.px(24)
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/padding:24px/)
  })
})
