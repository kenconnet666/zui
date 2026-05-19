# React 接入 `@kenconnet666/zui-core`

> 库本身**框架无关**，React 集成由用户拼装。下面是 30 行级 provider/hook 实现。
>
> 关键点：`Theme` 是普通类；`Chain` 每次渲染都建一个新实例（开销可忽略，emotion 内部按内容
> hash 复用 className），用 `useMemo` 加缓存即可。

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
import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { mergeTheme, type DeepPartial, type ResolvedTheme } from '@kenconnet666/zui-core'
import { defaultTheme, type MySchema } from './mySchema'

const ThemeCtx = createContext<ResolvedTheme<MySchema>>(defaultTheme.resolve())

export function ZThemeProvider({
  theme,
  children,
}: {
  theme?: DeepPartial<MySchema>
  children: ReactNode
}) {
  const parent = useContext(ThemeCtx)
  const merged = useMemo(() => (theme ? mergeTheme(parent, theme) : parent), [parent, theme])
  return <ThemeCtx.Provider value={merged}>{children}</ThemeCtx.Provider>
}

export function useTheme() {
  return useContext(ThemeCtx)
}
```

## 3. `useIcss` hook

```tsx
// hooks/useIcss.ts
import { useMemo } from 'react'
import { Chain, toClassName } from '@kenconnet666/zui-core'
import { useTheme } from '../theme/ZThemeProvider'
import type { MySchema } from '../theme/mySchema'

export function useIcss(factory: (s: Chain<MySchema>) => void, deps: unknown[] = []): string {
  const theme = useTheme()
  return useMemo(() => {
    const c = new Chain<MySchema>(theme)
    factory(c)
    return toClassName(c)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, ...deps])
}
```

## 4. 组件使用

```tsx
// MyButton.tsx
import { useIcss } from '../hooks/useIcss'

export function MyButton({ children }: { children: React.ReactNode }) {
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
  return <button className={cls}>{children}</button>
}
```

## 5. App 顶层挂 Provider

```tsx
import { useState, useMemo } from 'react'
import { ZThemeProvider } from './theme/ZThemeProvider'
import { MyButton } from './MyButton'

export function App() {
  const [dark, setDark] = useState(false)
  const themeOverride = useMemo(
    () => (dark ? { color: { primary: '#60a5fa' } } : undefined),
    [dark],
  )
  return (
    <ZThemeProvider theme={themeOverride}>
      <button onClick={() => setDark((d) => !d)}>Toggle dark</button>
      <MyButton>Click me</MyButton>
    </ZThemeProvider>
  )
}
```

---

## 性能 / 缓存提示

- 每次 render 重建 `Chain` 开销极小（~μs 级），emotion 内部按内容 hash 复用 className
- `useIcss` 用 `useMemo` 把 className 锁到 theme 变化时才重算
- props 派生的样式：把 props 作为 `useMemo` 的 deps 透传给 `useIcss(factory, [size, variant])`

## SSR

React SSR + emotion 推荐用 `@emotion/server` 的 `renderStylesToString`；core 0.3.0 计划提供
`createIcssInstance(emotion)` 工厂统一封装 SSR 实例隔离。
