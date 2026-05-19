---
'@kenconnet666/zui-core': patch
---

Batch 6 — 文档审计补强（仅文档）

- `README.md` 限制章节：
  - 新增 `:focus-visible` iOS Safari 14- 兼容性提示
  - 新增 schema function token 直接访问 vs `resolve()` 一致性警示
  - 新增 `mergeTheme` partial 字面量约定（0.4.0 起 dev 警告）
  - SSR 章节改为 "0.3.0 起提供 createIcssInstance(emotion)"
  - 测试数量更新到 17 套 / 281
  - 设计文档链接改为 `.claude/Plan.md` / `.claude/AGENT.md`
- `.claude/AGENT.md`：
  - §5.12 schema function token 一致性
  - §5.13 token / keyword 命中不返回 chain（statement-only）
  - §5.14 vitest agent 环境跑 pnpm 用 cmd.exe wrapper
- `.claude/Plan.md`：
  - §五 当前状态：17 套 / 281 / 89+ 内建方法
  - §六 未做尾巴：标记 ✅ Batch 1-5 / 标记 **不做** W4.2 / W6.1 完整 / N8
  - §八 审计：B2 / B5 / C2 / C10 标 ✅ 修复
  - §九 决策日志：新增 5 条 Batch 1-5 决策记录
- `CLAUDE.md`：状态 + 下一步候选刷新

零代码改动。
