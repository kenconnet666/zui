---
"@kenconnet666/zui-vue": minor
---

主题交互态 token 化 + 复用收口 + ZButton 精简

- **feat(theme)**: 新增 7 个交互态/层次叠层语义 token —— `bgHover` / `selectedBg` / `pressedBg`（hover / 选中 / 按下底色）+ `stripeBg` / `rowHoverBg` / `overlayMask` / `loadingOverlay`（斑马纹 / 数据行 hover / 遮罩 / 加载蒙层）。收口约 16 个组件中 33 处散落的 `.alpha()` 派生，交互态视觉可在主题层集中精调（改一个 token 全库统一）。
- **refactor(ui-vue)**: 复杂组件复用基础组件 —— ZNotification / ZUpload / ZInput / ZTreeSelect 的关闭/清空按钮、ZDynamicTags 添加按钮收口到 ZButton（ghost / dashed）。
- **BREAKING(ZButton)**: 移除 `text` variant（与 `ghost` 视觉重复，`ghost` 为其超集且传 `color` 时仍有 hover 反馈）。迁移：`variant="text"` → `variant="ghost"`。
