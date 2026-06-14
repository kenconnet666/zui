# AGENT.md — 接手指南

> 项目全部知识在 `.claude/skills/zui.md`。本文件是精简入口。

---

## 起手 3 步

1. **加载项目 skill**：调 `Skill(skill="zui")` 加载完整指南（API / 陷阱 / ui-vue 约定 / 验证流程 / 发版流程）。
2. **跑基线**：
   ```powershell
   pnpm --filter @kenconnet666/zui-core test            # 应 572/572 全绿
   pnpm --filter @kenconnet666/zui-core run type-check
   ```
3. **看近况**：`git log --oneline -10`。

---

## 验证铁律（每次必跑）

- **每改一个文件** → `mcp__idea__get_file_problems(filePath, errorsOnly=true)`
- **改对外类型** → 必须 `pnpm build`（否则 dist 与 src 不同步，IDEA / examples 读到旧签名）
- **改 `ENHANCED_PROPS` / `csstype`** → `node scripts/generate-properties.mjs` + `test -- parity`
- **push 前** → type-check + test + build 全跑

---

## STOP 节点（自主推进必停）

- 每个 Phase / Batch 末尾（push 前停下让用户审）
- `git push` 前（除非用户已 explicit 授权）
- 任何 type-check / test 红
- generator diff > 30% 行数
- API 形态 / 命名级别的设计决策
- **发版本**（bump + tag + push tag）

---

## 严格禁止

- `git push --force` / `git reset --hard` / 删远端引用
- `pnpm publish` / `npm publish`（用户始终手动）
- 改 `.gitconfig` / `.npmrc` 凭据
- 跳 commit hook (`--no-verify`)
- `rm -rf` / `Remove-Item -Recurse -Force`（除非用户单次 explicit 授权）

---

## 用户偏好

- **中文回复**；代码 / 命令 / 错误信息保持英文
- **讨论 → 列选项 → 用户拍板**，不要先动手
- **推送到远程 git = 代码层面发布**；`npm publish` 始终用户手动
- commit：中文 body + 列改动 + 验证结果 + Co-Authored-By Claude

---

详细规则一律去 `.claude/skills/zui.md` 查。
