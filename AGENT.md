# AGENT.md — 接手指南

> 给下次接手 `@kenconnet666/zui-core` 的 agent 看的本仓库专用指南。
> 用户全局偏好已在 `C:\Users\<user>\.claude\CLAUDE.md`；本文件只补本项目特有规则与本次实践经验。

---

## 一、一句话定位

**框架无关**的 CSS-in-JS 工具库，基于 `@emotion/css`。
核心是 `class Chain<TSchema>` —— 用 declaration merging 把 ~857 个 CSS 属性挂到 builder 上，
让 `s.color._primary` / `s.padding.px(16)` / `s.color._primary.alpha(50)` 全部强类型 + IDE 补全。

设计完整背景见 `Plan.md`（1400+ 行，是本项目唯一的 source of truth）。

---

## 二、仓库结构

```
zui/                            # workspace root
├── packages/
│   └── core/                   # @kenconnet666/zui-core (主体)
│       ├── src/
│       │   ├── chain/          # Chain.ts (59 内建方法) / proxy.ts / carrier.ts /
│       │   │                   # color.ts / enhanced-props.ts (129 条) / keywords.ts / units.ts
│       │   ├── theme/          # Theme.ts (class) / resolveTheme / mergeTheme / keymap /
│       │   │                   # defaults (Tailwind 242 色 palette + 11 语义色)
│       │   ├── types/          # carrier.ts / tokens.ts / properties.generated.ts (★ 自动生成)
│       │   └── (icss/toClassName/cx/injectGlobal/ikeyframes/index)
│       ├── tests/              # 7 套 / 95 测试
│       ├── bench/              # vitest bench + baseline.md
│       ├── examples/           # vanilla-button / vue-button / react-button (独立 vite app)
│       ├── recipes/            # vue.md / react.md / svelte.md / solid.md (用户复制即用)
│       ├── tsconfig.json       # build 用
│       └── tsconfig.typecheck.json  # type-check 脚本用，include src + tests
├── scripts/
│   └── generate-properties.mjs # 读 csstype + ENHANCED_PROPS 派生 properties.generated.ts
├── .changeset/                 # @changesets/cli config
├── .github/workflows/ci.yml    # generator drift + typecheck + test + build
├── Plan.md                     # ★ 主设计文档 + 决策日志
└── AGENT.md                    # 本文件
```

---

## 三、用户偏好（来自本次会话观察）

| 项 | 偏好 |
|---|---|
| 沟通语言 | 中文回复；代码 / 命令 / 错误信息保持英文 |
| 决策风格 | "讨论 → 列选项 → 用户拍板" 而非 "agent 直接做"；多用 D1 / D2 / ... 编号 |
| 默认策略 | 用户常说 "按推荐"，所以 agent 给的推荐应可执行、风险低 |
| 离线推进 | 用户明确授权后会离开，agent 自主跑完 phase 才停 |
| 发布定义 | **推送到远程 git 仓库即视为发布**；`npm publish` **始终手动** |
| 验证强制度 | `mcp__idea__get_file_problems` 每改完文件必跑；大改后 typecheck + test 必跑 |
| commit 节奏 | 每个 P*.X 子任务一次 commit；message 中文 + 详细 body + Co-Authored-By |
| 设计 idiom | `s.xx.xx`（carrier 四态）/ `s._xx('opt', (h) => h.xx)`（option + factory） |

---

## 四、工作流（每次会话标准动作）

### 4.1 会话起手
1. **看 Plan.md §十三现状对照表 + §十四决策日志** —— 了解当前 phase / 已做决策
2. **跑 `pnpm test`** 确认基线绿（当前应 95/95）
3. **跑 `pnpm type-check`** 确认 src + tests 类型干净
4. **看 `git log --oneline -10`** 看最近 commit 节奏

### 4.2 执行任务
1. 用 `TaskCreate` 把任务拆到 atomic 级别（≥3 步必用）
2. 改前用 `Read` 看现状；改用 `Edit` / `Write`
3. **每个文件改完立刻 `mcp__idea__get_file_problems`** —— 不要等 commit 才发现
4. 关键改动后跑 `pnpm test` + `pnpm type-check`
5. 子任务完成 → `TaskUpdate completed` → commit

### 4.3 验证铁律（push 前必跑）

```powershell
pnpm --filter @kenconnet666/zui-core run type-check         # tsc 含 src + tests
pnpm --filter @kenconnet666/zui-core test                    # 95/95 测试
pnpm --filter @kenconnet666/zui-core build                   # ★ vite lib mode，更新 dist/
# 改了 ENHANCED_PROPS / csstype 还要：
node scripts/generate-properties.mjs
pnpm test -- parity                                          # parity 守护
```

### 4.4 commit / push
- commit message：中文 body，列改动文件 + 验证结果 + Co-Authored-By Claude
- 版本 bump 后：`git tag v0.X.Y` → `git push origin main && git push origin v0.X.Y`
- 远程：`https://github.com/kenconnet666/zui.git`，账号 `kenconnet666 <kenconnet@foxmail.com>`
- **禁止**：`--force` push、改 git config、`reset --hard`、`pnpm publish`

---

## 五、本次会话踩过的坑（重点防范）

### 5.1 ★ Proxy 方法 bind 到 target 还是 receiver
**陷阱**：`proxy.ts` 拦截 `get` 时若 `.bind(target)`，方法内 `this === target`（原始 chain，无 carrier）。
`_when / _apply / _nest` 内部 `fn(this)` 传出 target，后续 `s.color._primary` 触发不了 Proxy → TypeError。

**修复**：`bind(receiver)`（即 proxy）。`this._node` 读取走 INTERNAL_KEYS 白名单。
对应 commit `d5e521f`，Plan §十四 §14 第 4 条。

### 5.2 ★ csstype `Properties` 默认不接 number
**陷阱**：`csstype.Properties['padding']` 默认 `Padding<string | 0>`，`s.padding(16)` 让 typecheck 报错。

**修复**：generator 把 `CssValueOf` 用 `Properties<string | number, string | number>` 实例化，
让 length / time 属性都接 number。对应 commit `abb5140`。

### 5.3 ★ Generator 不解析 spread 和命名常量
**陷阱**：`keywords: [...JUSTIFY_KW, 'auto']` 让 generator 漏掉 spread 部分，cfg.keywords 退化。

**修复**：generator AST parser 加 `collectStringArrayConsts` + spread 元素展开。
对应 commits `69542df` + `851bc52`。

### 5.4 ★ dist/ 与 src/ 不同步导致 IDEA 误报 ★ **最大坑**
**陷阱**：改 `src/toClassName.ts` 签名 → commit + push → 用户 IDEA 仍报错。
原因：dist/index.d.ts 是上次 build 的旧产物，IDEA 通过 node_modules symlink
（pnpm workspace）→ `packages/core/dist/index.d.ts` 读到旧签名。

**修复**：
1. 每次改对外类型签名后 **必须** `pnpm build` 更新 dist；
2. examples 的 tsconfig 加 `paths: { "@kenconnet666/zui-core": ["../../src/index.ts"] }`。
对应 commits `401253c` + `4142541`。

**预防**：把 `pnpm build` 放进 push 前 checklist 的 step 0。

### 5.5 interface extends mapped type
**陷阱**：`interface X<T> extends ResolvedTheme<T>` 在 verbatimModuleSyntax 严格模式 → TS2312。
`interface X extends Omit<DefaultSchema, 'k'>` 让 SchemaTokens 推断为 never。

**修复**：type alias intersection：`type X<T> = _Internal<T> & ResolvedTheme<T>` + const 强转。
对应 Plan §3.1。

### 5.6 noUncheckedIndexedAccess
**陷阱**：`ctx.color!.primary` 返回 `string | number | undefined`，function token 返回类型不满足
`ThemeValue`，T 推断为 never，级联 `r.color` 也 never。

**修复**：测试里 `(ctx.color!.primary as string)` cast。生产代码避免依赖 indexed access narrowing。

### 5.7 vitest happy-dom 下 `import.meta.url` 不可用
**陷阱**：`fileURLToPath(new URL('.', import.meta.url))` 在 vitest happy-dom 报
"URL must be of scheme file"。

**修复**：用 `process.cwd()`（vitest 工作目录就是 packages/core）。
对应 `tests/parity.spec.ts`。

### 5.8 blur key 命名 `2xl` / `3xl`
不是合法 ident。schema interface 用字面量 key：`'2xl': string`。
访问只能 `theme.blur['2xl']`，不能 `theme.blur._2xl`。
Chain 上 `_blur('2xl')` 不带 `_` 直接命中（`resolveBlurValue` 兼容）。

### 5.9 csstype Properties 6.0 升级
**陷阱**：API Extractor (vite-plugin-dts) 在 TS 6.0.3 下提示 "newer than bundled compiler engine"。
不阻塞 build，但 dts rollup 可能略走老解析路径。

**处理**：不阻塞，留观察；若未来 dts 出问题再升级 API Extractor。

---

## 六、工具使用优先级

### 6.1 IDE / 索引（首选）
- `mcp__idea__get_file_problems` — 单文件诊断（**每改完必跑**）
- `mcp__idea__lint_files` — 多文件 lint
- `mcp__idea__execute_terminal_command` — 跑 pnpm 命令（用 `truncateMode=END` + `maxLinesCount` 控输出长度）

### 6.2 原生 Claude Code 工具
- 文件读 / 写 / 搜：`Read` / `Write` / `Edit` / `Glob` / `Grep`
- shell：`Bash`（POSIX 脚本）或 `PowerShell`
- **never** `grep` / `cat` / `find` 命令行版本

### 6.3 长查询 / 跨文件分析
- `Agent (subagent_type: Explore)` — 只读探索 / 找文件
- `Agent (subagent_type: Plan)` — 设计计划
- 单点查找直接 `Grep` / `Glob`，不要起 Agent

---

## 七、自主推进规则

### 7.1 STOP 节点（必须停下来让用户审）
- 每个 Phase 末尾（如 0.1.0 ready / 0.2.0 ready）
- 任何 `git push` 前（除非用户已 explicit 授权 "推送即发布"）
- 触发 TS2589 / 任何 type-check 红 / test 红
- 遇到 API 形态 / 命名级别的设计决策

### 7.2 §十四 自主决策日志
凡 agent 离线时做的边角决策，立即追加到 `Plan.md §十四` 表格，5 列：
`时间 | 文件/范围 | 问题 | 决策 | 理由/参考`。回来后用户审。

### 7.3 严格禁止
- `git push --force` / `git reset --hard` / 删远端引用
- `pnpm publish` / `npm publish`（用户始终手动）
- 改 `.gitconfig` / `.npmrc` 凭据相关
- 写 CI/CD secrets
- 跳 commit hook (`--no-verify`)
- `rm -rf` / `Remove-Item -Recurse -Force`（除非用户单次 explicit 授权）

---

## 八、常用命令速记

```powershell
# ─── 起手验证 ───
pnpm install
pnpm --filter @kenconnet666/zui-core test            # 应 95/95
pnpm --filter @kenconnet666/zui-core run type-check
pnpm --filter @kenconnet666/zui-core build           # ★ 更新 dist/
pnpm --filter @kenconnet666/zui-core bench           # 性能基线

# ─── 改 ENHANCED_PROPS 后 ───
node scripts/generate-properties.mjs
pnpm --filter @kenconnet666/zui-core test -- parity

# ─── examples ───
pnpm --filter @kenconnet666/example-vanilla-button dev
pnpm --filter @kenconnet666/example-vue-button dev
pnpm --filter @kenconnet666/example-react-button dev

# ─── 发版（推 git 即视为发布） ───
# 1. 改完 + 全套验证
# 2. bump packages/core/package.json version
# 3. (可选) pnpm changeset → pnpm changeset version
git add ... && git commit -m "..."
git tag v0.X.Y
git push origin main
git push origin v0.X.Y
# 4. npm publish 用户手动决定

# ─── changesets ───
pnpm changeset           # 交互式 patch/minor/major
pnpm changeset version   # bump + CHANGELOG
# publish 仅用户操作：
# pnpm --filter @kenconnet666/zui-core publish --access public
```

---

## 九、Phase 3 候选清单（供下次会话参考）

按工作量 + 风险排序：

| 候选 | 工作量 | 风险 | 价值 |
|---|---|---|---|
| **P3.A** 性能优化（keymap 缓存到 Theme） | 0.5 天 | 中（动 core） | bench 从 19k 可提到 40k+ ops/s |
| **P3.B** SSR / `createIcssInstance(emotion)` | 1 天 | 中 | 解决 Plan §十一.16-17 |
| **P3.C** ui-vue 包启动（ZThemeProvider + 5 个基础组件） | 2-3 天 | 高（API 设计） | 落地组件库 |
| **P3.D** docs 站（VitePress） | 1-2 天 | 低 | 文档 + 在线 demo |
| **P3.E** 二级 carrier（`s.transform.rotate.deg(45)`） | 1 天 | 中（DSL 设计） | 表达力升级 |
| **P3.F** ESLint plugin（禁直接 emotion css） | 1 天 | 低 | 大型项目防错 |

**用户上次说**：等 0.2.0 审完后再决定 P3 范围（推荐先 docs / 其次 SSR / ui-vue 最后）。
未来 agent 接手时建议先问 "现在要做哪些？" 再列选项。

---

## 十、最后

- **Plan.md 是 source of truth**，本文件是 operational guide
- 不改 Plan.md 已决条款（§一决策表 / §九陷阱表 / §十一已决问题）—— 那些是用户拍板的
- 自主决策一律入 Plan.md §十四，等用户审
- 全局规则在 `~/.claude/CLAUDE.md`，本文件不重复其内容

**会话结束前 checklist**：
1. ✅ 所有改动已 commit + push
2. ✅ Plan.md §十四 最新决策记录
3. ✅ dist/ 与 src/ 一致（`pnpm build` 跑过）
4. ✅ 95/95 tests + typecheck 全绿
