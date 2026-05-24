/**
 * Phase β gene 补全:ZAvatar / ZTag / ZBadge / ZCode / ZBlockquote / ZEllipsis。
 * 单文件组织 6 个 describe(简单组件,小型 spec)。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { ZAvatar, ZTag, ZBadge, ZCode, ZBlockquote, ZEllipsis } from '../src'

describe('ZAvatar', () => {
  it('src 显示 img + alt', () => {
    const w = mount(ZAvatar, { props: { src: '/a.png', alt: 'me' } })
    const img = w.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('me')
  })

  it('图片加载失败 → fallback 到 text', async () => {
    const w = mount(ZAvatar, { props: { src: '/a.png', text: 'AB' } })
    await w.find('img').trigger('error')
    expect(w.find('img').exists()).toBe(false)
    expect(w.text()).toContain('AB')
  })

  it('default slot 优先', () => {
    const w = mount(ZAvatar, { props: { text: 'X' }, slots: { default: () => '🐱' } })
    expect(w.text()).toContain('🐱')
    expect(w.text()).not.toContain('X')
  })

  it('square=true → 方形圆角(非完全圆)', () => {
    mount(ZAvatar, { props: { square: true, text: 'A' } })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/border-radius:calc/)
  })

  it('size=3 → 自定义尺寸(等价 48px @ 16px iem)', () => {
    // R10:size 是 number(iem 倍数),3 等价 48px @ default 16px iem
    mount(ZAvatar, {
      props: {
        size: 3,
        text: 'X',
      },
    })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/width:calc\(3 \* var\(--zui-iem/)
  })
})

describe('ZTag', () => {
  it('默认 variant=soft', () => {
    const w = mount(ZTag, { slots: { default: () => 'label' } })
    expect(w.text()).toContain('label')
  })

  it('closable → 渲染关闭按钮 + emit close', async () => {
    const w = mount(ZTag, { props: { closable: true }, slots: { default: () => 'tag' } })
    const btn = w.find('button[aria-label="关闭"]')
    expect(btn.exists()).toBe(true)
    await btn.trigger('click')
    expect(w.emitted('close')).toBeTruthy()
  })

  it('variant=filled → schema color 背景(不再用 currentColor 桥接,2026-05-23 重构)', () => {
    mount(ZTag, { props: { variant: 'filled' }, slots: { default: () => 't' } })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/background-color:#/)
  })

  it('round=true → 圆角胶囊', () => {
    mount(ZTag, { props: { round: true }, slots: { default: () => 't' } })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/border-radius:9999px/)
  })
})

describe('ZBadge', () => {
  it('value=5 → 显示 5', () => {
    const w = mount(ZBadge, { props: { value: 5 } })
    expect(w.text()).toContain('5')
  })

  it('value=0 + showZero=false → 不显示', () => {
    const w = mount(ZBadge, { props: { value: 0 } })
    expect(w.text()).toBe('')
  })

  it('value=0 + showZero=true → 显示 0', () => {
    const w = mount(ZBadge, { props: { value: 0, showZero: true } })
    expect(w.text()).toContain('0')
  })

  it('value > max → "max+"', () => {
    const w = mount(ZBadge, { props: { value: 150, max: 99 } })
    expect(w.text()).toContain('99+')
  })

  it('dot=true → 不显数字,只显小圆点', () => {
    const w = mount(ZBadge, { props: { dot: true, value: 5 } })
    // dot 模式 displayText 是空,但 shouldShow=true → span 存在但 text 空
    expect(w.text()).toBe('')
    expect(w.findAll('span').length).toBeGreaterThanOrEqual(2) // wrapper + badge dot
  })

  it('有 default slot → wrapper position:relative', () => {
    mount(ZBadge, { props: { value: 5 }, slots: { default: () => 'icon' } })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/position:relative/)
  })
})

describe('ZCode', () => {
  it('默认 inline=true → <code>', () => {
    const w = mount(ZCode, { slots: { default: () => 'const x = 1' } })
    expect(w.element.tagName).toBe('CODE')
    expect(w.text()).toContain('const x = 1')
  })

  it('inline=false → <pre><code>', () => {
    const w = mount(ZCode, { props: { inline: false }, slots: { default: () => 'block' } })
    expect(w.element.tagName).toBe('PRE')
    expect(w.find('code').exists()).toBe(true)
  })

  it('字体走 mono', () => {
    mount(ZCode, { slots: { default: () => 'x' } })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/font-family:/)
  })
})

describe('ZBlockquote', () => {
  it('渲染 <blockquote>', () => {
    const w = mount(ZBlockquote, { slots: { default: () => 'quote' } })
    expect(w.element.tagName).toBe('BLOCKQUOTE')
    expect(w.text()).toContain('quote')
  })

  it('左侧 border-left 0.25iem(默认 size=1 → size * 0.25)', () => {
    mount(ZBlockquote, { slots: { default: () => 'q' } })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/border-left-width:calc\(0\.25 \* var\(--zui-iem/)
  })
})

describe('ZEllipsis', () => {
  it('默认 lines=1 → 单行 ellipsis 三件套', () => {
    mount(ZEllipsis, { slots: { default: () => 'long text long text' } })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/overflow:hidden/)
    expect(css).toMatch(/text-overflow:ellipsis/)
    expect(css).toMatch(/white-space:nowrap/)
  })

  it('lines=3 → -webkit-line-clamp:3', () => {
    mount(ZEllipsis, { props: { lines: 3 }, slots: { default: () => 'x' } })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/-webkit-line-clamp:3/)
  })

  it('tag prop 切换根元素', () => {
    const w = mount(ZEllipsis, { props: { tag: 'div' }, slots: { default: () => 'x' } })
    expect(w.element.tagName).toBe('DIV')
  })
})
