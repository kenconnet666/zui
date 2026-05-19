import { computed, inject, ref, type ComputedRef, type Ref } from 'vue'
import type { ComponentTokenOverrides, ComponentTokenRegistry } from '@kenconnet666/zui-core'
import { Z_OVERRIDES_KEY } from './keys'

/**
 * `useZComponentTokens()` —— 取当前层级 inject 的 ComponentTokenOverrides。
 *
 * 配合 `withComponentTokens(theme, derivers, overrides.value)` 把用户覆盖喂给组件。
 */
export function useZComponentTokens(): Ref<ComponentTokenOverrides> {
  const injected = inject(Z_OVERRIDES_KEY, null)
  if (injected) return injected
  // 树外：返回稳定空 ref，避免下游 `.value` 触空
  return ref<ComponentTokenOverrides>({})
}

/**
 * `useZComponentTokenSlice(name)` —— 只订阅某个组件 namespace 的 override。
 *
 * @example
 * const buttonOverride = useZComponentTokenSlice('button')
 * // buttonOverride.value → Partial<ComponentTokenRegistry['button']> | undefined
 */
export function useZComponentTokenSlice<C extends keyof ComponentTokenRegistry>(
  name: C,
): ComputedRef<ComponentTokenOverrides[C]> {
  const all = useZComponentTokens()
  return computed(() => all.value[name])
}
