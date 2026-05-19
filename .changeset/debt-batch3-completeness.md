---
'@kenconnet666/zui-core': minor
---

Debt Batch 3 — 完整性 4 项

### L5 `defineVariants` LRU 缓存上限

新增 `cacheLimit` 配置（默认 256），超过后按 LRU 淘汰最早插入的 entry。LRU touch：访问已缓存项会重新插入到尾部，避免被淘汰。

```ts
const button = defineVariants(theme, {
  variants: { /* ... */ },
  cacheLimit: 100,   // 限制 100 个 className 缓存
  // 或 Infinity 关闭上限（不推荐）
})
```

### L6 `registerFont` URL escape + dev warn

之前 `font-family: '${family}'` / `url('${src}')` 拼接对包含单引号的字符串会破坏 CSS。
现在 `escapeSingleQuotes(value)` 把 `'` 转 `\'`；dev 模式检测到 `<` / `>` / `"` 等可疑字符时 warn。`createIcssInstance` 内的 `registerFont` 同步获益。

### M2 README 加非颜色 token 不应链式警告

明确标注：
- 颜色 token 命中返回 `ColorTokenValue` helper（**不返回 chain**）→ 不能继续链式
- 非颜色 token 命中**当前**返回 chain，**类型层也允许**继续链 — 但请按 statement-only 风格写

### M3 ★ Generator 启动时校验 KEYWORD_TO_CSS 覆盖 enhanced-props

`scripts/generate-properties.mjs` 新增 `validateKeywordCoverage()`：扫描 ENHANCED_PROPS 所有 `keywords` 数组引用的 keyword，校验都存在于 `keywords.ts` 的 `KEYWORD_TO_CSS` 表中；缺失则抛错。

**立刻发现 6 个隐藏 bug**：
- `top` / `bottom`（captionSide）
- `inside` / `outside`（listStylePosition）
- `light` / `dark`（colorScheme）

之前用户写 `s.captionSide.top` 等 carrier 静默不命中。已补 6 个 keyword 到 `KEYWORD_TO_CSS`。

### 新增测试

15 个测试（共 402 → 417）：
- L5 LRU 淘汰 / touch / cacheLimit Infinity
- L6 URL escape / dev warn
- M3 补全的 6 个 keyword 在 KEYWORD_TO_CSS 且 carrier 命中
- M2 文档化的 token 命中行为守护
