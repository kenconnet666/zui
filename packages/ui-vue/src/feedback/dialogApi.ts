/**
 * `createDialogApi` —— 命令式对话框工厂(对齐 `createMessageApi` / `createNotificationApi`)。
 *
 * 业务方在 app 入口调一次拿到 `dialogApi`,在任意位置(含非组件上下文)以 **Promise** 方式弹确认/提示框:
 *
 * ```ts
 * const dialog = createDialogApi()
 * const ok = await dialog.confirm({ title: '删除?', content: '此操作不可恢复' })
 * if (ok) doDelete()
 *
 * await dialog.success({ title: '已保存' })
 * ```
 *
 * **生命周期**:首次调用任意方法时懒挂载一个 host 到 `appendTo`(默认 `document.body`);
 * 内部渲染 `ZModal`,关闭动画结束后移除条目。脱离 `<ZBox>` 注入树时主题走 `useZTheme` 的 `zuiLight` 兜底
 * (与 message / notification 一致)。
 *
 * **关闭语义**:点确定 → resolve(`true`);点取消 / 点遮罩 / ESC / 右上角关闭 → resolve(`false`)。
 * `info/success/warning/error` 只有一个"确定"按钮,任何关闭方式均 resolve(`true`)。
 */
import { createApp, h, nextTick, reactive, type App, type VNode } from 'vue'
import ZModal from './ZModal.vue'
import { ZButton } from '../gene'

/** 对话框类型:`confirm` 双按钮(确定/取消);其余为单"确定"按钮的提示框。 */
export type ZDialogKind = 'confirm' | 'info' | 'success' | 'warning' | 'error'

/** 单次对话框选项。 */
export interface ZDialogOptions {
  /** 标题。 */
  title?: string
  /** 正文文本(纯字符串;需富文本走组件式 `ZModal`)。 */
  content?: string
  /** 确定按钮文字,默认 `'确定'`。 */
  okText?: string
  /** 取消按钮文字(仅 `confirm`),默认 `'取消'`。 */
  cancelText?: string
  /** 弹窗宽度 —— px 倍数(1 单位 = 16px),默认 `26`(= 416px)。 */
  width?: number
}

interface DialogItem extends ZDialogOptions {
  id: number
  visible: boolean
  kind: ZDialogKind
  settle: (ok: boolean) => void
}

/** `createDialogApi` 返回的 API。所有方法返回 `Promise<boolean>`(确定=true,取消/关闭=false)。 */
export interface ZDialogApi {
  /** 二次确认框(确定 / 取消双按钮)。 */
  confirm: (options?: ZDialogOptions) => Promise<boolean>
  /** 信息提示框(单"确定")。 */
  info: (options?: ZDialogOptions) => Promise<boolean>
  /** 成功提示框。 */
  success: (options?: ZDialogOptions) => Promise<boolean>
  /** 警告提示框。 */
  warning: (options?: ZDialogOptions) => Promise<boolean>
  /** 错误提示框。 */
  error: (options?: ZDialogOptions) => Promise<boolean>
  /** 立即关闭所有对话框并卸载容器。 */
  destroyAll: () => void
}

/** `createDialogApi` 配置。 */
export interface CreateDialogApiOptions {
  /** host 挂载目标,默认 `document.body`。 */
  appendTo?: HTMLElement
}

let nextId = 0

/** 创建命令式对话框 API。通常 app 内只调一次。 */
export function createDialogApi(opts: CreateDialogApiOptions = {}): ZDialogApi {
  const items = reactive<DialogItem[]>([]) as DialogItem[]
  let app: App<Element> | null = null
  let host: HTMLDivElement | null = null

  function ensureMounted(): void {
    if (app || typeof document === 'undefined') return
    host = document.createElement('div')
    host.setAttribute('data-zui-dialog-host', '')
    ;(opts.appendTo ?? document.body).appendChild(host)
    app = createApp({
      render: () =>
        items.map(item =>
          h(
            ZModal,
            {
              key: item.id,
              visible: item.visible,
              title: item.title ?? '',
              width: item.width ?? 26,
              'onUpdate:visible': (v: boolean) => {
                if (!v) item.settle(item.kind === 'confirm' ? false : true)
              },
              onClose: () => item.settle(item.kind === 'confirm' ? false : true),
            },
            {
              default: () => item.content ?? '',
              foot: (): VNode[] => {
                const btns: VNode[] = []
                if (item.kind === 'confirm') {
                  btns.push(
                    h(ZButton, { variant: 'ghost', onClick: () => item.settle(false) }, () =>
                      item.cancelText ?? '取消',
                    ),
                  )
                }
                btns.push(
                  h(ZButton, { onClick: () => item.settle(true) }, () => item.okText ?? '确定'),
                )
                return btns
              },
            },
          ),
        ),
    })
    app.mount(host)
  }

  function open(kind: ZDialogKind, options: ZDialogOptions): Promise<boolean> {
    ensureMounted()
    return new Promise<boolean>(resolve => {
      const id = ++nextId
      let done = false
      const item: DialogItem = {
        ...options,
        id,
        kind,
        visible: false,
        settle(ok: boolean) {
          if (done) return
          done = true
          item.visible = false
          resolve(ok)
          // 等关闭动画结束再移除条目
          window.setTimeout(() => {
            const idx = items.findIndex(it => it.id === id)
            if (idx >= 0) items.splice(idx, 1)
          }, 320)
        },
      }
      items.push(item)
      // 下一帧置 visible 触发 ZModal 打开动画
      void nextTick(() => {
        const cur = items.find(it => it.id === id)
        if (cur) cur.visible = true
      })
    })
  }

  return {
    confirm: (options = {}) => open('confirm', options),
    info: (options = {}) => open('info', options),
    success: (options = {}) => open('success', options),
    warning: (options = {}) => open('warning', options),
    error: (options = {}) => open('error', options),
    destroyAll() {
      items.splice(0, items.length)
      if (app) {
        app.unmount()
        app = null
      }
      if (host && host.parentNode) {
        host.parentNode.removeChild(host)
        host = null
      }
    },
  }
}
