---
name: zui
description: zui monorepo（@kenconnet666/zui-core + @kenconnet666/zui-vue）项目专用指南。当用户在本仓库工作、提及 zui / Chain / Theme / icss / defineVariants / defineParts / ZConfigProvider / ENHANCED_PROPS / 四态访问，或开发 ui-vue 组件库时激活此 skill。
---

# zui 项目工作指南

> **本文件是 zui 仓库的 single source of truth**，含设计 / API / 陷阱 / ui-vue 约定 / 验证流程 / 发版流程。
> 其它 .md 文件（README / AGENT.md / CHANGELOG）只是入口或精简介绍，知识全部在此。

---

## 一、项目定位

**框架无关**的 CSS-in-JS 工具库 monorepo。

- `@kenconnet666/zui-core`（已发 npm 0.5.0+）—— 框架无关核心：基于 `@emotion/css`，`class Chain<TSchema>` 用 declaration merging 把 ~857 个 CSS 属性挂到强类型 builder 上。
- `@kenconnet666/zui-vue`（开发中）—— Vue 3 组件库 + `ZConfigProvider` 嵌套覆盖。

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
│   │   │   ├── provider/                    # ZConfigProvider + 4 composables + keys
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
| `spacing` | tiny/small/middle/large/huge | **`zu(4/8/16/24/32)`** —— 走 zu，Provider `:unit` 可全站切换基准 |
| `fontSize` | tiny/small/middle/large/huge | **`zu(12/14/16/18/20)`** —— 走 zu，配合 `:unit="ZUnitPreset.rem"` 可达到 a11y 大字模式 |
| `radius` | none/tiny/small/middle/large/huge/**full** | none=`'0'` / 5 阶`zu(4/8/12/16/24)` / **full=`'9999px'`**（语义性 ∞，不缩放） |
| `shadow` | tiny/small/middle/large/huge | 保留 px 字面量（装饰性效果，与设计稿绑定，**不**跟 unit 缩放） |
| `blur` | **none**/tiny/small/middle/large/huge | none=`'0'` / 5 阶 `zu(4/8/16/24/40)` |
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

**① 离散预设优先 · size 类维度可选 `| number` escape hatch · 其它无连续输入**

外观 props **默认**只接受**有限枚举档位**，参考 5 阶哲学 `tiny / small / middle / large / huge`（必要时 `none` / `full`）。
- **禁止**：任意 CSS 字符串（`'24px'` / `'1.5rem'` / `'#abcdef'`）、任意对象 / 数组 / 函数（除 `cssRoot` 等明确 factory prop）—— 这类**复合输入**全部走 §3 cssNode factory
- **禁止"半离散字符串"**：不要"枚举档位 OR 自定义字符串"二选一的 union，prop 表达只走枚举一条路
- **size 类维度允许 `| number` escape hatch**（受控逃逸口）：
  - **适用**：尺寸 / 倍率 / 时长 / 角度等"**数值本身有语义**"的维度。如 `size?: 'tiny' | ... | 'huge' | number`（em 倍率）、`spin?: 'tiny' | ... | 'huge' | number`（秒）、`rotate?: 'left' | 'right' | number`（角度）
  - **不适用**：`color` / `depth` / `intent` / `status` 等"**档位即语义**"的枚举（"primary" / "danger" 不能用数字表达），这类只允许枚举，复杂场景走 `cssRoot`
  - **类型严格**：只开放**单一 number**（em 倍率 / 秒 / 角度等），不开放 `string` 或 union object。需要"任意 css length"走 `cssRoot.zu(N)` 或 `cssRoot.px(N)`
  - **实现固定形态**：`typeof props.X === 'number' ? props.X : enumMap[props.X]`
  - 维度 default 仍是枚举字符串（如 `size: 'middle'`），不能默认 number
- **无 dynamic styles / 无 applyResponsive / 无运行时 token resolution**
- 每个维度必须有合理默认值（`defaultVariants` 或 `withDefaults`），用户不传也能直接渲染
- **实现选择**（按组件复杂度二选一）：
  - **极简组件**（ZIcon / Spinner / Badge 等 —— 每个维度 → 几行 CSS、无状态笛卡尔积）：setup 内一个 `icss(themed.value, s => { ... })`，内联 base + 4 维度 switch + 末尾调用 `props.cssRoot?.(s)`。**无** `defineVariants` 工厂、**无** `cx` 拼接，一个 className 一气呵成。
  - **复杂组件**（Button / Input / Dialog / Tabs / Select —— 含 hover/focus/disabled/active 等状态笛卡尔积，或多 slot）：用 `defineVariants` / `defineParts` 工厂；工厂是 `<script>` 块的 module-level const，**不对外 export**。**number escape hatch 在 setup 内分支处理**（变体工厂只接枚举档位，number 走 setup 直接 chain method）

**② zu 单位优先 · 文字相关用 em · Provider 全站切换基准**

- **大部分尺寸维度**（spacing / radius / fontSize / blur / gap / width / height / padding / 等）：组件内走 `s.padding.zu(8)` / `s.width.zu(16)` 等；theme token 表用 `zu(N)` helper（emit `calc(N * var(--zui-unit, 1px))`）。
- **`<ZConfigProvider :unit>` 单点切换 1zu 物理意义**：默认 `'1px'`（1zu = 1px，与传统 css 一致）；`'2px'` 整站放大 2×；`ZUnitPreset.rem`（`'0.0625rem'`）跟随浏览器根字号（a11y 大字模式整站同步）；`'0.05vw'` 响应式 fluid sizing。嵌套 Provider 通过 css cascade 自然覆盖。
- **图标 / Avatar 等文字相关组件用 em**：跟随父字号缩放，让它们在 `<button style="font-size:14px">` / `<h1>` 等不同字号容器里自动协调（用 zu 会让 icon 不随按钮文字缩放）。**注意：em 单位只在一个属性上设**（如 ZIcon 只设 `width/height: N em`，**不**设 `font-size: N em`），避免 em 复合（fontSize.em(N) + width.em(N) 会让 width 算到 N²×父字号）。
- **不走 zu 的几类**（语义不同）：
  - `breakpoint` —— 媒体查询基准，跟"屏幕宽度"硬绑定
  - `shadow` —— 装饰性效果，保留 px 字面量与设计稿绑定（**可选 zu 化**，看产品需求）
  - `radius.full = '9999px'` —— "无穷大圆角"语义
  - `letterSpacing` —— em 单位（跟字体本身缩放）
  - `duration / easing / zIndex / opacity / lineHeight / aspectRatio / fontWeight` —— 非长度

**③ cssNode factory 是唯一逃生口**

任何不在维度里的需求 — 任意属性 / 任意值 / 伪类 / 媒体查询 / 容器查询 / 嵌套选择器 — 一律通过 chain factory prop 表达：

```ts
cssRoot?:   (s: Chain<ZuiSchema>) => void   // 单节点组件唯一
cssHeader?: (s: Chain<ZuiSchema>) => void   // 多 slot 组件按节点拆 prop
cssBody?:   (s: Chain<ZuiSchema>) => void
cssItem?:   (s: Chain<ZuiSchema>) => void
```

- 命名约定：`css<NodeName>` —— 名字里带"哪个节点"，预留 multi-slot 组件并列命名空间
- **应用时机 = base + 维度之后，可覆盖任何属性**：
  - 极简组件 / icss 路径：在同一个 chain factory 末尾 `props.cssRoot?.(s)`
  - 复杂组件 / defineVariants 路径：单独 `icss(themed.value, props.cssRoot)` → `cx(variantsCls, cssRootCls)`
- 内部实现固定走 `icss(themed.value, ...)` —— 一行，不要手写 `new Chain + toClassName`
- 用户拿到的 chain 默认 `Chain<ZuiSchema>`；通过 module augmentation 扩 `UserColorExt` 等即可获得自定义 token 的 IDE 补全，**无需穿透 `<S>` 泛型**

**④ 三层覆盖模型 · 无 component token namespace**

不再有「ComponentTokenRegistry / `<ZConfigProvider :component-tokens>` / `withComponentTokens` / `componentTokensFor`」这套 namespace 级覆盖。三个口子各管一类需求：

| 层级       | 场景                            | 怎么做                                                                                  |
| ---------- | ------------------------------- | --------------------------------------------------------------------------------------- |
| **Theme**  | 全组件统一改色                  | `zuiLight.extend({ color: { primary: '#abc' } })` → 所有 `_primary` 调用点跟随          |
| **Schema** | 新增品牌 / 自定义 token         | `interface UserColorExt { brandRoyal: string }` augmentation → chain `_brandRoyal` 自动可用 |
| **Instance** | 单组件 / 单实例改一项         | `:css-root="s => s.width.em(1.2)"` 任意 chain 方法直接覆盖                              |

- 组件 setup 直接吃 `useZTheme()`，**不走** `withComponentTokens / componentTokensFor`
- 数值类档位（size / depth / spin 倍率 / opacity / 时长）写成模块级 `const SIZE_MAP / DEPTH_MAP / SPIN_MAP` 字面量 —— 设计语言决策，运行时不开放覆盖（要变就 BREAKING）
- color 类直接走 chain shortcut `s.color._primary / _success / _danger / _warning / _info`（schema token），跟 vue-button demo 一致
- deriver 直接读 `theme.color.primary` 等 schema 字段，**无需 cast / narrow helper** —— core 的 `ResolvedTheme` mapped type 已让 schema 字面量类型穿透（function token 求值后才宽化为 `string | number`）

**⑤ 文件组织 · 单文件 SFC + 双 `<script>` 块**

每个组件 1 个 `.vue` 文件 + 3 行 barrel `index.ts`。**禁止** `types.ts` / `tokens.ts` / `variants.ts` 等独立子文件。

- `<script lang="ts">`（无 setup 标记）—— 模块级出口：
  - `export interface ZXxxProps { ... }`（维度 union **inline 写在字段处**，**不抽** `ZXxxSize` / `ZXxxColor` 等中间子类型 alias）
  - 数值类档位 `const SIZE_MAP / DEPTH_MAP / SPIN_MAP` 字面量 —— **内部 const，不 export**
  - 复杂组件还有 `function createXxxVariants()` / `createXxxParts()` —— 同样内部 const
- `<script setup lang="ts">` —— 组件运行时：`defineProps<ZXxxProps>()`、setup 逻辑、computed、模板绑定
- `index.ts` 3 行 re-export：`ZXxx` 默认导出 + `type ZXxxProps`（顶层 `packages/ui-vue/src/index.ts` 同步 barrel）

**总结一句话**：**离散 + em + cssNode + 三层覆盖模型 + 单文件 SFC** 五件套 — 组件 API 表面极小（每组件 2 项导出）、零运行时分支、所有复杂度推给用户在 chain 里自由表达。

### 13.1 包结构与 subpath 入口

```
packages/ui-vue/src/
├── provider/          # ZConfigProvider + 4 composables + injection keys
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

### 13.3 ZConfigProvider —— 实际签名

```ts
// @kenconnet666/zui-vue/provider
import { ZConfigProvider } from '@kenconnet666/zui-vue/provider'
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
  unit?: string | number                    // 逻辑单位 zu 的物理映射，写到 wrapper inline --zui-unit
}
```

合并策略一栏：

| context | 顶层 fallback | 嵌套合并方式 |
|---|---|---|
| theme | `defaultLight.resolve()`（dev warn） | `mergeTheme` 深合并 |
| locale | `zhCN` | `mergeLocale` namespace+字段两级浅合并；数组整体替换 |
| timezone | `'UTC'` | 子覆盖父 |
| dateLocale | `undefined` | 子覆盖父 |
| unit | `'1px'` | wrapper inline `--zui-unit`，子层 css cascade 自然覆盖（无运行时合并） |

Inject keys（symbol）：`Z_THEME_KEY` / `Z_LOCALE_KEY` / `Z_DATE_KEY`，全部 `InjectionKey<Ref<...>>`。`Z_THEME_KEY` 退化到 `ResolvedTheme<any>`（Vue InjectionKey 不支持泛型），子组件 `useZTheme<S>()` cast 回。

`<ZConfigProvider v-slot="{ theme, locale }">` 暴露 unwrapped 值；不需要时直接 `<slot />`。

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

Dialog / Tabs / Select / Menu / Popover / DropdownMenu 等。`useParts(createXxxParts, propsGetter)` 返回各 slot className。嵌套 ZConfigProvider 内通过 `extendParts(theme, parent, partialConfig)` 局部覆盖。

### 13.8 三层覆盖路径（替代旧 component token）

组件不再注册 namespace 到 ComponentTokenRegistry。三种典型覆盖场景：

```ts
// ① 全组件改色 —— 改 theme 语义色，所有 _primary 调用点跟随
const myLight = zuiLight.extend({ color: { primary: '#abc' } })
<ZConfigProvider :theme="myLight">...</ZConfigProvider>

// ② 新增品牌色 / 自定义 token —— schema augmentation
declare module '@kenconnet666/zui-vue' {
  interface UserColorExt { brandRoyal: string }
}
const branded = zuiLight.extend({ color: { brandRoyal: '#1a3a8f' } })
// 任意组件内：s.color._brandRoyal  ← IDE 自动补全

// ③ 单实例改 —— cssRoot 直接 chain 方法
<ZIcon :css-root="s => { s.width.em(1.2); s.color._danger }" />
```

组件 setup 直接 `useZTheme()` + 模块级 const map（`SIZE_MAP / DEPTH_MAP / SPIN_MAP`），无 `withComponentTokens` 派生层。

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

### 13.10 ZIcon —— 首个基础组件（单文件 SFC + icss 内联参照实现）

**§13.0 五件套首个落地，对应 §13.0 ① 实现选择中的 "极简组件" 分支：setup 内一个 `icss` chain factory 内联全部维度，不上 `defineVariants` 工厂。复杂组件（Button / Input / Dialog）照此结构但换用 `defineVariants`。**

**❗ ZIcon 是 §13.0 ② 的 em 例外**：图标语义上跟随父字号（在 `<button>` / `<h1>` 等不同字号容器内自动协调），所以 size 维度用 `s.width.em(N)` / `s.height.em(N)` 而非 zu。**只设 width/height、不设 font-size**：避免 em 复合（若同时 `s.fontSize.em(N)` 与 `s.width.em(N)`，width 会算到 N²×父字号，与"N × 父字号"语义不符）。Avatar 等"跟随文字"的组件也按此 em 路径，其它组件全部走 zu。

**文件结构**（2 个文件，~190 行核心实现 + 3 行 barrel）：

```
packages/ui-vue/src/components/icon/
├── ZIcon.vue          # <script> + <script setup> + <template> 三块
└── index.ts           # 2 行 re-export（ZIcon + ZIconProps）
```

**对外 API surface（仅 2 项）**：

```ts
import { ZIcon, type ZIconProps } from '@kenconnet666/zui-vue'
// 或单组件 import：
import { ZIcon } from '@kenconnet666/zui-vue/components/icon'
```

`SIZE_MAP` / `DEPTH_MAP` / `SPIN_MAP` / `ZIconSize` / `ZIconColor` 等 **全部内部化**，不导出。**没有** `createIconVariants` —— ZIcon 直接走 icss 内联，不上 variants 工厂。

**`ZIconProps`（union inline，不抽子类型 alias）**：

```ts
export interface ZIconProps {
  size?:  'tiny' | 'small' | 'middle' | 'large' | 'huge' | number            // 5 阶档位 + number escape（任意 em 倍率；默认 'middle'）
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'  // 6 种语义（默认 default）
  depth?: 'none' | 'subtle' | 'muted' | 'dim' | 'faded' | 'ghost'            // 5 阶 + none 淡化（默认 none）
  spin?:  'none' | 'tiny' | 'small' | 'middle' | 'large' | 'huge'            // 6 阶纯枚举（默认 none；**不**接 boolean）
  cssRoot?:   (s: Chain<ZuiSchema>) => void                                  // ★ 二次精细覆盖逃生口
  component?: Component                                                       // 双模式：与 default slot 互斥（slot 优先）
  tag?: string                                                                // 根元素，默认 'i'
  label?: string                                                              // a11y
}
```

**`size` 的 number escape**（§13.0 ① escape hatch 范式参照实现）：
```vue
<ZIcon size="middle" />        <!-- 5 阶档位，1em -->
<ZIcon :size="1.125" />        <!-- 任意 em 倍率，1.125em -->
<ZIcon :size="2.3" />          <!-- 2.3em -->
```
实现固定形态 `typeof props.size === 'number' ? props.size : enumMap[props.size]`。后续 Button.size / Dialog.size / Avatar.size 等 size 类维度按此模式照画。`spin` 暂未开 `| number`（用得少），需要时按同模式加。

**数值类档位（模块级 const，不对外）**：

```ts
const SIZE_MAP = { tiny: 0.75, small: 0.875, middle: 1, large: 1.25, huge: 1.5 } as const   // em 倍率
const DEPTH_MAP = { subtle: 0.8, muted: 0.6, dim: 0.4, faded: 0.25, ghost: 0.15 } as const  // opacity
const SPIN_MAP = { tiny: 0.3, small: 0.5, middle: 1, large: 2, huge: 3 } as const           // 秒
```

设计语言级决策，运行时不开放覆盖（要变就改这里 = BREAKING）。要 app 级改色走 `zuiLight.extend({ color: { primary: '#abc' } })`；要新增品牌色走 `UserColorExt` augmentation；要单点改走 `:css-root`。

**`ZIcon.vue` 内部结构**（按 §13.0 ⑤ 五件套）：

`<script lang="ts">` 块（模块级出口）：
- type imports（`Chain` / `Component` / `ZuiSchema`）+ runtime imports（`icss` / `presetAnimations`）
- `export interface ZIconProps {}`
- 3 个 `as const` 数值 map（SIZE_MAP / DEPTH_MAP / SPIN_MAP）

`<script setup lang="ts">` 块（**setup 仅 ~50 行**，无 variants 工厂，无 component token 派生）：
- `import { computed } from 'vue'` + `import { useZTheme } from '../../provider'`
- `withDefaults(defineProps<ZIconProps>(), { size: 'middle', color: 'default', depth: 'none', spin: 'none', tag: 'i' })`
- `const theme = useZTheme()` —— 一行注入，直吃 `ResolvedTheme<ZuiSchema>`
- **唯一 className computed**（一气呵成，无 cx 拼接）：

```ts
const className = computed(() => icss(theme.value, (s) => {
  // base
  s.display.inlineFlex; s.alignItems.center; s.justifyContent.center
  s.flexShrink(0); s.lineHeight(1)
  // size —— number escape 优先，否则查 SIZE_MAP（只设 width/height、不设 fontSize 避免 em 复合）
  const sizeN = typeof props.size === 'number' ? props.size : SIZE_MAP[props.size]
  s.width.em(sizeN); s.height.em(sizeN)
  // color —— 5 个语义色走 chain shortcut，'default' 显式 currentColor
  switch (props.color) {
    case 'default': s.color('currentColor'); break
    case 'primary': s.color._primary; break
    case 'success': s.color._success; break
    case 'warning': s.color._warning; break
    case 'danger':  s.color._danger;  break
    case 'info':    s.color._info;    break
  }
  // depth —— 'none' 跳过；其余查 DEPTH_MAP
  if (props.depth !== 'none') s.opacity(DEPTH_MAP[props.depth])
  // spin —— 'none' 跳过；其余查 SPIN_MAP
  if (props.spin !== 'none') {
    s.animationName(presetAnimations.spin)
    s.animationDuration.s(SPIN_MAP[props.spin])
    s.animationIterationCount.infinite
    s.animationTimingFunction.linear
  }
  // cssRoot 用户覆盖（末尾调用，可覆盖以上任何属性）
  props.cssRoot?.(s)
}))
```

**为什么 color 走 chain shortcut 而 size / depth / spin 走 const map**：chain `_xxx` 是 schema 字符串 token 的 getter，能给 `s.color(...)` / `s.backgroundColor(...)` 这类字符串属性用。`s.width.em(N)` / `s.opacity(N)` / `s.animationDuration.s(N)` 需要 **number 直接传参**，chain shortcut 帮不到，所以这三个维度都吃模块级 const 字面量。

**`cssRoot` factory 范式**（任意值 / 任意 chain method 兜底）：

```vue
<ZIcon
  :component="HeartIcon"
  color="primary"
  :css-root="s => {
    s.cursor.pointer
    s.fontSize.px(24)                                    // 控制 1em 等于多少
    s._hover(h => { h.color._danger })
    s._media('_middle', m => { m.fontSize._iconSizeHuge })
  }"
/>
```

**测试覆盖**：~38 tests = provider 9 + icon 29（`tests/icon.spec.ts`：渲染 5 / size 5 含 number escape / color 3 / depth 3 / spin 7 / cssRoot 4 / a11y 2）。tests 只 import `ZIcon` + `Chain<ZuiSchema>`，不依赖任何内部 helper。

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
