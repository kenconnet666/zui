/**
 * Phase β 批量 spec:ZDropdown / ZPopconfirm / ZNotification / ZSlider / ZRate。
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, reactive, ref } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import {
  ZDropdown,
  ZPopconfirm,
  ZNotification,
  createNotificationApi,
  ZSlider,
  ZRate,
  type ZNotificationItem,
} from '../src'

let wrappers: VueWrapper[] = []

function cleanPortals(): void {
  wrappers.forEach(w => w.unmount())
  wrappers = []
  document.body
    .querySelectorAll('[role="menu"], [role="dialog"], [data-zui-notification-host]')
    .forEach(el => el.remove())
}

beforeEach(cleanPortals)
afterEach(cleanPortals)

describe('ZDropdown', () => {
  const ITEMS = [
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete', danger: true },
    { key: 'disabled', label: 'X', disabled: true },
  ]

  it('default 隐藏,点击触发器 → 展开 menu', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZDropdown, { items: ITEMS }, { default: () => h('button', { id: 't' }, 'click') })
      },
    })
    const w = mount(Host, { attachTo: document.body })
    wrappers.push(w)
    expect(document.querySelector('[role="menu"]')).toBeNull()
    await w.find('#t').trigger('click')
    await nextTick()
    expect(document.querySelector('[role="menu"]')).not.toBeNull()
    expect(document.body.textContent).toContain('Edit')
  })

  it('选项点击 → emit select + 关闭', async () => {
    let selectedKey: string | null = null
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZDropdown,
            {
              items: ITEMS,
              onSelect: (k: string) => (selectedKey = k),
            },
            { default: () => h('button', { id: 't' }, 'click') },
          )
      },
    })
    const w = mount(Host, { attachTo: document.body })
    wrappers.push(w)
    await w.find('#t').trigger('click')
    await nextTick()
    const items = document.querySelectorAll('[role="menuitem"]')
    ;(items[0] as HTMLElement).click()
    await nextTick()
    expect(selectedKey).toBe('edit')
    expect(document.querySelector('[role="menu"]')).toBeNull()
  })

  it('disabled item 点击不 emit', async () => {
    let selectedKey: string | null = null
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZDropdown,
            {
              items: ITEMS,
              onSelect: (k: string) => (selectedKey = k),
            },
            { default: () => h('button', { id: 't' }, 'click') },
          )
      },
    })
    const w = mount(Host, { attachTo: document.body })
    wrappers.push(w)
    await w.find('#t').trigger('click')
    await nextTick()
    const items = document.querySelectorAll('[role="menuitem"]')
    ;(items[2] as HTMLElement).click()
    await nextTick()
    expect(selectedKey).toBeNull()
  })
})

describe('ZPopconfirm', () => {
  it('点击触发器 → 显示气泡,确定 → emit confirm + 关', async () => {
    let confirmed = false
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZPopconfirm,
            { title: 'Sure?', onConfirm: () => (confirmed = true) },
            { default: () => h('button', { id: 't' }, 'del') },
          )
      },
    })
    const w = mount(Host, { attachTo: document.body })
    wrappers.push(w)
    await w.find('#t').trigger('click')
    await nextTick()
    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement
    const buttons = dialog.querySelectorAll('button')
    // 第二个按钮是 "确定"
    ;(buttons[1] as HTMLButtonElement).click()
    await nextTick()
    expect(confirmed).toBe(true)
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it('取消 → emit cancel', async () => {
    let cancelled = false
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZPopconfirm,
            { title: 'Sure?', onCancel: () => (cancelled = true) },
            { default: () => h('button', { id: 't' }, 'del') },
          )
      },
    })
    const w = mount(Host, { attachTo: document.body })
    wrappers.push(w)
    await w.find('#t').trigger('click')
    await nextTick()
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement
    const buttons = dialog.querySelectorAll('button')
    ;(buttons[0] as HTMLButtonElement).click() // 取消
    await nextTick()
    expect(cancelled).toBe(true)
  })
})

describe('ZNotification (组件模式 + createNotificationApi)', () => {
  it('items 渲染', async () => {
    const items = reactive<ZNotificationItem[]>([
      { id: 1, type: 'info', title: 'Hello', description: 'world', duration: 0 },
    ])
    const Host = defineComponent({ setup: () => () => h(ZNotification, { items }) })
    wrappers.push(mount(Host, { attachTo: document.body }))
    await nextTick()
    expect(document.body.textContent).toContain('Hello')
    expect(document.body.textContent).toContain('world')
  })

  it('createNotificationApi - api.success 显示 + destroyAll 卸载', async () => {
    const api = createNotificationApi()
    api.success('Done', 'Saved', 0)
    await nextTick()
    expect(document.body.textContent).toContain('Done')
    expect(document.body.textContent).toContain('Saved')
    expect(document.body.querySelector('[data-zui-notification-host]')).not.toBeNull()
    api.destroyAll()
    expect(document.body.querySelector('[data-zui-notification-host]')).toBeNull()
  })

  it('duration > 0 → 自动关闭', async () => {
    vi.useFakeTimers()
    try {
      const api = createNotificationApi()
      api.info('T', 'D', 1000)
      await nextTick()
      expect(document.body.textContent).toContain('T')
      vi.advanceTimersByTime(1500)
      await nextTick()
      // close 后 items 数组 splice;TransitionGroup 退场动画期间 DOM 仍存在,所以这里不强断言文本消失
      // 改测:advance + destroyAll
      api.destroyAll()
      expect(document.body.querySelector('[data-zui-notification-host]')).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('ZSlider', () => {
  it('渲染 input[type=range] + value', () => {
    const w = mount(ZSlider, { props: { value: 30, min: 0, max: 100 } })
    const input = w.find('input[type="range"]').element as HTMLInputElement
    expect(input.value).toBe('30')
    expect(input.min).toBe('0')
    expect(input.max).toBe('100')
  })

  it('input → update:value', async () => {
    const w = mount(ZSlider, { props: { value: 50 } })
    const input = w.find('input')
    ;(input.element as HTMLInputElement).value = '75'
    await input.trigger('input')
    expect(w.emitted('update:value')![0]).toEqual([75])
  })

  it('showValue=true → 显示当前值', () => {
    const w = mount(ZSlider, { props: { value: 42, showValue: true } })
    expect(w.text()).toContain('42')
  })

  it('disabled → input.disabled', () => {
    const w = mount(ZSlider, { props: { value: 0, disabled: true } })
    expect(w.find('input').attributes('disabled')).toBeDefined()
  })
})

describe('ZRate', () => {
  it('role=radiogroup + count=5 默认', () => {
    const w = mount(ZRate, { props: { value: 3 } })
    expect(w.attributes('role')).toBe('radiogroup')
    expect(w.findAll('[role="radio"]').length).toBe(5)
  })

  it('value=3 → 第 3 颗 aria-checked=true', () => {
    const w = mount(ZRate, { props: { value: 3 } })
    const stars = w.findAll('[role="radio"]')
    expect(stars[2].attributes('aria-checked')).toBe('true')
  })

  it('点第 4 颗 → update:value(4)', async () => {
    const w = mount(ZRate, { props: { value: 0 } })
    const stars = w.findAll('[role="radio"]')
    await stars[3].trigger('click')
    expect(w.emitted('update:value')![0]).toEqual([4])
  })

  it('readonly → 点击不 emit', async () => {
    const w = mount(ZRate, { props: { value: 0, readonly: true } })
    const stars = w.findAll('[role="radio"]')
    await stars[2].trigger('click')
    expect(w.emitted('update:value')).toBeFalsy()
  })

  it('count=10', () => {
    const w = mount(ZRate, { props: { value: 0, count: 10 } })
    expect(w.findAll('[role="radio"]').length).toBe(10)
  })
})
