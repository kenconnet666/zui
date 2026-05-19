---
'@kenconnet666/zui-core': minor
---

Batch 4 — 4 个现代 CSS 4 helper

新增 4 个 Chain method，对齐 CSS 2024 实用方向：

- `_safeArea(side?, property?)` — iOS notch / home indicator / Android nav bar 留白。支持 4 单侧或 `'all'`，可写 padding / margin / inset。
- `_scrollSnap(opts)` — CSS Scroll Snap Level 1 简写：`type` + `strictness`（容器侧）和 `align` + `stop`（子项侧）。
- `_overscroll(behavior, axis?)` — `overscroll-behavior` / `-x` / `-y` / `-inline` / `-block`。常用于禁用页面下拉刷新。
- `_field(sizing)` — CSS Working Group 草案 `field-sizing`，让 `<input>` / `<textarea>` 跟随内容自适应。

跳过：实验性 `_anchor`（CSS Anchor Positioning），浏览器支持率低 + API 易变。

新增 24 测试（共 248 / 224 → 248）。
