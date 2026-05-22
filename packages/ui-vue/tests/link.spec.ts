/**
 * `ZLink` —— 链接。继承 ZText 维度,新增 href/target/rel/disabled。
 *
 * 覆盖:
 * 1. 默认 tag=a + cursor:pointer + color:_primary + underline:hover
 * 2. href / target / rel 属性写入
 * 3. target=_blank 自动补 rel=noopener noreferrer
 * 4. 用户传 rel 接管自动 rel
 * 5. disabled:屏蔽 href + opacity + pointer-events + aria-disabled + tabindex
 * 6. color/underline 用户覆盖
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Chain } from '@kenconnet666/zui-core'
import { ZLink, zuiLight, type ZuiSchema } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map((el) => el.textContent ?? '')
    .join('\n')
}

describe('ZLink — 渲染', () => {
  it('默认 tag 是 <a>', () => {
    const w = mount(ZLink, { slots: { default: () => 'go' } })
    expect(w.element.tagName).toBe('A')
  })

  it('渲染 default slot', () => {
    const w = mount(ZLink, { slots: { default: () => 'Click here' } })
    expect(w.text()).toContain('Click here')
  })
})

describe('ZLink — 组件默认', () => {
  it('默认颜色 _primary', () => {
    mount(ZLink, { slots: { default: () => 'x' } })
    const primary = String((zuiLight.resolve() as { color: Record<string, string> }).color.primary)
    expect(getInjectedCss().toLowerCase()).toContain(primary.toLowerCase())
  })

  it('默认 cursor:pointer', () => {
    mount(ZLink, { slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/cursor:pointer/)
  })

  it('默认 underline=hover → 嵌套 :hover 块', () => {
    mount(ZLink, { slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/:hover\s*\{[^}]*text-decoration-line:underline/)
  })
})

describe('ZLink — href / target / rel', () => {
  it('href 属性写入 DOM', () => {
    const w = mount(ZLink, {
      props: { href: 'https://example.com' },
      slots: { default: () => 'x' },
    })
    expect(w.attributes('href')).toBe('https://example.com')
  })

  it('target 属性写入 DOM', () => {
    const w = mount(ZLink, {
      props: { href: '/x', target: '_blank' },
      slots: { default: () => 'x' },
    })
    expect(w.attributes('target')).toBe('_blank')
  })

  it('target=_blank 自动补 rel=noopener noreferrer', () => {
    const w = mount(ZLink, {
      props: { href: '/x', target: '_blank' },
      slots: { default: () => 'x' },
    })
    expect(w.attributes('rel')).toBe('noopener noreferrer')
  })

  it('用户传 rel 接管自动 rel', () => {
    const w = mount(ZLink, {
      props: { href: '/x', target: '_blank', rel: 'nofollow' },
      slots: { default: () => 'x' },
    })
    expect(w.attributes('rel')).toBe('nofollow')
  })

  it('非 _blank target 不自动补 rel', () => {
    const w = mount(ZLink, {
      props: { href: '/x', target: '_self' },
      slots: { default: () => 'x' },
    })
    expect(w.attributes('rel')).toBeUndefined()
  })
})

describe('ZLink — disabled 态', () => {
  it('disabled=true → href 被屏蔽', () => {
    const w = mount(ZLink, {
      props: { href: '/x', disabled: true },
      slots: { default: () => 'x' },
    })
    expect(w.attributes('href')).toBeUndefined()
  })

  it('disabled=true → aria-disabled="true"', () => {
    const w = mount(ZLink, {
      props: { disabled: true },
      slots: { default: () => 'x' },
    })
    expect(w.attributes('aria-disabled')).toBe('true')
  })

  it('disabled=true → tabindex=-1', () => {
    const w = mount(ZLink, {
      props: { disabled: true },
      slots: { default: () => 'x' },
    })
    expect(w.attributes('tabindex')).toBe('-1')
  })

  it('disabled=true → opacity + pointer-events:none + cursor:not-allowed', () => {
    mount(ZLink, { props: { disabled: true }, slots: { default: () => 'x' } })
    const css = getInjectedCss()
    expect(css).toMatch(/opacity:/)
    expect(css).toMatch(/pointer-events:none/)
    expect(css).toMatch(/cursor:not-allowed/)
  })

  it('disabled=false(默认)→ 无 aria-disabled / tabindex', () => {
    const w = mount(ZLink, {
      props: { href: '/x' },
      slots: { default: () => 'x' },
    })
    expect(w.attributes('aria-disabled')).toBeUndefined()
    expect(w.attributes('tabindex')).toBeUndefined()
  })
})

describe('ZLink — 用户覆盖默认', () => {
  it('color factory 覆盖默认 _primary', () => {
    mount(ZLink, {
      props: {
        color: (c: Chain<ZuiSchema>['color']) => {
          c('#ff0000')
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss().toLowerCase()).toContain('#ff0000')
  })

  it('underline=always 覆盖默认 hover', () => {
    mount(ZLink, { props: { underline: 'always' }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/text-decoration-line:underline/)
  })
})
