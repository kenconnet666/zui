# SolidJS 接入 `@kenconnet666/zui-core`

> 库本身**框架无关**，Solid 集成由用户拼装。下面是 30 行级 provider/hook 实现。
>
> 关键点：`Theme` 是普通类；用 `createContext` + `useContext` 传主题；`createMemo`
> 把 className 锁到 signal 变化时才重算。Solid 的 fine-grained 响应天然适配本库。

---

## 1. 定义 schema 和默认 theme

```ts
// theme/mySchema.ts
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

## 2. ThemeProvider

```tsx
// theme/ZThemeProvider.tsx
import {
  createContext,
  createMemo,
  useContext,
  type Accessor,
  type JSX,
  type ParentProps,
} from 'solid-js'
import { mergeTheme, type DeepPartial, type ResolvedTheme } from '@kenconnet666/zui-core'
import { defaultTheme, type MySchema } from './mySchema'

const ThemeCtx = createContext<Accessor<ResolvedTheme<MySchema>>>(() => defaultTheme.resolve())

export function ZThemeProvider(props: ParentProps<{ theme?: DeepPartial<MySchema> }>): JSX.Element {
  const parent = useContext(ThemeCtx)
  const merged = createMemo(() => (props.theme ? mergeTheme(parent(), props.theme) : parent()))
  return <ThemeCtx.Provider value={merged}>{props.children}</ThemeCtx.Provider>
}

export function useTheme(): Accessor<ResolvedTheme<MySchema>> {
  return useContext(ThemeCtx)
}
```

## 3. `useIcss` hook

```tsx
// hooks/useIcss.ts
import { createMemo, type Accessor } from 'solid-js'
import { Chain, toClassName } from '@kenconnet666/zui-core'
import { useTheme } from '../theme/ZThemeProvider'
import type { MySchema } from '../theme/mySchema'

export function useIcss(factory: (s: Chain<MySchema>) => void): Accessor<string> {
  const theme = useTheme()
  return createMemo(() => {
    const c = new Chain<MySchema>(theme())
    factory(c)
    return toClassName(c)
  })
}
```

## 4. 组件使用

```tsx
// MyButton.tsx
import type { JSX } from 'solid-js'
import { useIcss } from '../hooks/useIcss'

export function MyButton(props: { children: JSX.Element }) {
  const cls = useIcss((s) => {
    s.color.white
    s.backgroundColor._primary
    s.padding.px(12)
    s.borderRadius._md
    s.fontWeight._bold
    s._hover((h) => {
      h.backgroundColor._primary.alpha(85)
    })
    s._focusVisible((f) => {
      f.outlineColor._primary
      f.outlineStyle('solid')
      f.outlineWidth.px(2)
    })
  })
  return <button class={cls()}>{props.children}</button>
}
```

## 5. App 顶层挂 Provider

```tsx
import { createSignal, createMemo } from 'solid-js'
import { ZThemeProvider } from './theme/ZThemeProvider'
import { MyButton } from './MyButton'

export function App() {
  const [dark, setDark] = createSignal(false)
  const themeOverride = createMemo(() => (dark() ? { color: { primary: '#60a5fa' } } : undefined))
  return (
    <ZThemeProvider theme={themeOverride()}>
      <button onClick={() => setDark((d) => !d)}>Toggle dark</button>
      <MyButton>Click me</MyButton>
    </ZThemeProvider>
  )
}
```

---

## 性能 / 缓存提示

- Solid 的 `createMemo` 是细粒度的，theme 不变 → cls 不重算
- emotion 内部按内容 hash 复用 className
- props 派生样式：让 `useIcss` 接受 `Accessor` 参数，在 createMemo 内部调用，自动追踪

## SSR

Solid SSR + emotion 需要用 `@emotion/server`；core 0.3.0 计划提供
`createIcssInstance(emotion)` 统一封装。
