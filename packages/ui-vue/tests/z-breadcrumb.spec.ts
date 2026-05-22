/**
 * `ZBreadcrumb` —— 面包屑。
 */
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ZBreadcrumb } from '../src'

describe('ZBreadcrumb', () => {
  it('nav aria-label=breadcrumb', () => {
    const w = mount(ZBreadcrumb, { props: { items: [{ label: 'Home' }] } })
    expect(w.attributes('aria-label')).toBe('breadcrumb')
  })

  it('items 渲染 + 分隔符', () => {
    const w = mount(ZBreadcrumb, {
      props: { items: [{ label: 'Home' }, { label: 'Docs' }, { label: 'API' }] },
    })
    expect(w.text()).toContain('Home')
    expect(w.text()).toContain('Docs')
    expect(w.text()).toContain('API')
    // 默认分隔符 /
    expect(w.text()).toContain('/')
  })

  it('最后项 aria-current=page,非 link', () => {
    const w = mount(ZBreadcrumb, {
      props: { items: [{ label: 'A' }, { label: 'B' }, { label: 'C' }] },
    })
    const current = w.find('[aria-current="page"]')
    expect(current.exists()).toBe(true)
    expect(current.text()).toBe('C')
  })

  it('href 透传到 <a>', () => {
    const w = mount(ZBreadcrumb, {
      props: { items: [{ label: 'A', href: '/a' }, { label: 'B' }] },
    })
    expect(w.find('a').attributes('href')).toBe('/a')
  })

  it('onClick 回调', async () => {
    const cb = vi.fn()
    const w = mount(ZBreadcrumb, {
      props: { items: [{ label: 'A', onClick: cb }, { label: 'B' }] },
    })
    await w.find('a').trigger('click')
    expect(cb).toHaveBeenCalled()
  })

  it('自定义 separator', () => {
    const w = mount(ZBreadcrumb, {
      props: { separator: '>', items: [{ label: 'A' }, { label: 'B' }] },
    })
    expect(w.text()).toContain('>')
  })
})
