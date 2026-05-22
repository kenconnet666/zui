/**
 * `ZSpace` —— 等间距 flex 布局(默认 align center + gap _small)。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Chain } from '@kenconnet666/zui-core'
import { ZSpace, type ZuiSchema } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map((el) => el.textContent ?? '')
    .join('\n')
}

describe('ZSpace — 默认', () => {
  it('默认 display:flex + row + nowrap + align center + gap _small', () => {
    mount(ZSpace, { slots: { default: () => 'x' } })
    const css = getInjectedCss()
    expect(css).toMatch(/display:flex/)
    expect(css).toMatch(/flex-direction:row/)
    expect(css).toMatch(/align-items:center/)
    // _small = iem(0.5) → calc(0.5 * var(--zui-iem, 16px))
    expect(css).toMatch(/gap:calc\(0\.5 \* var\(--zui-iem,/)
  })
})

describe('ZSpace — direction', () => {
  it('direction=vertical → flex-direction:column', () => {
    mount(ZSpace, { props: { direction: 'vertical' }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/flex-direction:column/)
  })
})

describe('ZSpace — size factory 覆盖默认 gap', () => {
  it('size 自定义 → 覆盖默认 _small', () => {
    mount(ZSpace, {
      props: {
        size: (g: Chain<ZuiSchema>['gap']) => {
          g.px(20)
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/gap:20px/)
  })
})

describe('ZSpace — 其它 props', () => {
  it('wrap=true → flex-wrap:wrap', () => {
    mount(ZSpace, { props: { wrap: true }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/flex-wrap:wrap[;}]/)
  })

  it('align=start → flex-start', () => {
    mount(ZSpace, { props: { align: 'start' }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/align-items:flex-start/)
  })

  it('inline=true → inline-flex', () => {
    mount(ZSpace, { props: { inline: true }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/display:inline-flex/)
  })
})
