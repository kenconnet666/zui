# 2026-05-23 · Stage 1 目录扁平化 + 单入口化(无人值守自动执行)

> **执行模式**:`/loop` 无人值守自主推进。路线图 §6 STOP 节点 #1("Stage 1 完成后停下问用户")
> 在路线图前言已显式豁免("定时任务无人值守情况除外,需要自行决策并写文档"),故跳过停止
> 转入 Stage 2。本文件即对应"写文档让用户知道"。

---

## 改动总览

### A. 目录扁平化(L1)

```
旧布局                                          新布局
─────────────────────────────────────────       ─────────────────────────────────────────
src/components/gene/Z*.vue                  →   src/gene/Z*.vue
src/components/gene/_typography-base.ts     →   src/gene/_typography-base.ts
src/components/gene/index.ts                →   src/gene/index.ts
src/components/index.ts                     →   (删除)
src/composables/{useStyles,useVariants,
  useResponsive,index}.ts                   →   (删除,业务方自取 @vueuse/core)
src/theme/{schema,zui-light,zui-dark,
  index}.ts                                 →   src/provider/theme/*.ts
src/locale/{types,zh-CN,en-US,merge,
  index}.ts                                 →   src/provider/locale/*.ts
src/provider/useZTheme.ts                   →   src/provider/theme/useZTheme.ts
src/provider/useZLocale.ts                  →   src/provider/locale/useZLocale.ts
src/provider/useZDate.ts                    →   src/provider/date/useZDate.ts
(新增)                                       →   src/provider/date/(useZDate 父目录)
(新增 占位 export {} index)                  →   src/{layout,input,display,feedback,
                                                    navigation,tool}/index.ts
(新增 空目录)                                →   src/_internal/  src/_hooks/
```

文件搬迁全部使用 `git mv`,git history blame 保留。

### B. provider 子结构(L2)

`src/provider/` 根仅保留:
- `ZBox.vue` —— 主题/iem/locale/date 注入器 + 底层带 css 的容器
- `keys.ts` —— `Z_THEME_KEY` / `Z_LOCALE_KEY` / `Z_DATE_KEY` injection symbols
- `units.ts` —— `ZIemPreset` / `ZIem`
- `index.ts` —— 重写,从 `./theme/useZTheme` / `./locale/useZLocale` / `./date/useZDate` re-export

### C. 删除 composables(L3)

`useStyles` / `useDynamicStyles` / `chainOf` / `useVariants` / `useParts` /
`useBreakpoints` / `useResponsive` 全部删除。git grep 显示无任何组件依赖这些
hook,纯外部工具函数,业务方需要时直接装 `@vueuse/core`。

### D. 单入口化(L12)

- `package.json/exports`:**只**保留 `.` 和 `./package.json`,删除 `/provider`
  `/locale` `/composables` `/components` `/components/gene` 五个 subpath 出口
- `vite.config.ts/build.lib.entry`:从对象式多入口改为单字符串 `'src/index.ts'`
- `src/index.ts`:聚合 provider + theme + locale + gene + 各分类占位 + core 全量透传

### E. Import 路径同步

- gene/*.vue + _typography-base.ts:`'../../theme'` → `'../provider/theme'`,
  `'../../provider'` → `'../provider'`
- provider/keys.ts:`'../theme'` → `'./theme'`,`'../locale/types'` → `'./locale/types'`
- provider/ZBox.vue:`'../theme'` → `'./theme'`,`'../locale/*'` → `'./locale/*'`
- provider/theme/useZTheme.ts:`'../theme'` → `'.'`(同目录),`'./keys'` → `'../keys'`
- provider/locale/useZLocale.ts:`'./keys'` → `'../keys'`,`'../locale/*'` → `'./'`
- provider/date/useZDate.ts:`'./keys'` → `'../keys'`

---

## 不变项

- 7 个 spec 文件全部从 `'../src'` 主入口 import,**无需修改**
- `docs/` 站点也只走主入口(`@kenconnet666/zui-vue` 包名),**无需修改**
- `.claude/skills/zui.md` 中提及的 `cssRoot` / 旧 `components/gene` 路径 → 留给
  **Stage 2**(cssRoot → css)统一改

---

## 验证

```
pnpm --filter @kenconnet666/zui-vue run type-check   → exit 0
pnpm --filter @kenconnet666/zui-vue test             → 147/147 pass
pnpm --filter @kenconnet666/zui-vue run build        → 27 chunks emitted
```

构建产物 `dist/index.js` 体积:**1.27 kB**(主入口聚合层,实际代码走 preserveModules
拆出的子模块,tree-shake 友好)。

---

## 路线图后续

下一步:**Stage 2 ── cssRoot → css 全局重命名 + 引入 SxObject 类型**。Stage 2 是
另一个 BREAKING,影响 ZBox + 6 已有组件 + 7 个 spec + skill 文档。

无人值守模式将继续推进,Stage 2 完成后再写一份决策文档。
