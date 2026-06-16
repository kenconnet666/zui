/**
 * `createNotificationApi` —— 通知工厂(类 createMessageApi)。
 *
 * 内部通过 `createToastApiBase` 管理 reactive 队列 + 挂载生命周期；
 * 本文件只负责 notification 特定的 `push` 签名包装（title / description / placement）
 * 与公开 API 封装。
 */
import { createApp } from 'vue'
import ZNotification from './ZNotification.vue'
import type { ZNotificationItem } from './ZNotification.vue'
import {
  createToastApiBase,
  TOAST_SEMANTIC_COLOR,
  TOAST_SEMANTIC_ICON,
  type ToastSemanticType,
} from '../_internal/createToastApi'

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

export function createNotificationApi(opts: CreateNotificationApiOptions = {}): ZNotificationApi {
  const base = createToastApiBase<ZNotificationItem>({
    hostAttr: 'data-zui-notification-host',
    createVueApp: (items, onClose) =>
      createApp(ZNotification, {
        items,
        placement: opts.placement ?? 'top-right',
        onClose,
      }),
    appendTo: opts.appendTo,
  })

  function push(
    type: ToastSemanticType,
    title: string,
    description?: string,
    duration?: number,
  ): ZNotificationItem['id'] {
    return base.push(id => {
      const item: ZNotificationItem = {
        id,
        title,
        color: TOAST_SEMANTIC_COLOR[type],
        icon: TOAST_SEMANTIC_ICON[type],
        loading: type === 'loading',
      }
      if (description !== undefined) item.description = description
      if (duration !== undefined) item.duration = duration
      return item
    })
  }

  return {
    info: (t, d, dur) => push('info', t, d, dur),
    success: (t, d, dur) => push('success', t, d, dur),
    warning: (t, d, dur) => push('warning', t, d, dur),
    error: (t, d, dur) => push('danger', t, d, dur),
    loading: (t, d, dur) => push('loading', t, d, dur ?? 0),
    close: base.close,
    destroyAll: base.destroyAll,
  }
}
