---
'@kenconnet666/zui-core': minor
---

第二轮审计 — Audit Batch 1-3 全部落地

### Audit Batch 1：全局 helper 接入 dedupe + escape + freeze

- **S1** 一致性：`registerCustomProperty` / `registerFont` / `injectLayer` / `injectLayerOrder` 全部改走 `./injectGlobal`（享受内存级去重）。与 `createIcssInstance` instance 版行为对齐。
- **S2** `registerCustomProperty` 加单引号 escape + dev 模式可疑 syntax / initialValue 警告。
- **S5** `PREFLIGHT_STYLES` 深 freeze 防外部 mutation 污染全局。

### Audit Batch 2：toIdent + assertSchemaConsistency 防御

- **S3** `toIdent` 检测非法 JS ident 字符（空格 / 特殊符号 / emoji）→ dev warn + 兜底 sanitize。`buildKeymap` 配套：同 category 内 ident 撞车 dev warn。
- **S6** `assertSchemaConsistency.makeReferenceProbe` 不存在 category 的内层 Proxy 也记录访问路径 → ref 含完整 `cat.key` 而非只 `cat`。

### Audit Batch 3：preset instance 工厂 + sideEffects 精确化

- **S4** ★ 抽 `src/preset/animation-defs.ts`（15 个动画的 stops 数据 + `PresetAnimationName` 类型）。
  - 全局 `presetAnimations` 仍 eager 注册到全局 emotion（向后兼容）
  - `createIcssInstance` 加 `presetAnimations` 字段：**lazy 注册到 instance 的 emotion**（多实例 SSR 隔离）
  - lazy 实现用 Proxy + 内部 cache，未访问任何字段则零开销
- **S7** `package.json` `sideEffects: false` → `["**/preset/animations.js", "**/preset/animations.mjs"]` 精确告知 bundler 哪个文件有副作用。

### Audit Batch 4：工程化 + 测试覆盖

- **S8** `vite.config.ts` bench 加 `environment: 'node'`，bench 启动加速。
- **S10** `tsconfig.json` 加 `noEmitOnError: true` 双保险（type-check 错时不出 dist）。
- **S9** `register*` 测试断言生成的 `@property` / `@font-face` / `@layer` 字符串内容（之前只测调用不抛错）。

### 新增测试

54 个测试（共 420 → 474）。
build 增量：68.26 kB → 72.05 kB（+3.79 kB，主要是 instance 版 presetAnimations + escape 代码）。
