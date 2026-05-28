/**
 * `ZGrid` —— CSS Grid 布局容器。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Chain } from '@kenconnet666/zui-core'
import { ZGrid, type ZuiSchema } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map(el => el.textContent ?? '')
    .join('\n')
}

describe('ZGrid — 默认', () => {
  it('默认 display:grid(不主动写 justifyItems/alignItems)', () => {
    const w = mount(ZGrid, { slots: { default: () => 'x' } })
    const css = getInjectedCss()
    expect(css).toMatch(/display:grid/)
    // 默认不写 justify-items/align-items —— 仅验证本组件 class 规则
    const cls = w.classes().find(c => c.startsWith('css-'))
    expect(cls).toBeTruthy()
    const re = new RegExp(`\\.${cls}\\s*\\{([^}]*)\\}`)
    const m = css.match(re)
    expect(m).toBeTruthy()
    const ownRule = m![1]
    expect(ownRule).not.toMatch(/justify-items/)
    expect(ownRule).not.toMatch(/align-items/)
  })
})

describe('ZGrid — cols / rows', () => {
  it('cols=3 → grid-template-columns:repeat(3, minmax(0, 1fr))', () => {
    mount(ZGrid, { props: { cols: 3 }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/grid-template-columns:repeat\(3, ?minmax\(0, ?1fr\)\)/)
  })

  it('cols 字符串 → 直接作 grid-template-columns', () => {
    mount(ZGrid, { props: { cols: '200px 1fr 100px' }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/grid-template-columns:200px 1fr 100px/)
  })

  it('cols 响应式对象 → 最小断点为 base,其它进 @media', () => {
    mount(ZGrid, { props: { cols: { tiny: 1, middle: 3 } }, slots: { default: () => 'x' } })
    const css = getInjectedCss()
    expect(css).toMatch(/grid-template-columns:repeat\(1, ?minmax\(0, ?1fr\)\)/)
    expect(css).toMatch(/@media[^{]+min-width:\s?1024px/)
    expect(css).toMatch(/grid-template-columns:repeat\(3, ?minmax\(0, ?1fr\)\)/)
  })

  it('rows=2 → grid-template-rows:repeat(2, ...)', () => {
    mount(ZGrid, { props: { rows: 2 }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/grid-template-rows:repeat\(2, ?minmax\(0, ?1fr\)\)/)
  })
})

describe('ZGrid — gap + 对齐', () => {
  it('gap factory → gap CSS', () => {
    mount(ZGrid, {
      props: {
        gap: (g: Chain<ZuiSchema>['gap']) => {
          g.px(16)
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/gap:16px/)
  })

  it('justifyItems=center', () => {
    mount(ZGrid, {
      props: {
        justifyItems: (j: Chain<ZuiSchema>['justifyItems']) => {
          j.center
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/justify-items:center/)
  })

  it('inline=true → inline-grid', () => {
    mount(ZGrid, { props: { inline: true }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/display:inline-grid/)
  })
})

describe('ZGrid — css 兜底', () => {
  it('css 可覆盖 padding', () => {
    mount(ZGrid, {
      props: {
        css: (s: Chain<ZuiSchema>) => {
          s.padding.px(20)
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/padding:20px/)
  })
})
