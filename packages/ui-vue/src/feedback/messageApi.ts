/**
 * `createMessageApi` —— Toast 工厂模式入口。
 *
 * 业务方一般在 app 入口调一次,拿到 `messageApi`,在任意位置调
 * `messageApi.success('保存成功')` / `.error('出错了')` 弹消息。
 *
 * 内部:`createApp` 临时实例渲染 `<ZMessage :messages>` + 维护 reactive `messages` 数组。
 *
 * **生命周期**:
 * - 第一次调 `createMessageApi()` 即挂载到 `<body>`
 * - 不传 `appendTo`,默认 `document.body`
 * - 主题:目前用 `zuiLight` 兜底(脱离 `<ZBox>` 注入树。后续 phase 接 `themeRef` 参数)
 */
import { createApp, reactive, type App } from 'vue'
import ZMessage from './ZMessage.vue'
import type { ZMessageItem, ZMessageType } from './ZMessage.vue'

/** message 工厂返回的 API 对象。 */
export interface ZMessageApi {
  info: (content: string, duration?: number) => ZMessageItem['id']
  success: (content: string, duration?: number) => ZMessageItem['id']
  warning: (content: string, duration?: number) => ZMessageItem['id']
  error: (content: string, duration?: number) => ZMessageItem['id']
  loading: (content: string, duration?: number) => ZMessageItem['id']
  /** 关闭某条 message。 */
  close: (id: ZMessageItem['id']) => void
  /** 清空所有 message + 卸载容器。 */
  destroyAll: () => void
}

export interface CreateMessageApiOptions {
  /** Teleport 容器(默认 `document.body`)。 */
  appendTo?: HTMLElement
}

let nextId = 0

/**
 * 创建 message API。多次调用会创建多个独立实例(容器隔离),通常 app 内只调一次。
 */
export function createMessageApi(opts: CreateMessageApiOptions = {}): ZMessageApi {
  const messages = reactive<ZMessageItem[]>([])
  let app: App<Element> | null = null
  let host: HTMLDivElement | null = null

  function ensureMounted(): void {
    if (app) return
    if (typeof document === 'undefined') return
    host = document.createElement('div')
    host.setAttribute('data-zui-message-host', '')
    ;(opts.appendTo ?? document.body).appendChild(host)
    app = createApp(ZMessage, {
      messages,
      onClose: (id: ZMessageItem['id']) => close(id),
    })
    app.mount(host)
  }

  function push(type: ZMessageType, content: string, duration?: number): ZMessageItem['id'] {
    ensureMounted()
    const id = ++nextId
    const item: ZMessageItem = { id, type, content }
    if (duration !== undefined) item.duration = duration
    messages.push(item)
    return id
  }

  function close(id: ZMessageItem['id']): void {
    const idx = messages.findIndex((m) => m.id === id)
    if (idx >= 0) messages.splice(idx, 1)
  }

  function destroyAll(): void {
    messages.splice(0, messages.length)
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
    info: (content, duration) => push('info', content, duration),
    success: (content, duration) => push('success', content, duration),
    warning: (content, duration) => push('warning', content, duration),
    error: (content, duration) => push('danger', content, duration),
    loading: (content, duration) => push('loading', content, duration ?? 0),
    close,
    destroyAll,
  }
}
