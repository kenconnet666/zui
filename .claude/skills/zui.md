---
name: zui
description: zui monorepo（@kenconnet666/zui-core + @kenconnet666/zui-vue）项目专用指南。当用户在本仓库工作、提及 zui / Chain / Theme / icss / defineVariants / defineParts / ZBox / ENHANCED_PROPS / 四态访问，或开发 ui-vue 组件库时激活此 skill。
---

# zui 项目工作指南

> **本文件是 zui 仓库的 single source of truth**，含设计 / API / 陷阱 / ui-vue 约定 / 验证流程 / 发版流程。
> 其它 .md 文件（README / AGENT.md / CHANGELOG）只是入口或精简介绍，知识全部在此。

---

## 一、项目定位

**框架无关**的 CSS-in-JS 工具库 monorepo。

- `@kenconnet666/zui-core`（已发 npm 0.5.0+）—— 框架无关核心：基于 `@emotion/css`，`class Chain<TSchema>` 用 declaration merging 把 ~857 个 CSS 属性挂到强类型 builder 上。
- `@kenconnet666/zui-vue`（开发中）—— Vue 3 组件库 + `ZBox` 嵌套覆盖。

**核心范式 — 四态访问**：

```ts
s.color('red')                  // ① 函数调用：csstype 严格
s.color._primary                // ② 主题 token（_ 前缀）
s.color.white                   // ③ CSS keyword（无前缀）
s.padding.px(16)                // ④ unit 方法 → '16px'
```

颜色 token 命中后挂 6 个 modifier：`.alpha(n)` `.darken(n)` `.lighten(n)` `.mix(other, n)` `.saturate(n)` `.desaturate(n)`。

**Chain 风格 statement-only**：`s => { s.padding.px(16); s.color._primary }`，每条独立一行，**不** chainable。

---

## 二、仓库布局

```
zui/
├── packages/
│   ├── core/                                # @kenconnet666/zui-core
│   │   ├── src/
│   │   │   ├── chain/                       # Chain.ts / proxy.ts / carrier.ts / color.ts / 
│   │   │   │                                  enhanced-props.ts / keywords.ts / units.ts / helpers.ts
│   │   │   ├── theme/                       # Theme.ts / resolveTheme.ts / mergeTheme.ts / 
│   │   │   │                                  keymap.ts / defaults/
│   │   │   ├── variants/                    # defineVariants / defineParts / composeVariants / 
│   │   │   │                                  extendVariants / extendParts / defineMixin
│   │   │   ├── types/                       # carrier / tokens / components / styleProps / 
│   │   │   │                                  properties.generated.ts ★ 自动生成
│   │   │   ├── dev/                         # assertSchemaConsistency / stackTrace
│   │   │   ├── preset/                      # animation-defs / animations / preflightStyles
│   │   │   ├── index.ts                     # 主入口（re-export）
│   │   │   ├── icss.ts / toClassName.ts / cx.ts / ikeyframes.ts / injectGlobal.ts
│   │   │   ├── createIcssInstance.ts        # SSR / 多 emotion 实例
│   │   │   ├── preflight.ts / layer.ts / registerFont.ts / registerCustomProperty.ts
│   │   │   └── responsive.ts
│   │   ├── tests/                           # 30 套 / 569 测试（截 2026-05）
│   │   ├── bench/
│   │   ├── examples/                        # vanilla-button / vue-button / react-button
│   │   └── CHANGELOG.md
│   ├── ui-vue/                              # @kenconnet666/zui-vue（开发中）
│   │   ├── src/
│   │   │   ├── provider/                    # ZBox + 4 composables + keys
│   │   │   ├── locale/                      # zh-CN / en-US / merge / types
│   │   │   ├── composables/                 # useStyles / useVariants / useResponsive
│   │   │   ├── components/
│   │   │   │   └── icon/                    # ZIcon.vue / variants / tokens / types
│   │   │   └── index.ts
│   │   └── tests/                           # provider (10) + icon (23) = 33 tests
│   └── docs/                                # @kenconnet666/docs（演示站，private，不发布）
├── scripts/
│   └── generate-properties.mjs              # ★ ENHANCED_PROPS + csstype → properties.generated.ts
├── .changeset/                              # @changesets/cli（access:public）
├── .github/workflows/ci.yml                 # generator drift + typecheck + test + build
├── .claude/
│   ├── AGENT.md                             # 精简入口；详情指向本 skill
│   ├── skills/zui.md                        # ★ 本文件
│   ├── settings.json                        # 项目级配置（permissions / hooks / lsp）
│   └── settings.local.json                  # 个人级（已 ignore）
└── CLAUDE.md                                # 项目根入口（agent 自动读）
```

---

## 三、core API 一页速查

### 3.1 主题层

```ts
class Theme<T extends ThemeSchema> {
  constructor(schema: T)
  resolve(): ResolvedTheme<T>                                // 展开 function token，结果缓存
  merge<P extends DeepPartial<T>>(partial: P): Theme<T>      // 返回新 Theme，父不变
  fork<P extends DeepPartial<T>>(partial: P): Theme<T>       // merge 的别名（推荐入口）
  getKeymap(): Map<string, Map<string, string>>              // ident keymap，Chain 共享
}
type Theme<T> = _ThemeClass<T> & ResolvedTheme<T>             // intersection 注入 schema 字段访问

// 工具
function resolveTheme<T>(schema: T): ResolvedTheme<T>
function mergeTheme<T, P extends DeepPartial<T>>(parent: ResolvedTheme<T>, partial: P): ResolvedTheme<T>
function buildKeymap<T>(theme: ResolvedTheme<T>): Map<string, Map<string, string>>

// 默认主题（Tailwind 风 242 色 palette + 11 语义色 + 18 token category）
const defaultLight: Theme<DefaultSchema>
const defaultDark: Theme<DefaultSchema>
```

### 3.2 Chain + 顶层 helper

```ts
class Chain<T extends ThemeSchema = DefaultSchema> {
  constructor(theme: ResolvedTheme<T> | Theme<T>, options?: ChainOptions)
  // 增强属性：ENHANCED_PROPS 列出的 ~195 条
  declare color: ColorPropCarrier<this, ...>
  declare padding: PropCarrier<this, ..., LengthUnits<this>>
  // 未增强属性：~660 个 csstype 属性 → PropFn 形态
  declare alignSelf: PropFn<this, csstype.Property.AlignSelf>
  // 内建方法（89+ 个）
  label(name: string): this
  _hover(fn: (s: this) => void): this
  _media(query: string, fn: (s: this) => void): this
  // ... 见 §九
  toCSSObject(): CSSObject
  toString(): string
}

// 顶层
function icss<T>(theme: Theme<T> | ResolvedTheme<T>, factory: (s: Chain<T>) => void): string
function toClassName<T>(chain: Chain<T>): string
function ikeyframes(factory): string
function cx(...args: ClassInput[]): string
function injectGlobal(styles: CSSObject | string): void

// 全局副作用（不返回 className）
function injectPreflight(): void
function registerCustomProperty(name, options): void
function injectLayer(name, css): void
function injectLayerOrder(...names): void
function registerFont(source: FontFaceSource): void
```

### 3.3 SSR / 多实例

```ts
function createIcssInstance(emotion: EmotionLikeInstance): IcssInstance
// 返回 { icss, ikeyframes, toClassName, cx, injectGlobal, ... } —— 各操作绑定给定 emotion 实例
// Vue 3 / Nuxt SSR：用 cache.flush() 取 SSR critical CSS
```

### 3.4 Variants 系统（组件库主力）

```ts
// 单 className 变体（cva 风）
function defineVariants<S, V>(theme, config: DefineVariantsConfig<S, V>): (props?: VariantProps<V>) => string

// 多 slot（Dialog / Tabs / Select）
function defineParts<S, Slot, V>(theme, config: DefinePartsConfig<S, Slot, V>): PartsResult<Slot, V>

// 复合：两个 / 三个 / 四个工厂并联，className 拼接
function composeVariants(f1, f2): combined
function composeVariants(f1, f2, f3): combined
function composeVariants(f1, f2, f3, f4): combined

// 继承：parent 工厂 + child 配置 → 合并工厂
function extendVariants<S, V1, V2>(theme, parent, childConfig): (props?: VariantProps<V1 & V2>) => string

// ★ 0.7.0+：Parts 继承（与 extendVariants 对偶）
function extendParts<S, Slot, V1, V2>(theme, parent, childConfig): PartsResult<Slot, V1 & V2>

// 可重用样式片段（focus-ring / elevation / surface）
function defineMixin<S>(factory: (s: Chain<S>) => void): (s: Chain<S>) => void

// 类型推断
type VariantPropsOf<F>             // 从工厂推 props
type VariantPropsOfParts<P>        // 从 parts 推 props
```

### 3.5 StyleProps + 响应式

```ts
// Theme UI / Chakra 风 alias prop（p/px/bg/...）
type StyleProps<T> = { color?, bg?, p?, px?, py?, m?, mx?, ..., w?, h?, rounded?, shadow?, fontSize? }
type ResponsiveStyleProps<T> = { [K in keyof StyleProps<T>]: ResponsiveValue<StyleProps<T>[K]> }

// 应用到 chain 或 theme
function applyStyleProps<T>(chain: Chain<T>, props: ResponsiveStyleProps<T>): void
function applyStyleProps<T>(theme: ResolvedTheme<T> | Theme<T>, props: ResponsiveStyleProps<T>): string

// 响应式对象
type ResponsiveValue<T> = T | ResponsiveObject<T>
interface ResponsiveObject<T> { base?: T, [breakpoint: string]: T | undefined }

// 解析（自动包 _media('_<bp>', ...)）
function applyResponsive<S, T>(chain, value, apply: (s, v) => void): void

// 检测（★ 0.7.0+ 加 breakpoints 严格模式）
function isResponsiveValue<T>(value, breakpoints?: readonly string[]): value is ResponsiveObject<T>
// 严格模式：所有 key ∈ ['base', ...breakpoints] 才算响应式 —— ui-vue 调用时应从 theme.breakpoint keys 派生传入

// 单 category token union
type TokenOf<Cat, T> = ColorTokens<T> | SpacingTokens<T> | ...
```

### 3.7 子包入口（精确 tree-shake）

```ts
import { ... } from '@kenconnet666/zui-core'             // 主入口（re-export 全部）
import { ... } from '@kenconnet666/zui-core/variants'    // defineVariants / defineParts / 等
import { ... } from '@kenconnet666/zui-core/preset'      // presetAnimations
import { ... } from '@kenconnet666/zui-core/dev'         // assertSchemaConsistency / stackTrace
```

---

## 四、用户偏好

| 项 | 偏好 |
|---|---|
| 沟通语言 | 中文回复；代码 / 命令 / 错误信息保持英文 |
| 决策风格 | "讨论 → 列选项 → 用户拍板"；不要先动手 |
| 默认策略 | 用户常说"按推荐"，agent 给的推荐应可执行、风险低 |
| 离线推进 | 用户明确授权后会离开，agent 自主跑完 phase 才停 |
| 发布定义 | **推送到远程 git = 代码层面发布**；`npm publish` 始终用户手动 |
| 验证强制度 | 每改完一个文件**必跑** `mcp__idea__get_file_problems`；大改后 typecheck + test 必跑 |
| commit 节奏 | 每个 P*.X / W*.X / Batch N 子任务一次 commit；中文 body + 列改动 + 验证结果 + Co-Authored-By |
| 设计 idiom | `s.xx.xx`（carrier 四态）/ `s._xx('opt', (h) => h.xx)`（option + factory） |

---

## 五、验证铁律

### 5.1 每改完一个文件
```
mcp__idea__get_file_problems(filePath, errorsOnly=true)
```

### 5.2 push 前必跑（顺序固定）
```powershell
pnpm --filter @kenconnet666/zui-core run type-check
pnpm --filter @kenconnet666/zui-core test
pnpm --filter @kenconnet666/zui-core build           # ★ 必跑！否则 dist 与 src 不同步
# 改了 ENHANCED_PROPS / csstype 还要：
node scripts/generate-properties.mjs
pnpm --filter @kenconnet666/zui-core test -- parity
```

### 5.3 用 IDE 终端跑 pnpm（绕过 PATH 问题）
```
mcp__idea__execute_terminal_command(
  command='cmd.exe /c "pnpm --filter @kenconnet666/zui-core test"',
  executeInShell=true,
  truncateMode='END',
  maxLinesCount=120
)
```
JetBrains MCP 内嵌 Node 没把 pnpm 放进 PATH，直接 PowerShell 调用会找不到；包一层 `cmd.exe /c` 即可。

### 5.4 CI 验证（已配，无须手动）
`.github/workflows/ci.yml` 在 push main / PR 时跑：
- generator drift 检查（`generate-properties.mjs` → `git diff --exit-code properties.generated.ts`）
- type-check + test + build core + build 3 examples

---

## 六、STOP 节点（自主推进时遇到必停下）

- 每个 Phase / Batch 末尾 → 全量 test + type-check + build + bench → push → 停下让用户审
- 任何 `git push` 前（除非用户已 explicit 授权"推送即发布"）
- 触发 TS2589 / 任何 type-check 红 / test 红
- generator 输出 diff 超 30% 行数（多半是 csstype 升级带来意外）
- bench 退化 > 20%
- 遇到 API 形态 / 命名级别的设计决策
- **要发版本**（bump version + tag + push tag）—— 始终用户手动

---

## 七、严格禁止

- `git push --force` / `git reset --hard` / 删远端引用
- `pnpm publish` / `npm publish`（用户始终手动）
- 改 `.gitconfig` / `.npmrc` 凭据
- 写 CI/CD secrets
- 跳 commit hook (`--no-verify`) / 跳签名
- `rm -rf` / `Remove-Item -Recurse -Force`（除非用户单次 explicit 授权）

---

## 八、关键陷阱表（按踩过频率排序）

### 8.1 ★ dist/ 与 src/ 不同步（最大坑）
**症状**：改对外类型 → commit + push → 用户 IDEA 仍报错。  
**原因**：dist/index.d.ts 是上次 build 产物；IDEA 通过 node_modules symlink 读旧签名。  
**防范**：**每次改对外类型后必须** `pnpm build`；examples 的 tsconfig 加 `paths` 直指 src。

### 8.2 ★ Proxy `bind` 到 receiver 不是 target
`chain/proxy.ts` 拦截 `get` 时**必须** `.bind(receiver)`。bind 到 `target` 让 `_when`/`_apply`/`_nest` 内 `fn(this)` 传出 target（原始 chain，无 carrier），后续 `s.color._primary` 触发不了 Proxy → TypeError。

### 8.3 ★ csstype `Properties` 默认不接 number
`Properties['padding']` 默认 `Padding<string | 0>`。generator 用 `Properties<string|number, string|number>` 实例化让 length/time 接 number。

### 8.4 ★ Generator 不解析 spread + 命名常量（已修）
`keywords: [...JUSTIFY_KW, 'auto']` 让 generator 漏 spread。AST parser 加 `collectStringArrayConsts` + SpreadElement 展开。

### 8.5 interface extends mapped type
`interface X<T> extends ResolvedTheme<T>` 在 `verbatimModuleSyntax` 严格模式下 TS2312。  
改用 `type X<T> = _Internal<T> & ResolvedTheme<T>` + const 强转。

### 8.6 noUncheckedIndexedAccess
`ctx.color!.primary` 返回 `string | number | undefined` → function token 类型不满足 ThemeValue → T 推断为 never → 级联 never。  
测试里 cast；生产代码避免依赖 indexed access narrowing。

### 8.7 vitest happy-dom 下 `import.meta.url` 不可用
报"URL must be of scheme file"。用 `process.cwd()` 代替（vitest 工作目录就是 packages/core）。

### 8.8 自定义 schema 用数字 / 特殊字符 key 非合法 ident
内置 token 全语义化（`tiny/small/middle/large/huge`，可加 `none/full`），无此问题。  
但用户扩展时若用 `'2xl'` / `'4xl'` 等数字开头 key —— Schema interface 用字面量字符串：`'2xl': string`。访问：`theme.blur['2xl']`。Chain 上 `_blur('2xl')` 不带 `_` 直接命中（toIdent 函数会把它转成 `_2xl` 形 carrier token）。

### 8.9 schema 上 function token 通过 `theme.<cat>.<key>` 读 — 类型与运行时不一致
`Object.assign(this, schema)` 把 function 原值挂到 instance；类型签名是 `string | number` 但运行时是 function。  
**修复**：永远走 `theme.resolve()` / `icss(theme, ...)` / `new Chain(theme)` 拿值，**不要**直接读 `theme.color.x` 当展开后的真值用。Theme 构造时 dev 模式会 warn。

### 8.10 ★ 类型层 statement-only —— carrier / unit / modifier 全部返回 `void`（2026-05-22 实施）
**类型层硬约束**：所有 carrier setter（`s.color('red')` / `s.color._primary` / `s.color.red` / `s.padding.px(8)` / `s.color._primary.alpha(50)`）的 TS 返回类型都是 `void`，链式 `s.X.x.Y.y` **编译会红**（`Property 'Y' does not exist on type 'void'`）。

**runtime 不变**：chain Proxy 仍 `return chain`，JS 层依赖 chain 状态切换的实现不动；只是类型签名不暴露 chain。

**唯一例外 —— ColorTokenValue**：`c.color._primary` 命中 color token 返回 `ColorTokenValue`（暴露 11 个 modifier：`alpha` / `darken` / `lighten` / `mix` / `shade` / `tint` / `saturate` / `desaturate` / `complement` / `rotateHue` / `invert`），是 token 的"语义延伸窗口"；modifier 调用后才返回 `void`。⚠️ modifier 是**覆盖式、不累积**，`s.color._primary.alpha(50).darken(15)` 现在编译错（darken 是 void 上的访问），并对齐既有"后者覆盖前者"语义。

**Chain 内建方法不在此约束内**：`_hover` / `_apply` / `_media` / `_when` / 等 89+ 个仍返回 `: this`，允许 `s._hover(fn)._active(fn2)` 这种 block 连写（block 容器，不是"一行 css"）。

**chain 风格**：每条 setter 表达式独立一行；IDE 补全只在 token / keyword 选择位置展开，永不爆 Chain 自身表面。

完整决策见 `.claude/decisions/2026-05-22-statement-only-type-layer.md`。

### 8.11 .claude/ untracked 导致 `pnpm publish` 报 `ERR_PNPM_GIT_UNCLEAN`
`.gitignore` 必须 ignore `.claude/settings.local.json`（**不要** ignore 整个 `.claude/`，否则项目级 settings.json 也入不了 git）。

### 8.12 npm 2FA 强制 publish（2024+）
新账号 publish 报 `E403 Two-factor authentication required`。  
两条出路：① 启用 2FA（Authenticator app，**不要 Security Key 路径**）；② 创建 **Granular Access Token** 时勾上 **"Bypass two-factor authentication (2FA)"** + Organizations 权限 "No access"。

### 8.13 csstype 6.0 升级 vite-plugin-dts 警告
"newer than bundled compiler engine"。不阻塞 build，留观察；未来 dts 出问题再升 API Extractor。

### 8.14 vitest agent 环境跑不通 pnpm
JetBrains MCP 内嵌 Node 没把 pnpm 放进 PATH。包一层 `cmd.exe /c "pnpm ..."` 即可。

---

## 九、内建嵌套方法（89+ 个，按职责）

| 组 | 方法 |
|---|---|
| 状态伪类 | `_hover` `_active` `_focus` `_focusVisible` `_focusWithin` `_disabled` `_checked` `_enabled` |
| 表单伪类 | `_required` `_optional` `_valid` `_invalid` `_readOnly` `_placeholderShown` `_inRange` `_outOfRange` |
| 链接 / 目标 | `_link` `_visited` `_target` `_dir(rtl/ltr, fn)` |
| 伪元素 | `_before` `_after` `_placeholder` `_selection` `_marker` |
| 结构伪类 | `_firstChild` `_lastChild` `_only` `_empty` `_nthChild(n, fn)` `_nthOfType(n, fn)` |
| group / peer | `_groupHover` `_groupFocus` `_groupActive` `_peerHover` `_peerFocus` `_peerChecked` |
| 媒体查询 | `_media(query, fn)` `_dark` `_light` `_motionReduce` `_motionSafe` `_print` `_screen` |
| 容器查询 | `_container(name, fn)` `_supports(query, fn)` |
| 嵌套 / 工具 | `_apply(...)` `_when(cond, fn)` `_nest(selector, fn)` `_state(props, mapping)` |
| 现代 CSS 4 | `_safeArea(side, fn)` `_scrollSnap(...)` `_overscroll(...)` `_field(...)` |
| 文本工具 | `_truncate()` `_lineClamp(n)` |
| 选择器 | `_not(selector, fn)` `_has(selector, fn)` `_is(selector, fn)` `_where(selector, fn)` |
| Token-aware | `_media('_middle', fn)` `_blur('_middle')` `_dur('_small')` |

完整签名见 `packages/core/src/chain/Chain.ts`。

---

## 十、ENHANCED_PROPS 与 generator

### 10.1 single source of truth
`packages/core/src/chain/enhanced-props.ts` 列出 ~195 条增强属性，**类型 + 运行时双向对齐**：

```ts
export const ENHANCED_PROPS: Record<string, EnhancedPropConfig> = {
  color: { tokenCat: 'color', keywords: [...COLOR_KW], unitClass: null },
  padding: { tokenCat: 'spacing', keywords: [...LENGTH_KW], unitClass: 'length' },
  // ...
}
```

### 10.2 generator 漂移守护（CI 红线）
`scripts/generate-properties.mjs` 读 csstype `Properties` 的 JSDoc + ENHANCED_PROPS 名单 → 派生 `src/types/properties.generated.ts`：
- 增强名单 → `PropCarrier` / `ColorPropCarrier`
- 其余 ~660 个 → `PropFn`（函数态 + 全局关键字）

CI 步骤"Generator drift check"会跑 generator 再 `git diff --exit-code`。**改 ENHANCED_PROPS 后必须重跑 generator + 提交结果**，否则 CI 红。

### 10.3 W6.1 extra-keywords slot
`src/chain/config/extra-keywords.config.ts` 是 ENHANCED_PROPS 漏掉的 CSS keyword 兜底入口（如 `place-items` 的 `start/end/center` 等）。

---

## 十一、token / unit / keyword 速查

### 11.1 默认 schema 18 category
`color` `spacing` `radius` `shadow` `fontSize` `fontWeight` `lineHeight` `letterSpacing` `fonts` `borders` `zIndex` `opacity` `duration` `easing` `aspectRatio` `size` `cursor` `transitionProperty` + `breakpoint`（响应式专用） + `blur`（含 `2xl` / `3xl` 字面量 key）

### 11.2 默认 token 命名（0.6.0 / 0.8.0 / 0.9.0 改名汇总）

**总哲学**：**5 阶 + 可能有 none + 可能有 full + 少数特例**。词汇分两类：
- **数量/尺寸维度**用 size 词 `tiny / small / middle / large / huge` —— 字面表达"小到大"
- **强度/质量/角色维度**用领域词 —— 字面表达"该维度的含义"

**禁用**：xs/sm/md/lg/xl（与 breakpoint 混淆）、纯数字 key `'0'..'100'`（非语义化）。

#### 用 size 词（tiny → huge）

| Category | Keys | 默认值 / 备注 |
|---|---|---|
| `spacing` | tiny/small/middle/large/huge | **`iem(0.25/0.5/1/1.5/2)`** —— 走 iem(默认 4/8/16/24/32px),`ZBox :iem` 全站切换基准 |
| `fontSize` | tiny/small/middle/large/huge | **`iem(0.75/0.875/1/1.125/1.25)`** —— 默认 12/14/16/18/20px;`:iem="ZIemPreset.rem"` 达到 a11y 大字模式 |
| `radius` | none/tiny/small/middle/large/huge/**full** | none=`'0'` / 5 阶`iem(0.25/0.5/0.75/1/1.5)`(默认 4/8/12/16/24px)/ **full=`'9999px'`**(语义性 ∞,不缩放) |
| `shadow` | tiny/small/middle/large/huge | 保留 px 字面量（装饰性效果，与设计稿绑定，**不**跟 unit 缩放） |
| `blur` | **none**/tiny/small/middle/large/huge | none=`'0'` / 5 阶 `iem(0.25/0.5/1/1.5/2.5)`(默认 4/8/16/24/40px) |
| `breakpoint` | tiny/small/middle/large/huge | **保留 px**（媒体查询基准，与"屏幕宽度"硬绑定，**不**跟 unit 缩放） |
| `duration` | **none**/tiny/small/middle/large/huge | 6 阶；0ms/75ms/150ms/300ms/500ms/700ms（时间，非长度） |
| `zIndex` | **none**/tiny/small/middle/large/huge + 角色 modal/popover/tooltip/toast + auto | 0/10/20/30/40/50（无单位） |

#### 用领域词（按强度顺序）

| Category | Keys | 默认值 | 备注 |
|---|---|---|---|
| `fontWeight` | thin/extralight/light/normal/medium/semibold/bold/extrabold/black | 100..900 | **9 阶（特例）**；CSS 标准词；`normal/bold` 与 keyword 双命中 |
| `lineHeight` | **none**/tight/snug/normal/relaxed/loose | 1 / 1.25 / 1.375 / 1.5 / 1.625 / 2 | 6 阶；Tailwind 标准；`normal` 与 keyword 双命中 |
| `letterSpacing` | tighter/tight/normal/wide/wider | -0.05 / -0.025 / 0 / 0.025 / 0.05 em | 5 阶；Tailwind 标准；`normal` 与 keyword 双命中 |
| `opacity` | **none**/faint/dim/half/strong/solid/**full** | 0 / 0.05 / 0.25 / 0.5 / 0.75 / 0.95 / 1 | 7 阶；含 none+full |

#### 不动（function / role 维度，不分大小）

| Category | Keys | 备注 |
|---|---|---|
| `easing` | default/linear/in/out/inOut | 5 个 timing function |
| `aspectRatio` | square/video/portrait/landscape | 4 个常用比例 |

#### 0.9.0 BREAKING 迁移速查（按 `_token` 访问形态）

| 旧 | 新 | 同值？ |
|---|---|---|
| `fontWeight._bold` | `fontWeight._bold` 不变 | ✓ |
| `fontWeight._medium` | `fontWeight._medium` 不变 | ✓ |
| `fontWeight._normal` | `fontWeight._normal` 不变 | ✓ |
| `opacity._0` | `opacity._none` | ✓ |
| `opacity._50` | `opacity._half` | ✓ |
| `opacity._70` | `opacity._strong` | 0.7→0.75 |
| `opacity._75` | `opacity._strong` | ✓ |
| `opacity._100` | `opacity._full` | ✓ |
| `lineHeight._tight` | `lineHeight._tight` 不变 | ✓ |
| `letterSpacing._wide` | `letterSpacing._wide` 不变 | ✓ |
| `zIndex._50` | `zIndex._huge` | ✓ (50) |
| `zIndex._modal` | `zIndex._modal` 不变 | ✓ |

CSS keyword fallback 路径 `fontWeight.bold` / `lineHeight.normal` / `letterSpacing.normal` / `zIndex.auto` **始终可用**。

### 11.3 LENGTH_UNITS（30 个）
`.px(n)` `.rem(n)` `.em(n)` `.ch(n)` `.ex(n)` `.percent(n)` `.vw(n)` `.vh(n)` `.vmin(n)` `.vmax(n)` `.svh/svw/lvh/lvw/dvh/dvw(n)`（小/大/动态视口）`.cm(n)` `.mm(n)` `.in(n)` `.pt(n)` `.pc(n)` `.q(n)` `.cqw/cqh/cqi/cqb/cqmin/cqmax(n)`（容器查询单位）`.fr(n)`

### 11.4 TIME_UNITS
`.ms(n)` `.s(n)`

### 11.5 ANGLE_UNITS
`.deg(n)` `.rad(n)` `.turn(n)` `.grad(n)`

### 11.6 Tailwind palette
完整 242 色 + 11 语义色。`tw('blue', '600')` helper。`TAILWIND_PALETTE` / `FLAT_PALETTE` / `PALETTE_NAMES` / `PALETTE_SHADES` 全部导出。

---

## 十二、关键技术决策（实现核心）

### 12.1 type intersection + const 强转
```ts
class _ThemeClass<T extends ThemeSchema> { ... }
export type Theme<T> = _ThemeClass<T> & ResolvedTheme<T>
export const Theme = _ThemeClass as unknown as { new<T>(schema: T): Theme<T>; ... }
```
原因：`interface Theme<T> extends ResolvedTheme<T>` 在 `verbatimModuleSyntax` 下 TS2312。

### 12.2 PropCarrier 类型 = 四态交叉
```ts
type PropCarrier<TSelf, TValue, TTokens, TKeywords, TUnits, TExtraKeywords> =
  ((value: TValue) => TSelf)                      // ① fn
  & { readonly [K in TTokens]: TSelf }             // ② token
  & { readonly [K in TKeywords]: TSelf }           // ③ keyword
  & { readonly [K in TExtraKeywords]: TSelf }      // ③' W6 slot
  & TUnits                                         // ④ unit
```
颜色专用：`ColorPropCarrier` 命中 token 返回 `ColorTokenValue<TSelf>` 暴露 6 modifier。

### 12.3 闭包陷阱（嵌套时必读最新 `_node`）
carrier 内部所有对 `_node` 的读写**必须**走 `chain._node`（不要快照 `_node` 引用）。`_nest(sel, fn)` 临时切换 `chain._node` 引用到子节点（try/finally 还原），carrier 必须通过 chain.\_node **间接**访问。

### 12.4 carrier 缓存
`chain._carriers: Map<string, callable>` 缓存。注意：缓存对象只引用 `chain`（不引用 `_node`），闭包陷阱依然适用。

### 12.5 Theme.getKeymap() 懒缓存（W4.1）
```ts
class _ThemeClass<T> {
  private _keymap: Map<string, Map<string, string>> | null = null
  getKeymap() {
    if (this._keymap == null) this._keymap = buildKeymap(this.resolve())
    return this._keymap
  }
}
```
Chain 构造时优先复用 `theme.getKeymap()`。**bench icss 19k → 404k ops/s（21×）**。

### 12.6 resolveTheme freeze 策略
`resolveTheme` 只 freeze **每个 category 内部 record**，**不 freeze 顶层**。这让 mergeTheme 后能再构建新对象；Vue 响应式靠 `theme.value = newTheme` 整体替换（标准模式），无需在 core 改 freeze。

### 12.7 mergeTheme 不再支持 function token
partial 应基于已解析的字面量。dev 模式扫到 function 会 warn，不阻塞。

---

## 十三、ui-vue 开发约定

> **状态**：Provider 层 + composables + locale 已实施（0.0.4+，2026-05）。基础组件 Button/Input/Dialog/... 尚未实现，按 13.6 / 13.7 模板逐个加。

### 13.0 组件设计哲学（总纲）

**所有 ui-vue 组件必须遵守的四条原则**。Button / Input / Dialog / Tabs / Select / ... 一概按此画。`ZIcon` 是首个参照实现（§13.10）。

**① ★ props 形态:全 chain factory 范式(2026-05-23 修订,撤销 Size5 union)**

外观 props 一律走 **chain factory**,**不再接受 Size5 字面量字符串**。所有"档位"通过 schema token 在 factory 内表达(`(s) => s._middle`)。详见 `.claude/decisions/2026-05-23-prop-shape-pure-factory.md`。

**5 种 prop 形态**:

```ts
export interface ZxxxProps {
  // Type A:单属性 factory —— prop 名 ≈ CSS 属性名
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  // 实现:s.color(props.color)

  // Type B:复合 wire factory —— 启用即 wire 一组规则,用户只控关键参数
  spin?: ((d: Chain<ZuiSchema>['animationDuration']) => void) | undefined
  // 实现:if (props.spin) { s.animationName(...); s.animationIterationCount.infinite; ...; s.animationDuration(props.spin) }

  // Type C:一对多 factory —— 同一 factory 作用到多个 CSS 属性
  size?: ((w: Chain<ZuiSchema>['width']) => void) | undefined
  // 实现:if (props.size) { s.width(props.size); s.height(props.size) }

  // Type V:variant 视觉变体 —— 内联字符串字面量,不导出独立 type alias
  variant?: 'filled' | 'outlined' | 'text' | 'ghost' | 'link'

  // Type N:真二态 boolean / 业务字符串 / 原生 HTML / 第三方继承(保留)
  disabled?: boolean
  trigger?: 'hover' | 'click'
  type?: 'button' | 'submit' | 'reset'
  placement?: Placement   // floating-ui 自带类型

  // 兜底逃生口
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
```

**用户写法**:

```vue
<!-- Type A 单属性 -->
<ZIcon :color="(c) => c._primary" />
<ZIcon :color="(c) => c._danger.alpha(50)" />     <!-- modifier 链 -->
<ZFlex :justify="(j) => j.spaceBetween" :align="(a) => a.center">...</ZFlex>

<!-- Type B 复合 wire -->
<ZIcon :spin="(d) => d.s(1)" />                   <!-- 1 秒一圈;name/iteration/timing 自动 -->

<!-- Type C 一对多 -->
<ZIcon :size="(w) => w.iem(1.25)" />              <!-- 显式 iem,width+height 同步 -->
<ZIcon :size="(w) => w._middle" />                <!-- 走 schema sizes token -->

<!-- Type V variant -->
<ZButton variant="outlined" />

<!-- 逃生口 -->
<ZIcon :css="(s) => { s.cursor.pointer; s._hover(h => h.color(c => c._primary)) }" />
```

**禁忌**(违反必须改):

| ❌ 错误形态 | ✅ 正确形态 |
|---|---|
| `justify?: 'between'` 配 MAP 翻译表 | `justify?: factory` (Type A) |
| `size?: 'small' \| 'middle' \| 'large'`(纯字面量枚举) | `size?: factory` (Type C) |
| `color?: 'primary' \| 'danger'`(颜色字面量) | `color?: factory` (Type A) |
| `direction?: 'horizontal' \| 'vertical'`(布局方向,无 JS 逻辑耦合) | `direction?: factory` (Type A 操作 `flexDirection`) |
| `export type ZXxxVariant = ...` 单独 type alias | 内联到 props interface (Type V) |
| 组件内 `XXX_MAP: Record<keyword, css-value>` 翻译表 | 直接走 factory + chain token access |

**iem 盒子模型 JSDoc 规范**:任何使用 iem 单位的尺寸 prop / 内部默认值,JSDoc **必须**标注 iem 盒子模型(**只写 iem,不写 px**,iem 物理意义由 ZBox Provider 控制):

```ts
/**
 * 高度 2iem(默认)
 * - padding-y: 0.25iem × 2
 * - border: 0.0625iem × 2
 * - 内容区:1.5iem
 */
```

或更简洁:

```ts
/**
 * 默认尺寸:width/height = 1iem,正方形。
 */
```

**实现选择**(按组件复杂度二选一,不变):
- **极简组件**(ZIcon / Spinner / Badge 等):setup 内一个 `icss(themed.value, s => { ... })`,内联 base + 维度 + 末尾 `props.css?.(s)`。**无** `defineVariants` 工厂、**无** `cx` 拼接。
- **复杂组件**(Button / Input / Dialog —— 含 hover/focus/disabled 状态笛卡尔积):用 `defineVariants` / `defineParts`;但**外观维度 props 仍然全 factory**,只是内部 className 拆 base / 状态 / variants 多层。

历史决策:
- `2026-05-22-carrier-factory-prop.md` —— 首次引入 factory props
- `2026-05-22-prop-shape-union.md` —— Size5 union(已被 2026-05-23 撤销)
- `2026-05-23-prop-shape-pure-factory.md` —— 当前规范(全 factory)

**② iem 单位优先 · `<ZBox :iem>` 全站切换基准 · 罕见局部用 em**

`iem` = **"我自己使用的 em"**,跟 CSS `rem`(root em)对称:
- `rem` = 浏览器根元素 font-size 倍率(浏览器掌控,默认 16px)
- `iem` = ZBox 注入的基准倍率(应用层掌控,**默认 1iem = 16px**,等同 1rem)

- **大部分尺寸维度**(spacing / radius / fontSize / blur / gap / width / height / padding / 等):组件内走 `s.padding.iem(1)` / `s.width.iem(1.5)` 等;theme token 表用 `iem(N)` helper(emit `calc(N * var(--zui-iem, 16px))`)。**N 是"几个基准字号"**,跟 rem 用法一致(`iem(1)` = 1iem,`iem(1.5)` = 1.5iem)。
- **`<ZBox :iem>` 单点切换 1iem 物理意义**:默认 `ZIemPreset.default`(`'16px'`)/ `ZIemPreset.large`(`'20px'`,大字模式)/ `ZIemPreset.compact`(`'14px'`,紧凑)/ `ZIemPreset.em`(`'1em'`,跟父字号)/ `ZIemPreset.rem`(`'1rem'`,a11y 跟浏览器根字号)。**嵌套 Provider 通过 css cascade 自然覆盖,兄弟 Provider 各自独立 —— 零运行时合并开销**。
- **ZIcon 等图标默认也走 iem**(`(w) => w.iem(1)` 默认),跟 Provider 字号联动,整站统一图标尺寸。想"跟随父容器字号"的罕见局部场景显式 `(w) => w.em(N)`。注意 em 单位只在一个属性上设(如 ZIcon 只设 `width/height: N em`,**不**设 `font-size: N em`),避免 em 复合(fontSize.em(N) + width.em(N) 会让 width 算到 N²×父字号)。
- **不走 iem 的几类**(语义不同):
  - `breakpoint` —— 媒体查询基准,跟"屏幕宽度"硬绑定
  - `shadow` —— 装饰性效果,保留 px 字面量与设计稿绑定(**可选 iem 化**,看产品需求)
  - `radius.full = '9999px'` —— "无穷大圆角"语义
  - `letterSpacing` —— em 单位（跟字体本身缩放）
  - `duration / easing / zIndex / opacity / lineHeight / aspectRatio / fontWeight` —— 非长度

**③ cssNode factory 是唯一逃生口**

任何不在维度里的需求 — 任意属性 / 任意值 / 伪类 / 媒体查询 / 容器查询 / 嵌套选择器 — 一律通过 chain factory prop 表达：

```ts
css?:   (s: Chain<ZuiSchema>) => void   // 单节点组件唯一
cssHeader?: (s: Chain<ZuiSchema>) => void   // 多 slot 组件按节点拆 prop
cssBody?:   (s: Chain<ZuiSchema>) => void
cssItem?:   (s: Chain<ZuiSchema>) => void
```

- 命名约定：`css<NodeName>` —— 名字里带"哪个节点"，预留 multi-slot 组件并列命名空间
- **应用时机 = base + 维度之后，可覆盖任何属性**：
  - 极简组件 / icss 路径：在同一个 chain factory 末尾 `props.css?.(s)`
  - 复杂组件 / defineVariants 路径：单独 `icss(themed.value, props.css)` → `cx(variantsCls, cssCls)`
- 内部实现固定走 `icss(themed.value, ...)` —— 一行，不要手写 `new Chain + toClassName`
- 用户拿到的 chain 默认 `Chain<ZuiSchema>`；通过 module augmentation 扩 `UserColorExt` 等即可获得自定义 token 的 IDE 补全，**无需穿透 `<S>` 泛型**

**④ 三层覆盖模型 · 无 component token namespace**

不再有「ComponentTokenRegistry / `<ZBox :component-tokens>` / `withComponentTokens` / `componentTokensFor`」这套 namespace 级覆盖。三个口子各管一类需求：

| 层级       | 场景                            | 怎么做                                                                                  |
| ---------- | ------------------------------- | --------------------------------------------------------------------------------------- |
| **Theme**  | 全组件统一改色                  | `zuiLight.extend({ color: { primary: '#abc' } })` → 所有 `_primary` 调用点跟随          |
| **Schema** | 新增品牌 / 自定义 token         | `interface UserColorExt { brandRoyal: string }` augmentation → chain `_brandRoyal` 自动可用 |
| **Instance** | 单组件 / 单实例改一项         | `:css="s => s.width.em(1.2)"` 任意 chain 方法直接覆盖                              |

- 组件 setup 直接吃 `useZTheme()`，**不走** `withComponentTokens / componentTokensFor`
- 设计档位由 **theme schema** 表达(`spacing.middle = '16px'` / `opacity.half = 0.5` / `duration.middle = '300ms'`),组件层不再硬编码 `SIZE_MAP` / `DEPTH_MAP` / `SPIN_MAP` 字面量(2026-05-22 改 chain factory props 范式后废除)
- 用户写 prop 时通过 factory 调用 schema token:`(o) => o._half` / `(s) => { s.animationDuration._middle; ... }`
- color 类直接走 chain shortcut `s.color._primary / _success / _danger / _warning / _info`(schema token),跟 vue-button demo 一致
- deriver 直接读 `theme.color.primary` 等 schema 字段，**无需 cast / narrow helper** —— core 的 `ResolvedTheme` mapped type 已让 schema 字面量类型穿透（function token 求值后才宽化为 `string | number`）

**⑤ 文件组织 · 单文件 SFC + 双 `<script>` 块**

每个组件 1 个 `.vue` 文件 + 3 行 barrel `index.ts`。**禁止** `types.ts` / `tokens.ts` / `variants.ts` 等独立子文件。

- `<script lang="ts">`（无 setup 标记）—— 模块级出口：
  - `export interface ZXxxProps { ... }`(每个维度都是 chain factory:`color?: (c: Chain<ZuiSchema>['color']) => void`,粒度匹配维度本身的语义)
  - ~~数值类档位 const map~~ —— 已废除(2026-05-22),设计档位走 theme schema
  - 复杂组件还有 `function createXxxVariants()` / `createXxxParts()` —— 同样内部 const
- `<script setup lang="ts">` —— 组件运行时：`defineProps<ZXxxProps>()`、setup 逻辑、computed、模板绑定
- `index.ts` 3 行 re-export：`ZXxx` 默认导出 + `type ZXxxProps`（顶层 `packages/ui-vue/src/index.ts` 同步 barrel）

**总结一句话**：**chain factory props + em + cssNode + 三层覆盖模型 + 单文件 SFC** 五件套 — 组件 API 表面极小(每组件 2 项导出)、零硬编码档位、设计档位集中在 schema、所有复杂度推给用户在 carrier factory 内自由表达。

### 13.1 包结构与 subpath 入口

```
packages/ui-vue/src/
├── provider/          # ZBox + 4 composables + injection keys
├── locale/            # ZLocale types + zhCN / enUS + mergeLocale
├── composables/       # useStyles / useDynamicStyles / useVariants / useParts / useResponsive / useBreakpoints
├── shared/            # 内部工具（floating-ui wrapper、domId、...）
├── components/        # 基础组件（每组件一目录）
└── index.ts           # 顶层 barrel（聚合 + 部分 core re-export）
```

**subpath exports**：
- `@kenconnet666/zui-vue` —— 主入口
- `@kenconnet666/zui-vue/provider`
- `@kenconnet666/zui-vue/composables`
- `@kenconnet666/zui-vue/locale`
- `@kenconnet666/zui-vue/components`
- `@kenconnet666/zui-vue/components/icon`（每个基础组件都开独立 subpath）

打包仿 core：`preserveModules` + 关 minify + dts `rollupTypes:false`（保留源结构，IDE go-to-def 看得到注释）。

### 13.2 peer / dev 依赖矩阵

```jsonc
"peerDependencies": {
  "@emotion/css": "^11.13.5",
  "@emotion/unitless": "^0.10.0",
  "@floating-ui/vue": "^1.1.11",
  "@vicons/ionicons5": "^0.13.0",         // optional
  "@vueuse/core": "^14.3.0",
  "@vueuse/integrations": "^14.3.0",
  "async-validator": "^4.2.5",
  "color2k": "^2.0.3",
  "date-fns": "^4.1.0",
  "date-fns-tz": "^3.2.0",
  "vue": "^3.5.0"
},
"peerDependenciesMeta": {
  "@vicons/ionicons5": { "optional": true }   // 图标走"插槽优先 + 默认 SVG"，不强制
}
```

工作区根 devDeps 还装了语言服务器（统一版本，2026-05 拍板锁 minor）：

| 包 | 版本 |
|---|---|
| `typescript` | `~6.0.3` |
| `vue-tsc` | `~3.3.0` |
| `@vue/language-core` | `~3.3.0` |
| `@vue/language-server` | `~3.3.0` |
| `@vue/typescript-plugin` | `~3.3.0` |
| `@vue/tsconfig` | `^0.9.1` |
| `@vue/eslint-config-typescript` | `^14.7.0` |
| `eslint-plugin-vue` | `~10.9.0` |
| `svelte-language-server` | `^0.18.0` |
| `typescript-language-server` | `^5.2.0` |
| `@vitejs/plugin-vue` | `^6.0.6` |
| `@vitejs/plugin-vue-jsx` | `^5.1.5` |

`vue-tsc` 与 `@vue/language-*` 必须保持同 minor（同步发版），用 `~` 锁住 minor。

### 13.3 ZBox —— 实际签名

```ts
// @kenconnet666/zui-vue/provider
import { ZBox } from '@kenconnet666/zui-vue/provider'
import type { Theme, DeepPartial } from '@kenconnet666/zui-core'
import type { ZLocale, ZLocalePartial, ZDateConfig } from '@kenconnet666/zui-vue/provider'
import type { Locale as DateFnsLocale } from 'date-fns'

interface Props<S extends ThemeSchema = ThemeSchema> {
  theme?: Theme<S>                          // 完整主题（顶层推荐）
  themePatch?: DeepPartial<S>               // 局部 patch（嵌套推荐，与 theme 同时给时先 theme 再 patch）
  locale?: ZLocale                          // 完整替换
  localePatch?: ZLocalePartial              // namespace 级 + 字段级浅合并
  timezone?: string                         // IANA 时区，未传继承父；根未传 → 'UTC'
  dateLocale?: DateFnsLocale                // date-fns Locale，未传继承父
  iem?: string | number                     // 逻辑单位 iem 的物理映射,写到 wrapper inline --zui-iem(默认 16px)
}
```

合并策略一栏：

| context | 顶层 fallback | 嵌套合并方式 |
|---|---|---|
| theme | `defaultLight.resolve()`（dev warn） | `mergeTheme` 深合并 |
| locale | `zhCN` | `mergeLocale` namespace+字段两级浅合并；数组整体替换 |
| timezone | `'UTC'` | 子覆盖父 |
| dateLocale | `undefined` | 子覆盖父 |
| iem | `'16px'`(`ZIemPreset.default`) | wrapper inline `--zui-iem`,子层 css cascade 自然覆盖(无运行时合并;兄弟 Provider 互不影响) |

Inject keys（symbol）：`Z_THEME_KEY` / `Z_LOCALE_KEY` / `Z_DATE_KEY`，全部 `InjectionKey<Ref<...>>`。`Z_THEME_KEY` 退化到 `ResolvedTheme<any>`（Vue InjectionKey 不支持泛型），子组件 `useZTheme<S>()` cast 回。

`<ZBox v-slot="{ theme, locale }">` 暴露 unwrapped 值；不需要时直接 `<slot />`。

### 13.4 3 个 composable —— 实际签名

```ts
// 树外调用：dev warn + 回落 defaultLight / zhCN / UTC
useZTheme<S>(): Ref<ResolvedTheme<S>>

useZLocale(): Ref<ZLocale>
useZLocale<NS extends keyof ZLocaleRegistry>(ns: NS): ComputedRef<ZLocaleRegistry[NS]>

useZDate(): {
  timezone: ComputedRef<string>
  locale: ComputedRef<DateFnsLocale | undefined>
  format(date, fmt): string         // formatInTimeZone(date, tz, fmt, { locale })
  toZoned(date): Date               // toZonedTime(date, tz)
  fromZoned(date): Date             // fromZonedTime(date, tz)
}
```

### 13.5 useStyles / useVariants / useResponsive

```ts
// 静态工厂（factory 闭包不动）
useStyles<S>(factory: (s: Chain<S>) => void): ComputedRef<string>

// 动态工厂（factory 依赖响应式 source）
useDynamicStyles<S>(factoryGetter: MaybeRefOrGetter<(s: Chain<S>) => void>): ComputedRef<string>

// variants 工厂模式（13.6 详述）
useVariants<S, P>(
  factory: (theme: ResolvedTheme<S>) => (props: P) => string,
  propsGetter: () => P,
): ComputedRef<string>

useParts<S, P, Slot>(
  factory: (theme: ResolvedTheme<S>) => Record<Slot, (props: P) => string>,
  propsGetter: () => P,
): ComputedRef<Record<Slot, string>>

// 响应式 prop 归一化
useBreakpoints<S>(): ComputedRef<string[]>      // theme.breakpoint 的 keys
useResponsive<T, S>(
  valueGetter: () => ResponsiveValue<T> | undefined,
): ComputedRef<{ base?: T; [bp: string]: T | undefined } | undefined>
```

### 13.6 组件 variants 工厂导出为函数

**不要**导出常量 `const button = defineVariants(theme, ...)`（绑定单一 theme，ConfigProvider 切主题时不会重算）。

**正确**：

```ts
// components/button/variants.ts
export const createButtonVariants = <S extends ThemeSchema>(theme: ResolvedTheme<S>) =>
  defineVariants(theme, {
    base: s => { ... },
    variants: { size: { sm: ..., md: ..., lg: ... }, intent: { primary: ..., danger: ... } },
  })

// components/button/Button.vue
const cls = useVariants(createButtonVariants, () => ({ size: props.size, intent: props.intent }))
```

emotion 内部按 css 内容 hash 复用 className，没有性能损失。

### 13.7 多 slot 组件用 defineParts

Dialog / Tabs / Select / Menu / Popover / DropdownMenu 等。`useParts(createXxxParts, propsGetter)` 返回各 slot className。嵌套 ZBox 内通过 `extendParts(theme, parent, partialConfig)` 局部覆盖。

### 13.8 三层覆盖路径（替代旧 component token）

组件不再注册 namespace 到 ComponentTokenRegistry。三种典型覆盖场景：

```ts
// ① 全组件改色 —— 改 theme 语义色，所有 _primary 调用点跟随
const myLight = zuiLight.extend({ color: { primary: '#abc' } })
<ZBox :theme="myLight">...</ZBox>

// ② 新增品牌色 / 自定义 token —— schema augmentation
declare module '@kenconnet666/zui-vue' {
  interface UserColorExt { brandRoyal: string }
}
const branded = zuiLight.extend({ color: { brandRoyal: '#1a3a8f' } })
// 任意组件内：s.color._brandRoyal  ← IDE 自动补全

// ③ 单实例改 —— css 直接 chain 方法
<ZIcon :css="s => { s.width.em(1.2); s.color._danger }" />
```

组件 setup 直接 `useZTheme()` + chain factory props,无 `withComponentTokens` 派生层、无模块级 const map(2026-05-22 改 chain factory 范式后废除)。

### 13.9 ZLocale 字典与扩展

内建 namespace：`common / button / input / select / dialog / pagination / form / datePicker`。用户自定义组件扩展自家 namespace：

```ts
declare module '@kenconnet666/zui-vue' {
  interface ZLocaleRegistry {
    myWidget: { title: string; ok: string }
  }
}
```

`mergeLocale(parent, partial)`：namespace 级浅合并；同 namespace 内字段级浅合并；数组（`weekdaysShort` / `monthsShort`）整体替换。

### 13.10 ZIcon —— v3 chain factory props 首个参照实现(2026-05-22)

**§13.0 ① chain factory props 范式的首个落地** —— 每个外观维度都是 `(c) => void` 工厂,setup 内一行应用,无 switch / 无 const map / 无 cx 拼接。复杂组件(Button / Input / Dialog)照此结构但 className 拆 base / 状态 / variants 多层。

**ZIcon size 默认 iem**(2026-05-22 改 iem 范式后):默认 `(w) => w.iem(1)`(1iem,默认 16px),跟 ZBox 字号联动 —— 整站统一图标尺寸。**只设 width(height 自动镜像)、不设 fontSize**,避免 em 复合(若同时 `s.fontSize.em(N)` + `s.width.em(N)`,width 会算到 N²×父字号)。想"跟随父字号"的罕见场景显式 `(w) => w.em(N)`。

**文件结构**(2 个文件,~150 行核心实现 + 2 行 barrel):

```
packages/ui-vue/src/components/icon/
├── ZIcon.vue          # <script> + <script setup> + <template> 三块
└── index.ts           # 2 行 re-export(ZIcon + ZIconProps)
```

**对外 API surface(仅 2 项)**:

```ts
import { ZIcon, type ZIconProps } from '@kenconnet666/zui-vue'
// 或单组件 import:
import { ZIcon } from '@kenconnet666/zui-vue/components/icon'
```

**没有** `createIconVariants` —— ZIcon 直接走 icss 内联。**没有** `SIZE_MAP` / `DEPTH_MAP` / `SPIN_MAP`(2026-05-22 改 chain factory 范式后废除,设计档位由 theme schema 承担)。

**`ZIconProps`**(2026-05-22 v3:**4 维度全单 carrier**):

```ts
export interface ZIconProps {
  size?:  ((w: Chain<ZuiSchema>['width']) => void) | undefined              // width carrier;height 自动镜像
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined              // color carrier
  depth?: ((o: Chain<ZuiSchema>['opacity']) => void) | undefined            // opacity carrier
  spin?:  ((d: Chain<ZuiSchema>['animationDuration']) => void) | undefined  // animationDuration carrier(name/iteration/timing 自动加)
  css?: ((s: Chain<ZuiSchema>) => void) | undefined                     // 兜底逃生口

  component?: Component                              // 双模式:与 default slot 互斥(slot 优先)
  tag?: string                                       // 根元素,默认 'i'
  label?: string                                     // a11y
}
```

**`| undefined`** 显式标注 —— 与 `exactOptionalPropertyTypes: true` 兼容(用户工程开了严格模式时可以传 undefined 等同不传)。

**height 镜像 width 实现**:setup 内 `props.size(s.width)` 后读 `s._node.width` 复制到 `_node.height`,保证图标永远正方形。非正方形场景走 css 单独设。

**spin 自动加 name / iteration / timing**:启用时(传了 spin)在 setup 内硬编码 `s.animationName(presetAnimations.spin)` + `s.animationIterationCount.infinite` + `s.animationTimingFunction.linear`,用户只通过 `(d) => d.s(1)` 控制速度。自定义 easing / 反向旋转走 css 覆盖。

**用户使用 — 4 维度全单 carrier factory,极致一致**:

```vue
<!-- size: w.em(N) 一行,height 自动镜像 -->
<ZIcon :component="HeartIcon" :size="(w) => w.em(1.25)" />     <!-- 1.25em × 1.25em -->
<ZIcon :component="HeartIcon" :size="(w) => w.iem(1)" />       <!-- 1iem,跟随 :iem -->
<ZIcon :component="HeartIcon" :size="(w) => w.px(20)" />       <!-- 字面量 -->

<!-- color: schema token / modifier / 字面量 -->
<ZIcon :component="HeartIcon" :color="(c) => c._primary" />
<ZIcon :component="HeartIcon" :color="(c) => c._danger.alpha(50)" />
<ZIcon :component="HeartIcon" :color="(c) => c('#ff00aa')" />

<!-- depth: 字面量 / schema token -->
<ZIcon :component="HeartIcon" :depth="(o) => o(0.5)" />
<ZIcon :component="HeartIcon" :depth="(o) => o._half" />

<!-- spin: 只控制速度(name / iteration / timing 自动加) -->
<ZIcon :component="Reload" :spin="(d) => d.s(1)" />            <!-- 1 秒一圈 -->
<ZIcon :component="Reload" :spin="(d) => d.ms(300)" />         <!-- 300ms -->
<ZIcon :component="Reload" :spin="(d) => d._middle" />         <!-- schema duration token -->

<!-- 非正方形 / 自定义 easing 走 css 兜底 -->
<ZIcon :component="HeartIcon" :css="(s) => { s.width.px(24); s.height.px(32) }" />
<ZIcon
  :component="Reload"
  :spin="(d) => d.s(2)"
  :css="(s) => { s.animationTimingFunction('ease-in-out'); s.animationDirection.reverse }"
/>
```

IDE 在每个 callback 内补全完整:
- `c.` → 全部 color schema token(`_primary` / `_danger` / `_blue600` / ...)+ 146 CSS 命名色 + `currentColor` 等 keyword
- 输入 `_p` → 模糊筛选 `_p*` token(`_primary` / `_pink500` 等)
- `c._primary.` → 11 个 ColorTokenValue modifier(`alpha` / `darken` / `lighten` / ...)

**`ZIcon.vue` 内部结构**(按 §13.0 ⑤ 五件套):

`<script lang="ts">` 块(模块级出口):
- type imports(`Chain` / `Component` / `ZuiSchema`)+ runtime imports(`icss`)
- `export interface ZIconProps {}`
- **没有** const map(已废除)

`<script setup lang="ts">` 块(**setup 仅 ~35 行**):
- `import { computed } from 'vue'` + `import { useZTheme } from '../../provider'`
- `withDefaults(defineProps<ZIconProps>(), { ... })` —— ⚠️ **Function 类型 prop 的 default 直接给函数本身**,不要 `() => fn` 工厂(Vue 不调用 outer factory,会导致 default 永远不生效)
- `const theme = useZTheme()` —— 一行注入
- **唯一 className computed**(5 行替代旧 30+ 行 switch + 镜像 / 自动属性两个 trick):

```ts
const props = withDefaults(defineProps<ZIconProps>(), {
  size: (w: Chain<ZuiSchema>['width']) => { w.em(1) },          // 默认 1em(height 自动镜像)
  color: (c: Chain<ZuiSchema>['color']) => { c.currentColor },
  tag: 'i',
})

const className = computed(() => icss(theme.value, (s) => {
  // base
  s.display.inlineFlex
  s.alignItems.center
  s.justifyContent.center
  s.flexShrink(0)
  s.lineHeight(1)

  // size:用户只控制 width carrier;height 自动镜像 width(保证图标正方形)
  props.size(s.width)
  if (s._node.width !== undefined) s._node.height = s._node.width

  // color:单 carrier factory
  s.color(props.color)

  // depth:单 carrier factory;不传 = 不写 opacity
  if (props.depth) s.opacity(props.depth)

  // spin:启用时自动加 name / iteration / timing,用户只控制速度
  if (props.spin) {
    s.animationName(presetAnimations.spin)
    s.animationIterationCount.infinite
    s.animationTimingFunction.linear
    s.animationDuration(props.spin)
  }

  // css 兜底
  props.css?.(s)
}))
```

**为什么所有维度都接单 carrier**:粒度统一 —— 每个 prop 表达"该维度的一个核心轴"(width / color / opacity / animationDuration),IDE 补全聚焦该 carrier 能力(token / keyword / 字面量 / modifier / unit method)。其它属性(height 镜像 / animation name 等)由组件 setup 自动处理,用户**不需要也不能**直接操作 — 想突破走 css。这种"单轴 + 兜底"的设计模式比"多属性 chain factory"更易理解、更难写错。

**测试覆盖**:42 tests = provider 9 + icon 33(`tests/icon.spec.ts`:渲染 5 / size 7 含镜像 + css 非正方形 / color 5 / depth 4 / spin 5 含自动属性 + css 覆盖 timing / css 4 / a11y 2)。tests 显式标注 callback 入参 `(c: Chain<ZuiSchema>['color'])` 因为 mount props 字面量内 vue-tsc 不能从 carrier union 重载推断回 callback 类型。

### 13.11 SSR（Nuxt / Vue SSR）
```ts
import { createIcssInstance } from '@kenconnet666/zui-core'
import createCache from '@emotion/cache'

// 服务器侧创建独立 emotion instance（隔离请求）
const cache = createCache({ key: 'zui' })
const { icss, cx /* ... */ } = createIcssInstance(cache)
// 渲染完后 cache.flush() 拿 critical CSS
```

---

## 十四、命令速记

```powershell
# ─── 起手验证 ───
pnpm install
pnpm --filter @kenconnet666/zui-core test
pnpm --filter @kenconnet666/zui-core run type-check
pnpm --filter @kenconnet666/zui-core build           # ★ 同步 dist
pnpm --filter @kenconnet666/zui-core bench           # 性能基线

# ─── 改 ENHANCED_PROPS / generator 后 ───
node scripts/generate-properties.mjs
pnpm --filter @kenconnet666/zui-core test -- parity

# ─── examples 调试 ───
pnpm --filter @kenconnet666/example-vanilla-button dev
pnpm --filter @kenconnet666/example-vue-button dev
pnpm --filter @kenconnet666/example-react-button dev

# ─── docs 演示站 ───
pnpm --filter @kenconnet666/docs dev           # vite dev server，默认 :5174（hash 路由）
pnpm --filter @kenconnet666/docs build         # 静态 SPA → packages/docs/dist
pnpm --filter @kenconnet666/docs preview       # 预览 build 产物
# docs 通过 vite alias 直接读 zui-core / zui-vue 的 src，改组件即时热更

# ─── 发版（changesets 流程） ───
pnpm changeset                                       # 交互选 patch / minor / major + 写 summary
pnpm changeset version                               # bump packages/*/package.json + 写 CHANGELOG.md + 删 .changeset/*.md
# 复核：git status / git diff packages/core/package.json
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
npm config set //registry.npmjs.org/:_authToken "npm_xxxxxxxx"
pnpm publish --access public
npm config delete //registry.npmjs.org/:_authToken  # 用完删除（安全）

# ─── 仓库远端 ───
# https://github.com/kenconnet666/zui.git
# 账号 kenconnet666 <kenconnet@foxmail.com>
```

---

## 十五、Git remote 配置

远程 HTTPS 没缓存凭据时 push 会 403：
- **方案 A**：配 PAT — `git config --global credential.helper manager`，再 push 时填用户名 + PAT
- **方案 B**：切 SSH — `git remote set-url origin git@github.com:kenconnet666/zui.git`（需 `~/.ssh/id_ed25519.pub` 已加到 GitHub）

---

## 十六、自主推进规则

### 16.1 离线决策同步
agent 离线做的边角决策，直接 commit message 留痕（无需单独 Plan.md 累加）。

### 16.2 任务追踪
≥3 步用 `TaskCreate` / `TaskUpdate` 追踪；每步 atomic；完成立刻 `completed`，不要批量。

### 16.3 commit 模板
```
<type>(<scope>): <中文摘要>

<body>
- 改动 1
- 改动 2

验证：type-check ✅ / test 566 ✅ / build ✅

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

`type` ∈ `feat` / `fix` / `chore` / `docs` / `refactor` / `test` / `perf` / `build` / `ci`。

---

**skill 末**。所有 zui 项目知识集中在此；其它 .md 仅做精简介绍或入口。
