/**
 * `ZAlert` —— 警示横幅(info/success/warning/danger + closable + showIcon)。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Chain } from '@kenconnet666/zui-core'
import { ZAlert, zuiLight, type ZuiSchema } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map((el) => el.textContent ?? '')
    .join('\n')
}

describe('ZAlert — 渲染', () => {
  it('默认 type=info + role=alert', () => {
    const w = mount(ZAlert, { props: { title: 'hi' } })
    expect(w.attributes('role')).toBe('alert')
    expect(w.text()).toContain('hi')
  })

  it('title + description 都显示', () => {
    const w = mount(ZAlert, { props: { title: 'T', description: 'D' } })
    expect(w.text()).toContain('T')
    expect(w.text()).toContain('D')
  })

  it('default slot 渲染', () => {
    const w = mount(ZAlert, { slots: { default: () => 'body content' } })
    expect(w.text()).toContain('body content')
  })
})

describe('ZAlert — type 配色', () => {
  it('type=success → 使用 success 语义色', () => {
    mount(ZAlert, { props: { type: 'success', title: 'ok' } })
    const success = String((zuiLight.resolve() as { color: Record<string, string> }).color.success)
    expect(getInjectedCss().toLowerCase()).toContain(success.toLowerCase())
  })

  it('type=danger → 使用 danger 语义色', () => {
    mount(ZAlert, { props: { type: 'danger', title: 'err' } })
    const danger = String((zuiLight.resolve() as { color: Record<string, string> }).color.danger)
    expect(getInjectedCss().toLowerCase()).toContain(danger.toLowerCase())
  })
})

describe('ZAlert — closable', () => {
  it('默认无关闭按钮', () => {
    const w = mount(ZAlert, { props: { title: 'x' } })
    expect(w.find('button').exists()).toBe(false)
  })

  it('closable=true 渲染 aria-label 关闭按钮', () => {
    const w = mount(ZAlert, { props: { title: 'x', closable: true } })
    const btn = w.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.attributes('aria-label')).toBe('关闭')
  })

  it('点击关闭按钮 → emit close', async () => {
    const w = mount(ZAlert, { props: { title: 'x', closable: true } })
    await w.find('button').trigger('click')
    expect(w.emitted('close')).toBeTruthy()
    expect(w.emitted('close')!.length).toBe(1)
  })
})

describe('ZAlert — showIcon + sx', () => {
  it('showIcon=false → 不渲染 icon 容器', () => {
    const w = mount(ZAlert, { props: { title: 'x', showIcon: false } })
    // 没有 icon 容器(只有 body + 可能的 close button)
    // 简易判定:slot count(icon slot 没渲染则 < 2)
    expect(w.findAll('div').length).toBeLessThan(3)
  })

  it('sxBody.css 应用到 body 节点', () => {
    mount(ZAlert, {
      props: {
        title: 'x',
        sxBody: {
          css: (s: Chain<ZuiSchema>) => {
            s.padding.px(99)
          },
        },
      },
    })
    expect(getInjectedCss()).toMatch(/padding:99px/)
  })
})
