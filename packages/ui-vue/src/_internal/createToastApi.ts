/**
 * `createToastApiBase` —— message / notification 工厂的共享生命周期底层。
 *
 * 两个工厂（createMessageApi / createNotificationApi）几乎逐行重复：
 *   - `nextId` 计数器
 *   - `reactive<TItem[]>([])` 队列
 *   - `ensureMounted()` —— createElement + setAttribute + appendChild + createApp + mount
 *   - `close(id)` —— findIndex + splice
 *   - `destroyAll()` —— splice + unmount + removeChild
 *
 * 本模块把这些提取成一个泛型工厂，各工厂只需提供：
 *   - `hostAttr`   — 挂载容器的 data-* 属性名（用于 DOM 识别 / 测试查询）
 *   - `createVueApp(items, onClose)` — 构造 Vue App 实例的函数
 *   - `appendTo`  — 可选，挂载目标节点（默认 `document.body`）
 *
 * 同时导出两个工厂共用的语义 color / icon 映射，避免重复定义。
 */
import {
  createApp,
  getCurrentInstance,
  inject,
  markRaw,
  reactive,
  ref,
  type App,
  type Component,
} from 'vue'
import type { Chain } from '@kenconnet666/zui-core'
import { BuiltinIcons } from '../gene/icons'
import type { ZuiSchema } from '../provider/theme'
import { zuiLight } from '../provider/theme'
import { Z_THEME_KEY, Z_LOCALE_KEY, Z_DATE_KEY } from '../provider/keys'

// ─── 共享语义映射 ────────────────────────────────────────────────────────────

/** 两个工厂都使用相同的 5 种语义类型。 */
export type ToastSemanticType = 'info' | 'success' | 'warning' | 'danger' | 'loading'

/**
 * 语义类型 → color chain factory。
 * `loading` 复用 `_info` 颜色。
 */
export const TOAST_SEMANTIC_COLOR: Record<
  ToastSemanticType,
  (c: Chain<ZuiSchema>['color']) => void
> = {
  info: c => {
    c._info
  },
  success: c => {
    c._success
  },
  warning: c => {
    c._warning
  },
  danger: c => {
    c._danger
  },
  loading: c => {
    c._info
  },
}

/** 语义类型 → BuiltinIcon Component。 */
// markRaw:icon component 会存进 reactive(items),不标记则被 Vue reactive 代理,
// 触发 "Component was made a reactive object" 警告。markRaw 让其保持原始 component。
export const TOAST_SEMANTIC_ICON: Record<ToastSemanticType, Component> = {
  info: markRaw(BuiltinIcons.info),
  success: markRaw(BuiltinIcons.success),
  warning: markRaw(BuiltinIcons.warning),
  danger: markRaw(BuiltinIcons.error),
  loading: markRaw(BuiltinIcons.refresh),
}

// ─── 共享生命周期底层 ─────────────────────────────────────────────────────────

/** `createToastApiBase` 的配置选项。 */
export interface ToastApiBaseOptions<TItem extends { id: string | number }> {
  /**
   * 挂载容器元素上设置的 data-* 属性名，例如 `'data-zui-message-host'`。
   * 同时用于 DOM 查询（测试 / afterEach 清理）。
   */
  hostAttr: string
  /**
   * 构造 Vue App 实例的工厂函数。
   * 接收响应式 items 数组和 onClose 回调，返回已配置好的 App（未 mount）。
   */
  createVueApp: (items: TItem[], onClose: (id: TItem['id']) => void) => App<Element>
  /** 挂载目标节点，默认 `document.body`。 */
  appendTo?: HTMLElement | undefined
}

/** `createToastApiBase` 返回的底层 API。 */
export interface ToastApiBase<TItem extends { id: string | number }> {
  /** 当前 reactive items 数组（供上层工厂读取）。 */
  readonly items: TItem[]
  /** 保证 Vue App 已挂载（幂等）。 */
  ensureMounted: () => void
  /**
   * 将一条 item 推入队列（并调用 ensureMounted）。
   *
   * 接受一个 `(id: number) => TItem` 工厂——由底层分配自增 id 后传入，
   * 上层无需预填占位符。返回该条目的 id。
   */
  push: (factory: (id: number) => TItem) => TItem['id']
  /** 按 id 移除某条 item。 */
  close: (id: TItem['id']) => void
  /** 清空所有 item 并卸载容器。 */
  destroyAll: () => void
}

/** 模块级自增 id 计数器（跨实例唯一，与原实现行为一致）。 */
let nextId = 0

/**
 * 创建 Toast 类 API 的共享生命周期底层。
 *
 * @example
 * ```ts
 * const base = createToastApiBase({
 *   hostAttr: 'data-zui-message-host',
 *   createVueApp: (items, onClose) =>
 *     createApp(ZMessage, { messages: items, onClose }),
 *   appendTo: opts.appendTo,
 * })
 * // 推入一条 item，id 由底层分配：
 * const id = base.push(id => ({ id, content, color, icon, loading }))
 * ```
 */
export function createToastApiBase<TItem extends { id: string | number }>(
  options: ToastApiBaseOptions<TItem>,
): ToastApiBase<TItem> {
  const items = reactive<TItem[]>([]) as TItem[]
  let app: App<Element> | null = null
  let host: HTMLDivElement | null = null

  // 命令式 toast 用独立 createApp 挂到 body,脱离 <ZBox> provider 树。
  // 在工厂调用处(通常组件 setup 内)捕获当前 theme/locale/date 注入独立 app,
  // 使 toast 跟随主题切换 + 不触发 useZTheme 回落警告;setup 外调用则 theme 兜底 zuiLight。
  const inSetup = !!getCurrentInstance()
  const theme = (inSetup ? inject(Z_THEME_KEY, null) : null) ?? ref(zuiLight.resolve())
  const locale = inSetup ? inject(Z_LOCALE_KEY, null) : null
  const date = inSetup ? inject(Z_DATE_KEY, null) : null

  function ensureMounted(): void {
    if (app || typeof document === 'undefined') return
    host = document.createElement('div')
    host.setAttribute(options.hostAttr, '')
    ;(options.appendTo ?? document.body).appendChild(host)
    app = options.createVueApp(items, close)
    app.provide(Z_THEME_KEY, theme)
    if (locale) app.provide(Z_LOCALE_KEY, locale)
    if (date) app.provide(Z_DATE_KEY, date)
    app.mount(host)
  }

  function push(factory: (id: number) => TItem): TItem['id'] {
    ensureMounted()
    const id = ++nextId
    const item = factory(id)
    items.push(item)
    return item.id
  }

  function close(id: TItem['id']): void {
    const idx = items.findIndex(m => m.id === id)
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

  return { items, ensureMounted, push, close, destroyAll }
}
