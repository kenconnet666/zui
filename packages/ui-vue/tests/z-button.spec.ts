/**
 * `ZButton` —— Material 风按钮(5 variant + Material ripple + focus ring)。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { ZButton } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map((el) => el.textContent ?? '')
    .join('\n')
}

describe('ZButton — 渲染', () => {
  it('默认 type=button', () => {
    const w = mount(ZButton, { slots: { default: () => 'Save' } })
    expect(w.element.tagName).toBe('BUTTON')
    expect(w.attributes('type')).toBe('button')
  })

  it('default slot 渲染', () => {
    const w = mount(ZButton, { slots: { default: () => 'Click me' } })
    expect(w.text()).toContain('Click me')
  })

  it('type=submit', () => {
    const w = mount(ZButton, { props: { type: 'submit' }, slots: { default: () => 'Go' } })
    expect(w.attributes('type')).toBe('submit')
  })
})

describe('ZButton — variant', () => {
  it('filled 默认 → 注入 box-shadow + primary 背景 + 反色文字', () => {
    mount(ZButton, { slots: { default: () => 'x' } })
    const css = getInjectedCss()
    // 2026-05-23 重构:不再用 currentColor 桥接(避免后续 color._bg 覆盖导致白底白字)
    // filled 直接走 _primary 背景 + _bg 文字
    expect(css).toMatch(/box-shadow:/)
    expect(css).toMatch(/background-color:#/)
  })

  it('outlined → border-color currentColor + 透明背景', () => {
    mount(ZButton, { props: { variant: 'outlined' }, slots: { default: () => 'x' } })
    const css = getInjectedCss()
    expect(css).toMatch(/border-color:currentColor/)
    expect(css).toMatch(/background-color:transparent/)
  })

  it('text → 透明背景 + hover state layer', () => {
    mount(ZButton, { props: { variant: 'text' }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/background-color:transparent/)
  })

  it('ghost → 半透明 primary 背景', () => {
    mount(ZButton, { props: { variant: 'ghost' }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/rgba\(/)
  })

  it('link → 透明 + hover underline', () => {
    mount(ZButton, { props: { variant: 'link' }, slots: { default: () => 'x' } })
    const css = getInjectedCss()
    expect(css).toMatch(/text-decoration:none/)
    expect(css).toMatch(/text-decoration:underline/)
  })
})

describe('ZButton — 状态', () => {
  it('disabled → button 禁用 + aria-disabled', () => {
    const w = mount(ZButton, { props: { disabled: true }, slots: { default: () => 'x' } })
    expect(w.attributes('disabled')).toBeDefined()
    expect(w.attributes('aria-disabled')).toBe('true')
  })

  it('loading → aria-busy + button 禁用', () => {
    const w = mount(ZButton, { props: { loading: true }, slots: { default: () => 'x' } })
    expect(w.attributes('aria-busy')).toBe('true')
    expect(w.attributes('disabled')).toBeDefined()
  })

  it('loading 显示旋转图标', () => {
    const w = mount(ZButton, { props: { loading: true }, slots: { default: () => 'Save' } })
    // loading 时显示 refresh 图标 + spin
    const css = getInjectedCss()
    expect(css).toMatch(/animation-name/)
    expect(w.text()).toContain('Save')
  })

  it('block=true → width:100%', () => {
    mount(ZButton, { props: { block: true }, slots: { default: () => 'x' } })
    expect(getInjectedCss()).toMatch(/width:100%/)
  })

  it('点击 → emit click', async () => {
    const w = mount(ZButton, { slots: { default: () => 'x' } })
    await w.trigger('click')
    expect(w.emitted('click')).toBeTruthy()
  })

  it('disabled 点击 → 不 emit', async () => {
    const w = mount(ZButton, { props: { disabled: true }, slots: { default: () => 'x' } })
    await w.trigger('click')
    expect(w.emitted('click')).toBeFalsy()
  })
})

describe('ZButton — focus-visible + ripple', () => {
  it(':focus-visible 注入 outline 规则', () => {
    mount(ZButton, { slots: { default: () => 'x' } })
    const css = getInjectedCss()
    expect(css).toMatch(/:focus-visible/)
    expect(css).toMatch(/outline-width:2px/)
  })

  it('ripple=true(默认)+ pointerdown → 注入 .zui-ripple', async () => {
    const w = mount(ZButton, { slots: { default: () => 'x' }, attachTo: document.body })
    await w.vm.$nextTick()
    const btn = w.element as HTMLElement
    btn.dispatchEvent(
      new PointerEvent('pointerdown', { clientX: 5, clientY: 5, bubbles: true, pointerType: 'mouse' }),
    )
    expect(btn.querySelector('.zui-ripple')).not.toBeNull()
    w.unmount()
  })

  it('ripple=false → 不注入 ripple', async () => {
    const w = mount(ZButton, { props: { ripple: false }, slots: { default: () => 'x' }, attachTo: document.body })
    await w.vm.$nextTick()
    const btn = w.element as HTMLElement
    btn.dispatchEvent(
      new PointerEvent('pointerdown', { clientX: 5, clientY: 5, bubbles: true, pointerType: 'mouse' }),
    )
    expect(btn.querySelector('.zui-ripple')).toBeNull()
    w.unmount()
  })
})

describe('ZButton — icon slots', () => {
  it('prefixIcon slot 渲染(非 loading)', () => {
    const w = mount(ZButton, {
      slots: { prefixIcon: () => '[ICON]', default: () => 'Save' },
    })
    expect(w.text()).toContain('[ICON]')
    expect(w.text()).toContain('Save')
  })

  it('loading 时 prefixIcon 被替换为 loading 图标', () => {
    const w = mount(ZButton, {
      props: { loading: true },
      slots: { prefixIcon: () => '[USER-ICON]', default: () => 'Save' },
    })
    expect(w.text()).not.toContain('[USER-ICON]')
  })
})
