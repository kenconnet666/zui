/**
 * `createNotificationApi` —— 通知工厂(类 createMessageApi)。
 */
import { createApp, reactive, type App } from 'vue'
import ZNotification from './ZNotification.vue'
import type { ZNotificationItem, ZNotificationType } from './ZNotification.vue'

export interface ZNotificationApi {
  info: (title: string, description?: string, duration?: number) => ZNotificationItem['id']
  success: (title: string, description?: string, duration?: number) => ZNotificationItem['id']
  warning: (title: string, description?: string, duration?: number) => ZNotificationItem['id']
  error: (title: string, description?: string, duration?: number) => ZNotificationItem['id']
  loading: (title: string, description?: string, duration?: number) => ZNotificationItem['id']
  close: (id: ZNotificationItem['id']) => void
  destroyAll: () => void
}

export interface CreateNotificationApiOptions {
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  appendTo?: HTMLElement
}

let nextId = 0

export function createNotificationApi(opts: CreateNotificationApiOptions = {}): ZNotificationApi {
  const items = reactive<ZNotificationItem[]>([])
  let app: App<Element> | null = null
  let host: HTMLDivElement | null = null

  function ensureMounted(): void {
    if (app || typeof document === 'undefined') return
    host = document.createElement('div')
    host.setAttribute('data-zui-notification-host', '')
    ;(opts.appendTo ?? document.body).appendChild(host)
    app = createApp(ZNotification, {
      items,
      placement: opts.placement ?? 'top-right',
      onClose: (id: ZNotificationItem['id']) => close(id),
    })
    app.mount(host)
  }

  function push(
    type: ZNotificationType,
    title: string,
    description?: string,
    duration?: number,
  ): ZNotificationItem['id'] {
    ensureMounted()
    const id = ++nextId
    const item: ZNotificationItem = { id, type, title }
    if (description !== undefined) item.description = description
    if (duration !== undefined) item.duration = duration
    items.push(item)
    return id
  }

  function close(id: ZNotificationItem['id']): void {
    const idx = items.findIndex((m) => m.id === id)
    if (idx >= 0) items.splice(idx, 1)
  }

  function destroyAll(): void {
    items.splice(0, items.length)
    if (app) {
      app.unmount()
      app = null
    }
    if (host && host.parentNode) {
      host.parentNode.removeChild(host)
      host = null
    }
  }

  return {
    info: (t, d, dur) => push('info', t, d, dur),
    success: (t, d, dur) => push('success', t, d, dur),
    warning: (t, d, dur) => push('warning', t, d, dur),
    error: (t, d, dur) => push('danger', t, d, dur),
    loading: (t, d, dur) => push('loading', t, d, dur ?? 0),
    close,
    destroyAll,
  }
}
