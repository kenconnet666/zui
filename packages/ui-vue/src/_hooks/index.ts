/**
 * `_hooks/` —— ui-vue 包内部使用的 composable。
 *
 * **设计**(L13):优先包装 VueUse,不够再 wrap floating-ui / Teleport,最后自写。
 * - `useZId` —— 包装 Vue 3.5+ 内置 `useId()`,加 `zui-` 前缀
 * - `usePortal` —— 封装 `<Teleport>`,默认 target body
 * - `useEscapeStack` —— 栈式 ESC 监听(多层浮层只关最顶层)
 * - `usePopper` —— 包装 `@floating-ui/vue` 的 `useFloating`,内置 offset+flip+shift 三件套
 * - `useRipple` —— **自写**(VueUse 无对应),Material 风波纹
 *
 * **可见性**:这些 hooks 主要供 ui-vue 自身组件用;`src/index.ts` 通过 `export * from './_hooks'`
 * 顺带透出,业务方可用但不是核心 API surface,API 变更不算 BREAKING(标 internal)。
 */
export { useZId } from './useZId'
export { usePortal, ZPortal } from './usePortal'
export { useEscapeStack } from './useEscapeStack'
export { usePopper, type UsePopperOptions } from './usePopper'
export { useRipple, type UseRippleOptions } from './useRipple'
