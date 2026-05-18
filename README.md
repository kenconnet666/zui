# zui

> 框架无关的 CSS-in-JS 工具库（核心包 `@kenconnet666/zui-core`）+ Vue 集成（`@kenconnet666/zui-vue`）+ VitePress 文档站。

设计目标与详细计划见 [`Plan.md`](./Plan.md)。

## 仓库结构

```
zui/
├── packages/
│   ├── core/             # @kenconnet666/zui-core — 框架无关 CSS DSL（Phase 1-2 主战场）
│   ├── ui-vue/           # @kenconnet666/zui-vue  — Vue 组件 + Provider（Phase 3）
│   └── docs/             # @kenconnet666/zui-docs — VitePress 文档站（私有）
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

## 环境要求

- Node `^20.19.0 || >=22.12.0`
- pnpm `>=9.0.0`

## 快速开始

```bash
pnpm install

# 启动文档站（默认 http://localhost:5173）
pnpm dev

# 构建全部包
pnpm build

# 单独构建 core
pnpm build:core

# 类型检查 / 测试
pnpm type-check
pnpm test

# Lint / 格式化
pnpm lint
pnpm format
```

## 开发节奏

按 [`Plan.md` 第八节](./Plan.md) 推进 `core`（Phase 1: 4-5 天到 0.1.0）。
开发期建议两个终端：

```bash
pnpm --filter @kenconnet666/zui-core dev   # core watch
pnpm --filter @kenconnet666/zui-docs dev   # docs HMR
```
