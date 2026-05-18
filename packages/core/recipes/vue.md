# Recipe: Vue 集成

> 30 行代码自己拼，库不打包这层。

```ts
// === themeContext.ts ===
import { ref, computed, inject, provide, type InjectionKey, type Ref } from 'vue'
import { mergeTheme, type ResolvedTheme, type DeepPartial } from '@kenconnet666/zui-core'
import type { MySchema } from './schema'

const KEY: InjectionKey<Ref<ResolvedTheme<MySchema>>> = Symbol('theme')
const globalTheme = ref<ResolvedTheme<MySchema>>(/* 用户的默认 theme */)

export function setTheme(theme: ResolvedTheme<MySchema>) {
  globalTheme.value = theme
}
```

```vue
<!-- === ZThemeProvider.vue === -->
<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import type { DeepPartial } from '@kenconnet666/zui-core'
import { mergeTheme } from '@kenconnet666/zui-core'
import { KEY, globalTheme } from './themeContext'

const props = defineProps<{ theme: DeepPartial<MySchema> }>()
const parent = inject(KEY, null)
const merged = computed(() => mergeTheme(parent?.value ?? globalTheme.value, props.theme))
provide(KEY, merged)
</script>
<template><slot /></template>
```

```ts
// === useIcss.ts ===
import { computed, inject } from 'vue'
import { Chain, toClassName } from '@kenconnet666/zui-core'
import { KEY, globalTheme } from './themeContext'

export function useIcss() {
  const themeRef = inject(KEY) ?? globalTheme
  return (factory: (s: Chain<MySchema>) => void) =>
    computed(() => {
      const c = new Chain(themeRef.value)
      factory(c)
      return toClassName(c)
    })
}
```
