---
'@kenconnet666/zui-core': minor
---

★ dist 产物结构改造 + subpath exports（无破坏，0.7.0）

### 改造前 vs 改造后

| | 0.6.0 | 0.7.0 |
|---|---|---|
| 文件结构 | 单 `dist/index.js`（75 kB minified） | 多目录平铺（~50 个独立文件） |
| 可读性 | 单字母变量、无 JSDoc | ✅ 真名变量 + 完整 JSDoc |
| Subpath import | ❌ 仅主入口 | ✅ `/variants` / `/preset` / `/dev` |
| Tree-shake | bundler 内部分析 | ✅ ESM 静态边界，更精确 |
| go-to-definition | 跳单文件第 N 行 | ✅ 跳独立模块 |

### Subpath 入口

```ts
// 组件库 variants
import { defineVariants, defineParts } from '@kenconnet666/zui-core/variants'

// 预设资源
import { presetAnimations, PREFLIGHT_STYLES } from '@kenconnet666/zui-core/preset'

// 开发态工具（仅 dev 模式 import）
import { assertSchemaConsistency } from '@kenconnet666/zui-core/dev'
```

### dist 产物结构

```
dist/
├── index.js                            (~2 kB re-exports)
├── chain/Chain.js                      (28.78 kB / gzip 9.01 kB)
├── chain/carrier.js, color.js, ...
├── theme/Theme.js, resolveTheme.js, defaults/light.js, dark.js, ...
├── variants/index.js + 4 文件
├── preset/index.js + 3 文件
├── dev/index.js + 2 文件
├── types/ (纯 .d.ts)
└── icss.js / cx.js / ikeyframes.js / ...
```

每个文件保留完整 JSDoc + 真名变量 + 独立 source map。

### 实现要点

- **`vite.config.ts`**：4 入口（main + 3 subpath）+ `preserveModules: true` + `minify: false`
- **`dts plugin`**：`rollupTypes: false`，每个源文件输出对应 `.d.ts`
- **`package.json`**：`exports` 加 `/variants` / `/preset` / `/dev` + `/package.json` 反查

### 包体积

- 主入口 `dist/index.js`: 75 kB → **2.27 kB**（仅 re-exports）
- 总 unpacked: ~120 kB（含 source map / d.ts.map）
- 总 packed tarball: 123 kB → **222 kB**（含完整 JSDoc / map，但每文件 gzip 友好）

实际 bundler 打包时按需 import，最终用户 bundle 不会变大。

### 内部修复

`theme/componentTokens.ts:65` — `prefix` 显式 `: string` cast，让 dts plugin 在
`ComponentTokenRegistry` 用户未 augment 时（`C = never`）也能生成 .d.ts。

### 兼容性

✅ **非破坏性**：所有现有 `import { ... } from '@kenconnet666/zui-core'` 主入口语句继续工作。
✅ 现有测试 549/549 全绿。
✅ types 路径修正（`dist/index.d.ts` 仍存在并 re-export）。
