/**
 * `createMessageApi` —— Toast 工厂模式入口。
 *
 * 业务方一般在 app 入口调一次,拿到 `messageApi`,在任意位置调
 * `messageApi.success('保存成功')` / `.error('出错了')` 弹消息。
 *
 * 内部通过 `createToastApiBase` 管理 reactive 队列 + 挂载生命周期；
 * 本文件只负责 message 特定的 `push` 签名包装与公开 API 封装。
 *
 * **生命周期**:
 * - 第一次调用任意方法时懒挂载到 `appendTo`（默认 `document.body`）
 * - 主题:工厂调用处(组件 setup 内)自动继承当前 `<ZBox>` 的 theme/locale/date,
 *   命令式消息跟随主题切换;setup 外调用则 theme 兜底 `zuiLight`。
 */
import { createApp } from 'vue'
import ZMessage from './ZMessage.vue'
import type { ZMessageItem } from './ZMessage.vue'
import {
  createToastApiBase,
  TOAST_SEMANTIC_COLOR,
  TOAST_SEMANTIC_ICON,
  type ToastSemanticType,
} from '../_internal/createToastApi'

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

/**
 * 创建 message API。多次调用会创建多个独立实例(容器隔离),通常 app 内只调一次。
 */
export function createMessageApi(opts: CreateMessageApiOptions = {}): ZMessageApi {
  const base = createToastApiBase<ZMessageItem>({
    hostAttr: 'data-zui-message-host',
    createVueApp: (items, onClose) =>
      createApp(ZMessage, {
        messages: items,
        onClose,
      }),
    appendTo: opts.appendTo,
  })

  function push(type: ToastSemanticType, content: string, duration?: number): ZMessageItem['id'] {
    return base.push(id => {
      const item: ZMessageItem = {
        id,
        content,
        color: TOAST_SEMANTIC_COLOR[type],
        icon: TOAST_SEMANTIC_ICON[type],
        loading: type === 'loading',
      }
      if (duration !== undefined) item.duration = duration
      return item
    })
  }

  return {
    info: (content, duration) => push('info', content, duration),
    success: (content, duration) => push('success', content, duration),
    warning: (content, duration) => push('warning', content, duration),
    error: (content, duration) => push('danger', content, duration),
    loading: (content, duration) => push('loading', content, duration ?? 0),
    close: base.close,
    destroyAll: base.destroyAll,
  }
}
