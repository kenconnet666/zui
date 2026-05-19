---
'@kenconnet666/zui-core': patch
---

Batch 5 — edge case 测试集中补强（仅测试）

新增 `tests/edge.spec.ts` 33 个测试，集中覆盖已知陷阱与边界条件，防止回归：

- function token 求值顺序 / 跨 category 引用 / 环 / 缺失 category cast 兜底
- `resolveTheme` `Object.freeze` immutable 验证
- blur key `'2xl'` / `'3xl'` 非合法 ident 访问（`theme.blur['2xl']`、`Chain._blur('2xl')`、`_blur('_2xl')`、未知 token 透传）
- proxy bind receiver — `_when` / `_apply` / `_unless` 内 `fn(this)` 仍是 proxy
- carrier 缓存命中（连续访问引用相同 / 跨实例不复用 / `_carriers` Map 大小）
- alpha clamp 边界（< 0 / > 100 / 0 / 100）
- 保留属性名（schema 起名 `label` 不破坏 Chain）
- `icss` 接受 Theme / ResolvedTheme 两种形式
- 空 schema / 空 partial 不抛
- `Chain.toString()` 多次调用按 emotion content hash 等价
- `_nest` try/finally 还原 _node（fn 抛错后 chain 仍可用）/ 同名 selector 合并 / 空 fn 不留空 selector

零代码改动。共 248 → 281 测试。
