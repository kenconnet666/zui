/**
 * Phase γ 批 2:Carousel/Descriptions/Watermark/PageHeader/DynamicTags/Transfer.
 * 不测 ZQRCode(依赖外部 qrcode 包,业务方需自装)。
 */
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import {
  ZCarousel,
  ZDescriptions,
  ZWatermark,
  ZPageHeader,
  ZDynamicTags,
  ZTransfer,
  type ZTransferItem,
} from '../src'

describe('ZCarousel', () => {
  it('role=region + slot 渲染每个 item', () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZCarousel,
            { current: 0, items: ['A', 'B', 'C'] },
            {
              default: ({ item, index }: { item: string; index: number }) => `${index}:${item}`,
            },
          )
      },
    })
    const w = mount(Host)
    expect(w.attributes('role')).toBe('region')
    expect(w.text()).toContain('0:A')
    expect(w.text()).toContain('1:B')
    expect(w.text()).toContain('2:C')
  })

  it('箭头按钮 + dots 渲染(showArrows/showDots 默认 true)', () => {
    const Host = defineComponent({
      setup() {
        return () => h(ZCarousel, { current: 0, items: ['A', 'B'] }, { default: () => 'x' })
      },
    })
    const w = mount(Host)
    expect(w.find('button[aria-label="上一张"]').exists()).toBe(true)
    expect(w.find('button[aria-label="下一张"]').exists()).toBe(true)
    expect(w.findAll('[aria-label^="第"]').length).toBe(2)
  })

  it('点下一张 → update:current(loop)', async () => {
    const current = ref(0)
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZCarousel,
            {
              current: current.value,
              items: ['A', 'B', 'C'],
              'onUpdate:current': (v: number) => (current.value = v),
            },
            { default: () => 'x' },
          )
      },
    })
    const w = mount(Host)
    await w.find('button[aria-label="下一张"]').trigger('click')
    expect(current.value).toBe(1)
  })
})

describe('ZDescriptions', () => {
  it('items 渲染 label + value', () => {
    const w = mount(ZDescriptions, {
      props: {
        items: [
          { label: 'Name', value: 'Alice' },
          { label: 'Age', value: 28 },
        ],
      },
    })
    expect(w.text()).toContain('Name')
    expect(w.text()).toContain('Alice')
    expect(w.text()).toContain('Age')
    expect(w.text()).toContain('28')
  })

  it('title prop 渲染', () => {
    const w = mount(ZDescriptions, {
      props: { items: [{ label: 'X', value: 'Y' }], title: 'Profile' },
    })
    expect(w.text()).toContain('Profile')
  })

  it('column=2 → grid-template-columns 2 列', () => {
    mount(ZDescriptions, {
      props: { items: [{ label: 'X', value: 'Y' }], column: 2 },
    })
    const css = Array.from(document.querySelectorAll('style'))
      .map(el => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/grid-template-columns:repeat\(2/)
  })
})

describe('ZWatermark', () => {
  it('渲染 default slot + overlay', () => {
    const w = mount(ZWatermark, {
      props: { content: 'CONFIDENTIAL' },
      slots: { default: () => 'content' },
    })
    expect(w.text()).toContain('content')
    // overlay div 存在(aria-hidden)
    expect(w.find('[aria-hidden="true"]').exists()).toBe(true)
  })
})

describe('ZPageHeader', () => {
  it('title 渲染 + 返回按钮', () => {
    const w = mount(ZPageHeader, { props: { title: 'My Page' } })
    expect(w.text()).toContain('My Page')
    expect(w.find('button[aria-label="返回"]').exists()).toBe(true)
  })

  it('点返回 → emit back', async () => {
    const w = mount(ZPageHeader, { props: { title: 'X' } })
    await w.find('button[aria-label="返回"]').trigger('click')
    expect(w.emitted('back')).toBeTruthy()
  })

  it('showBack=false → 不渲染返回按钮', () => {
    const w = mount(ZPageHeader, { props: { title: 'X', showBack: false } })
    expect(w.find('button[aria-label="返回"]').exists()).toBe(false)
  })

  it('subtitle + extra slot', () => {
    const w = mount(ZPageHeader, {
      props: { title: 'T', subtitle: 'S' },
      slots: { extra: () => '[EX]' },
    })
    expect(w.text()).toContain('S')
    expect(w.text()).toContain('[EX]')
  })
})

describe('ZDynamicTags', () => {
  it('value 数组 → 渲染 tags', () => {
    const w = mount(ZDynamicTags, { props: { value: ['Vue', 'React'] } })
    expect(w.text()).toContain('Vue')
    expect(w.text()).toContain('React')
  })

  it('点 add 按钮 → 显示输入框', async () => {
    const w = mount(ZDynamicTags, { props: { value: [] } })
    const addBtn = w.findAll('button').find(b => b.text().includes('新标签'))!
    await addBtn.trigger('click')
    await w.vm.$nextTick()
    expect(w.find('input').exists()).toBe(true)
  })

  it('回车提交新 tag → update:value', async () => {
    const value = ref<string[]>([])
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZDynamicTags, {
            value: value.value,
            'onUpdate:value': (v: string[]) => (value.value = v),
          })
      },
    })
    const w = mount(Host)
    const addBtn = w.findAll('button').find(b => b.text().includes('新标签'))!
    await addBtn.trigger('click')
    await w.vm.$nextTick()
    const input = w.find('input')
    ;(input.element as HTMLInputElement).value = 'newTag'
    await input.trigger('input')
    await input.trigger('keydown', { key: 'Enter' })
    expect(value.value).toEqual(['newTag'])
  })

  it('点 close → remove tag', async () => {
    const value = ref<string[]>(['x', 'y'])
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZDynamicTags, {
            value: value.value,
            'onUpdate:value': (v: string[]) => (value.value = v),
          })
      },
    })
    const w = mount(Host)
    // ZTag 的关闭按钮 aria-label 为 "关闭";找第一个 tag(值 "x")对应的关闭按钮
    const tagSpans = w.findAll('span[class]')
    const xTag = tagSpans.find(s => s.text().startsWith('x'))!
    const removeBtn = xTag.find('button[aria-label="关闭"]')
    await removeBtn.trigger('click')
    expect(value.value).toEqual(['y'])
  })

  it('达到 max → 不显示 add 按钮', () => {
    const w = mount(ZDynamicTags, { props: { value: ['a', 'b'], max: 2 } })
    expect(w.findAll('button').find(b => b.text().includes('新标签'))).toBeUndefined()
  })
})

describe('ZTransfer', () => {
  const DATA: ZTransferItem[] = [
    { key: '1', label: 'A' },
    { key: '2', label: 'B' },
    { key: '3', label: 'C' },
  ]

  /** 激活 ZTransfer 内部所有 ZVirtualList(注入 viewport 高度并触发 scroll)。 */
  function activateVirtual(w: ReturnType<typeof mount>): Promise<void> {
    class StubRO {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }
    ;(globalThis as unknown as { ResizeObserver: typeof StubRO }).ResizeObserver = StubRO
    const wrappers = w.element.querySelectorAll('[data-zv-wrapper]')
    wrappers.forEach((wrap: Element) => {
      const root = wrap.parentElement as HTMLElement
      if (root) {
        Object.defineProperty(root, 'clientHeight', { configurable: true, value: 300 })
        root.dispatchEvent(new Event('scroll'))
      }
    })
    return nextTick()
  }

  it('左右两栏渲染 + title', async () => {
    const w = mount(ZTransfer, { props: { dataSource: DATA, targetKeys: ['2'] } })
    await activateVirtual(w)
    expect(w.text()).toContain('源')
    expect(w.text()).toContain('目标')
    expect(w.text()).toContain('A')
    expect(w.text()).toContain('B')
    expect(w.text()).toContain('C')
  })

  it('targetKeys 控制右侧', () => {
    const w = mount(ZTransfer, {
      props: { dataSource: DATA, targetKeys: ['2', '3'] },
    })
    // 左侧 1 项,右侧 2 项
    expect(w.text()).toMatch(/源 \(1\)/)
    expect(w.text()).toMatch(/目标 \(2\)/)
  })

  it('勾选 + 点右箭头 → 移到右侧', async () => {
    const target = ref<string[]>([])
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZTransfer, {
            dataSource: DATA,
            targetKeys: target.value,
            'onUpdate:targetKeys': (k: string[]) => (target.value = k),
          })
      },
    })
    const w = mount(Host)
    await activateVirtual(w)
    // 勾左侧第一个 (A,key=1);ZCheckbox 由 input change 事件驱动
    const checkboxes = w.findAll('input[type="checkbox"]')
    expect(checkboxes.length).toBeGreaterThan(0)
    // jsdom 不自动同步 checked,手动设置再 trigger change
    const inputEl = checkboxes[0]!.element as HTMLInputElement
    inputEl.checked = true
    await checkboxes[0]!.trigger('change')
    const rightBtn = w.find('button[aria-label="移到右侧"]')
    await rightBtn.trigger('click')
    expect(target.value).toContain('1')
  })

  it('自定义 titles', () => {
    const w = mount(ZTransfer, {
      props: { dataSource: DATA, targetKeys: [], titles: ['可选', '已选'] },
    })
    expect(w.text()).toContain('可选')
    expect(w.text()).toContain('已选')
  })
})
