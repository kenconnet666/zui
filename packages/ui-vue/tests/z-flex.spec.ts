/**
 * `ZFlex` —— Flexbox 布局容器。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Chain } from '@kenconnet666/zui-core'
import { ZFlex, type ZuiSchema } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map((el) => el.textContent ?? '')
    .join('\n')
}

describe('ZFlex — 默认', () => {
  it('默认 display:flex + row + nowrap + stretch + flex-start', () => {
    mount(ZFlex, { slots: { default: () => 'x' } })
    const css = getInjectedCss()
    expect(css).toMatch(/display:flex/)
    expect(css).toMatch(/flex-direction:row/)
    expect(css).toMatch(/flex-wrap:nowrap/)
    expect(css).toMatch(/justify-content:flex-start/)
    expect(css).toMatch(/align-items:stretch/)
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
    mount(ZFlex, { props: { direction: 'column' }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/flex-direction:column/)
  })

  it('wrap=true → flex-wrap:wrap', () => {
    mount(ZFlex, { props: { wrap: true }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/flex-wrap:wrap[;}]/)
  })

  it('wrap=reverse → wrap-reverse', () => {
    mount(ZFlex, { props: { wrap: 'reverse' }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/flex-wrap:wrap-reverse/)
  })

  it('justify=between → space-between', () => {
    mount(ZFlex, { props: { justify: 'between' }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/justify-content:space-between/)
  })

  it('align=center → center', () => {
    mount(ZFlex, { props: { align: 'center' }, slots: { default: () => 'x' } })
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
