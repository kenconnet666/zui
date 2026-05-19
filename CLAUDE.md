# `@kenconnet666/zui` workspace — Claude 接手指南

> Claude Code 自动加载本文件。详细文档在 `.claude/` 子目录。

---

## 一句话定位

**框架无关**的 CSS-in-JS 工具库 monorepo。核心包 `@kenconnet666/zui-core` 基于 `@emotion/css`，用 `class Chain<TSchema>` + declaration merging 把 ~857 个 CSS 属性挂到强类型 builder 上。已发 npm 0.3.0。

---

## 起手必读（按顺序）

1. **[`.claude/AGENT.md`](./.claude/AGENT.md)** — operational guide：工作流 / 命令速记 / 工具优先级 / 踩坑表 / STOP 节点
2. **[`.claude/Plan.md`](./.claude/Plan.md)** — 设计 source of truth：定位 / 核心 API / 关键技术决策 / 当前状态 / 未做尾巴 / 决策日志
3. **[`packages/core/README.md`](./packages/core/README.md)** — 用户视角文档：四态访问 / 内建方法表 / 自定义 schema / 限制
4. **[`packages/core/CHANGELOG.md`](./packages/core/CHANGELOG.md)** — 版本节奏

---

## 当前状态（速览）

| 项 | 值 |
|---|---|
| npm 主包 | `@kenconnet666/zui-core@0.3.0`（2026-05-19 发布）；本地 src 已是 0.4.0 候选 |
| 测试 | **17 套 / 281 全绿** |
| build | 61.30 kB / gzip 15.12 kB |
| bench | icss ~404k ops/s（W4.1 keymap 缓存提速 21×） |
| 内建方法 | **89+ 个**（含 _safeArea / _scrollSnap / _overscroll / _field） |
| 未启动子包 | `ui-vue`（0.0.2 空壳） / `docs`（VitePress 脚手架） |

---

## 起手三条命令

```powershell
pnpm --filter @kenconnet666/zui-core test            # 应 174/174
pnpm --filter @kenconnet666/zui-core run type-check
git log --oneline -10                                # 看最近 commit 节奏
```

---

## 用户偏好（重要）

- **中文回复**，代码 / 命令 / 错误信息保持英文
- **讨论 → 列选项 → 用户拍板**，不要先动手
- **每改完一个文件**立刻 `mcp__jetbrain__get_file_problems` 跑诊断
- **推送到远程 git = 代码发布**；`npm publish` **始终用户手动**
- commit message：中文 body + 列改动 + 验证结果 + Co-Authored-By

更多见 `.claude/AGENT.md` §三 用户偏好。

---

## 严格禁止（agent 红线）

- `git push --force` / `git reset --hard` / 删远端引用
- `pnpm publish` / `npm publish`（用户始终手动）
- 改 `.gitconfig` / `.npmrc` 凭据
- 跳 commit hook (`--no-verify`)
- `rm -rf` / `Remove-Item -Recurse -Force`（除非用户单次 explicit 授权）

---

## 下一步候选

短期（已无大量必做项）：

1. **发版 0.4.0** — Batch 1-6 累积，用户手动 `pnpm publish` 即可
2. **ui-vue 启动**（ZThemeProvider + 基础组件）— 长线
3. **docs 站填充**（VitePress 内容）— 长线

完整路线见 `.claude/Plan.md` §六、§七。已确定**不做**：W4.2 / W6.1 完整版 / N8 / ESLint plugin（理由见 Plan §六）。
