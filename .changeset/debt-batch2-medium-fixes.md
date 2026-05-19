---
'@kenconnet666/zui-core': minor
---

Debt Batch 2 — 中等改进 6 项

### M5 `cx` 支持 tailwind / clsx 风多形态入参

```ts
cx('foo', false && 'bar', { active: true, disabled: false })   // 'foo active'
cx(['a', 'b', { c: cond }], 'd')                                // 嵌套递归
```

支持：string / number / falsy 跳过 / object `{ k: truthy }` / 数组嵌套。新增 `ClassInput` 类型导出。

### M4 `Theme` 构造对 function token 发 dev 警告

`Object.assign(this, schema)` 把 function token 挂到 instance 上 → 类型签名是 `string | number` 但运行时是 function。dev 模式现在 `console.warn` 提醒用户走 `theme.resolve()`。production 静默。**只警告一次**（防止多 token 时刷屏）。

### M7 `deepClone` JSDoc 文档化 undefined 跳过行为

JSDoc 现在明确：`undefined` 字段跳过（与 JS 一般约定一致），`null` 字段保留。

### M8 `color.ts` clamp NaN / Infinity 防御

`setAlpha(c, NaN)` 之前输出 `rgba(r,g,b,NaN)` 破坏 CSS。现在 `clamp01` 内 `if (!Number.isFinite(n)) return 0`，所有 modifier（darken / lighten / mix / saturate / desaturate）安全。

### L1 `Chain._node` / `_theme` / `_keymap` / `_carriers` / `_cssFn` 改 `readonly`

TypeScript 现在标记 `chain._node = {}` reassign 为错。**mutation（`chain._node.color = 'x'`）仍允许** —— escape hatch 保留。
`_nest()` 内部通过 cast 切换 `_node` 引用（集中此处，唯一已知 reassign 用法）。

### 类型层 R1 收尾：`LengthUnits` 接口补 18 个现代单位

接 Debt Batch 1 的 R1 修复（运行时 carrier），`types/carrier.ts` 的 `LengthUnits<TSelf>` 也补完 svw/svh/svmin/svmax/lvw/lvh/lvmin/lvmax/dvw/dvh/dvmin/dvmax/cqw/cqh/cqi/cqb/cqmin/cqmax 共 18 个新单位。**与 LENGTH_UNITS（34 个）严格对齐**。
类型层 + 运行时全闭环。

### L3 `applyStyleProps` 运行时测试补完

之前只有类型层测试，现在加 14 个运行时测试覆盖 alias 映射、token / keyword / 函数态、undefined 跳过、混合 props 等。

### 新增测试

39 个测试（共 363 → 402）。
