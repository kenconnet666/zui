/**
 * `ZPagination` —— 分页器。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { ZPagination } from '../src'

describe('ZPagination', () => {
  it('nav aria-label=pagination', () => {
    const w = mount(ZPagination, { props: { page: 1, total: 100, pageSize: 10 } })
    expect(w.attributes('aria-label')).toBe('pagination')
  })

  it('总页数 = ceil(total / pageSize)', () => {
    const w = mount(ZPagination, { props: { page: 1, total: 23, pageSize: 10 } })
    // 23/10 = 3 页:1, 2, 3
    const btns = w.findAll('button').filter(b => /^\d+$/.test(b.text()))
    expect(btns.length).toBe(3)
  })

  it('当前页 aria-current=page', () => {
    const w = mount(ZPagination, { props: { page: 2, total: 30, pageSize: 10 } })
    const cur = w.find('[aria-current="page"]')
    expect(cur.exists()).toBe(true)
    expect(cur.text()).toBe('2')
  })

  it('点页码 → update:page + change', async () => {
    const w = mount(ZPagination, { props: { page: 1, total: 30, pageSize: 10 } })
    const btns = w.findAll('button')
    const p3 = btns.find(b => b.text() === '3')!
    await p3.trigger('click')
    expect(w.emitted('update:page')![0]).toEqual([3])
    expect(w.emitted('change')![0]).toEqual([3])
  })

  it('上一页按钮 page=1 disabled', () => {
    const w = mount(ZPagination, { props: { page: 1, total: 30, pageSize: 10 } })
    const prev = w.find('button[aria-label*="一页"]')
    expect(prev.attributes('disabled')).toBeDefined()
  })

  it('页码 > 5 + 2*siblings → 显示省略号', () => {
    const w = mount(ZPagination, { props: { page: 5, total: 100, pageSize: 10, siblings: 1 } })
    expect(w.text()).toContain('…')
  })

  it('showTotal=true 显示总数文本', () => {
    const w = mount(ZPagination, {
      props: { page: 1, total: 47, pageSize: 10, showTotal: true },
    })
    expect(w.text()).toContain('47')
  })

  it('disabled → 所有页码按钮 disabled', () => {
    const w = mount(ZPagination, { props: { page: 1, total: 30, pageSize: 10, disabled: true } })
    const btns = w.findAll('button')
    expect(btns.every(b => b.attributes('disabled') !== undefined)).toBe(true)
  })
})
