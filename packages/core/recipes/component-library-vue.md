# 用 zui-core 构建 Vue 组件库（含 ConfigProvider 向下覆盖）

> 完整示例：组件库作者用 `defineVariants` 定义 Button；用户在自己 app 里用 `ConfigProvider`
> 多层向下覆盖：**外层换主题色 → 内层 5 档大小用自己的**。
>
> 关键 API：`defineVariants` + `extendVariants` + `provide/inject` + `computed`。

---

## 一、组件库视角（@yourcompany/ui-vue）

### 1.1 导出 base button variants

```ts
// src/Button/variants.ts
import { defineVariants, type VariantPropsOf } from '@kenconnet666/zui-core'
import type { ResolvedTheme } from '@kenconnet666/zui-core'
import type { MySchema } from '@/theme/schema'

/**
 * Button 的 base variants 工厂。
 *
 * 导出为**函数**而非常量：让用户的 ConfigProvider 在主题切换时重新调用，
 * 拿到新主题下的 className（emotion 自动按内容 hash 复用相同 CSS）。
 */
export function createBaseButtonVariants(theme: ResolvedTheme<MySchema>) {
  return defineVariants(theme, {
    base: s => {
      s.borderRadius._md
      s.fontWeight._bold
      s.cursor.pointer
      s.transitionProperty('all')
      s.transitionDuration._fast
      s._focusVisible(f => {
        f.outlineColor._primary
        f.outlineStyle('solid')
        f.outlineWidth.px(2)
        f.outlineOffset.px(2)
      })
    },
    variants: {
      intent: {
        primary: s => { s.backgroundColor._primary; s.color.white },
        danger:  s => { s.backgroundColor._danger;  s.color.white },
        ghost:   s => { s.color._primary; s.backgroundColor.transparent },
      },
      // ★ 组件库内置 5 档大小
      size: {
        sm:   s => { s.padding.px(4);  s.fontSize._sm },
        md:   s => { s.padding.px(8);  s.fontSize._md },
        lg:   s => { s.padding.px(12); s.fontSize._lg },
        xl:   s => { s.padding.px(16); s.fontSize._xl },
        '2xl': s => { s.padding.px(20); s.fontSize._xl },
      },
      disabled: {
        true: s => { s.opacity._50; s.cursor.notAllowed; s.pointerEvents('none') },
        false: () => {},
      },
    },
    defaultVariants: { intent: 'primary', size: 'md', disabled: false },
  })
}

/** ButtonProps 类型从工厂推断 —— 用户不需要重复声明。 */
export type ButtonProps = VariantPropsOf<ReturnType<typeof createBaseButtonVariants>>
```

### 1.2 定义"variants override"injection key

组件库的 ConfigProvider 允许用户传 override，需要约定 inject key：

```ts
// src/config/injections.ts
import type { InjectionKey, Ref } from 'vue'
import type { ResolvedTheme, DefineVariantsConfig } from '@kenconnet666/zui-core'
import type { MySchema } from '@/theme/schema'

/** 主题（已存在）。 */
export const THEME_KEY: InjectionKey<Ref<ResolvedTheme<MySchema>>> =
  Symbol('zui-theme')

/**
 * Button variants override：用户在 ConfigProvider 给出"想覆盖的子集"。
 *
 * Partial：用户只写自己想改的（如 size.sm），其它走 base。
 */
export type ButtonOverride = Partial<{
  base: DefineVariantsConfig<MySchema, never>['base']
  variants: {
    intent?: Record<string, (s: never) => void>
    size?: Record<string, (s: never) => void>
    disabled?: Record<string, (s: never) => void>
  }
}>

export const BUTTON_OVERRIDE_KEY: InjectionKey<Ref<ButtonOverride | undefined>> =
  Symbol('zui-button-override')
```

### 1.3 Button 组件

```vue
<!-- src/Button/Button.vue -->
<script setup lang="ts">
import { computed, inject } from 'vue'
import { extendVariants } from '@kenconnet666/zui-core'
import { createBaseButtonVariants, type ButtonProps } from './variants'
import { THEME_KEY, BUTTON_OVERRIDE_KEY } from '../config/injections'

const props = defineProps<ButtonProps>()

const theme = inject(THEME_KEY)
if (!theme) throw new Error('Button 必须用 <ConfigProvider> 包裹')

const override = inject(BUTTON_OVERRIDE_KEY, null)

/**
 * variants 工厂随主题与用户 override 响应式重建。
 *
 * - 主题切换 → theme.value 变 → 重建工厂 → 出新 className
 * - 用户 ConfigProvider 嵌套 / props 变 → override.value 变 → 重建工厂
 */
const variants = computed(() => {
  const base = createBaseButtonVariants(theme.value)
  if (!override?.value) return base
  // 用户 override 走 extendVariants：base 五档全跑，用户写的 size.sm 后跑覆盖
  return extendVariants(theme.value, base, override.value as never)
})

const cls = computed(() => variants.value(props))
</script>

<template>
  <button :class="cls" :disabled="props.disabled === true">
    <slot />
  </button>
</template>
```

---

## 二、`ConfigProvider`：theme + variants 一站式注入

```vue
<!-- src/config/ConfigProvider.vue -->
<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import {
  defaultLight,
  defaultDark,
  mergeTheme,
  type DeepPartial,
} from '@kenconnet666/zui-core'
import {
  THEME_KEY,
  BUTTON_OVERRIDE_KEY,
  type ButtonOverride,
} from './injections'
import type { MySchema } from '@/theme/schema'

interface Props {
  /** 颜色模式（light/dark/auto）。 */
  mode?: 'light' | 'dark'
  /** 主题 token 层覆盖（color/spacing/radius/...）。 */
  theme?: DeepPartial<MySchema>
  /** Button 组件 variants 覆盖（局部 — 你写啥覆啥）。 */
  button?: ButtonOverride
  // 后续：input?, card?, dialog?, ...
}

const props = defineProps<Props>()

// 嵌套继承：取父 provider 的 theme 与各组件 override，本层叠加
const parentTheme = inject(THEME_KEY, null)
const parentButtonOverride = inject(BUTTON_OVERRIDE_KEY, null)

// ── 主题（token 层） ─────────────────────────────────────────
const finalTheme = computed(() => {
  // 1. 起点：父 theme（嵌套）或 base mode（顶层）
  let t = parentTheme?.value ?? (
    props.mode === 'dark' ? defaultDark.resolve() : defaultLight.resolve()
  )
  // 2. 本层 theme override（如：换品牌主色）
  if (props.theme) t = mergeTheme(t, props.theme as never) as never
  return t
})

// ── Button variants override（嵌套合并） ─────────────────────
/**
 * 嵌套语义：父 provider 已经声明 button.size.sm；本层再给 button.size.md。
 * 期望：合并后两个都有，组件用 base + 父 + 本 三层叠加。
 *
 * 简化实现：本层有 button 时 deep merge 父 + 本；只取最后一层也可（取决于策略）。
 * 这里走"深合并"（嵌套 ConfigProvider 局部覆盖叠加）。
 */
const finalButtonOverride = computed<ButtonOverride | undefined>(() => {
  if (!props.button && !parentButtonOverride?.value) return undefined
  if (!props.button) return parentButtonOverride!.value
  if (!parentButtonOverride?.value) return props.button
  return mergeButtonOverrides(parentButtonOverride.value, props.button)
})

function mergeButtonOverrides(parent: ButtonOverride, child: ButtonOverride): ButtonOverride {
  return {
    base: child.base ?? parent.base,
    variants: {
      intent: { ...parent.variants?.intent, ...child.variants?.intent },
      size:   { ...parent.variants?.size,   ...child.variants?.size },
      disabled: { ...parent.variants?.disabled, ...child.variants?.disabled },
    },
  }
}

provide(THEME_KEY, finalTheme as never)
provide(BUTTON_OVERRIDE_KEY, finalButtonOverride)
</script>

<template>
  <slot />
</template>
```

---

## 三、用户视角：单层 + 嵌套向下覆盖

### 3.1 单层 ConfigProvider（最常见）

```vue
<!-- App.vue -->
<script setup>
import { ConfigProvider, Button } from '@yourcompany/ui-vue'
</script>

<template>
  <ConfigProvider
    mode="light"
    :theme="{ color: { primary: '#7c3aed' } }"
    :button="{
      variants: {
        size: {
          sm:   s => { s.padding.px(6);  s.fontSize._md },
          md:   s => { s.padding.px(10); s.fontSize._lg },
          lg:   s => { s.padding.px(14); s.fontSize._xl },
          xl:   s => { s.padding.px(18); s.fontSize._xl },
          '2xl': s => { s.padding.px(22); s.fontSize._xl },
        },
      },
    }"
  >
    <Button size="sm">小按钮（用户的 sm = padding 6）</Button>
    <Button size="lg">大按钮（用户的 lg = padding 14）</Button>
    <Button intent="danger" size="md">混合 variant</Button>
  </ConfigProvider>
</template>
```

**效果**：
- 主题主色变 `#7c3aed`（紫色）
- 5 档大小全部走用户的（padding 6 / 10 / 14 / 18 / 22）
- `intent` / `disabled` 这两个 variant 没 override → 仍走组件库默认

### 3.2 嵌套 ConfigProvider（局部子树覆盖）

```vue
<template>
  <!-- 顶层：换品牌主色 + 全局 sm 档大小 -->
  <ConfigProvider
    :theme="{ color: { primary: '#brand' } }"
    :button="{ variants: { size: { sm: s => { s.padding.px(6); s.fontSize._md } } } }"
  >
    <Page>
      <Header>
        <Button size="sm">顶部 sm（用户定义的 padding 6）</Button>
      </Header>

      <Main>
        <!-- 子树：局部再覆盖 md 档；sm 沿用上层；其它 lg/xl/2xl 沿用组件库 -->
        <ConfigProvider
          :button="{ variants: { size: { md: s => { s.padding.px(12); s.borderRadius._xl } } } }"
        >
          <Button size="sm">仍用顶层 sm（padding 6）</Button>
          <Button size="md">本层 md（padding 12 + 大圆角）</Button>
          <Button size="lg">组件库默认 lg（padding 12）</Button>
        </ConfigProvider>
      </Main>
    </Page>
  </ConfigProvider>
</template>
```

### 3.3 主题切换 + variants override 共存

```vue
<script setup>
import { ref, computed } from 'vue'

const dark = ref(false)
const compact = ref(false)

const theme = computed(() => dark.value
  ? { color: { primary: '#60a5fa' } }
  : { color: { primary: '#2563eb' } },
)

const buttonOverride = computed(() => compact.value
  ? {
      variants: {
        size: {
          sm:   s => { s.padding.px(2); s.fontSize._xs },
          md:   s => { s.padding.px(4); s.fontSize._sm },
          lg:   s => { s.padding.px(6); s.fontSize._md },
          xl:   s => { s.padding.px(8); s.fontSize._lg },
          '2xl': s => { s.padding.px(10); s.fontSize._xl },
        },
      },
    }
  : undefined,
)
</script>

<template>
  <ConfigProvider :mode="dark ? 'dark' : 'light'" :theme="theme" :button="buttonOverride">
    <label>
      <input type="checkbox" v-model="dark" /> Dark mode
    </label>
    <label>
      <input type="checkbox" v-model="compact" /> Compact button sizes
    </label>
    <Button size="md">Button</Button>
  </ConfigProvider>
</template>
```

切换 `dark` / `compact` 时 Vue computed 链：

```
dark / compact 变化
  → theme.value / buttonOverride.value 变
  → ConfigProvider 的 finalTheme / finalButtonOverride 重算
  → 子 Button 的 variants computed 重算
  → cls 重算 → 新 className → 浏览器重绘
```

emotion 自动按内容 hash 缓存 CSS，相同样式不重复注入。

---

## 四、关键设计点解释

### 4.1 为什么 base variants 工厂是函数而非常量？

```ts
// ❌ 常量形式
export const baseButton = defineVariants(theme, {...})   // 主题切换时不会重建

// ✅ 函数形式
export function createBaseButton(theme) {
  return defineVariants(theme, {...})
}
```

工厂形式让 ConfigProvider 在 `theme.value` 变化时**重新调用**，生成新 theme 下的 className。emotion 按内容 hash，相同 CSS 不重复注入，性能无损。

### 4.2 为什么用 `extendVariants` 而非"重新 defineVariants"？

```ts
// ❌ 用户在自己 app 里写整套 variants（重复样板）
defineVariants(theme, { variants: { intent: {...}, size: {...}, disabled: {...} } })

// ✅ extendVariants：只写要改的，其它自动继承组件库 base
extendVariants(theme, baseButton, { variants: { size: { sm: s => {...} } } })
```

`extendVariants` 内部用 `composeVariants(parent, child)` 让两个工厂都跑：
- parent 跑完整 5 档；child 只跑自己声明的（如只 `sm`）
- emotion 输出**两个 className**拼接：CSS cascade 让后者（child）覆盖前者同样 property
- child 没写的 variant key（如 `md` / `lg`）只有 parent 跑过 → 沿用组件库

### 4.3 嵌套合并的取舍

```ts
// 当前实现：浅合并 variants.size
mergeButtonOverrides(parent, child) {
  variants: { size: { ...parent.size, ...child.size } }   // child 覆盖同 key
}
```

| 场景 | 父 override | 子 override | 结果 |
|---|---|---|---|
| 父全 5 档 / 子改 md | sm/md/lg/xl/2xl | md | sm/lg/xl/2xl 用父，md 用子 |
| 父改 sm / 子改 lg | sm | lg | sm 用父，lg 用子，其它走组件库 base |
| 子完全替换父 | sm/md | sm/md/lg/xl/2xl 全 | 子的 5 档全 |

---

## 五、TypeScript 类型推断完整版

```ts
import type { VariantPropsOf } from '@kenconnet666/zui-core'

// 组件库
export type ButtonProps = VariantPropsOf<ReturnType<typeof createBaseButtonVariants>>
// = {
//   intent?: 'primary' | 'danger' | 'ghost'
//   size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
//   disabled?: boolean | 'true' | 'false'
// }

// 用户写组件 props 时直接复用
import type { ButtonProps } from '@yourcompany/ui-vue'

interface MyComponentProps {
  buttonIntent?: ButtonProps['intent']
  buttonSize?: ButtonProps['size']
}
```

---

## 六、SSR 提示

如果用 Nuxt / 任何 SSR：

```ts
// ConfigProvider.vue（SSR 版）
import { createIcssInstance, defaultLight } from '@kenconnet666/zui-core'
import { createInstance } from '@emotion/css/create-instance'

// 服务端 / 客户端各自一个 emotion instance（避免污染）
const emotion = createInstance({ key: 'myapp' })
const { icss, chain, presetAnimations } = createIcssInstance(emotion)

// 注入这个 instance（替代直接用 @emotion/css 默认 instance）
provide(EMOTION_INSTANCE_KEY, { icss, chain, presetAnimations })
```

详见 [`createIcssInstance`](../README.md#ssr--多-emotion-实例) 章节。

---

## 七、完整目录结构（参考）

```
@yourcompany/ui-vue/
├── src/
│   ├── theme/
│   │   └── schema.ts                # 用户自定义 MySchema
│   ├── config/
│   │   ├── ConfigProvider.vue
│   │   └── injections.ts
│   ├── Button/
│   │   ├── Button.vue
│   │   ├── variants.ts              # createBaseButtonVariants
│   │   └── index.ts
│   ├── Input/...                    # 同结构
│   └── index.ts                     # 桶式导出
└── package.json
```

---

## 八、回顾：实现"按钮 5 档大小用户向下覆盖"全链路

```
组件库（createBaseButtonVariants）          ← 声明 5 档默认
       ↓ export
用户 ConfigProvider props.button.variants.size  ← 用户的 5 档（部分或全部）
       ↓ provide
Button 组件 inject + computed                ← reactive 重算
       ↓ extendVariants(theme, base, override)
emotion 出两个 className（base + override）   ← CSS cascade 后者覆盖前者
       ↓
最终 DOM className                          ← 用户的 5 档样式生效，未 override 的走默认
```

**核心**：`extendVariants` 让"部分覆盖"成为可能 —— 用户只写关心的 size，其它继承组件库。
