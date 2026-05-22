/**
 * `ZCard` —— 三节点卡片(head + body + foot)。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Chain } from '@kenconnet666/zui-core'
import { ZCard, type ZuiSchema } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map((el) => el.textContent ?? '')
    .join('\n')
}

describe('ZCard — 渲染', () => {
  it('只有 default slot → 不渲染 head/foot', () => {
    const w = mount(ZCard, { slots: { default: () => 'body' } })
    expect(w.text()).toContain('body')
    // 仅 1 个 inner div(body)
    expect(w.findAll('div').length).toBeLessThanOrEqual(2)
  })

  it('title prop → 渲染 head', () => {
    const w = mount(ZCard, { props: { title: 'T' }, slots: { default: () => 'b' } })
    expect(w.text()).toContain('T')
    expect(w.text()).toContain('b')
  })

  it('#head slot 优先于 title', () => {
    const w = mount(ZCard, {
      props: { title: 'override-me' },
      slots: { head: () => 'custom-head', default: () => 'b' },
    })
    expect(w.text()).toContain('custom-head')
    expect(w.text()).not.toContain('override-me')
  })

  it('#extra slot 渲染', () => {
    const w = mount(ZCard, {
      props: { title: 'T' },
      slots: { extra: () => 'extra-zone', default: () => 'b' },
    })
    expect(w.text()).toContain('extra-zone')
  })

  it('#foot slot 渲染', () => {
    const w = mount(ZCard, {
      slots: { default: () => 'b', foot: () => 'footer' },
    })
    expect(w.text()).toContain('footer')
  })
})

describe('ZCard — bordered / hoverable', () => {
  it('默认 bordered=true → 边框 1px solid', () => {
    mount(ZCard, { slots: { default: () => 'x' } })
    const css = getInjectedCss()
    expect(css).toMatch(/border-width:1px/)
    expect(css).toMatch(/border-style:solid/)
  })

  it('bordered=false → 走 shadow elevation', () => {
    mount(ZCard, { props: { bordered: false }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/box-shadow:/)
  })

  it('hoverable=true → 注入 :hover 规则 + transition', () => {
    mount(ZCard, { props: { hoverable: true }, slots: { default: () => 'x' } })
    const css = getInjectedCss()
    expect(css).toMatch(/transition-property/)
    expect(css).toMatch(/:hover/)
  })
})

describe('ZCard — sx 子节点', () => {
  it('sxBody.css → 应用到 body class', () => {
    mount(ZCard, {
      props: {
        sxBody: {
          css: (s: Chain<ZuiSchema>) => {
            s.padding.px(77)
          },
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/padding:77px/)
  })

  it('sxHead.aria-label 透传', () => {
    const w = mount(ZCard, {
      props: {
        title: 'T',
        sxHead: { 'aria-label': 'card-header' },
      },
      slots: { default: () => 'x' },
    })
    expect(w.find('[aria-label="card-header"]').exists()).toBe(true)
  })
})
