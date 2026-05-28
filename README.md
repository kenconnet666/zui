# zui

> **框架无关**的 CSS-in-JS 工具库 + Vue 3 强类型组件库 monorepo。

[![core](https://img.shields.io/npm/v/@kenconnet666/zui-core.svg?label=zui-core)](https://www.npmjs.com/package/@kenconnet666/zui-core)
[![ui-vue](https://img.shields.io/npm/v/@kenconnet666/zui-vue.svg?label=zui-vue)](https://www.npmjs.com/package/@kenconnet666/zui-vue)

## 一句话

把 `@emotion/css` 包成 **强类型 chain DSL** + 拿来盖一个 80+ 组件的 Vue 3 库。

```ts
icss(theme, (s) => {
  s.color._primary
  s.fontSize._large
  s.padding.iem(1)
  s._hover((h) => { h.color._primary.darken(15) })
})
```

`s` 是 `Chain<TSchema>` 实例,~857 个 CSS 属性都挂在它上面,带 csstype JSDoc + MDN 链接 + 主题 token 补全。

## 包

```
zui/
├── packages/
│   ├── core/       @kenconnet666/zui-core      —— 框架无关 chain DSL
│   ├── ui-vue/     @kenconnet666/zui-vue       —— Vue 3 集成 + 80+ 组件
│   └── docs/       @kenconnet666/docs          —— SPA 文档站点(不发布)
├── .claude/
│   ├── skills/zui.md            —— 完整 API + 范式 + 验证铁律
│   ├── zui-vue-roadmap.md       —— 组件库实现路线图
│   └── decisions/               —— 历史架构决策
└── scripts/
```

| 包 | 状态 | 简介 |
|---|---|---|
| **[`@kenconnet666/zui-core`](./packages/core)** | ✅ 已发布(0.7.x) | 框架无关核心。`Theme<TSchema>` + `Chain<TSchema>`,87+ 嵌套选择器、11 个 color modifier、defineVariants/defineParts |
| **[`@kenconnet666/zui-vue`](./packages/ui-vue)** | 🚧 开发中(0.1.x) | Vue 3 组件库:`<ZBox>` provider + 80+ 组件 + `zuiLight/Dark` 主题 + i18n |
| **[`@kenconnet666/docs`](./packages/docs)** | 🌐 文档站点 | SPA(vite + vue-router),每个组件 demo + API 表 |

## 环境

- Node `^20.19.0 || >=22.12.0`
- pnpm `>=9.0.0`
- TypeScript ≥ 5(`moduleResolution: "Bundler"`)

## 快速开始

```bash
# 装依赖
pnpm install

# 跑所有包测试(core 566 + ui-vue 540+)
pnpm test

# 类型检查
pnpm type-check

# Lint
pnpm lint

# 构建 core + ui-vue
pnpm build

# 启动文档站点
pnpm --filter @kenconnet666/docs dev
```

## 用法速览

### 选 1:只要 CSS-in-JS DSL(任何框架)

```bash
pnpm add @kenconnet666/zui-core @emotion/css
```

```ts
import { icss, paletteLight } from '@kenconnet666/zui-core'

const cls = icss(paletteLight, (s) => {
  s.color.white
  s.backgroundColor._blue
  s.padding.px(12)
})
```

### 选 2:Vue 3 + 完整组件库

```bash
pnpm add @kenconnet666/zui-vue
# 还需装 peerDeps,详见 packages/ui-vue/README.md
```

```vue
<script setup lang="ts">
import { ZBox, zuiLight, ZButton, ZForm, ZFormItem, ZInput } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZBox :theme="zuiLight">
    <ZButton variant="filled">Click me</ZButton>
  </ZBox>
</template>
```

完整入门见 [`packages/ui-vue/README.md`](./packages/ui-vue/README.md)。

## 路线图

**已完成**:
- ✅ zui-core 全套(556+ spec)
- ✅ zui-vue Phase α(21 个 P0 组件)
- ✅ zui-vue Phase β(高频补全 30+ 组件)
- ✅ zui-vue Phase γ(锦上花 13 个组件)
- ✅ 响应式 vw 单位 + 虚拟列表全栈接入
- ✅ Material 主题(M2 700 色 + M3 elevation / radius)

**进行中 / 待办**:
- 📚 docs 站点 demo 多样化
- 🎯 Phase δ(VirtualList / 富文本 / 企业 DataGrid / Schema-driven Form)按需开

详见 [实现路线图](./.claude/zui-vue-roadmap.md)。

## 文档

- [📘 docs 站点](./packages/docs/) —— 本地 `pnpm --filter @kenconnet666/docs dev`
- [📕 zui-core API](./packages/core/README.md)
- [📗 zui-vue API + Quickstart](./packages/ui-vue/README.md)
- [📙 skill 知识库](./.claude/skills/zui.md) —— Claude / Cursor 接手指南

## 设计哲学

1. **强类型优先** —— 一切补全在 IDE 里跑,而不是文档里
2. **statement-only** —— 每行 setter 是独立语句,禁止跨属性 fluent chaining(IDE 表面干净)
3. **统一逃生口** —— 任何强类型组件都有 `:css="(s) => ..."` 兜底,不被 schema 框死
4. **a11y 内建** —— ARIA / `:focus-visible` / ESC 栈 / focus trap 是默认,不是可选
5. **响应式 vw 单位** —— `0.8333vw = 16px @ 1920`,16:9 全屏等比缩放

## License

MIT © kenconnet666
