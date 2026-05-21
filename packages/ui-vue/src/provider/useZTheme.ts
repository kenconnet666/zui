import { inject, ref, type Ref } from 'vue'
import type { ResolvedTheme } from '@kenconnet666/zui-core'
import { zuiLight } from '../theme'
import type { ZuiSchema } from '../theme'
import { Z_THEME_KEY } from './keys'

/**
 * `useZTheme()` —— 取当前层级 inject 的 ResolvedTheme。
 *
 * - 在 `<ZConfigProvider>` 子树内调用 → 返回 provider 维护的 `Ref<ResolvedTheme<ZuiSchema>>`。
 * - 树外调用 → 返回 fallback `zuiLight.resolve()`，并在 dev 警告。
 *
 * 默认 schema 是 `ZuiSchema`（含 11 语义色 + 完整 5 阶 scale）。用户工程要扩自家 brand：
 * 定义 `interface MySchema extends ZuiSchema { ... }`，构造 `Theme<MySchema>`，
 * 在消费侧用 `useZTheme() as Ref<ResolvedTheme<MySchema>>` 拿到强类型 chain access。
 */
export function useZTheme(): Ref<ResolvedTheme<ZuiSchema>> {
  const injected = inject(Z_THEME_KEY, null)
  if (injected) return injected as Ref<ResolvedTheme<ZuiSchema>>
  if (typeof process === 'undefined' || process.env?.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(
      '[zui-vue/useZTheme] 调用点不在 <ZConfigProvider> 子树内，回落 zuiLight。' +
        '\n  请在根组件外包一层 <ZConfigProvider :theme="zuiLight">。',
    )
  }
  return ref(zuiLight.resolve()) as unknown as Ref<ResolvedTheme<ZuiSchema>>
}
