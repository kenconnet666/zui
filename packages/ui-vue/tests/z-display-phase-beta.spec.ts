/**
 * Phase β display 批 2:ZEmpty / ZSkeleton / ZResult / ZList / ZProgress / ZCollapse。
 */
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { ZEmpty, ZSkeleton, ZResult, ZList, ZProgress, ZCollapse } from '../src'

describe('ZEmpty', () => {
  it('role=status + 默认描述 "暂无数据"', () => {
    const w = mount(ZEmpty)
    expect(w.attributes('role')).toBe('status')
    expect(w.text()).toContain('暂无数据')
  })

  it('description prop 覆盖默认', () => {
    const w = mount(ZEmpty, { props: { description: '无结果' } })
    expect(w.text()).toContain('无结果')
  })

  it('default slot 渲染 actions', () => {
    const w = mount(ZEmpty, { slots: { default: () => '[ACTION]' } })
    expect(w.text()).toContain('[ACTION]')
  })
})

describe('ZSkeleton', () => {
  it('loading=true → 渲染骨架(role=status + aria-busy)', () => {
    const w = mount(ZSkeleton)
    expect(w.attributes('role')).toBe('status')
    expect(w.attributes('aria-busy')).toBe('true')
  })

  it('rows=3 → 渲染 3 行(默认)', () => {
    const w = mount(ZSkeleton, { props: { rows: 3 } })
    // 3 行 div(linesContainer 内)
    const lines = w.findAll('div').filter((d) => {
      const cls = d.classes().join(' ')
      return cls.includes('css-') && d.element.children.length === 0
    })
    expect(lines.length).toBeGreaterThanOrEqual(3)
  })

  it('avatar=true → 渲染头像圆', () => {
    const w = mount(ZSkeleton, { props: { avatar: true } })
    expect(w.findAll('div').length).toBeGreaterThanOrEqual(2)
  })

  it('loading=false → 显示 default slot', () => {
    const w = mount(ZSkeleton, {
      props: { loading: false },
      slots: { default: () => 'loaded content' },
    })
    expect(w.text()).toContain('loaded content')
  })
})

describe('ZResult', () => {
  it('default status=info + title', () => {
    const w = mount(ZResult, { props: { title: '操作完成' } })
    expect(w.attributes('role')).toBe('status')
    expect(w.text()).toContain('操作完成')
  })

  it('status=success → success 色图标', () => {
    mount(ZResult, { props: { status: 'success', title: '成功' } })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    // success 色应出现(_2e7d32 M2 Green 700 in light)
    expect(css.toLowerCase()).toMatch(/#2e7d32|color:rgb\(46/)
  })

  it('description + actions slot', () => {
    const w = mount(ZResult, {
      props: { status: 'error', title: 'T', description: 'D' },
      slots: { default: () => '[BTN]' },
    })
    expect(w.text()).toContain('D')
    expect(w.text()).toContain('[BTN]')
  })
})

describe('ZList', () => {
  it('items 渲染 + role=list', () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZList,
            { items: ['A', 'B', 'C'] },
            {
              default: ({ item, index }: { item: string; index: number }) => `${index}:${item}`,
            },
          )
      },
    })
    const w = mount(Host)
    expect(w.attributes('role')).toBe('list')
    expect(w.text()).toContain('0:A')
    expect(w.text()).toContain('2:C')
  })

  it('header / footer / 空数据 emptyText', () => {
    const w = mount(ZList, { props: { items: [], header: 'H', footer: 'F' } })
    expect(w.text()).toContain('H')
    expect(w.text()).toContain('F')
    expect(w.text()).toContain('暂无数据')
  })

  it('bordered=true → 注入边框样式', () => {
    mount(ZList, { props: { items: [1, 2], bordered: true } })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/border-width:1px/)
  })
})

describe('ZProgress', () => {
  it('line + value=40 → role=progressbar + width 40%', () => {
    const w = mount(ZProgress, { props: { value: 40 } })
    expect(w.attributes('role')).toBe('progressbar')
    expect(w.attributes('aria-valuenow')).toBe('40')
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/width:40%/)
  })

  it('value clamp 到 0-100', () => {
    const w = mount(ZProgress, { props: { value: 150 } })
    expect(w.attributes('aria-valuenow')).toBe('100')
    const w2 = mount(ZProgress, { props: { value: -10 } })
    expect(w2.attributes('aria-valuenow')).toBe('0')
  })

  it('showText=true → 显示百分比文字', () => {
    const w = mount(ZProgress, { props: { value: 65, showText: true } })
    expect(w.text()).toContain('65%')
  })

  it('type=circle → 渲染 <svg>', () => {
    const w = mount(ZProgress, { props: { value: 50, type: 'circle' } })
    expect(w.find('svg').exists()).toBe(true)
  })

  it('status=success → success 色', () => {
    mount(ZProgress, { props: { value: 100, status: 'success' } })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css.toLowerCase()).toMatch(/#2e7d32|background-color:rgb\(46/)
  })
})

describe('ZCollapse', () => {
  const ITEMS = [
    { key: 'a', title: 'A' },
    { key: 'b', title: 'B' },
    { key: 'c', title: 'C', disabled: true },
  ]

  it('renders titles', () => {
    const w = mount(ZCollapse, { props: { value: [], items: ITEMS } })
    expect(w.text()).toContain('A')
    expect(w.text()).toContain('B')
    expect(w.text()).toContain('C')
  })

  it('点 panel → toggle expanded(非 accordion 多选)', async () => {
    const value = ref<string[]>([])
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZCollapse, {
            value: value.value,
            items: ITEMS,
            'onUpdate:value': (v: string[]) => (value.value = v),
          })
      },
    })
    const w = mount(Host)
    const headers = w.findAll('button')
    await headers[0].trigger('click')
    expect(value.value).toEqual(['a'])
    await headers[1].trigger('click')
    expect(value.value.sort()).toEqual(['a', 'b'])
    await headers[0].trigger('click')
    expect(value.value).toEqual(['b'])
  })

  it('accordion=true → 只能展开一个', async () => {
    const value = ref<string>('')
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZCollapse, {
            value: value.value,
            items: ITEMS,
            accordion: true,
            'onUpdate:value': (v: string) => (value.value = v),
          })
      },
    })
    const w = mount(Host)
    const headers = w.findAll('button')
    await headers[0].trigger('click')
    expect(value.value).toBe('a')
    await headers[1].trigger('click')
    expect(value.value).toBe('b')
  })

  it('disabled panel 点击不切换', async () => {
    const value = ref<string[]>([])
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZCollapse, {
            value: value.value,
            items: ITEMS,
            'onUpdate:value': (v: string[]) => (value.value = v),
          })
      },
    })
    const w = mount(Host)
    const headers = w.findAll('button')
    await headers[2].trigger('click') // disabled
    expect(value.value).toEqual([])
  })
})
