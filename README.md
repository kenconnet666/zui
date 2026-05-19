# zui

> 框架无关的 CSS-in-JS 工具库 monorepo。

- **[`@kenconnet666/zui-core`](./packages/core)** — 框架无关核心（已发 npm）。基于 `@emotion/css`，`class Chain<TSchema>` 用 declaration merging 把 ~857 个 CSS 属性挂到强类型 builder 上。
- **[`@kenconnet666/zui-vue`](./packages/ui-vue)** — Vue 3 组件库 + `ZConfigProvider` 嵌套覆盖（开发中）。

## 环境

- Node `^20.19.0 || >=22.12.0`
- pnpm `>=9.0.0`

## 快速开始

```bash
pnpm install
pnpm test           # 跑所有包测试
pnpm build          # 构建 core + ui-vue
pnpm type-check
pnpm lint
pnpm format
```

## License

MIT
