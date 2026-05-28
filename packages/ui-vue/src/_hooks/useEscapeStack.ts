/**
 * `useEscapeStack` —— ESC 键栈式管理。
 *
 * **问题**:多层浮层(Modal 套 Popover、Modal 套 Drawer 等)同时监听 `Escape`,按一次只关最顶层。
 * 朴素的 `window.addEventListener('keydown')` 多个组件都触发 → 全部关闭,错。
 *
 * **方案**:全局维护一个 LIFO 栈,只 dispatch 给最顶层 enabled 的 handler。
 *
 * @example
 * ```ts
 * const open = ref(false)
 * useEscapeStack(() => (open.value = false), { enabled: open })
 * ```
 */
import { onScopeDispose, ref, watch, type Ref } from 'vue'

interface EscapeEntry {
  id: number
  onEscape: () => void
  enabled: Ref<boolean>
}

const stack: EscapeEntry[] = []
let listenerAttached = false
let entryIdCounter = 0

function handleGlobalEscape(e: KeyboardEvent): void {
  if (e.key !== 'Escape' && e.key !== 'Esc') return
  // 从栈顶往下找第一个 enabled 的 handler
  for (let i = stack.length - 1; i >= 0; i--) {
    const entry = stack[i]
    if (entry && entry.enabled.value) {
      e.stopPropagation()
      entry.onEscape()
      return
    }
  }
}

function attachListener(): void {
  if (listenerAttached || typeof window === 'undefined') return
  window.addEventListener('keydown', handleGlobalEscape, { capture: true })
  listenerAttached = true
}

function detachListener(): void {
  if (!listenerAttached || typeof window === 'undefined') return
  window.removeEventListener('keydown', handleGlobalEscape, { capture: true })
  listenerAttached = false
}

/**
 * 注册一个 Escape handler,组件销毁时自动 pop。
 *
 * @param onEscape - 触发回调
 * @param opts.enabled - 控制此 handler 是否生效的 ref;默认 `ref(true)`(始终生效)
 */
export function useEscapeStack(onEscape: () => void, opts: { enabled?: Ref<boolean> } = {}): void {
  const enabled = opts.enabled ?? ref(true)
  const entry: EscapeEntry = {
    id: ++entryIdCounter,
    onEscape,
    enabled,
  }

  stack.push(entry)
  attachListener()

  // 监听 enabled 变化,若全部 disabled 则 detach listener 节省资源
  watch(
    () => stack.some(e => e.enabled.value),
    anyEnabled => {
      if (anyEnabled) attachListener()
      else detachListener()
    },
    { flush: 'post' },
  )

  onScopeDispose(() => {
    const idx = stack.findIndex(e => e.id === entry.id)
    if (idx >= 0) stack.splice(idx, 1)
    if (stack.length === 0) detachListener()
  })
}
