---
'@kenconnet666/zui-core': patch
---

Debt Batch 1 — 5 个严重 bug / 一致性修复

### R1 ★ 修复：现代 CSS 单位完全不工作

`chain/carrier.ts` 的 `isUnitMethod` 硬编码 16 个 length unit，**遗漏 W1.7 落地的 18 个现代单位**（svw / svh / lvw / lvh / dvw / dvh / dvmin / dvmax / cqw / cqh / cqi / cqb / cqmin / cqmax 等）。导致 `s.padding.cqw(10)` / `s.width.svh(100)` 等运行时静默失败。

修复：carrier 改用 `getUnitList(cls)` 从 `units.ts` 取，避免硬编码漂移。

### R2 GLOBAL_KEYWORDS single source

`isGlobalKeyword` 硬编码 5 个值，与 `keywords.ts` 的 `GLOBAL_KEYWORDS` 常量重复。修复：import 常量。

### R3 createIcssInstance 内 injectGlobal 加 instance 级 dedupe

`createIcssInstance` 直接调 `emotion.injectGlobal`，多实例 SSR 环境下反复 `injectPreflight()` / `registerCustomProperty()` 等都重复走 emotion serializer。修复：每个 instance 独立 `injectedHashes: Set<string>` 内存去重；新增 `_resetInjectGlobalCache()` API。

### R4 preflight single source

`preflight.ts`（全局版）与 `createIcssInstance.injectPreflight`（instance 版）两份独立实现，已漂移（全局版多 `MozOsxFontSmoothing` / `textRendering`）。修复：抽 `src/preset/preflightStyles.ts` 作为 single source，两份实现都引用。

### R5 删 keywords.ts `leftPage` / `rightPage` 歧义条目

`leftPage: 'left'` / `rightPage: 'right'` 与 `left: 'left'` / `right: 'right'` 重复，且 break-before 直接用 css `left` / `right` 命中已可。修复：删除两条歧义条目；`enhanced-props.ts` 的 `BREAK_KW` 改用 `'left'` / `'right'`；重跑 generator 更新 properties.generated.ts。

### 新增测试

22 个测试（共 341 → 363）覆盖：
- 34 个 length unit 全部可用
- TIME_UNITS / ANGLE_UNITS 回归
- GLOBAL_KEYWORDS 全部命中
- instance dedupe + SSR 隔离 + _resetCache
- PREFLIGHT_STYLES 内容稳定
- break-before: left / right 仍工作
