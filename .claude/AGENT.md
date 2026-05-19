# AGENT.md — 接手指南

> 给下次接手 `@kenconnet666/zui-core` 的 agent 看的本仓库专用 operational guide。
> 用户全局偏好在 `C:\Users\<user>\.claude\CLAUDE.md`；本文件只补本项目特有规则与陷阱。
> 设计 / 决策 / 路线见 [`Plan.md`](./Plan.md)；版本节奏见 `packages/core/CHANGELOG.md` + `git log`。

---

## 一、定位

**框架无关** CSS-in-JS 工具库，基于 `@emotion/css`。核心：`class Chain<TSchema>` 用 declaration merging 把 ~857 个 CSS 属性挂到 builder 上 + 18 个 token category。详见 `Plan.md` §〇/§一。

---

## 二、仓库结构

```
zui/                              # workspace root
├── packages/
│   ├── core/                     # @kenconnet666/zui-core（已发 npm 0.3.0）
│   │   ├── src/
│   │   │   ├── chain/            # Chain.ts (85+ 内建) / proxy / carrier / color /
│   │   │   │                     # enhanced-props.ts (195 条) / keywords / units /
│   │   │   │                     # config/extra-keywords.config.ts (W6.1 slot)
│   │   │   ├── theme/            # Theme.ts / resolveTheme / mergeTheme / keymap /
│   │   │   │                     # componentTokens / defaults (Tailwind 253 token)
│   │   │   ├── types/            # carrier / tokens / components / styleProps /
│   │   │   │                     # properties.generated.ts (★ 自动生成)
│   │   │   ├── dev/              # assertSchemaConsistency
│   │   │   └── (icss/toClassName/cx/injectGlobal/ikeyframes/createIcssInstance/
│   │   │      preflight/registerCustomProperty/layer/registerFont/index)
│   │   ├── tests/                # 13 套 / 174 测试
│   │   ├── bench/                # vitest bench + baseline.md
│   │   ├── examples/             # vanilla-button / vue-button / react-button
│   │   ├── recipes/              # vue / react / svelte / solid
│   │   └── CHANGELOG.md          # changesets 维护
│   ├── ui-vue/                   # @kenconnet666/zui-vue（空壳，0.0.2，未启动）
│   └── docs/                     # VitePress 脚手架（私有，未启动）
├── scripts/
│   └── generate-properties.mjs   # 读 csstype + ENHANCED_PROPS 派生 .generated.ts
├── .changeset/                   # @changesets/cli config（access:public）
├── .github/workflows/ci.yml      # generator drift + typecheck + test + build
├── .claude/                      # ★ 本目录：Claude Code 项目配置 + 文档入口
│   ├── settings.json             # 项目级配置（permissions / hooks / lsp）— 入 git
│   ├── settings.local.json       # 个人级（已 ignore）
│   ├── AGENT.md                  # 本文件
│   └── Plan.md                   # 设计 + 路线图
└── CLAUDE.md                     # 项目根入口（agent 自动读，指向 .claude/）
```

---

## 三、用户偏好

| 项 | 偏好 |
|---|---|
| 沟通语言 | 中文回复；代码 / 命令 / 错误信息保持英文 |
| 决策风格 | "讨论 → 列选项 → 用户拍板" 而非 "agent 直接做"；多用 D1 / D2 / W1.x 编号 |
| 默认策略 | 用户常说 "按推荐"，agent 给的推荐应可执行、风险低 |
| 离线推进 | 用户明确授权后会离开，agent 自主跑完 phase 才停 |
| 发布定义 | **推送到远程 git 即视为代码层面发布**；**`npm publish` 始终用户手动** |
| 验证强制度 | `mcp__jetbrain__get_file_problems` 每改完文件必跑；大改后 typecheck + test 必跑 |
| commit 节奏 | 每个 P*.X / W*.X 子任务一次 commit；message 中文 + body 详细 + Co-Authored-By |
| 设计 idiom | `s.xx.xx`（carrier 四态）/ `s._xx('opt', (h) => h.xx)`（option + factory） |

---

## 四、工作流（每次会话标准动作）

### 4.1 会话起手

1. **看 `.claude/Plan.md` §五 当前状态 + §六 未做尾巴 + §九 决策日志精华**
2. **跑 `pnpm test`** 确认基线绿（当前应 174/174）
3. **跑 `pnpm run type-check`** 确认 src + tests 类型干净
4. **`git log --oneline -10`** 看最近 commit 节奏

### 4.2 执行任务

1. 用 `TaskCreate` 把任务拆到 atomic 级别（≥3 步必用）
2. 改前 `Read` 看现状；改用 `Edit` / `Write`
3. **每个文件改完立刻 `mcp__jetbrain__get_file_problems`** —— 不要等 commit 才发现
4. 关键改动后跑 `pnpm test` + `pnpm run type-check`
5. 子任务完成 → `TaskUpdate completed` → commit

### 4.3 验证铁律（push 前必跑）

```powershell
pnpm --filter @kenconnet666/zui-core run type-check
pnpm --filter @kenconnet666/zui-core test
pnpm --filter @kenconnet666/zui-core build           # ★ 必跑！否则 dist 与 src 不同步
# 改了 ENHANCED_PROPS / csstype 还要：
node scripts/generate-properties.mjs
pnpm --filter @kenconnet666/zui-core test -- parity
```

### 4.4 commit / push / 发版

- commit message：中文 body + 列改动文件 + 验证结果 + Co-Authored-By Claude
- 远程：`https://github.com/kenconnet666/zui.git`，账号 `kenconnet666 <kenconnet@foxmail.com>`
- **禁止**：`--force` push / 改 git config / `reset --hard` / `pnpm publish` / `--no-verify`
- 发版走 changesets：`pnpm changeset` → `pnpm changeset version` → commit → tag → push → 用户手动 `pnpm publish --access public`

---

## 五、踩过的坑（重点防范）

### 5.1 ★ Proxy 方法 bind 到 receiver 不是 target

`proxy.ts` 拦截 `get` 时 `.bind(receiver)`（**不是 target**）。target 让 `_when`/`_apply`/`_nest` 内 `fn(this)` 传出原始 chain，无 carrier。
`this._node` 读取走 INTERNAL_KEYS 白名单。详见 `Plan.md` §3.4。

### 5.2 ★ csstype `Properties` 默认不接 number

`csstype.Properties['padding']` 默认 `Padding<string | 0>`。Generator 用 `Properties<string|number, string|number>` 实例化让 length/time 接 number。

### 5.3 ★ Generator 不解析 spread 和命名常量（已修）

`keywords: [...JUSTIFY_KW, 'auto']` 让 generator 漏掉 spread 部分；AST parser 加 `collectStringArrayConsts` + SpreadElement 展开。

### 5.4 ★ dist/ 与 src/ 不同步导致 IDEA 误报 ★ **最大坑**

- 改对外类型签名 → commit + push → 用户 IDEA 仍报错
- 原因：dist/index.d.ts 是上次 build 产物；IDEA 通过 node_modules symlink 读旧签名
- **防范**：每次改对外类型后**必须** `pnpm build`（**§四.3 step 0**）；examples 的 tsconfig 加 `paths` 直指 src

### 5.5 interface extends mapped type

`interface X<T> extends ResolvedTheme<T>` 在严格模式 → TS2312。
改用 `type X<T> = _Internal<T> & ResolvedTheme<T>` + const 强转。

### 5.6 noUncheckedIndexedAccess

`ctx.color!.primary` 返回 `string | number | undefined` → function token 类型不满足 ThemeValue → T 推断为 never → 级联 never。
测试里 cast；生产代码避免依赖 indexed access narrowing。

### 5.7 vitest happy-dom `import.meta.url` 不可用

`fileURLToPath(new URL('.', import.meta.url))` 报 "URL must be of scheme file"。
用 `process.cwd()`（vitest 工作目录就是 packages/core）。

### 5.8 blur key `2xl` / `3xl`

非法 ident。Schema interface 用字面量字符串：`'2xl': string`。
访问只能 `theme.blur['2xl']`。Chain 上 `_blur('2xl')` 不带 `_` 直接命中。

### 5.9 csstype 6.0 升级警告

vite-plugin-dts API Extractor 提示 "newer than bundled compiler engine"。**不阻塞 build**，留观察；未来 dts 出问题再升级 API Extractor。

### 5.10 npm 2FA 强制 publish（2024+）

新账号 publish 直接报 `E403 Two-factor authentication required`。
两条出路：① 启用 2FA（Authenticator app，不要 Security Key 路径）；② 创建 **Granular Access Token** 时勾上 **"Bypass two-factor authentication (2FA)"**，并把 Organizations 权限改 "No access"（用户没有 org 就会报错）。

### 5.11 .claude/ untracked 让 pnpm publish 报 `ERR_PNPM_GIT_UNCLEAN`

`.gitignore` 必须 ignore `.claude/settings.local.json`（不要 ignore 整个 `.claude/`，否则项目级 settings.json 也入不了 git）。

---

## 六、工具使用优先级

### 6.1 IDE / 索引（首选）

- `mcp__jetbrain__get_file_problems` — 单文件诊断（**每改完必跑**）
- `mcp__jetbrain__execute_terminal_command` — 跑 pnpm 命令（用 `truncateMode=END` + `maxLinesCount` 控输出长度）
- `mcp__jetbrain__get_symbol_info` / `mcp__jetbrain__search_symbol` — 跨文件符号
- `LSP` 工具 — Claude Code 自带 LSP（goToDefinition / findReferences / hover / workspaceSymbol 等）

### 6.2 原生 Claude Code 工具

- 文件读 / 写 / 搜：`Read` / `Write` / `Edit` / `Glob` / `Grep`
- shell：`Bash`（POSIX）或 `PowerShell`
- **never** 用 `grep` / `cat` / `find` 命令行版本

### 6.3 长查询 / 跨文件分析

- `Agent (subagent_type: Explore)` — 只读探索 / 找文件
- `Agent (subagent_type: Plan)` — 设计计划
- 单点查找直接 `Grep` / `Glob`

---

## 七、自主推进规则

### 7.1 STOP 节点

- 每个 Phase / W batch 末尾 → 全量 test + type-check + build + bench → push → 停下让用户审
- 任何 `git push` 前（除非用户已 explicit 授权"推送即发布"）
- 触发 TS2589 / 任何 type-check 红 / test 红
- generator 输出 diff 超 30% 行数（多半是 csstype 升级带来意外）
- bench 退化 > 20%
- 遇到 API 形态 / 命名级别的设计决策
- 遇 `Plan.md` §四 陷阱表 / §六 未做尾巴 标"中风险"以上 — 不要自决，停下问
- **要发版本**（bump version + tag + push tag）—— 始终用户手动

### 7.2 §决策日志同步

凡 agent 离线时做的边角决策，立即追加到 `Plan.md` §九 的表格。回来后用户审。

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
pnpm --filter @kenconnet666/zui-core test            # 应 174/174
pnpm --filter @kenconnet666/zui-core run type-check
pnpm --filter @kenconnet666/zui-core build           # ★ 更新 dist/
pnpm --filter @kenconnet666/zui-core bench           # 性能基线（icss ~404k ops/s）

# ─── 改 ENHANCED_PROPS / generator 后 ───
node scripts/generate-properties.mjs
pnpm --filter @kenconnet666/zui-core test -- parity

# ─── examples ───
pnpm --filter @kenconnet666/example-vanilla-button dev
pnpm --filter @kenconnet666/example-vue-button dev
pnpm --filter @kenconnet666/example-react-button dev

# ─── 发版（changesets 流程） ───
pnpm changeset                                       # 交互选 patch / minor / major + 写 summary
pnpm changeset version                               # bump packages/*/package.json + 写 CHANGELOG.md + 删 .changeset/*.md
# 复核：git status / git diff packages/core/package.json / cat packages/core/CHANGELOG.md
pnpm --filter @kenconnet666/zui-core run type-check
pnpm --filter @kenconnet666/zui-core test
pnpm --filter @kenconnet666/zui-core build
git add packages/core/package.json packages/core/CHANGELOG.md ...
git commit -m "chore(release): @kenconnet666/zui-core@0.X.Y"
git tag v0.X.Y
git push origin main && git push origin v0.X.Y
# ★ publish 必须用户手动：
# cd packages/core && pnpm publish --access public

# ─── npm Granular Access Token 模式（bypass 2FA）───
# 网页创建 token 时：
#   - Packages and scopes: @kenconnet666 (Read and write)
#   - Organizations: No access  ← 否则报错
#   - Bypass two-factor authentication (2FA): ✅
# 本地：
npm config set //registry.npmjs.org/:_authToken "npm_xxxxxxxx"
pnpm publish --access public
# 用完即删（安全）：
npm config delete //registry.npmjs.org/:_authToken
```

---

## 九、下一步候选（按推荐顺序）

> 完整路线 + 工作量 / 风险 / 价值评估见 `Plan.md` §六、§七。

**短期（batch 可一次推完）**：

1. **B 类小修 batch**（B2 INTERNAL_KEYS prototype 扫描 / C2 label join / B5 color alpha / B4 / C10）—— 0.5d，零风险
2. **N7 bench 场景扩展** —— 0.5d，是后续 W4.2 perf 工作前置
3. **W3.2 完整 stack-trace label** —— 0.5d，dev 体验
4. **W6.1 完整 csstype keyword 派生** —— 1.5d，删 ~100 行手写

**中期**：

5. **W4.2 carrier 工厂模块级**（先 N7 找证据，无明显瓶颈就 skip）
6. **N8 build size 审计**（19→61kb 涨 3×）

**长线（不立即做）**：

- **docs 站填充**（VitePress 内容） — 1-2d
- **ui-vue 启动**（ZThemeProvider + 5 基础组件） — 2-3d，需用户拍板 API
- **W11.1 Babel/SWC 插件** — v0.5+ 路线

---

## 十、最后

- **`Plan.md` 是设计 source of truth**，本文件是 operational guide
- 不改 `Plan.md` 已决条款（§一决策表 / §四陷阱表 / §六 未做尾巴 列表）—— 那些是用户拍板的
- 自主决策一律入 `Plan.md` §九，等用户审
- 全局规则在 `~/.claude/CLAUDE.md`，本文件不重复其内容

**会话结束前 checklist**：

1. ✅ 所有改动已 commit + push
2. ✅ `Plan.md` §九 最新决策已记录
3. ✅ dist/ 与 src/ 一致（`pnpm build` 跑过）
4. ✅ test + typecheck 全绿（174/174）
