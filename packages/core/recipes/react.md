# Recipe: React 集成

> 30 行代码自己拼，库不打包这层。

```tsx
import { createContext, useContext, useMemo, type ReactNode } from 'react'
import {
  Chain,
  toClassName,
  mergeTheme,
  type ResolvedTheme,
  type DeepPartial,
} from '@kenconnet666/zui-core'
import type { MySchema } from './schema'

const ThemeCtx = createContext<ResolvedTheme<MySchema>>(/* 默认 theme */)

export function ZThemeProvider({
  theme,
  children,
}: {
  theme: DeepPartial<MySchema>
  children: ReactNode
}) {
  const parent = useContext(ThemeCtx)
  const merged = useMemo(() => mergeTheme(parent, theme), [parent, theme])
  return <ThemeCtx.Provider value={merged}>{children}</ThemeCtx.Provider>
}

export function useIcss(factory: (s: Chain<MySchema>) => void): string {
  const theme = useContext(ThemeCtx)
  return useMemo(() => {
    const c = new Chain(theme)
    factory(c)
    return toClassName(c)
  }, [theme, factory])
}
```
