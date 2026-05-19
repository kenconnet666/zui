# @kenconnet666/zui-core

## 0.4.0

### Minor Changes

- 2b32b59: Batch 1 — 质量与调试体验改进（5 项）
  - **B2** `Chain` Proxy 改用 prototype 自动扫描，新增内建方法无需同步白名单（修复历史易漏 bug）。继承 Chain 加自定义方法也能正确走 Proxy。
  - **C2** `label()` 多次调用现在 join 成 `a.b.c` 而非互相覆盖；空字符串入参被忽略。
  - **B5** 颜色 modifier (`darken` / `lighten` / `mix` / `saturate` / `desaturate`) 在原色含 alpha (rgba) 时保留原 alpha 输出 `rgba(...)`；不透明颜色仍输出 hex（兼容）。
  - **B4** `mergeTheme` 在 dev 模式下扫描 partial，遇 function token 时 `console.warn` 警示（生产构建静默）。
  - **C10** `injectGlobal` 内存级去重（基于内容指纹），重复内容不再走 emotion serializer。新增 `_resetInjectGlobalCache()` 内部测试 helper。

  新增 24 测试（共 198 / 174 → 198）。非破坏性。

- 277fc1c: Batch 3 — W3.2 完整 stack-trace label（dev 体验）

  把 `Chain` 构造的 `debug: true` 选项从简化版升级为完整版：
  - 抽到新模块 `src/dev/stackTrace.ts`，方便测试与复用
  - 跨 runtime 解析 stack 行：V8（Chrome / Node）/ SpiderMonkey（Firefox）/ JavaScriptCore（Safari）三种格式
  - framework frame 过滤：跳过 `Chain.ts` / `proxy.ts` / `carrier.ts` / `stackTrace.ts` / `node_modules` / `@kenconnet666/zui-core` 等
  - 输出 `fileName_LINE` 格式 label（去扩展名 / 去路径，对 emotion devtools 友好）
  - `isProductionEnv()` 提取：production 下 `debug: true` 自动降级 noop（避免栈泄露）
  - 与 C2 `label()` join 协作：手动 `c.label('Button')` 后会拼成 `App_42.Button`

  新增 26 测试（共 224 / 198 → 224）。

  新导出（dev 工具）：
  - `makeCallsiteLabel(stack?: string): string | null`
  - `parseStackLine(line: string): StackFrame | null`
  - `findUserCallsite(stackLines: string[]): StackFrame | null`
  - `isProductionEnv(): boolean`
  - type `StackFrame`

- 5271397: Batch 4 — 4 个现代 CSS 4 helper

  新增 4 个 Chain method，对齐 CSS 2024 实用方向：
  - `_safeArea(side?, property?)` — iOS notch / home indicator / Android nav bar 留白。支持 4 单侧或 `'all'`，可写 padding / margin / inset。
  - `_scrollSnap(opts)` — CSS Scroll Snap Level 1 简写：`type` + `strictness`（容器侧）和 `align` + `stop`（子项侧）。
  - `_overscroll(behavior, axis?)` — `overscroll-behavior` / `-x` / `-y` / `-inline` / `-block`。常用于禁用页面下拉刷新。
  - `_field(sizing)` — CSS Working Group 草案 `field-sizing`，让 `<input>` / `<textarea>` 跟随内容自适应。

  跳过：实验性 `_anchor`（CSS Anchor Positioning），浏览器支持率低 + API 易变。

  新增 24 测试（共 248 / 224 → 248）。

### Patch Changes

- e5b793b: Batch 5 — edge case 测试集中补强（仅测试）

  新增 `tests/edge.spec.ts` 33 个测试，集中覆盖已知陷阱与边界条件，防止回归：
  - function token 求值顺序 / 跨 category 引用 / 环 / 缺失 category cast 兜底
  - `resolveTheme` `Object.freeze` immutable 验证
  - blur key `'2xl'` / `'3xl'` 非合法 ident 访问（`theme.blur['2xl']`、`Chain._blur('2xl')`、`_blur('_2xl')`、未知 token 透传）
  - proxy bind receiver — `_when` / `_apply` / `_unless` 内 `fn(this)` 仍是 proxy
  - carrier 缓存命中（连续访问引用相同 / 跨实例不复用 / `_carriers` Map 大小）
  - alpha clamp 边界（< 0 / > 100 / 0 / 100）
  - 保留属性名（schema 起名 `label` 不破坏 Chain）
  - `icss` 接受 Theme / ResolvedTheme 两种形式
  - 空 schema / 空 partial 不抛
  - `Chain.toString()` 多次调用按 emotion content hash 等价
  - `_nest` try/finally 还原 \_node（fn 抛错后 chain 仍可用）/ 同名 selector 合并 / 空 fn 不留空 selector

  零代码改动。共 248 → 281 测试。

- 012c314: Batch 6 — 文档审计补强（仅文档）
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

## 0.3.0

### Minor Changes

- Phase 3 全量落地：新增 ComponentTokenRegistry / StyleProps / \_stack / \_grid / \_inspect / assertSchemaConsistency / createIcssInstance SSR wrapper / injectPreflight / registerCustomProperty / injectLayer / registerFont 等约 20 个 API。default schema 补 8 个 token category（duration / easing / breakpoint / zIndex / opacity / lineHeight / letterSpacing / aspectRatio）。bench 提升 21×（icss 19k → 404k ops/s）。测试 95 → 174。

  新增 API：
  - `ComponentTokenRegistry` declaration merging 注册槽 + `FlattenComponentTokens` 工具 + `withComponentTokens` 派生 helper
  - `StyleProps<T>` 类型 + `applyStyleProps(chain, props)` 运行时（30+ alias：color/bg/p/m/rounded/shadow/...）
  - `TokenOf<Cat, T>` 工具类型
  - 通用属性 variant：`_data` / `_aria` / `_has` / `_not` / `_is` / `_where`
  - 状态 variant：`_open` / `_closed` / `_loading` / `_inert` / `_forcedColors` / `_starting`
  - container query 简写：`_containerSm` / `_containerMd` 等
  - group / peer data 变种：`_groupData` / `_peerData` / `_groupAria` / `_peerAria`
  - Transform longhand：`_translate` / `_translateX/Y/Z` / `_rotate` / `_rotateX/Y/Z` / `_scale` / `_scaleX/Y/Z` / `_skew` / `_perspective` / `_transformOrigin` / `_preserve3d`
  - Filter / Backdrop helpers：`_filterBlur` / `_filterBrightness` 等共 18 个
  - Gradient helpers：`_linearGradient` / `_radialGradient` / `_conicGradient`
  - Pattern 库：`_stack` / `_grid` / `_aspectVideo/Square/Portrait/Landscape` / `_focusRing` / `_visuallyHidden` / `_fillParent` / `_skipLink`
  - Dev 工具：`_inspect({ format })` / `assertSchemaConsistency()`
  - SSR：`createIcssInstance(emotion)` 工厂返回完整工具集（icss / chain / cx / injectGlobal / ikeyframes / registerAnimation / injectPreflight / registerCustomProperty / injectLayer / injectLayerOrder / registerFont / extractCritical）

  性能优化：
  - `Theme.getKeymap()` 懒缓存（W4.1）：bench icss 19k → 404k ops/s（21× 提速）
  - `resolveTheme()` 末尾 `Object.freeze` 每个 category（V8 sealed class）

  类型系统：
  - `PropCarrier` / `ColorPropCarrier` 扩 `TExtraKeywords` slot
  - generator 接管 extra-keywords 扩展槽 + 校验 `_` 前缀
  - LENGTH_UNITS 从 16 扩到 30（容器查询单位 cqw/cqh/cqi/cqb/cqmin/cqmax + 动态视口单位 svw/lvw/dvw 等）
  - ENHANCED_PROPS 从 129 扩到 195（filter / tables / lists / SVG / scroll-snap / pointer / layout / blend / writing / columns / break / 现代 CSS 4 / counter）

  非破坏性 minor 升级：所有 0.2.x API 保留。
