---
name: zui
description: zui monorepo（@kenconnet666/zui-core + @kenconnet666/zui-vue）项目专用指南。当用户在本仓库工作、提及 zui / Chain / Theme / icss / defineVariants / defineParts / componentTokens / ZConfigProvider / ENHANCED_PROPS / 四态访问，或开发 ui-vue 组件库时激活此 skill。
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
│   │   │   │                                  keymap.ts / componentTokens.ts / defaults/
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
│   │   ├── tests/                           # 30 套 / 566 测试（截 2026-05）
│   │   ├── bench/
│   │   ├── examples/                        # vanilla-button / vue-button / react-button
│   │   └── CHANGELOG.md
│   └── ui-vue/                              # @kenconnet666/zui-vue（开发中）
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

### 3.5 Component Token Registry（组件库 token 命名空间）

```ts
// 用户用 declaration merging 注册：
declare module '@kenconnet666/zui-core' {
  interface ComponentTokenRegistry {
    button: { primary: string; primaryHover: string; bg: string }
    input: { borderFocus: string }
  }
}

// 派生：组件 token 从主题色派生 → flatten 进 theme.color
function withComponentTokens<T>(
  theme: ResolvedTheme<T>,
  derivers: ComponentTokenDerivers<T>,
  overrides?: ComponentTokenOverrides,                       // 用户 ConfigProvider override
): ResolvedTheme<T>
// 命名规则：button.primary → theme.color.buttonPrimary（camelCase 拼接）
// → Chain 上用 s.color._buttonPrimary 访问

// 反推：拿 namespace 下完整 token map
function componentTokensFor<C>(component: C, theme): Partial<ComponentTokenRegistry[C]>

// ★ 0.7.0+：多层 ConfigProvider 嵌套时合并多层 override
function mergeComponentTokenOverrides(
  ...layers: Array<ComponentTokenOverrides | undefined | null>
): ComponentTokenOverrides
// 每个 namespace 内部浅合并；后传层同 key 覆盖前传
```

### 3.6 StyleProps + 响应式

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

### 8.8 blur key `2xl` / `3xl` 不是合法 ident
Schema interface 用字面量字符串：`'2xl': string`。访问：`theme.blur['2xl']`。Chain 上 `_blur('2xl')` 不带 `_` 直接命中。

### 8.9 schema 上 function token 通过 `theme.<cat>.<key>` 读 — 类型与运行时不一致
`Object.assign(this, schema)` 把 function 原值挂到 instance；类型签名是 `string | number` 但运行时是 function。  
**修复**：永远走 `theme.resolve()` / `icss(theme, ...)` / `new Chain(theme)` 拿值，**不要**直接读 `theme.color.x` 当展开后的真值用。Theme 构造时 dev 模式会 warn。

### 8.10 token / keyword 命中后不返回 chain（statement-only 决策）
`c.color._primary` 命中 token 后返回 `ColorTokenValue`（暴露 `.alpha(n)` 等 modifier），**不是 chain**。  
`c.color.red` 命中 keyword 后语义是 statement，**用户不应**继续链式（`.red.padding.px(8)` 是错的）。  
chain 风格：每条独立一行。

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
| Token-aware | `_media('_md', fn)` `_blur('_md')` `_dur('_fast')` |

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

### 11.2 默认 size 命名（语义化，0.6.0 改名）
- `tiny` / `small` / `middle` / `large` / `huge` —— 用于 spacing / fontSize / 组件 size variant
- **不再用** xs/sm/md/lg/xl —— 与 breakpoint 名混淆

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

## 十三、ui-vue 开发约定（启动前预设）

### 13.1 顶层 ZConfigProvider 模式
```vue
<!-- ZConfigProvider.vue -->
<script setup lang="ts" generic="S extends ThemeSchema">
import { computed, provide, inject } from 'vue'
import {
  mergeTheme,
  mergeComponentTokenOverrides,        // ★ 0.7.0+
  type DeepPartial,
  type ResolvedTheme,
  type ComponentTokenOverrides,
} from '@kenconnet666/zui-core'

const props = defineProps<{
  theme?: DeepPartial<S>
  componentTokens?: ComponentTokenOverrides
}>()

const parentTheme = inject<Ref<ResolvedTheme<S>>>(THEME_KEY, /* globalDefault */)
const parentOverrides = inject<Ref<ComponentTokenOverrides>>(OVERRIDES_KEY, ref({}))

// 主题：父 + 子 partial 深合并
const mergedTheme = computed(() =>
  props.theme ? mergeTheme(parentTheme.value, props.theme) : parentTheme.value,
)

// component token overrides：父 + 子合并（key 级浅合并）
const mergedOverrides = computed(() =>
  mergeComponentTokenOverrides(parentOverrides.value, props.componentTokens),
)

provide(THEME_KEY, mergedTheme)
provide(OVERRIDES_KEY, mergedOverrides)
</script>
<template><slot /></template>
```

### 13.2 useStyles composable（ui-vue 内部，不入 core）
```ts
import { computed, type ComputedRef } from 'vue'
import { Chain, toClassName, type ResolvedTheme, type ThemeSchema } from '@kenconnet666/zui-core'

export function useStyles<S extends ThemeSchema>(
  theme: Ref<ResolvedTheme<S>>,
  factory: (s: Chain<S>) => void,
): ComputedRef<string> {
  return computed(() => {
    const c = new Chain<S>(theme.value)
    factory(c)
    return c.toString()
  })
}
```
**为什么不入 core**：core 框架无关是根本原则。

### 13.3 响应式 prop 解析
组件库内部，把 `theme.breakpoint` 的 keys 派生成 `breakpoints` 数组，传给 `isResponsiveValue(value, breakpoints)` 启用严格模式：
```ts
const breakpoints = Object.keys(theme.value.breakpoint ?? {})
const isResp = isResponsiveValue(propValue, breakpoints)
```

### 13.4 组件 variants 工厂导出为函数
**不要导出**常量 `const button = defineVariants(...)`（绑定单一 theme）。  
**导出工厂**：`function createButtonVariants(theme) { return defineVariants(theme, ...) }`，让 ConfigProvider 主题切换时重新调用，emotion 自动按内容 hash 复用 CSS。

### 13.5 多 slot 组件用 defineParts
Dialog / Tabs / Select / Menu / Popover / DropdownMenu 等多内部元素的组件用 `defineParts`。嵌套 ZConfigProvider 覆盖某个 slot 用 `extendParts(theme, parent, partialConfig)`。

### 13.6 component token 路径（推荐）
```ts
// 1. 用户声明 token 形状
declare module '@kenconnet666/zui-core' {
  interface ComponentTokenRegistry {
    button: { primary: string; primaryHover: string; bg: string }
  }
}

// 2. 组件库内部 deriver（从主题色派生）
const themed = withComponentTokens(
  theme,
  { button: (t) => ({ primary: t.color.primary, primaryHover: t.color.primaryHover, bg: t.color.bg }) },
  userOverrides,    // 来自 ZConfigProvider
)

// 3. 组件用 _buttonPrimary 访问
s.backgroundColor._buttonPrimary
```

### 13.7 SSR（Nuxt / Vue SSR）
```ts
import { createIcssInstance } from '@kenconnet666/zui-core'
import createCache from '@emotion/cache'
import { CacheProvider, getCacheProvider } from '@emotion/server'

// 服务器侧创建独立 emotion instance（隔离请求）
const cache = createCache({ key: 'zui' })
const { icss, cx, ... } = createIcssInstance(cache)
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
