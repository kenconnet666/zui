import { inject, type Ref } from 'vue'
import { defaultLight, type ResolvedTheme, type ThemeSchema } from '@kenconnet666/zui-core'
import { ref } from 'vue'
import { Z_THEME_KEY } from './keys'

/**
 * `useZTheme()` —— 取当前层级 inject 的 ResolvedTheme。
 *
 * - 在 `<ZConfigProvider>` 子树内调用 → 返回 provider 维护的 `Ref<ResolvedTheme<S>>`。
 * - 树外调用 → 返回 fallback `defaultLight.resolve()`，并在 dev 警告。
 *
 * 泛型 `S` 由调用者声明（与挂载的 ConfigProvider 一致）；
 * 类型不强校验跨层 schema 一致性 —— 这是 Vue inject 的限制。
 */
export function useZTheme<S extends ThemeSchema = ThemeSchema>(): Ref<ResolvedTheme<S>> {
  const injected = inject(Z_THEME_KEY, null)
  if (injected) return injected as Ref<ResolvedTheme<S>>
  if (typeof process === 'undefined' || process.env?.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(
      '[zui-vue/useZTheme] 调用点不在 <ZConfigProvider> 子树内，回落 defaultLight。' +
        '\n  请在根组件外包一层 <ZConfigProvider :theme="myTheme">。',
    )
  }
  return ref(defaultLight.resolve()) as unknown as Ref<ResolvedTheme<S>>
}
