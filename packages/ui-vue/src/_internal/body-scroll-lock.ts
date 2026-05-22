/**
 * `_internal/body-scroll-lock` —— 多实例共享的 body 滚动锁。
 *
 * **问题**:Modal/Drawer/其他全屏遮罩都需要在打开时锁 body 滚动。多个实例同时打开时,
 * 各自保存 `document.body.style.overflow` 原值再覆盖,**关闭时会互相覆盖**导致滚动状态错乱。
 *
 * **方案**:模块级 instance set + 第一个 lock 时保存原值,最后一个 unlock 时还原。
 */
const lockedInstances = new Set<symbol>()
let originalOverflow = ''

/**
 * 注册一个 scroll lock 持有者。第一个调用者会保存当前 body overflow 并设为 hidden。
 *
 * 返回的 release 函数用于解除:最后一个 release 时恢复原值。
 */
export function lockBodyScroll(): () => void {
  if (typeof document === 'undefined') return () => {}
  const token = Symbol('zui:scroll-lock')
  if (lockedInstances.size === 0) {
    originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  lockedInstances.add(token)
  return () => {
    if (!lockedInstances.has(token)) return
    lockedInstances.delete(token)
    if (lockedInstances.size === 0) {
      document.body.style.overflow = originalOverflow
      originalOverflow = ''
    }
  }
}
