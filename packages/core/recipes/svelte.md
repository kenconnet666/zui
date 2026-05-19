# Svelte 5 接入 `@kenconnet666/zui-core`

> 库本身**框架无关**，Svelte 集成由用户拼装。下面是 Svelte 5（runes 模式）的 30 行级
> provider/composable 实现。
>
> 关键点：`Theme` 是普通类；用 `$state` 持有当前主题，`$derived` 派生 className；
> `getContext` / `setContext` 在组件树中传递主题引用。

---

## 1. 定义 schema 和默认 theme

```ts
// src/lib/theme/mySchema.ts
import { Theme, type ThemeSchema } from '@kenconnet666/zui-core'

export interface MySchema extends ThemeSchema {
  color: { primary: string; danger: string; brand: string }
  spacing: { xs: string; sm: string; md: string; lg: string }
  breakpoint: { md: string; lg: string }
}

export const defaultTheme = new Theme<MySchema>({
  color: { primary: '#2563eb', danger: '#dc2626', brand: '#7c3aed' },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
  breakpoint: { md: '768px', lg: '1024px' },
})
```

## 2. 上下文 + 全局 store

```ts
// src/lib/theme/themeContext.svelte.ts
import { getContext, setContext } from 'svelte'
import type { ResolvedTheme } from '@kenconnet666/zui-core'
import { defaultTheme, type MySchema } from './mySchema'

const KEY = Symbol('zui-theme')

/** 顶层全局主题（无 ZThemeProvider 时也能用）。 */
class ThemeStore {
  current = $state<ResolvedTheme<MySchema>>(defaultTheme.resolve())
}
export const globalTheme = new ThemeStore()

export function setThemeContext(store: ThemeStore) {
  setContext(KEY, store)
}

export function getThemeStore(): ThemeStore {
  return getContext<ThemeStore>(KEY) ?? globalTheme
}
```

## 3. ZThemeProvider 组件

```svelte
<!-- src/lib/theme/ZThemeProvider.svelte -->
<script lang="ts">
  import { mergeTheme, type DeepPartial } from '@kenconnet666/zui-core'
  import { getThemeStore, setThemeContext } from './themeContext.svelte'
  import type { MySchema } from './mySchema'

  let { theme, children } = $props<{
    theme?: DeepPartial<MySchema>
    children?: () => unknown
  }>()

  const parent = getThemeStore()

  // 派生当前主题（partial override）。每次 theme prop 变化都重算。
  const merged = $derived(theme ? mergeTheme(parent.current, theme) : parent.current)

  // 自己也建一个 store 暴露给子树。
  class ChildStore {
    current = $derived(merged)
  }
  setThemeContext(new ChildStore() as never)
</script>

{@render children?.()}
```

## 4. `useIcss` —— 在组件里写样式

```ts
// src/lib/composables/useIcss.svelte.ts
import { Chain, toClassName } from '@kenconnet666/zui-core'
import { getThemeStore } from '../theme/themeContext.svelte'
import type { MySchema } from '../theme/mySchema'

export function useIcss(factory: (s: Chain<MySchema>) => void) {
  const store = getThemeStore()
  // 返回 getter；调用方用 $derived 包装即可响应主题变化
  return () => {
    const c = new Chain<MySchema>(store.current)
    factory(c)
    return toClassName(c)
  }
}
```

## 5. 组件使用

```svelte
<!-- MyButton.svelte -->
<script lang="ts">
  import { useIcss } from '$lib/composables/useIcss.svelte'

  const getCls = useIcss(s => {
    s.color.white
    s.backgroundColor._primary
    s.padding.px(12)
    s.borderRadius._middle
    s.fontWeight._bold
    s._hover(h => { h.backgroundColor._primary.alpha(85) })
    s._focusVisible(f => {
      f.outlineColor._primary
      f.outlineStyle('solid')
      f.outlineWidth.px(2)
    })
  })
  const cls = $derived(getCls())
</script>

<button class={cls}><slot /></button>
```

## 6. 顶层 App 切换主题

```svelte
<!-- App.svelte -->
<script lang="ts">
  import ZThemeProvider from '$lib/theme/ZThemeProvider.svelte'
  import MyButton from './MyButton.svelte'

  let dark = $state(false)
  const themeOverride = $derived(dark ? { color: { primary: '#60a5fa' } } : undefined)
</script>

<ZThemeProvider theme={themeOverride}>
  <button onclick={() => dark = !dark}>Toggle dark</button>
  <MyButton>Click me</MyButton>
</ZThemeProvider>
```

---

## 性能 / 缓存提示

- `useIcss` 返回 getter，外部用 `$derived` 包一层让 Svelte runtime 自动追踪
- emotion 内部按 CSS 内容 hash 复用 className，相同样式只注入一次
- 高频组件：把 chain 构建提到 module scope（无主题依赖时）

## Svelte 4（非 runes）

如果还在用 Svelte 4，把 `$state` / `$derived` 换成 `writable` / `derived` store，其它逻辑等价；
recipe 思路一致。
