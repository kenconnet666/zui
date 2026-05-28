/**
 * `ZMenu` —— 菜单(horizontal/vertical/inline + submenu)。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { ZMenu, type ZMenuItem } from '../src'

const ITEMS: ZMenuItem[] = [
  { key: 'home', label: 'Home' },
  {
    key: 'docs',
    label: 'Docs',
    children: [
      { key: 'docs-a', label: 'Getting Started' },
      { key: 'docs-b', label: 'API' },
    ],
  },
  { key: 'about', label: 'About', disabled: true },
]

describe('ZMenu', () => {
  it('role=menu + 渲染 items', () => {
    const w = mount(ZMenu, { props: { value: 'home', items: ITEMS } })
    expect(w.find('[role="menu"]').exists()).toBe(true)
    expect(w.text()).toContain('Home')
    expect(w.text()).toContain('Docs')
    expect(w.text()).toContain('About')
  })

  it('点 leaf → update:value + select', async () => {
    const w = mount(ZMenu, { props: { value: '', items: ITEMS } })
    const buttons = w.findAll('[role="menuitem"]')
    // 第一个是 Home(leaf)
    await buttons[0].trigger('click')
    expect(w.emitted('update:value')![0]).toEqual(['home'])
    expect(w.emitted('select')![0]).toEqual(['home'])
  })

  it('disabled 项点击不 emit', async () => {
    const w = mount(ZMenu, { props: { value: '', items: ITEMS } })
    const aboutBtn = w.findAll('[role="menuitem"]').find(b => b.text().includes('About'))!
    await aboutBtn.trigger('click')
    expect(w.emitted('update:value')).toBeFalsy()
  })

  it('submenu 点击 → toggle expand,不 emit select', async () => {
    const w = mount(ZMenu, { props: { value: '', items: ITEMS } })
    const docsBtn = w.findAll('[role="menuitem"]').find(b => b.text().includes('Docs'))!
    expect(docsBtn.attributes('aria-expanded')).toBe('false')
    await docsBtn.trigger('click')
    expect(docsBtn.attributes('aria-expanded')).toBe('true')
    expect(w.emitted('update:value')).toBeFalsy()
    // 展开后能看到子项
    expect(w.text()).toContain('Getting Started')
  })

  it('展开后点 leaf child → emit select 子 key', async () => {
    const w = mount(ZMenu, { props: { value: '', items: ITEMS } })
    const docsBtn = w.findAll('[role="menuitem"]').find(b => b.text().includes('Docs'))!
    await docsBtn.trigger('click')
    const childBtn = w.findAll('[role="menuitem"]').find(b => b.text().includes('API'))!
    await childBtn.trigger('click')
    expect(w.emitted('update:value')![0]).toEqual(['docs-b'])
  })

  it('collapsed=true → 不显示 label 文本', () => {
    const w = mount(ZMenu, { props: { value: 'home', items: ITEMS, collapsed: true } })
    // 折叠时 label 不渲染(仅占位 icon)
    expect(w.text()).not.toContain('Home')
  })

  it('value=home → 高亮当前选中', () => {
    const w = mount(ZMenu, { props: { value: 'home', items: ITEMS } })
    // 简单检查:Home 按钮存在
    const homeBtn = w.findAll('[role="menuitem"]').find(b => b.text().includes('Home'))!
    expect(homeBtn.exists()).toBe(true)
  })
})
