/**
 * `ZButtonGroup` —— 按钮组(贴合折叠相邻边框 / 间隔模式 / 横纵向)。
 */
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { ZButton, ZButtonGroup } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map(el => el.textContent ?? '')
    .join('\n')
}

describe('ZButtonGroup', () => {
  it('渲染 role=group + slot 按钮', () => {
    const w = mount(ZButtonGroup, {
      slots: { default: () => [h(ZButton, () => 'A'), h(ZButton, () => 'B')] },
    })
    expect(w.attributes('role')).toBe('group')
    expect(w.findAllComponents(ZButton).length).toBe(2)
  })

  it('attached(默认)折叠相邻边框 → margin-left:-1px + 内圆角归零', () => {
    mount(ZButtonGroup, { slots: { default: () => h(ZButton, () => 'x') } })
    const css = getInjectedCss()
    expect(css).toMatch(/margin-left:-1px/)
    expect(css).toMatch(/border-top-right-radius:0/)
  })

  it('vertical → flex-direction:column + margin-top:-1px', () => {
    mount(ZButtonGroup, {
      props: { vertical: true },
      slots: { default: () => h(ZButton, () => 'x') },
    })
    const css = getInjectedCss()
    expect(css).toMatch(/flex-direction:column/)
    expect(css).toMatch(/margin-top:-1px/)
  })

  it('attached=false → 走 gap(1 单位 = 16px)', () => {
    mount(ZButtonGroup, {
      props: { attached: false, gap: 1 },
      slots: { default: () => h(ZButton, () => 'x') },
    })
    expect(getInjectedCss()).toMatch(/gap:16px/)
  })
})
