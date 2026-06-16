/**
 * `ZVirtualList` 综合 spec(Sprint 1)。
 *
 * 纯 px 模式(1 单位 = 16px):itemSize=3 等价 48px,便于断言。
 * happy-dom 不算盒模型,通过 fakeScrollEl 注入 clientHeight + dispatch scroll。
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { ZVirtualList, ZBox } from '../src'

type Row = { id: number; label: string }
function rows(n: number): Row[] {
  return Array.from({ length: n }, (_, i) => ({ id: i, label: `R${i}` }))
}

class StubRO {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

beforeEach(() => {
  ;(globalThis as unknown as { ResizeObserver: typeof StubRO }).ResizeObserver = StubRO
  // happy-dom 无真实布局/滚动:onScroll 把 calculateRange 放进 rAF,而测试用 await nextTick
  // 不会等 rAF,导致可视区/visibleRange 断言拿到旧值。这里把 rAF 同步化,让可视区即时计算。
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0)
    return 0
  })
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

/** happy-dom 不算盒子,手动注入 clientHeight + scrollTop setter。 */
function fakeScrollEl(el: HTMLElement, clientHeight: number): void {
  Object.defineProperty(el, 'clientHeight', { configurable: true, value: clientHeight })
  Object.defineProperty(el, 'clientWidth', { configurable: true, value: 0 })
  let scrollTop = 0
  Object.defineProperty(el, 'scrollTop', {
    configurable: true,
    get: () => scrollTop,
    set: v => {
      scrollTop = v
      el.dispatchEvent(new Event('scroll'))
    },
  })
  Object.defineProperty(el, 'scrollLeft', { configurable: true, value: 0, writable: true })
}

/** 在 ZBox 主题上下文内挂 ZVirtualList,返回 wrapper 和虚拟列表根 el。 */
function mountVL(props: Record<string, unknown>, slots: Record<string, unknown> = {}) {
  const Host = defineComponent({
    setup() {
      return () =>
        h(
          ZBox,
          {},
          {
            default: () => h(ZVirtualList, props, slots),
          },
        )
    },
  })
  const w = mount(Host)
  // ZBox 渲染 <div>,内部第一个子是 ZVirtualList 根
  const root = w.element.querySelector('.zui-virtual-list') as HTMLElement
  return { w, root }
}

describe('ZVirtualList — 固定行高', () => {
  it('items=100, itemSize=3(=48px), height=200(=3200px wrapper) → totalSize=4800', async () => {
    const { w, root } = mountVL(
      { items: rows(100), itemSize: 3, height: 200 },
      {
        default: '<div>x</div>',
      },
    )
    fakeScrollEl(root, 200)
    await nextTick()
    root.dispatchEvent(new Event('scroll'))
    await nextTick()
    const wrapper = root.querySelector('[data-zv-wrapper]') as HTMLElement
    expect(wrapper.style.height).toBe('4800px') // 100 * 48
    w.unmount()
  })

  it('只渲染可视区 + overscan', async () => {
    const { w, root } = mountVL(
      { items: rows(1000), itemSize: 3, height: 200, overscan: 2 },
      {
        default: '<div>x</div>',
      },
    )
    fakeScrollEl(root, 200)
    await nextTick()
    root.dispatchEvent(new Event('scroll'))
    await nextTick()
    const items = root.querySelectorAll('[data-zv-wrapper] > div')
    // viewport 200 / 48 ≈ 4.17 项 → 5 项 + overscan 0~2 = 5~7 个
    expect(items.length).toBeLessThanOrEqual(8)
    expect(items.length).toBeGreaterThanOrEqual(5)
    w.unmount()
  })

  it('滚到 scrollTop=480 → 起始 item index = 10(480/48)', async () => {
    const { w, root } = mountVL(
      { items: rows(1000), itemSize: 3, height: 200, overscan: 0 },
      {
        default: '<div>x</div>',
      },
    )
    fakeScrollEl(root, 200)
    await nextTick()
    root.dispatchEvent(new Event('scroll'))
    await nextTick()
    ;(root as unknown as { scrollTop: number }).scrollTop = 480
    await nextTick()
    const firstItem = root.querySelector('[data-zv-wrapper] > div') as HTMLElement
    expect(firstItem.style.top).toBe('480px')
    w.unmount()
  })
})

describe('ZVirtualList — 函数行高', () => {
  it('itemSize 函数 → totalSize 累加', async () => {
    const { w, root } = mountVL(
      {
        items: rows(10),
        itemSize: (i: number) => (i % 2 === 0 ? 2 : 4), // 32 / 64 px
        height: 200,
      },
      { default: '<div>x</div>' },
    )
    fakeScrollEl(root, 200)
    await nextTick()
    root.dispatchEvent(new Event('scroll'))
    await nextTick()
    const wrapper = root.querySelector('[data-zv-wrapper]') as HTMLElement
    // 5 个 32 + 5 个 64 = 480
    expect(wrapper.style.height).toBe('480px')
    w.unmount()
  })
})

describe('ZVirtualList — slots', () => {
  it('空 items + empty slot → 渲染 empty', () => {
    const { w } = mountVL(
      { items: [], itemSize: 3, height: 200 },
      {
        default: () => h('div', 'x'),
        empty: () => h('span', { 'data-empty': '' }, '无数据'),
      },
    )
    expect(w.find('[data-empty]').exists()).toBe(true)
    expect(w.find('[data-zv-wrapper]').exists()).toBe(false)
    w.unmount()
  })

  it('header / footer slot 在虚拟之外', () => {
    const { w } = mountVL(
      { items: rows(10), itemSize: 3, height: 200 },
      {
        default: () => h('div', 'x'),
        header: () => h('div', { 'data-h': '' }, 'HEAD'),
        footer: () => h('div', { 'data-f': '' }, 'FOOT'),
      },
    )
    expect(w.find('[data-h]').exists()).toBe(true)
    expect(w.find('[data-f]').exists()).toBe(true)
    w.unmount()
  })

  it('scoped slot 拿到 item / index / size', async () => {
    const { w, root } = mountVL(
      { items: rows(5), itemSize: 3, height: 100 },
      {
        default: ({ item, index, size }: { item: Row; index: number; size: number }) =>
          h('div', { 'data-info': `${index}-${item.label}-${size}` }),
      },
    )
    fakeScrollEl(root, 100)
    await nextTick()
    root.dispatchEvent(new Event('scroll'))
    await nextTick()
    const first = root.querySelector('[data-info]') as HTMLElement
    expect(first.getAttribute('data-info')).toBe('0-R0-48')
    w.unmount()
  })
})

describe('ZVirtualList — emit', () => {
  it('emit update(start, end) 在可见区变化', async () => {
    const exposeRef: { value: unknown } = { value: null }
    const events: unknown[][] = []
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZBox,
            {},
            {
              default: () =>
                h(
                  ZVirtualList,
                  {
                    items: rows(100),
                    itemSize: 3,
                    height: 200,
                    ref: (el: unknown) => {
                      exposeRef.value = el
                    },
                    onUpdate: (s: number, e: number) => events.push([s, e]),
                  } as Record<string, unknown>,
                  {
                    default: () => h('div', 'x'),
                  },
                ),
            },
          )
      },
    })
    const w = mount(Host)
    const root = w.element.querySelector('.zui-virtual-list') as HTMLElement
    fakeScrollEl(root, 200)
    await nextTick()
    root.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(events.length).toBeGreaterThan(0)
    w.unmount()
  })

  it('emit scroll-end 当滚到底', async () => {
    const events: unknown[] = []
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZBox,
            {},
            {
              default: () =>
                h(
                  ZVirtualList,
                  {
                    items: rows(10),
                    itemSize: 3,
                    height: 200,
                    onScrollEnd: () => events.push('end'),
                  } as Record<string, unknown>,
                  {
                    default: () => h('div', 'x'),
                  },
                ),
            },
          )
      },
    })
    const w = mount(Host)
    const root = w.element.querySelector('.zui-virtual-list') as HTMLElement
    fakeScrollEl(root, 200)
    await nextTick()
    // total = 480, viewport = 200, scrollTop = 280 触底
    ;(root as unknown as { scrollTop: number }).scrollTop = 280
    await nextTick()
    expect(events.length).toBe(1)
    w.unmount()
  })
})

describe('ZVirtualList — expose API', () => {
  function mountWithExpose() {
    const exposeRef: {
      value: {
        scrollToIndex: Function
        scrollToOffset: Function
        getScroll: Function
        getItemOffset: Function
      } | null
    } = {
      value: null,
    }
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZBox,
            {},
            {
              default: () =>
                h(
                  ZVirtualList,
                  {
                    items: rows(100),
                    itemSize: 3,
                    height: 200,
                    ref: (el: unknown) => {
                      exposeRef.value = el as typeof exposeRef.value
                    },
                  } as Record<string, unknown>,
                  {
                    default: () => h('div', 'x'),
                  },
                ),
            },
          )
      },
    })
    const w = mount(Host)
    const root = w.element.querySelector('.zui-virtual-list') as HTMLElement
    return { w, expose: exposeRef, root }
  }

  it('scrollToIndex(50, "start") → scrollTop=2400(50*48)', async () => {
    const { w, expose, root } = mountWithExpose()
    await nextTick()
    fakeScrollEl(root, 200)
    root.dispatchEvent(new Event('scroll'))
    await nextTick()
    expose.value!.scrollToIndex(50, 'start')
    expect(root.scrollTop).toBe(2400)
    w.unmount()
  })

  it('scrollToOffset(123)', async () => {
    const { w, expose, root } = mountWithExpose()
    await nextTick()
    fakeScrollEl(root, 200)
    root.dispatchEvent(new Event('scroll'))
    await nextTick()
    expose.value!.scrollToOffset(123)
    expect(root.scrollTop).toBe(123)
    w.unmount()
  })

  it('getItemOffset(10) = 480(10*48)', async () => {
    const { w, expose, root } = mountWithExpose()
    await nextTick()
    fakeScrollEl(root, 200)
    root.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(expose.value!.getItemOffset(10)).toBe(480)
    w.unmount()
  })
})

describe('ZVirtualList — 数据动态变化', () => {
  it('items 替换后 totalSize 重算', async () => {
    const items = ref<Row[]>(rows(10))
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZBox,
            {},
            {
              default: () =>
                h(
                  ZVirtualList,
                  { items: items.value, itemSize: 3, height: 200 },
                  {
                    default: () => h('div', 'x'),
                  },
                ),
            },
          )
      },
    })
    const w = mount(Host)
    const root = w.element.querySelector('.zui-virtual-list') as HTMLElement
    fakeScrollEl(root, 200)
    await nextTick()
    root.dispatchEvent(new Event('scroll'))
    await nextTick()
    let wrapper = root.querySelector('[data-zv-wrapper]') as HTMLElement
    expect(wrapper.style.height).toBe('480px')

    items.value = rows(50)
    await nextTick()
    wrapper = root.querySelector('[data-zv-wrapper]') as HTMLElement
    expect(wrapper.style.height).toBe('2400px')
    w.unmount()
  })
})
