# @kenconnet666/docs

> zui 项目文档与组件演示站点。**不发布到 npm**。

SPA(`vite` + `vue-router` + `vue 3`),每个组件都有独立 page,内含若干 demo 和 API 表(Props / Events / Slots / Expose)。

## 启动

```bash
# 从 monorepo 根
pnpm install
pnpm --filter @kenconnet666/docs dev      # 默认 http://localhost:5174
```

Vite 配置直接走 workspace symlink 到 `packages/core/src` 与 `packages/ui-vue/src` —— **改组件源码即时 HMR,无需先 build**。

## 构建

```bash
pnpm --filter @kenconnet666/docs build    # 产出到 packages/docs/dist
pnpm --filter @kenconnet666/docs preview  # 本地 preview 产物
```

## 目录约定

```
src/
├── pages/                     ← 顶层指南页(快速开始 / 主题 / iem / zui-core 等)
├── gene/                      ← 通用组件 demo
│   ├── ZButton/                  ← 单组件多 demo 子目录
│   │   ├── VariantsDemo.vue
│   │   ├── SizeDemo.vue
│   │   └── ...
│   ├── ZButtonPage.vue        ← 组件页(import demo + 渲染 API 表)
│   └── ZIconPage.vue
├── layout/                    ← 布局组件
├── input/                     ← 输入组件
├── display/                   ← 展示组件
├── feedback/                  ← 反馈组件
├── navigation/                ← 导航组件
├── tool/                      ← 工具组件
├── components/
│   ├── DocLayout.vue          ← 整页骨架(左 nav + 右 toc + 中间内容)
│   ├── DocToc.vue             ← 右侧目录树
│   ├── DemoBlock.vue          ← 单 demo 容器(组件 + 源码切换)
│   └── ApiTable.vue           ← API 表(Props / Events / Slots / Expose)
├── config/
│   ├── nav.ts                 ← 左侧导航数据
│   └── router.ts              ← 路由表
├── App.vue
└── main.ts
```

## 编写新 demo

### 1. 在组件分类目录建 demo 子目录

```
src/gene/ZButton/
├── VariantsDemo.vue
├── SizeDemo.vue
└── ColorDemo.vue
```

每个 `*.vue` 是一个独立可运行的小示例,**演示代码 = 实际文件源码 1:1**,不剥 import、不删空块。

### 2. 在 ZxxxPage.vue 里 import + 渲染

```vue
<script setup lang="ts">
import { ZTitle, ZParagraph } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import VariantsDemo from './ZButton/VariantsDemo.vue'
import VariantsDemoSource from './ZButton/VariantsDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZButton 按钮</ZTitle>
    <ZParagraph>按钮组件...</ZParagraph>

    <ZTitle :level="2">5 种 variant</ZTitle>
    <DemoBlock title="filled / outlined / text / ghost / link" :source="VariantsDemoSource">
      <template #desc>说明文字(可选)。</template>
      <VariantsDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />
  </section>
</template>
```

### 3. 注册到 nav.ts + router.ts

```ts
// nav.ts
{ key: 'button', label: 'ZButton 按钮', route: '/gene/button' },

// router.ts
{ path: '/gene/button', component: () => import('../gene/ZButtonPage.vue') },
```

## API 表标准列

| 表     | 列                             | 说明                              |
| ------ | ------------------------------ | --------------------------------- |
| Props  | `name / type / default / desc` | name/type/default 用 `mono: true` |
| Events | `name / payload / desc`        | name/payload 用 mono              |
| Slots  | `name / scope / desc`          | 无 scope 时省略 scope 列          |
| Expose | `name / type / desc`           | name/type 用 mono                 |

## DemoBlock 用法

```vue
<DemoBlock
  title="基础用法"
  :source="BasicDemoSource"
  :default-expanded="false"   <!-- 默认折叠源码 -->
  lang="vue"                  <!-- 默认 vue -->
>
  <template #desc>说明文字,可富文本。</template>
  <BasicDemo />               <!-- 实时渲染 -->
</DemoBlock>
```

`:source` 用 Vite `?raw` 后缀 import 同名 demo:`import BasicSource from './X/BasicDemo.vue?raw'`。

## 与组件库的依赖

```
docs ──直接 alias 到──> ui-vue/src
                        ui-vue ──依赖──> core/src
```

vite alias 指向 src 目录(见 `vite.config.ts`),修改 `ui-vue` / `core` 源码立即 HMR。

## 部署

输出 `dist/` 是静态文件,放任意静态托管(GitHub Pages / Vercel / nginx)即可。注意:**使用 hash 路由**(`createWebHashHistory`),URL 是 `#/path`,部署不需要服务端 rewrite。

## 相关链接

- [zui-core README](../core/README.md)
- [zui-vue README](../ui-vue/README.md)
- [实现路线图](../../.claude/zui-vue-roadmap.md)
- [完整 skill 知识库](../../.claude/skills/zui.md)
