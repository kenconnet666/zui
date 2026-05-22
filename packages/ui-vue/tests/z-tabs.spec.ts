/**
 * `ZTabs` —— 标签页。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { ZTabs } from '../src'

const TABS = [
  { name: 'a', label: 'A' },
  { name: 'b', label: 'B' },
  { name: 'c', label: 'C', disabled: true },
]

describe('ZTabs', () => {
  it('role=tablist + 渲染 tabs', () => {
    const w = mount(ZTabs, {
      props: { value: 'a', tabs: TABS },
      slots: { default: () => 'panel' },
    })
    expect(w.find('[role="tablist"]').exists()).toBe(true)
    expect(w.findAll('[role="tab"]').length).toBe(3)
  })

  it('当前 tab aria-selected=true', () => {
    const w = mount(ZTabs, {
      props: { value: 'b', tabs: TABS },
      slots: { default: () => 'p' },
    })
    const tabs = w.findAll('[role="tab"]')
    expect(tabs[0].attributes('aria-selected')).toBe('false')
    expect(tabs[1].attributes('aria-selected')).toBe('true')
  })

  it('点 tab → update:value + change', async () => {
    const w = mount(ZTabs, {
      props: { value: 'a', tabs: TABS },
      slots: { default: () => 'p' },
    })
    const tabs = w.findAll('[role="tab"]')
    await tabs[1].trigger('click')
    expect(w.emitted('update:value')![0]).toEqual(['b'])
    expect(w.emitted('change')![0]).toEqual(['b'])
  })

  it('disabled tab 点击不 emit', async () => {
    const w = mount(ZTabs, {
      props: { value: 'a', tabs: TABS },
      slots: { default: () => 'p' },
    })
    const disabled = w.findAll('[role="tab"]')[2]
    await disabled.trigger('click')
    expect(w.emitted('update:value')).toBeFalsy()
  })

  it('closable=true → 每个 tab 有关闭按钮,点击 emit close', async () => {
    const w = mount(ZTabs, {
      props: { value: 'a', tabs: TABS, closable: true },
      slots: { default: () => 'p' },
    })
    const closeBtns = w.findAll('[aria-label="关闭"]')
    expect(closeBtns.length).toBe(3)
    await closeBtns[0].trigger('click')
    expect(w.emitted('close')![0]).toEqual(['a'])
  })

  it('addable=true → 渲染添加按钮 + emit add', async () => {
    const w = mount(ZTabs, {
      props: { value: 'a', tabs: TABS, addable: true },
      slots: { default: () => 'p' },
    })
    const addBtn = w.find('[aria-label="添加"]')
    expect(addBtn.exists()).toBe(true)
    await addBtn.trigger('click')
    expect(w.emitted('add')).toBeTruthy()
  })

  it('panel slot 接收 activeName', () => {
    const w = mount(ZTabs, {
      props: { value: 'b', tabs: TABS },
      slots: { default: (props: { activeName: string }) => `active:${props.activeName}` },
    })
    expect(w.text()).toContain('active:b')
  })

  it('type=card 渲染', () => {
    const w = mount(ZTabs, {
      props: { value: 'a', tabs: TABS, type: 'card' },
      slots: { default: () => 'p' },
    })
    // tablist 存在
    expect(w.find('[role="tablist"]').exists()).toBe(true)
  })
})
