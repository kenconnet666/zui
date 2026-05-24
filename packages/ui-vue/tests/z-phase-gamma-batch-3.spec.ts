/**
 * Phase γ 批 3:ZMention / ZCalendar / ZCascader.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { ZMention, ZCalendar, ZCascader, type ZCascaderOption } from '../src'

let wrappers: VueWrapper[] = []

function cleanup(): void {
  wrappers.forEach((w) => w.unmount())
  wrappers = []
  document.body.querySelectorAll('[role="listbox"]').forEach((el) => el.remove())
}

beforeEach(cleanup)
afterEach(cleanup)

describe('ZMention', () => {
  it('渲染 textarea + value 透传', () => {
    const w = mount(ZMention, {
      props: { value: 'hello', options: ['alice', 'bob'] },
    })
    const ta = w.find('textarea').element as HTMLTextAreaElement
    expect(ta.value).toBe('hello')
  })

  it('输入触发 update:value', async () => {
    const w = mount(ZMention, { props: { value: '', options: ['alice'] } })
    const ta = w.find('textarea')
    ;(ta.element as HTMLTextAreaElement).value = 'hi'
    await ta.trigger('input')
    expect(w.emitted('update:value')![0]).toEqual(['hi'])
  })
})

describe('ZCalendar', () => {
  it('渲染年月头 + 7 个星期 + 42 个日期格', () => {
    const w = mount(ZCalendar, { props: { value: '2026-05-15' } })
    expect(w.text()).toContain('2026')
    expect(w.text()).toContain('5')
    // 7 个 weekday + 42 日期格
    expect(w.findAll('button').length).toBeGreaterThanOrEqual(42)
  })

  it('点日期 → update:value', async () => {
    const value = ref('2026-05-15')
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZCalendar, {
            value: value.value,
            'onUpdate:value': (v: string) => (value.value = v),
          })
      },
    })
    const w = mount(Host)
    // 找到 "10" 日期按钮(本月)
    const dayBtns = w.findAll('button').filter((b) => b.text() === '10')
    expect(dayBtns.length).toBeGreaterThan(0)
    await dayBtns[0].trigger('click')
    expect(value.value).toMatch(/2026-05-1\d/)
  })

  it('上下月切换', async () => {
    const w = mount(ZCalendar, { props: { value: '2026-05-15' } })
    const prevBtn = w.find('button[aria-label="上一月"]')
    await prevBtn.trigger('click')
    expect(w.text()).toContain('4')
    const nextBtn = w.find('button[aria-label="下一月"]')
    await nextBtn.trigger('click')
    await nextBtn.trigger('click')
    expect(w.text()).toContain('6')
  })

  it('firstDayOfWeek=1 → 周一起首', () => {
    const w = mount(ZCalendar, { props: { firstDayOfWeek: 1 } })
    // weekday header 第一个应是 '一'
    const headers = w.findAll('span').filter((s) => /^[一二三四五六日]$/.test(s.text()))
    expect(headers[0]?.text()).toBe('一')
  })
})

describe('ZCascader', () => {
  const OPTS: ZCascaderOption[] = [
    {
      value: 'zh',
      label: '浙江',
      children: [
        {
          value: 'hz',
          label: '杭州',
          children: [
            { value: 'xh', label: '西湖区' },
            { value: 'bj', label: '滨江区' },
          ],
        },
      ],
    },
    { value: 'js', label: '江苏', children: [{ value: 'nj', label: '南京' }] },
  ]

  it('默认隐藏,点触发器 → 展开', async () => {
    const w = mount(ZCascader, {
      props: { value: [], options: OPTS },
      attachTo: document.body,
    })
    wrappers.push(w)
    expect(document.querySelector('[role="listbox"]')).toBeNull()
    await w.find('[role="combobox"]').trigger('click')
    expect(document.querySelector('[role="listbox"]')).not.toBeNull()
    expect(document.body.textContent).toContain('浙江')
    expect(document.body.textContent).toContain('江苏')
  })

  it('点第一列选项 → 展开第二列', async () => {
    class StubRO {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }
    ;(globalThis as unknown as { ResizeObserver: typeof StubRO }).ResizeObserver = StubRO
    const w = mount(ZCascader, {
      props: { value: [], options: OPTS },
      attachTo: document.body,
    })
    wrappers.push(w)
    await w.find('[role="combobox"]').trigger('click')
    // 激活 panel 虚拟列表
    document.querySelectorAll('[data-zv-wrapper]').forEach((wrap) => {
      const root = wrap.parentElement as HTMLElement | null
      if (root) {
        Object.defineProperty(root, 'clientHeight', { configurable: true, value: 300 })
        root.dispatchEvent(new Event('scroll'))
      }
    })
    await nextTick()
    const items = document.querySelectorAll('[role="option"]')
    ;(items[0] as HTMLElement).click()
    await w.vm.$nextTick()
    // 现在应该多一列(包含 杭州)— 也需要再次激活
    document.querySelectorAll('[data-zv-wrapper]').forEach((wrap) => {
      const root = wrap.parentElement as HTMLElement | null
      if (root) {
        Object.defineProperty(root, 'clientHeight', { configurable: true, value: 300 })
        root.dispatchEvent(new Event('scroll'))
      }
    })
    await nextTick()
    expect(document.body.textContent).toContain('杭州')
  })

  /** 激活所有虚拟列表(注入 clientHeight + dispatch scroll)。 */
  async function activateVirtualPanels(): Promise<void> {
    class StubRO {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }
    ;(globalThis as unknown as { ResizeObserver: typeof StubRO }).ResizeObserver = StubRO
    document.querySelectorAll('[data-zv-wrapper]').forEach((wrap) => {
      const root = wrap.parentElement as HTMLElement | null
      if (root) {
        Object.defineProperty(root, 'clientHeight', { configurable: true, value: 300 })
        root.dispatchEvent(new Event('scroll'))
      }
    })
    await nextTick()
  }

  it('点叶子 → 完整路径 emit', async () => {
    const value = ref<string[]>([])
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZCascader, {
            value: value.value,
            options: OPTS,
            'onUpdate:value': (v: string[]) => (value.value = v),
          })
      },
    })
    const w = mount(Host, { attachTo: document.body })
    wrappers.push(w)
    await w.find('[role="combobox"]').trigger('click')
    await activateVirtualPanels()
    // 点浙江
    ;(document.querySelectorAll('[role="option"]')[0] as HTMLElement).click()
    await w.vm.$nextTick()
    await activateVirtualPanels()
    // 点杭州(此时第二列已激活)
    const hzBtn = Array.from(document.querySelectorAll('[role="option"]')).find((el) =>
      el.textContent?.includes('杭州'),
    )!
    ;(hzBtn as HTMLElement).click()
    await w.vm.$nextTick()
    await activateVirtualPanels()
    // 点西湖区
    const xhBtn = Array.from(document.querySelectorAll('[role="option"]')).find((el) =>
      el.textContent?.includes('西湖'),
    )!
    ;(xhBtn as HTMLElement).click()
    await w.vm.$nextTick()
    expect(value.value).toEqual(['zh', 'hz', 'xh'])
  })

  it('显示选中路径(separator)', () => {
    const w = mount(ZCascader, {
      props: { value: ['zh', 'hz', 'xh'], options: OPTS, separator: ' > ' },
      attachTo: document.body,
    })
    wrappers.push(w)
    expect(w.find('[role="combobox"]').text()).toContain('浙江 > 杭州 > 西湖区')
  })
})
