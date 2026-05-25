# `@kenconnet666/zui` workspace — Claude 接手入口

> Claude Code 自动加载本文件。

---

## 立即做

1. 用 `Read` 工具读取 `.claude/skills/zui.md` 加载项目完整指南 — API / 陷阱 / ui-vue 约定 / 验证 / 发版全在那里。
2. 看 `.claude/AGENT.md` —— 验证铁律 + STOP 节点 + 严格禁止（精简版）。

---

## 一句话定位

**框架无关**的 CSS-in-JS 工具库 monorepo。核心包 `@kenconnet666/zui-core` 基于 `@emotion/css`，`class Chain<TSchema>` + declaration merging 把 ~857 个 CSS 属性挂到强类型 builder 上。Vue 组件库 `@kenconnet666/zui-vue` 开发中。

---

## 起手 3 命令

```powershell
pnpm --filter @kenconnet666/zui-core test            # 566/566 全绿
pnpm --filter @kenconnet666/zui-core run type-check
git log --oneline -10
```

---

更详细规则一律去 `.claude/skills/zui.md` 查。
