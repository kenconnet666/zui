# Vue 3 接入 `@kenconnet666/zui-core`

> 库本身**框架无关**，Vue 集成完全由用户拼装。下面是一个最小、可复制的 30 行级 provider/hook 实现。
>
> 关键点：`Theme` 是普通类，无需特殊适配；`Chain` 在每次构建样式时实例化；用 `computed` 包住
> `toClassName(chain)` 即可让 className 在主题切换时响应式更新。

---

## 1. 定义你的 schema 和默认 theme

```ts
// src/theme/mySchema.ts
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

## 2. Provider + 上下文

```ts
// src/theme/themeContext.ts
import { inject, provide, ref, type InjectionKey, type Ref } from 'vue'
import { type ResolvedTheme } from '@kenconnet666/zui-core'
import { defaultTheme, type MySchema } from './mySchema'

const KEY: InjectionKey<Ref<ResolvedTheme<MySchema>>> = Symbol('zui-theme')

/** 全局默认 —— 没套 ZThemeProvider 时也能用。 */
const globalTheme = ref<ResolvedTheme<MySchema>>(defaultTheme.resolve())

export function getThemeRef() {
  return inject(KEY, globalTheme)
}

export function provideTheme(theme: Ref<ResolvedTheme<MySchema>>) {
  provide(KEY, theme)
}

/** 顶层切换默认主题（e.g. dark mode toggle）。 */
export function setGlobalTheme(theme: ResolvedTheme<MySchema>) {
  globalTheme.value = theme
}
```

```vue
<!-- src/theme/ZThemeProvider.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { mergeTheme, type DeepPartial } from '@kenconnet666/zui-core'
import { getThemeRef, provideTheme } from './themeContext'
import type { MySchema } from './mySchema'

const props = defineProps<{ theme?: DeepPartial<MySchema> }>()
const parent = getThemeRef()
const merged = computed(() =>
  props.theme ? mergeTheme(parent.value, props.theme) : parent.value,
)
provideTheme(merged)
</script>
<template><slot /></template>
```

## 3. `useIcss` —— 在组件里写样式

```ts
// src/composables/useIcss.ts
import { computed, type ComputedRef } from 'vue'
import { Chain, toClassName } from '@kenconnet666/zui-core'
import { getThemeRef } from '@/theme/themeContext'
import type { MySchema } from '@/theme/mySchema'

export function useIcss(factory: (s: Chain<MySchema>) => void): ComputedRef<string> {
  const themeRef = getThemeRef()
  return computed(() => {
    const c = new Chain<MySchema>(themeRef.value)
    factory(c)
    return toClassName(c)
  })
}
```

## 4. 组件使用

```vue
<!-- MyButton.vue -->
<script setup lang="ts">
import { useIcss } from '@/composables/useIcss'

const cls = useIcss(s => {
  s.color.white
  s.backgroundColor._primary
  s.padding.px(12)
  s.borderRadius._md
  s.fontWeight._bold
  s._hover(h => { h.backgroundColor._primary.alpha(85) })
  s._focusVisible(f => {
    f.outlineColor._primary
    f.outlineStyle('solid')
    f.outlineWidth.px(2)
  })
})
</script>
<template>
  <button :class="cls"><slot /></button>
</template>
```

## 5. 在 App.vue 切换主题

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const dark = ref(false)
const themeOverride = computed(() =>
  dark.value ? { color: { primary: '#60a5fa' } } : undefined,
)
</script>
<template>
  <ZThemeProvider :theme="themeOverride">
    <button @click="dark = !dark">Toggle dark</button>
    <MyButton>Click me</MyButton>
  </ZThemeProvider>
</template>
```

---

## 性能 / 缓存提示

- `useIcss` 用 `computed` 包住 chain 构建，**只在依赖变化时重算 className**
- emotion 内部按 CSS 内容 hash，相同样式只注入一次
- 高频组件可在 `defineComponent` 顶层一次性建好 chain 并 `markRaw`

## SSR

`@emotion/css` 默认实例不支持 critical CSS extract。SSR 场景请：

1. 用 `createInstance({ key, container })` 创建独立 emotion 实例
2. 把 chain 改成消费该实例的 css —— 0.3.0 计划提供 `createIcssInstance(emotion)` 工厂统一封装。
