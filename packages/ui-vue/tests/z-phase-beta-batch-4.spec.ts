/**
 * Phase β 批 4 spec:ZImage / ZAnchor / ZScrollbar / ZAutoComplete.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { ZImage, ZAnchor, ZScrollbar, ZAutoComplete } from '../src'

let wrappers: VueWrapper[] = []

function cleanup(): void {
  wrappers.forEach((w) => w.unmount())
  wrappers = []
  document.body.querySelectorAll('[role="listbox"]').forEach((el) => el.remove())
}

beforeEach(cleanup)
afterEach(cleanup)

describe('ZImage', () => {
  it('渲染 img,src/alt 透传', () => {
    const w = mount(ZImage, { props: { src: '/a.png', alt: 'pic', width: 100, height: 100 } })
    const img = w.find('img')
    expect(img.attributes('src')).toBe('/a.png')
    expect(img.attributes('alt')).toBe('pic')
  })

  it('默认 lazy=true', () => {
    const w = mount(ZImage, { props: { src: '/a.png' } })
    expect(w.find('img').attributes('loading')).toBe('lazy')
  })

  it('错误 + 无 fallback → 显示错误文案', async () => {
    const w = mount(ZImage, { props: { src: '/bad.png' } })
    await w.find('img').trigger('error')
    expect(w.text()).toContain('加载失败')
  })

  it('错误 + fallback → 渲染 fallback img', async () => {
    const w = mount(ZImage, { props: { src: '/bad.png', fallback: '/fb.png' } })
    await w.find('img').trigger('error')
    expect(w.find('img').attributes('src')).toBe('/fb.png')
  })
})

describe('ZAnchor', () => {
  it('渲染 items 链接', () => {
    const w = mount(ZAnchor, {
      props: {
        items: [
          { href: '#a', title: 'A' },
          { href: '#b', title: 'B' },
        ],
      },
    })
    expect(w.attributes('aria-label')).toBe('page anchor')
    expect(w.text()).toContain('A')
    expect(w.text()).toContain('B')
    const links = w.findAll('a')
    expect(links.length).toBe(2)
    expect(links[0].attributes('href')).toBe('#a')
  })
})

describe('ZScrollbar', () => {
  it('渲染容器 + slot 内容', () => {
    const w = mount(ZScrollbar, {
      props: { maxHeight: 200 },
      slots: { default: () => 'long content' },
    })
    expect(w.text()).toContain('long content')
    expect(w.classes()).toContain('zui-scrollbar')
  })

  it('全局样式只注入一次(再 mount 不重复)', () => {
    mount(ZScrollbar, { slots: { default: () => 'x' } })
    mount(ZScrollbar, { slots: { default: () => 'y' } })
    expect(document.querySelectorAll('#zui-scrollbar-styles').length).toBe(1)
  })
})

describe('ZAutoComplete', () => {
  it('input + options 渲染', async () => {
    const value = ref('')
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZAutoComplete, {
            value: value.value,
            options: ['Apple', 'Banana', 'Cherry'],
            'onUpdate:value': (v: string) => (value.value = v),
          })
      },
    })
    const w = mount(Host, { attachTo: document.body })
    wrappers.push(w)
    await w.find('input').trigger('focus')
    await nextTick()
    expect(document.querySelector('[role="listbox"]')).not.toBeNull()
    expect(document.body.textContent).toContain('Apple')
  })

  it('过滤 options(默认 includes)', async () => {
    const value = ref('an')
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZAutoComplete, {
            value: value.value,
            options: ['Apple', 'Banana', 'Cherry'],
            'onUpdate:value': (v: string) => (value.value = v),
          })
      },
    })
    const w = mount(Host, { attachTo: document.body })
    wrappers.push(w)
    await w.find('input').trigger('focus')
    await nextTick()
    // 'an' 包含在 Banana
    const opts = document.querySelectorAll('[role="option"]')
    expect(opts.length).toBe(1)
    expect(opts[0].textContent).toContain('Banana')
  })

  it('点选项 → update:value + select + 关闭', async () => {
    const value = ref('')
    let selected = ''
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZAutoComplete, {
            value: value.value,
            options: ['A', 'B'],
            'onUpdate:value': (v: string) => (value.value = v),
            onSelect: (v: string) => (selected = v),
          })
      },
    })
    const w = mount(Host, { attachTo: document.body })
    wrappers.push(w)
    await w.find('input').trigger('focus')
    await nextTick()
    const opts = document.querySelectorAll('[role="option"]')
    ;(opts[0] as HTMLElement).click()
    await nextTick()
    expect(value.value).toBe('A')
    expect(selected).toBe('A')
  })
})
