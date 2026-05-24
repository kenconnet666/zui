/**
 * `ZSpin` —— 加载指示器(包裹模式 + 纯 indicator 模式)。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Chain } from '@kenconnet666/zui-core'
import { ZSpin, type ZuiSchema } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map((el) => el.textContent ?? '')
    .join('\n')
}

describe('ZSpin — 默认', () => {
  it('默认 spinning=true,role=status,aria-busy=true', () => {
    const w = mount(ZSpin)
    expect(w.attributes('role')).toBe('status')
    expect(w.attributes('aria-busy')).toBe('true')
  })

  it('spinning=false → aria-busy=false', () => {
    const w = mount(ZSpin, { props: { spinning: false } })
    expect(w.attributes('aria-busy')).toBe('false')
  })
})

describe('ZSpin — 纯 indicator 模式(无 slot)', () => {
  it('无 slot → inline-flex 容器', () => {
    mount(ZSpin)
    expect(getInjectedCss()).toMatch(/display:inline-flex/)
  })

  it('无 slot + spinning=false → 不渲染 indicator', () => {
    const w = mount(ZSpin, { props: { spinning: false } })
    // root 渲染,但内部无 indicator 子节点
    expect(w.findAll('*').length).toBeLessThanOrEqual(1)
  })
})

describe('ZSpin — 包裹模式(有 slot)', () => {
  it('有 slot → position:relative + slot 内容渲染', () => {
    const w = mount(ZSpin, { slots: { default: () => 'wrapped' } })
    expect(getInjectedCss()).toMatch(/position:relative/)
    expect(w.text()).toContain('wrapped')
  })

  it('spinning=true → overlay div 存在', () => {
    const w = mount(ZSpin, { slots: { default: () => 'x' } })
    // 包裹模式 + spinning:overlay div 在树内
    expect(w.findAll('div').length).toBeGreaterThanOrEqual(2)
  })

  it('tip 文字渲染', () => {
    const w = mount(ZSpin, {
      props: { tip: '加载中...' },
      slots: { default: () => 'x' },
    })
    expect(w.text()).toContain('加载中...')
  })
})

describe('ZSpin — size + sx', () => {
  it('size=2 → indicator 走 calc(2 * var(--zui-iem))', () => {
    // R10:size 是 number(iem 倍数),直接透传给 ZIcon
    mount(ZSpin, {
      props: {
        size: 2,
      },
    })
    expect(getInjectedCss()).toMatch(/width:calc\(2 \* var\(--zui-iem,/)
  })

  it('sxIndicator.css 写入 indicator class', () => {
    mount(ZSpin, {
      props: {
        sxIndicator: {
          css: (s: Chain<ZuiSchema>) => {
            s.color('#abc123')
          },
        },
      },
    })
    expect(getInjectedCss().toLowerCase()).toContain('#abc123')
  })
})
