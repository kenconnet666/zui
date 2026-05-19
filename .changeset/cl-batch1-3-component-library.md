---
'@kenconnet666/zui-core': minor
---

CL Batch 1-3 — 组件库基础设施完整化

为构建组件库（Button / Input / Dialog / Tabs / Select / Toast 等）补完一组核心 API。

### CL Batch 1：组件库核心 5 项

- **`defineParts`** 多 slot variants（参考 tailwind-variants slots）—— 给 Dialog / Select / Tabs 等多内部元素组件用。每个 slot 独立工厂、独立 LRU 缓存。
- **`composeVariants(...factories)`** 多变体复合 + **`extendVariants(parent, child)`** 继承——让作者复用通用 interactive / focus 变体。
- **`VariantPropsOf<typeof factory>`** / **`VariantPropsOfParts<typeof parts>`** 类型推断 ——自动从工厂推 component props 类型。
- **`defineMixin`** 可重用样式片段（focus-ring / elevation / surface 等）。
- **`Chain._state(props, mapping)`** 状态化样式——把 if 链替换成声明式 mapping。

### CL Batch 2：响应式 + props 统一 + boolean variants

- **`applyResponsive(chain, value, apply)`** 响应式 prop 解析 —— `{ base: 4, md: 8, lg: 16 }` 自动 `_media` 嵌套。
- **`applyStyleProps(theme, props)`** 新签名（旧 `(chain, props)` 保留）—— 与 `icss` / `defineVariants` 参数顺序一致；同时支持响应式 prop。
- **`ResponsiveStyleProps<T>`** 类型；**`ResponsiveValue<T>` / `ResponsiveObject<T>` / `isResponsiveValue`** 工具。
- **defineVariants boolean / number variants**：`variants: { disabled: { true: ..., false: ... } }` 配合 `f({ disabled: true })`；数字 `f({ elevation: 2 })` 自动转 `'2'` 字符串 key。
- 类型层 **`BoolFriendly<K>`**：`'true' | 'false'` 暴露成 `boolean`；纯数字字面量暴露成 `number`。

### CL Batch 3：集成 + componentTokensFor + 文档

- **`componentTokensFor(component, theme)`** runtime helper —— 拿到组件 namespace 下完整 token map（供 icon color 派生 / DOM 注入等）。
- 新增 `tests/cl-batch3-integration.spec.ts` 24 个集成测试覆盖：完整 Button 组件（27 种 variant 组合）/ 6-slot Dialog / 主题切换 light↔dark / SSR 多 instance 隔离 / applyStyleProps 端到端 / 预设动画用例。
- README 新增「构建组件库（0.5.0+）」章节，含 7 个 API 完整用例（defineVariants / defineParts / composeVariants / defineMixin / `_state` / applyResponsive / componentTokensFor / SSR）。

### 新增导出

- `defineMixin`
- `composeVariants` / `extendVariants` / `VariantPropsOf`
- `defineParts` + 8 个相关类型 / `VariantPropsOfParts`
- `applyResponsive` / `isResponsiveValue` / `ResponsiveValue` / `ResponsiveObject` / `ResponsiveStyleProps`
- `componentTokensFor`
- `Chain._state` 内建方法

### 数字

- 测试 474 → **549**（+75）
- 套件 26 → **29**（+3）
- build 72.05 kB → **75.24 kB**（+3.19 kB / +0.79 kB gzip）
