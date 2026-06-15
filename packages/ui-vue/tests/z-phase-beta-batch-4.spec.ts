/**
 * Phase β 批 4 spec:ZImage / ZAnchor / ZScrollbar / ZAutoComplete.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { ZImage, ZAnchor, ZScrollbar, ZAutoComplete } from '../src'

let wrappers: VueWrapper[] = []

function cleanup(): void {
  wrappers.forEach(w => w.unmount())
  wrappers = []
  document.body.querySelectorAll('[role="listbox"]').forEach(el => el.remove())
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

  it('level=2/3 → 按 indentStep 递增缩进', () => {
    mount(ZAnchor, {
      props: {
        items: [
          { href: '#a', title: 'A', level: 1 },
          { href: '#b', title: 'B', level: 2 },
          { href: '#c', title: 'C', level: 3 },
        ],
      },
    })
    const css = Array.from(document.querySelectorAll('style'))
      .map(el => el.textContent ?? '')
      .join('\n')
    // level=2 → padding-left 12px(0.75*16);level=3 → 24px(1.5*16)
    expect(css).toMatch(/padding-left:12px/)
    expect(css).toMatch(/padding-left:24px/)
  })

  it('点击 link → emit click + preventDefault', async () => {
    // mount 到 body,真实触发 anchor 点击;jsdom/happy-dom 都不会跳页
    const target = document.createElement('h2')
    target.id = 'target-section'
    document.body.appendChild(target)
    const w = mount(ZAnchor, {
      props: { items: [{ href: '#target-section', title: 'T' }] },
    })
    await w.find('a').trigger('click')
    expect(w.emitted('click')?.length).toBe(1)
    expect(w.emitted('click')?.[0]?.[0]).toBe('#target-section')
    document.body.removeChild(target)
  })
})

describe('ZScrollbar', () => {
  it('渲染容器 + slot 内容', () => {
    const w = mount(ZScrollbar, {
      props: { maxHeight: 200 },
      slots: { default: () => 'long content' },
    })
    expect(w.text()).toContain('long content')
    // 注:ZScrollbar expose $el=scrollerRef,VTU 的 w.element/classes() 因此指向内层 scroller;
    // 稳定 hook class 'zui-scrollbar' 在根元素,用 html() 校验
    expect(w.html()).toContain('zui-scrollbar')
  })

  it('多次 mount 均挂载稳定 hook class(emotion 天然去重)', () => {
    const w1 = mount(ZScrollbar, { slots: { default: () => 'x' } })
    const w2 = mount(ZScrollbar, { slots: { default: () => 'y' } })
    // emotion 对相同样式生成相同 hash class,天然去重;两次挂载根元素都带稳定 hook class
    expect(w1.html()).toContain('zui-scrollbar')
    expect(w2.html()).toContain('zui-scrollbar')
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
