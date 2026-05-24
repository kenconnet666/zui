/**
 * `ZTitle` —— 标题(level 1-6)。继承 ZText 6+5 维度,新增 `level` 决定默认 tag/字号/字重。
 *
 * 覆盖:
 * 1. 默认 level=1 + tag=h1
 * 2. level 1-6 默认 fontSize / fontWeight 映射
 * 3. 用户传 size / weight factory 覆盖默认
 * 4. 用户传 tag 覆盖默认 h{level}
 * 5. ZText 共享维度透传(抽样 color / italic / ellipsis)
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Chain } from '@kenconnet666/zui-core'
import { ZTitle, type ZTitleLevel, type ZuiSchema } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map((el) => el.textContent ?? '')
    .join('\n')
}

describe('ZTitle — 渲染', () => {
  it('默认 level=1 → tag=h1', () => {
    const w = mount(ZTitle, { slots: { default: () => 'T' } })
    expect(w.element.tagName).toBe('H1')
  })

  it('level=3 → tag=h3', () => {
    const w = mount(ZTitle, { props: { level: 3 }, slots: { default: () => 'T' } })
    expect(w.element.tagName).toBe('H3')
  })

  it('显式 tag 覆盖默认 h{level}', () => {
    const w = mount(ZTitle, { props: { level: 2, tag: 'div' }, slots: { default: () => 'T' } })
    expect(w.element.tagName).toBe('DIV')
  })

  it('渲染 default slot 文本', () => {
    const w = mount(ZTitle, { slots: { default: () => 'Hello' } })
    expect(w.text()).toContain('Hello')
  })
})

describe('ZTitle — level 默认尺寸/字重映射', () => {
  const cases: Array<[ZTitleLevel, number, number]> = [
    [1, 2, 700],
    [2, 1.75, 700],
    [3, 1.5, 600],
    [4, 1.25, 600],
    [5, 1.125, 600],
    [6, 1, 600],
  ]

  for (const [level, fontIem, weight] of cases) {
    it(`level=${level} → font-size:calc(${fontIem} * iem) + font-weight:${weight}`, () => {
      mount(ZTitle, { props: { level }, slots: { default: () => 'T' } })
      const css = getInjectedCss()
      // 用字符串模板构建正则匹配 calc(N * var(--zui-iem, ...))
      const fontRe = new RegExp(
        `font-size:calc\\(${fontIem.toString().replace('.', '\\.')} \\* var\\(--zui-iem`,
      )
      expect(css).toMatch(fontRe)
      expect(css).toMatch(new RegExp(`font-weight:${weight}`))
    })
  }

  it('默认 line-height:1.25(标题紧凑)', () => {
    mount(ZTitle, { slots: { default: () => 'T' } })
    expect(getInjectedCss()).toMatch(/line-height:1\.25/)
  })

  it('默认 margin:0(重置浏览器 h{N} margin)', () => {
    mount(ZTitle, { slots: { default: () => 'T' } })
    expect(getInjectedCss()).toMatch(/margin:0/)
  })
})

describe('ZTitle — props 覆盖默认', () => {
  it('size=3 覆盖 level 默认 fontSize(等价 48px @ 16px iem)', () => {
    mount(ZTitle, {
      props: {
        level: 1,
        size: 3,
      },
      slots: { default: () => 'T' },
    })
    expect(getInjectedCss()).toMatch(/font-size:calc\(3 \* var\(--zui-iem/)
  })

  it('weight factory 覆盖 level 默认 fontWeight', () => {
    mount(ZTitle, {
      props: {
        level: 3,
        weight: (w: Chain<ZuiSchema>['fontWeight']) => {
          w(400)
        },
      },
      slots: { default: () => 'T' },
    })
    expect(getInjectedCss()).toMatch(/font-weight:400/)
  })

  it('leading factory 覆盖 level 默认 lineHeight', () => {
    mount(ZTitle, {
      props: {
        leading: (l: Chain<ZuiSchema>['lineHeight']) => {
          l(2)
        },
      },
      slots: { default: () => 'T' },
    })
    expect(getInjectedCss()).toMatch(/line-height:2/)
  })
})

describe('ZTitle — ZText 共享维度透传', () => {
  it('italic prop 生效', () => {
    mount(ZTitle, { props: { italic: true }, slots: { default: () => 'T' } })
    expect(getInjectedCss()).toMatch(/font-style:italic/)
  })

  it('color factory 生效', () => {
    mount(ZTitle, {
      props: {
        color: (c: Chain<ZuiSchema>['color']) => {
          c('#abc123')
        },
      },
      slots: { default: () => 'T' },
    })
    expect(getInjectedCss().toLowerCase()).toContain('#abc123')
  })

  it('ellipsis=true → 单行截断', () => {
    mount(ZTitle, { props: { ellipsis: true }, slots: { default: () => 'T' } })
    const css = getInjectedCss()
    expect(css).toMatch(/text-overflow:ellipsis/)
    expect(css).toMatch(/white-space:nowrap/)
  })
})
