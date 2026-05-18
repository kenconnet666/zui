# @kenconnet666/zui-core

> 框架无关的 CSS-in-JS 工具库，基于 `@emotion/css`。

## 特性

- **`class Theme<T>`**：继承或实例化定义主题，自动获得强类型字段访问。
- **`class Chain<T>`**：链式 builder，CSS 属性 + 内建嵌套 + 增强 carrier 全按 schema 推断类型。
- **四态访问**：
  - `s.color('red')` — 函数调用，csstype 严格
  - `s.color._primary` — 主题 token（`_` 前缀）
  - `s.color.white` — CSS keyword（无前缀）
  - `s.padding.px(16)` — unit 方法
- **`icss(theme, factory)`** 一行 shortcut。
- **不依赖任何框架** — Vue / React / Svelte / Solid 用户拼 30-50 行 Provider 自己接入。

参见仓库根的 [`Plan.md`](../../Plan.md)。

## 用法（最简）

```ts
import { Chain, defaultLight, icss } from '@kenconnet666/zui-core'

const cls = icss(defaultLight, (s) => {
  s.color._primary
  s.padding.px(16)
  s._hover((h) => h.opacity(0.9))
})
```

## 框架集成

- [Vue](./recipes/vue.md)
- [React](./recipes/react.md)
