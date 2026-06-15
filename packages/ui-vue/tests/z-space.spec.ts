/**
 * `ZSpace` —— 等间距 flex 布局(默认 align center + gap _small)。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Chain } from '@kenconnet666/zui-core'
import { ZSpace, type ZuiSchema } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map(el => el.textContent ?? '')
    .join('\n')
}

describe('ZSpace — 默认', () => {
  it('默认 display:flex + align center + gap _small(不主动写 direction)', () => {
    const w = mount(ZSpace, { slots: { default: () => 'x' } })
    const css = getInjectedCss()
    expect(css).toMatch(/display:flex/)
    expect(css).toMatch(/align-items:center/)
    // _small = 8px(0.5 * 16)
    expect(css).toMatch(/gap:8px/)
    // 默认不写 flex-direction —— 仅验证本组件 class 规则
    const cls = w.classes().find(c => c.startsWith('css-'))
    expect(cls).toBeTruthy()
    const re = new RegExp(`\\.${cls}\\s*\\{([^}]*)\\}`)
    const m = css.match(re)
    expect(m).toBeTruthy()
    expect(m![1]).not.toMatch(/flex-direction/)
  })
})

describe('ZSpace — direction', () => {
  it('direction=column → flex-direction:column', () => {
    mount(ZSpace, {
      props: {
        direction: (d: Chain<ZuiSchema>['flexDirection']) => {
          d.column
        },
      },
      slots: { default: () => 'x' },
    })
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
    mount(ZSpace, {
      props: {
        wrap: (w: Chain<ZuiSchema>['flexWrap']) => {
          w.wrap
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/flex-wrap:wrap[;}]/)
  })

  it('align=start → flex-start', () => {
    mount(ZSpace, {
      props: {
        align: (a: Chain<ZuiSchema>['alignItems']) => {
          a.flexStart
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/align-items:flex-start/)
  })

  it('inline=true → inline-flex', () => {
    mount(ZSpace, { props: { inline: true }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/display:inline-flex/)
  })
})
