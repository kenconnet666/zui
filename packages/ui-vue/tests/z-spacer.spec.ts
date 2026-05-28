/**
 * `ZSpacer` —— flex 推开占位(默认 flex: 1 1 auto)。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Chain } from '@kenconnet666/zui-core'
import { ZSpacer, type ZuiSchema } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map(el => el.textContent ?? '')
    .join('\n')
}

describe('ZSpacer — 默认', () => {
  it('默认 flex-grow:1 + flex-shrink:1 + flex-basis:auto', () => {
    mount(ZSpacer)
    const css = getInjectedCss()
    expect(css).toMatch(/flex-grow:1/)
    expect(css).toMatch(/flex-shrink:1/)
    expect(css).toMatch(/flex-basis:auto/)
  })

  it('aria-hidden=true(语义化占位元素,屏读器跳过)', () => {
    const w = mount(ZSpacer)
    expect(w.attributes('aria-hidden')).toBe('true')
  })
})

describe('ZSpacer — props', () => {
  it('grow=2 → flex-grow:2', () => {
    mount(ZSpacer, { props: { grow: 2 } })
    expect(getInjectedCss()).toMatch(/flex-grow:2/)
  })

  it('shrink=0 → flex-shrink:0(不可压缩)', () => {
    mount(ZSpacer, { props: { shrink: 0 } })
    expect(getInjectedCss()).toMatch(/flex-shrink:0/)
  })

  it('basis factory → flex-basis 自定义', () => {
    mount(ZSpacer, {
      props: {
        basis: (b: Chain<ZuiSchema>['flexBasis']) => {
          b.px(200)
        },
      },
    })
    expect(getInjectedCss()).toMatch(/flex-basis:200px/)
  })
})

describe('ZSpacer — css 兜底', () => {
  it('css 加 background', () => {
    mount(ZSpacer, {
      props: {
        css: (s: Chain<ZuiSchema>) => {
          s.backgroundColor('#ff0000')
        },
      },
    })
    expect(getInjectedCss().toLowerCase()).toContain('#ff0000')
  })
})
