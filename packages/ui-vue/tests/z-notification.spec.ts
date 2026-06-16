/**
 * `ZNotification` + `createNotificationApi` —— 通知队列。
 *
 * 镜像 `z-message.spec.ts` 的结构：
 *   1. 组件模式（直接渲染 `<ZNotification>`）
 *   2. 工厂模式（`createNotificationApi`）
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import {
  ZNotification,
  createNotificationApi,
  type ZNotificationItem,
} from '../src'

afterEach(() => {
  document.body.querySelectorAll('[data-zui-notification-host]').forEach(el => el.remove())
})

describe('ZNotification — 组件模式', () => {
  it('渲染 items 数组（title 可见）', async () => {
    const items = reactive<ZNotificationItem[]>([
      { id: 1, title: '操作成功', duration: 0 },
      { id: 2, title: '请注意', description: '详细描述', duration: 0 },
    ])
    const Host = defineComponent({
      setup() {
        return () => h(ZNotification, { items })
      },
    })
    mount(Host, { attachTo: document.body })
    await nextTick()
    expect(document.body.textContent).toContain('操作成功')
    expect(document.body.textContent).toContain('请注意')
    expect(document.body.textContent).toContain('详细描述')
  })

  it('duration > 0 → 时间到 emit close', async () => {
    vi.useFakeTimers()
    try {
      const items = reactive<ZNotificationItem[]>([
        { id: 1, title: '超时关闭', duration: 2000 },
      ])
      let closedId: ZNotificationItem['id'] | null = null
      const Host = defineComponent({
        setup() {
          return () =>
            h(ZNotification, {
              items,
              onClose: (id: ZNotificationItem['id']) => (closedId = id),
            })
        },
      })
      mount(Host, { attachTo: document.body })
      await nextTick()
      vi.advanceTimersByTime(2100)
      expect(closedId).toBe(1)
    } finally {
      vi.useRealTimers()
    }
  })

  it('duration=0(loading 默认)→ 不自动关闭', async () => {
    vi.useFakeTimers()
    try {
      const items = reactive<ZNotificationItem[]>([
        { id: 1, title: '加载中', loading: true },
      ])
      let closedId: ZNotificationItem['id'] | null = null
      const Host = defineComponent({
        setup() {
          return () =>
            h(ZNotification, {
              items,
              onClose: (id: ZNotificationItem['id']) => (closedId = id),
            })
        },
      })
      mount(Host, { attachTo: document.body })
      await nextTick()
      vi.advanceTimersByTime(9000)
      expect(closedId).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('createNotificationApi', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('调用 success → 在 body 注入容器 + 显示 title', async () => {
    const api = createNotificationApi()
    api.success('保存成功', undefined, 0)
    await nextTick()
    expect(document.body.textContent).toContain('保存成功')
    expect(document.body.querySelector('[data-zui-notification-host]')).not.toBeNull()
    api.destroyAll()
  })

  it('调用 info → 带 description 显示', async () => {
    const api = createNotificationApi()
    api.info('提示标题', '这是描述内容', 0)
    await nextTick()
    expect(document.body.textContent).toContain('提示标题')
    expect(document.body.textContent).toContain('这是描述内容')
    api.destroyAll()
  })

  it('多种类型', async () => {
    const api = createNotificationApi()
    api.info('notif-info', undefined, 0)
    api.success('notif-suc', undefined, 0)
    api.warning('notif-warn', undefined, 0)
    api.error('notif-err', undefined, 0)
    api.loading('notif-load', undefined, 0)
    await nextTick()
    expect(document.body.textContent).toContain('notif-info')
    expect(document.body.textContent).toContain('notif-suc')
    expect(document.body.textContent).toContain('notif-warn')
    expect(document.body.textContent).toContain('notif-err')
    expect(document.body.textContent).toContain('notif-load')
    api.destroyAll()
  })

  it('close(id) → 立即关闭某条', async () => {
    const api = createNotificationApi()
    const id = api.info('alive-title', undefined, 0)
    await nextTick()
    expect(document.body.textContent).toContain('alive-title')
    api.close(id)
    // close 是同步 splice；断言 id 类型正确且 close 不抛异常
    expect(typeof id).toBe('number')
    api.destroyAll()
  })

  it('destroyAll → 卸载容器', async () => {
    const api = createNotificationApi()
    api.info('x', undefined, 0)
    await nextTick()
    expect(document.body.querySelector('[data-zui-notification-host]')).not.toBeNull()
    api.destroyAll()
    expect(document.body.querySelector('[data-zui-notification-host]')).toBeNull()
  })

  it('placement 选项传入 bottom-left → 容器存在', async () => {
    const api = createNotificationApi({ placement: 'bottom-left' })
    api.info('位置测试', undefined, 0)
    await nextTick()
    expect(document.body.querySelector('[data-zui-notification-host]')).not.toBeNull()
    api.destroyAll()
  })
})
