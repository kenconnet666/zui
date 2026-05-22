/**
 * `ZParagraph` —— 段落(块级 + 段间距 + 舒适行高)。
 *
 * 覆盖:
 * 1. 默认 tag=p + display:block + margin-bottom 走 schema spacing
 * 2. 默认 line-height:_normal(1.5)
 * 3. 用户 leading 覆盖默认
 * 4. tag 切换
 * 5. ZText 共享维度透传(抽样)
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Chain } from '@kenconnet666/zui-core'
import { ZParagraph, type ZuiSchema } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map((el) => el.textContent ?? '')
    .join('\n')
}

describe('ZParagraph — 渲染', () => {
  it('默认 tag 是 <p>', () => {
    const w = mount(ZParagraph, { slots: { default: () => 'p' } })
    expect(w.element.tagName).toBe('P')
  })

  it('tag prop 切换', () => {
    const w = mount(ZParagraph, { props: { tag: 'div' }, slots: { default: () => 'p' } })
    expect(w.element.tagName).toBe('DIV')
  })

  it('渲染 default slot', () => {
    const w = mount(ZParagraph, { slots: { default: () => 'Lorem ipsum' } })
    expect(w.text()).toContain('Lorem ipsum')
  })
})

describe('ZParagraph — 组件默认', () => {
  it('display:block', () => {
    mount(ZParagraph, { slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/display:block/)
  })

  it('margin:0(重置浏览器 <p> 默认)', () => {
    mount(ZParagraph, { slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/margin:0/)
  })

  it('margin-bottom 走 schema spacing._middle(默认 1iem = 16px)', () => {
    mount(ZParagraph, { slots: { default: () => 'x' } })
    // spacing.middle = iem(1) = calc(1 * var(--zui-iem, 16px))
    expect(getInjectedCss()).toMatch(/margin-bottom:calc\(1 \* var\(--zui-iem,/)
  })

  it('默认 line-height:1.5(_normal)', () => {
    mount(ZParagraph, { slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/line-height:1\.5/)
  })
})

describe('ZParagraph — props 覆盖', () => {
  it('leading factory 覆盖默认 line-height', () => {
    mount(ZParagraph, {
      props: {
        leading: (l: Chain<ZuiSchema>['lineHeight']) => {
          l(1.8)
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/line-height:1\.8/)
  })

  it('size factory 透传', () => {
    mount(ZParagraph, {
      props: {
        size: (f: Chain<ZuiSchema>['fontSize']) => {
          f.px(15)
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/font-size:15px/)
  })

  it('cssRoot 可覆盖默认 margin-bottom', () => {
    mount(ZParagraph, {
      props: {
        cssRoot: (s: Chain<ZuiSchema>) => {
          s.marginBottom.px(40)
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/margin-bottom:40px/)
  })
})
