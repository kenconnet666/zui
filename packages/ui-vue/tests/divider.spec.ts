/**
 * `ZDivider` —— 分隔线(水平 / 垂直,可带文字)。
 *
 * 覆盖:
 * 1. 默认 tag=div + role=separator + aria-orientation
 * 2. 水平单线:border-top
 * 3. 水平带文字:flex + ::before/::after border-top
 * 4. 垂直:border-left
 * 5. dashed / thickness / color 应用
 * 6. align=left/right 影响 before/after flex 比例
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Chain } from '@kenconnet666/zui-core'
import { ZDivider, zuiLight, type ZuiSchema } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map((el) => el.textContent ?? '')
    .join('\n')
}

describe('ZDivider — 渲染', () => {
  it('默认 tag=div', () => {
    const w = mount(ZDivider)
    expect(w.element.tagName).toBe('DIV')
  })

  it('role=separator', () => {
    const w = mount(ZDivider)
    expect(w.attributes('role')).toBe('separator')
  })

  it('默认 aria-orientation=horizontal', () => {
    const w = mount(ZDivider)
    expect(w.attributes('aria-orientation')).toBe('horizontal')
  })

  it('orientation=vertical → aria-orientation=vertical', () => {
    const w = mount(ZDivider, { props: { orientation: 'vertical' } })
    expect(w.attributes('aria-orientation')).toBe('vertical')
  })
})

describe('ZDivider — 水平单线(无 slot)', () => {
  it('display:block + width:100% + border-top', () => {
    mount(ZDivider)
    const css = getInjectedCss()
    expect(css).toMatch(/display:block/)
    expect(css).toMatch(/width:100%/)
    expect(css).toMatch(/border-top-width:1px/)
    expect(css).toMatch(/border-top-style:solid/)
    expect(css).toMatch(/border-top-color:currentColor/)
  })

  it('dashed=true → border-top-style:dashed', () => {
    mount(ZDivider, { props: { dashed: true } })
    expect(getInjectedCss()).toMatch(/border-top-style:dashed/)
  })

  it('thickness 自定义', () => {
    mount(ZDivider, { props: { thickness: '3px' } })
    expect(getInjectedCss()).toMatch(/border-top-width:3px/)
  })

  it('默认 color:_border', () => {
    mount(ZDivider)
    const border = String((zuiLight.resolve() as { color: Record<string, string> }).color.border)
    expect(getInjectedCss().toLowerCase()).toContain(border.toLowerCase())
  })

  it('color factory 覆盖默认', () => {
    mount(ZDivider, {
      props: {
        color: (c: Chain<ZuiSchema>['color']) => {
          c('#ff0000')
        },
      },
    })
    expect(getInjectedCss().toLowerCase()).toContain('#ff0000')
  })
})

describe('ZDivider — 水平 + 文字(有 slot)', () => {
  it('display:flex + ::before + ::after', () => {
    mount(ZDivider, { slots: { default: () => 'OR' } })
    const css = getInjectedCss()
    expect(css).toMatch(/display:flex/)
    expect(css).toMatch(/align-items:center/)
    // ::before / ::after 嵌套包含 border-top
    expect(css).toMatch(/::before\s*\{[^}]*border-top/)
    expect(css).toMatch(/::after\s*\{[^}]*border-top/)
  })

  /** 取本次 mount 产生的 className(emotion 给每个独特 style 哈希一个 class)。 */
  function getOwnRule(w: ReturnType<typeof mount>, pseudo: '::before' | '::after'): string {
    const cls = w.classes().find((c) => c.startsWith('css-'))
    if (!cls) throw new Error('no emotion class on wrapper')
    const css = getInjectedCss()
    const re = new RegExp(`\\.${cls}${pseudo}\\s*\\{[^}]*\\}`)
    const m = css.match(re)
    if (!m) throw new Error(`no ${pseudo} rule for .${cls}`)
    return m[0]
  }

  it('align=center(默认)→ before/after 都 flex:1', () => {
    const w = mount(ZDivider, { slots: { default: () => 'x' } })
    expect(getOwnRule(w, '::before')).toMatch(/flex:1/)
    expect(getOwnRule(w, '::after')).toMatch(/flex:1/)
  })

  it('align=left → before 短(0 0 10%),after 长(1)', () => {
    const w = mount(ZDivider, { props: { align: 'left' }, slots: { default: () => 'x' } })
    expect(getOwnRule(w, '::before')).toMatch(/flex:0 0 10%/)
    expect(getOwnRule(w, '::after')).toMatch(/flex:1/)
  })

  it('align=right → before 长(1),after 短(0 0 10%)', () => {
    const w = mount(ZDivider, { props: { align: 'right' }, slots: { default: () => 'x' } })
    expect(getOwnRule(w, '::before')).toMatch(/flex:1/)
    expect(getOwnRule(w, '::after')).toMatch(/flex:0 0 10%/)
  })

  it('slot 内容渲染', () => {
    const w = mount(ZDivider, { slots: { default: () => 'OR' } })
    expect(w.text()).toContain('OR')
  })
})

describe('ZDivider — 垂直', () => {
  it('orientation=vertical → border-left', () => {
    mount(ZDivider, { props: { orientation: 'vertical' } })
    const css = getInjectedCss()
    expect(css).toMatch(/display:inline-block/)
    expect(css).toMatch(/border-left-width:1px/)
    expect(css).toMatch(/border-left-style:solid/)
    expect(css).toMatch(/border-left-color:currentColor/)
  })

  it('vertical + dashed', () => {
    mount(ZDivider, { props: { orientation: 'vertical', dashed: true } })
    expect(getInjectedCss()).toMatch(/border-left-style:dashed/)
  })
})

describe('ZDivider — cssRoot', () => {
  it('cssRoot 可覆盖默认样式', () => {
    mount(ZDivider, {
      props: {
        cssRoot: (s: Chain<ZuiSchema>) => {
          s._prop('borderTopColor', 'red')
        },
      },
    })
    expect(getInjectedCss()).toMatch(/border-top-color:red/)
  })
})
