/**
 * Phase γ spec:ZSegmented / ZGradientText / ZCountdown / ZNumberAnimation / ZMarquee / ZSplit.
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import {
  ZSegmented,
  ZGradientText,
  ZCountdown,
  ZNumberAnimation,
  ZMarquee,
  ZSplit,
} from '../src'

describe('ZSegmented', () => {
  const OPTS = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
    { value: 'c', label: 'C', disabled: true },
  ]

  it('role=radiogroup + 渲染 options', () => {
    const w = mount(ZSegmented, { props: { value: 'a', options: OPTS } })
    expect(w.attributes('role')).toBe('radiogroup')
    expect(w.findAll('[role="radio"]').length).toBe(3)
  })

  it('点选项 → update:value + change', async () => {
    const w = mount(ZSegmented, { props: { value: 'a', options: OPTS } })
    const btns = w.findAll('[role="radio"]')
    await btns[1].trigger('click')
    expect(w.emitted('update:value')![0]).toEqual(['b'])
    expect(w.emitted('change')![0]).toEqual(['b'])
  })

  it('disabled 选项点击不 emit', async () => {
    const w = mount(ZSegmented, { props: { value: 'a', options: OPTS } })
    const btns = w.findAll('[role="radio"]')
    await btns[2].trigger('click')
    expect(w.emitted('update:value')).toBeFalsy()
  })

  it('aria-checked', () => {
    const w = mount(ZSegmented, { props: { value: 'b', options: OPTS } })
    const btns = w.findAll('[role="radio"]')
    expect(btns[0].attributes('aria-checked')).toBe('false')
    expect(btns[1].attributes('aria-checked')).toBe('true')
  })
})

describe('ZGradientText', () => {
  it('渲染 slot + 注入 gradient style', () => {
    const w = mount(ZGradientText, { slots: { default: () => 'Hello' } })
    expect(w.text()).toContain('Hello')
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/background-image:linear-gradient/)
  })

  it('自定义 gradient', () => {
    mount(ZGradientText, {
      props: { gradient: 'linear-gradient(90deg, red, blue)' },
      slots: { default: () => 'x' },
    })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/red.*blue/)
  })
})

describe('ZCountdown', () => {
  it('过去时间 → 立即显示 00:00:00 + 触发 finish', async () => {
    const past = Date.now() - 1000
    const w = mount(ZCountdown, { props: { value: past } })
    expect(w.text()).toBe('00:00:00')
    expect(w.emitted('finish')).toBeTruthy()
  })

  it('未来时间(大量) → 显示非零数字', async () => {
    const future = Date.now() + 3600000
    const w = mount(ZCountdown, { props: { value: future } })
    await w.vm.$nextTick()
    expect(w.text()).not.toBe('00:00:00')
  })

  it('format 占位符替换', async () => {
    const future = Date.now() + 90061000 // ~1d
    const w = mount(ZCountdown, {
      props: { value: future, format: '{d}d {h}h' },
    })
    await w.vm.$nextTick()
    expect(w.text()).toMatch(/\d+d \d+h/)
  })
})

describe('ZNumberAnimation', () => {
  it('渲染初始 from 值(0 或 自定义)', () => {
    const w = mount(ZNumberAnimation, { props: { from: 100, to: 200 } })
    // animation 立即开始;初始 text 是 from
    expect(w.text()).toContain('100')
  })

  it('format precision + separator', () => {
    const w = mount(ZNumberAnimation, {
      props: { from: 1234567.89, to: 1234567.89, precision: 2, separator: ',' },
    })
    // 立即停在 from(因为 to === from)
    expect(w.text()).toContain('1,234,567.89')
  })
})

describe('ZMarquee', () => {
  it('渲染 slot 内容两次(衔接)', () => {
    const w = mount(ZMarquee, { slots: { default: () => 'hello' } })
    // slot 出现两次:一次正常 + 一次 aria-hidden
    expect(w.html().match(/hello/g)!.length).toBe(2)
  })

  it('注入 keyframes 样式(走 emotion)', () => {
    mount(ZMarquee, { slots: { default: () => 'x' } })
    // ikeyframes 走 emotion 注入 <style data-emotion>,包含 @keyframes 定义
    const emotionStyles = Array.from(document.querySelectorAll('style[data-emotion]'))
    const css = emotionStyles.map((el) => el.textContent ?? '').join('\n')
    expect(css).toMatch(/@keyframes/)
  })
})

describe('ZSplit', () => {
  it('first / second slot 渲染', () => {
    const w = mount(ZSplit, {
      slots: { first: () => 'left', second: () => 'right' },
    })
    expect(w.text()).toContain('left')
    expect(w.text()).toContain('right')
  })

  it('divider role=separator + aria-orientation', () => {
    const w = mount(ZSplit, {
      slots: { first: () => 'a', second: () => 'b' },
    })
    const divider = w.find('[role="separator"]')
    expect(divider.exists()).toBe(true)
    expect(divider.attributes('aria-orientation')).toBe('vertical')
  })

  it('direction=vertical → orientation=horizontal', () => {
    const w = mount(ZSplit, {
      props: { direction: 'vertical' },
      slots: { first: () => 'a', second: () => 'b' },
    })
    expect(w.find('[role="separator"]').attributes('aria-orientation')).toBe('horizontal')
  })
})
