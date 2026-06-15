/**
 * 把 DOM 节点写入用户经 `sx.ref` 传入的 ref。
 *
 * 复合组件子节点常需把用户经 `sxXxx.ref` 传入的 ref 透传出去。`VNodeRef` 有三态：
 * string（模板 ref 名，运行时无需处理）/ function（回调 ref）/ Ref 对象。本 helper 统一处理
 * function 与 Ref 对象两种可写形式，替代各组件手抄的同款片段。
 *
 * **只处理 userRef** —— 组件内部 ref（可能不止一个，如 ZSelect 的 `rootRef` + `triggerRef`）
 * 由各组件在调用前自行赋值，本 helper 不碰，避免「单 internalRef」假设丢失额外引用。
 *
 * @param userRef 用户经 sx 传入的 ref（`extractSxAttrs(...).ref`），可能为 undefined
 * @param node    已转好的 DOM 节点（`HTMLElement | null`）
 *
 * @example
 * function bindMask(el: unknown): void {
 *   const node = (el as HTMLElement | null) ?? null
 *   rootRef.value = node
 *   applyUserRef(sxMaskAttrs.value.ref, node)
 * }
 */
export function applyUserRef(userRef: unknown, node: unknown): void {
  if (typeof userRef === 'function') {
    ;(userRef as (el: unknown, refs: Record<string, unknown>) => void)(node, {})
  } else if (userRef && typeof userRef === 'object' && 'value' in userRef) {
    ;(userRef as { value: unknown }).value = node
  }
}
