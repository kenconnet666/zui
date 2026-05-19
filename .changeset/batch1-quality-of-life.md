---
'@kenconnet666/zui-core': minor
---

Batch 1 — 质量与调试体验改进（5 项）

- **B2** `Chain` Proxy 改用 prototype 自动扫描，新增内建方法无需同步白名单（修复历史易漏 bug）。继承 Chain 加自定义方法也能正确走 Proxy。
- **C2** `label()` 多次调用现在 join 成 `a.b.c` 而非互相覆盖；空字符串入参被忽略。
- **B5** 颜色 modifier (`darken` / `lighten` / `mix` / `saturate` / `desaturate`) 在原色含 alpha (rgba) 时保留原 alpha 输出 `rgba(...)`；不透明颜色仍输出 hex（兼容）。
- **B4** `mergeTheme` 在 dev 模式下扫描 partial，遇 function token 时 `console.warn` 警示（生产构建静默）。
- **C10** `injectGlobal` 内存级去重（基于内容指纹），重复内容不再走 emotion serializer。新增 `_resetInjectGlobalCache()` 内部测试 helper。

新增 24 测试（共 198 / 174 → 198）。非破坏性。
