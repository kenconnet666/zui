/**
 * `useZId` —— Vue 3.5+ 内置 `useId()` + zui 前缀,给组件实例生成 SSR-friendly 唯一 id。
 *
 * **用途**:复合组件内部需要给「子节点」关联 `aria-controls` / `aria-labelledby` /
 * `htmlFor` 等无障碍属性时,需要稳定的 id。直接用 `Math.random()` 会 SSR hydration 不一致;
 * 用 Vue 3.5 内置 `useId()` 保证服务端/客户端同步,前缀避免和宿主页面其它 id 冲突。
 *
 * @example
 * ```vue
 * <script setup>
 * const labelId = useZId()       // 'zui-v-1'
 * const inputId = useZId('input') // 'zui-v-1-input'(语义后缀)
 * </script>
 * <template>
 *   <label :id="labelId" :for="inputId">名称</label>
 *   <input :id="inputId" :aria-labelledby="labelId" />
 * </template>
 * ```
 */
import { useId } from 'vue'

/**
 * 生成形如 `'zui-{vueId}'` 或 `'zui-{vueId}-{suffix}'` 的唯一 id。
 *
 * @param suffix - 可选语义后缀(用于复合组件区分多个子节点 id)
 */
export function useZId(suffix?: string): string {
  const base = `zui-${useId()}`
  return suffix ? `${base}-${suffix}` : base
}
