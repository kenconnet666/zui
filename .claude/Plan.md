# `@kenconnet666/zui-core` 项目计划

> **设计文档 + 路线图**。运行级操作指南在 [`AGENT.md`](./AGENT.md)。
> 已发版 / 历史节奏 / commit 记录见 [`packages/core/CHANGELOG.md`](../packages/core/CHANGELOG.md) 与 `git log`。

---

## 〇、一句话定位

**框架无关**的 CSS-in-JS 工具库，基于 `@emotion/css`。

核心是 `class Chain<TSchema>` —— 用 declaration merging 把 ~857 个 CSS 属性挂到 builder 上，让
`s.color._primary` / `s.padding.px(16)` / `s.color._primary.alpha(50)` 全部强类型 + IDE 补全。

**框架适配（响应式包装、Provider）由用户在外面套**，库只给原料 + recipes。

---

## 一、设计目标与边界

### ✅ 库提供

- **`class Theme<T>`** — 继承或实例化拿强类型主题
- **`class Chain<T>`** — 链式 builder，所有 CSS 属性 + 内建嵌套 + 增强 carrier 按 `T` 推断
- **`class PropCarrier<...>` / `PropFn<...>`** — 属性级类型（callable + tokens + keywords + units）
- **`icss(theme, factory)`** — 一行 shortcut；以及 `resolveTheme` / `mergeTheme` / `toClassName` / `cx` / `ikeyframes` / `injectGlobal`
- **内置 default schema**（Tailwind 风）+ **59+ 内建嵌套链方法**
- **`createIcssInstance(emotion)`** — SSR / 多 emotion 实例的工厂
- 透传 `cx` / `ikeyframes` / `injectGlobal`

### ❌ 库**不**做

- 任何框架专用代码（无 Vue composable、无 React hook、无 Svelte store）
- Provider 组件（用户自己 30 行级 recipe 拼装）
- token → CSS variable 的自动桥接（token 出值始终是 JS 真值；`_var()` 是独立的"主动写自定义属性"逃生舱）
- 响应式封装（Vue `computed` / React `useMemo` / Svelte `$:`）
- 组件库 / recipe 变体

### ✅ generator 只做"派生类型"

`scripts/generate-properties.mjs` 读 **csstype `Properties` 接口的 JSDoc** + **`enhanced-props.ts` 名单**，派生 `src/types/properties.generated.ts`：

- 名单中的属性 → `PropCarrier` / `ColorPropCarrier`（四态）
- 其余 ~660 个属性 → `PropFn`（函数态 + 全局关键字）
- 每个属性带完整 JSDoc（MDN 链接、浏览器兼容表、Syntax、Initial value）

**ENHANCED_PROPS 是类型 + 运行时双向对齐的 single source of truth**，零漂移可能。

### 关键决策

| 项 | 决定 |
|---|---|
| 类型系统 | **class 泛型 + 继承** |
| 主题定义 | 用户 `extends Theme<T>` 或 `new Theme(schema)` |
| 框架支持 | 框架无关；用户自己拼 Provider（库出 recipe） |
| 入口 | `class Chain<T>` 核心 + `icss(theme, factory)` shortcut |
| Chain 风格 | **statement-only**：`s => { s.padding.px(16); s.color._primary }`，每条独立一行，**不**支持链式 return |
| Chain 构造 | **必传 theme**；不暗自走 DefaultSchema |
| 四态访问 | ① 函数调用 / ② `_`-prefixed token / ③ CSS keyword / ④ unit 方法 |
| Token 出值 | JS 真值（不做 token→CSS variable 自动桥接） |
| `alpha` 简写 | `chain.color._primary.alpha(50)`：token 命中立即赋值，`.alpha(n)` 重写为 rgba（0-100，%） |
| 保留属性名 | README 写明禁用 schema category 名：`label` / `constructor` / `toString` / `toCSSObject` / `_node` / `_theme` / `_keymap` / `_carriers`；运行时 INTERNAL_KEYS 白名单兜底 |
| 内置 schema | Tailwind 风 `DefaultSchema`，用户继承扩展或全替换 |
| 局部覆盖 | `mergeTheme(parent, partial)` 工具 |
| 性能取舍 | 类型完整 + IDE 补全优先；W4.1 keymap 缓存后 icss ~404k ops/s |

---

## 二、核心 API 表面

```ts
// ─── 主题类 ───
export class Theme<T extends ThemeSchema> {
  constructor(public schema: T)
  resolve(): ResolvedTheme<T>
  merge<P extends DeepPartial<T>>(partial: P): Theme<T>
  getKeymap(): Map<string, Map<string, string>>    // ★ W4.1 缓存
}
export interface Theme<T extends ThemeSchema> extends ResolvedTheme<T> {}

// ─── 链类 ───
export class Chain<T extends ThemeSchema = DefaultSchema> {
  constructor(theme: ResolvedTheme<T> | Theme<T>, options?: ChainOptions)

  // 增强属性（PropCarrier / ColorPropCarrier）— ENHANCED_PROPS 名单 ~195 条
  declare color: ColorPropCarrier<this, ...>
  declare padding: PropCarrier<this, ..., LengthUnits<this>>
  // ...

  // 未增强属性（PropFn）— ~660 个 csstype 属性
  declare alignSelf: PropFn<this, csstype.Property.AlignSelf>
  // ...

  // 内建方法（85+ 个 _ 前缀方法）— 见 README 内建方法表
  label(name: string): this
  _hover(fn: (s: this) => void): this
  // ... 详见 README

  // 输出
  toCSSObject(): CSSObject
  toString(): string
}

// ─── 类型工具 ───
export interface ThemeSchema {
  color?: Record<string, ThemeValue>
  spacing?: Record<string, ThemeValue>
  // ... 18 个内置 category
  [customCategory: string]: Record<string, ThemeValue> | undefined
}
export type ThemeValue = string | number | ((ctx: ResolvedThemeContext) => string | number)
export type ResolvedTheme<T> = { [Cat in keyof T]: { [K in keyof T[Cat]]: string | number } }
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }

// ─── 入口函数 ───
export function icss<T>(theme, factory): string
export function toClassName<T>(chain: Chain<T>): string
export function ikeyframes(factory): string
export function cx(...args): string
export function injectGlobal(styles): void

// ─── SSR / 多实例 ───
export function createIcssInstance(emotion): IcssInstance

// ─── 内置默认 ───
export const defaultLight: Theme<DefaultSchema>
export const defaultDark: Theme<DefaultSchema>
export type DefaultSchema = typeof DefaultSchema
```

---

## 三、关键技术决策（实现核心）

### 3.1 type intersection + const 强转

```ts
// 内部 class
class _ThemeClass<T extends ThemeSchema> {
  private _resolved: ResolvedTheme<T> | null = null
  constructor(public schema: T) { Object.assign(this, schema) }
  resolve(): ResolvedTheme<T> { /* ... */ }
}

// type alias 注入 ResolvedTheme 字段
export type Theme<T extends ThemeSchema> = _ThemeClass<T> & ResolvedTheme<T>
// const 强转保留 new / extends 能力
export const Theme = _ThemeClass as unknown as {
  new <T extends ThemeSchema>(schema: T): Theme<T>
  readonly prototype: _ThemeClass<ThemeSchema>
}
```

**为什么不用 `interface Theme<T> extends ResolvedTheme<T>`**：`verbatimModuleSyntax` 严格模式下 TS2312 报 interface 不能 extend mapped type。

### 3.2 PropCarrier 类型 = 四态交叉

```ts
export type PropCarrier<TSelf, TValue, TTokens extends string, TKeywords extends string,
  TUnits = unknown, TExtraKeywords extends string = never> =
    & ((value: TValue) => TSelf)                            // ① 函数
    & { readonly [K in TTokens]: TSelf }                    // ② token (_ 前缀)
    & { readonly [K in TKeywords]: TSelf }                  // ③ CSS keyword
    & { readonly [K in TExtraKeywords]: TSelf }             // W6.2 ExtraKeywords slot
    & TUnits                                                // ④ unit 方法

// 颜色专用：token 命中返回 ColorTokenValue（有 .alpha(n) 等 6 个 modifier）
export interface ColorTokenValue<TSelf> {
  alpha(n: number): TSelf       // 0-100 (%)
  darken(n: number): TSelf
  lighten(n: number): TSelf
  mix(other: string, n: number): TSelf
  saturate(n: number): TSelf
  desaturate(n: number): TSelf
}
```

### 3.3 闭包陷阱（嵌套时必须读最新 `_node`）

```ts
// ❌ carrier 闭包捕获 _node：_hover 嵌套写入会进父节点
function makeCarrierWrong(chain, prop) {
  const node = chain._node                     // 快照
  return (v) => { node[prop] = v }             // 错位
}

// ✅ 每次走 chain._node
function makeCarrierOk(chain, prop) {
  return (v) => { chain._node[prop] = v }      // 动态读
}
```

**原因**：`_nest(sel, fn)` 临时切换 `chain._node` 引用到子节点（try/finally 还原），carrier 必须**通过 chain._node 间接访问**。

### 3.4 ★ Proxy `bind` 到 `receiver` 不是 `target`

`proxy.ts` 拦截 `get` 时**必须** `.bind(receiver)`。若 bind 到 `target`，方法内 `this === target`（原始 chain，无 carrier）。`_when` / `_apply` / `_nest` 内部 `fn(this)` 传出 target，后续 `s.color._primary` 触发不了 Proxy → TypeError。

`this._node` 读取走 **INTERNAL_KEYS 白名单**（手写，加新内部方法时易漏 —— **§十五审计 B2** 拟改 prototype 扫描）。

### 3.5 carrier 缓存

`chain.color` 每次访问都建一个 callable Proxy 浪费。`Chain` 实例上挂 `_carriers: Map<string, callable>` 缓存。

```ts
function getOrCreateCarrier(chain, prop) {
  let cached = chain._carriers.get(prop)
  if (cached) return cached
  cached = buildCarrier(chain, prop)
  chain._carriers.set(prop, cached)
  return cached
}
```

注意：缓存对象只引用 `chain`（不引用 `_node`），§3.3 闭包陷阱依旧适用。

### 3.6 Theme.getKeymap() 缓存（W4.1）

```ts
class _ThemeClass<T> {
  private _keymap: Map<string, Map<string, string>> | null = null
  getKeymap() {
    if (this._keymap == null) this._keymap = buildKeymap(this.resolve())
    return this._keymap
  }
}
```

`Chain` 构造时优先复用 `theme.getKeymap()`，无 Theme 实例（裸 ResolvedTheme）才 `buildKeymap`。**bench icss 19k → 404k ops/s（21×）**。

---

## 四、关键陷阱表

| 项 | 处理 |
|---|---|
| **`interface X<T> extends T` 在 verbatimModuleSyntax 下 TS2312** | 改用 `type X<T> = _Internal<T> & ResolvedTheme<T>` + const 强转 |
| **class 实例返回 Proxy** | `return new Proxy(this, ...)` 合法；TS 严格模式下需要 `as unknown as Chain<T>` 双断言 |
| **保留属性名冲突** | `label` / `toString` / `toCSSObject` / `constructor` 不能作为 CSS 属性；INTERNAL_KEYS 白名单兜底；schema 不能起这些名 |
| **token 与 keyword 命名冲突** | token 强制 `_` 前缀；keymap 永远只接受 `_`-前缀键 |
| **carrier 闭包陷阱** | §3.3：carrier 必须通过 `chain._node` 间接访问 |
| **嵌套 try/finally** | `_nest` 必须 try/finally 还原 `_node`，避免 fn 抛错污染父链 |
| **TS 实例化深度** | 完整 Tailwind palette（200+ key）触发 TS2589；缓解：拆 `PaletteColorTokens` + `SemanticColorTokens` |
| **csstype `Properties` 默认不接 number** | generator 用 `Properties<string \| number, string \| number>` 实例化（length / time 属性接 number） |
| **Generator 不解析 spread / 命名常量** | AST parser 加 `collectStringArrayConsts` + SpreadElement 展开（已处理） |
| **★ dist/ 与 src/ 不同步** | examples + IDE TS 服务通过 node_modules symlink 读 dist；对外类型改动后**必须** `pnpm build` 同步 dist |
| **noUncheckedIndexedAccess** | `ctx.color!.primary` 返回 `string \| number \| undefined`；测试里 cast；生产代码避免依赖 indexed access narrowing |
| **vitest happy-dom 下 `import.meta.url` 不可用** | 用 `process.cwd()` |
| **blur key `2xl` / `3xl` 不是合法 ident** | schema interface 用字面量 key `'2xl': string`；访问 `theme.blur['2xl']` |
| **csstype 6.0 升级 vite-plugin-dts 警告** | API Extractor "newer than bundled compiler engine"（不阻塞 build） |
| **alpha helper 持有原 token 值闭包** | 后续覆盖颜色再调 `.alpha(50)` 仍按 token 原值算；用户应理解为"alpha 是 token 的修饰" |
| **emotion 单实例 / SSR 隔离** | 0.3.0 已提供 `createIcssInstance(emotion)` 工厂 |

---

## 五、当前状态（0.4.0 准备中，0.3.0 已发 npm）

| 项 | 现状 |
|---|---|
| npm 版本 | **0.3.0**（2026-05-19 发布）；本地 src 已是 0.4.0 候选 |
| 测试 | **17 套 / 281 测试** 全绿（Batch 1-5 新增 +107） |
| build | 61.30 kB / gzip 15.12 kB |
| bench | icss ~404k ops/s；N7 拆 carrier / proxy 专项 bench |
| ENHANCED_PROPS | 195 条 |
| CSS 属性总数 | ~857（含 vendor prefix） |
| 内建方法 | **89+ 个**（Batch 4 新增 _safeArea / _scrollSnap / _overscroll / _field） |
| Token category | 18 个（默认 schema 全填了 8 个：duration / easing / breakpoint / zIndex / opacity / lineHeight / letterSpacing / aspectRatio） |
| LENGTH_UNITS | 30 个 |
| Tailwind palette | 完整 242 色 + 11 语义色 |
| examples | vanilla-button / vue-button / react-button |
| recipes | vue / react / svelte / solid |

---

## 六、未做的尾巴（按值/工作量排序）

> Batch 1-5 已完成：B2 / C2 / B5 / B4 / C10 / W3.2 / N7 / 现代 CSS 4 helper / edge case 测试 全部落地。

| ID | 内容 | 工作量 | 风险 | 价值 | 状态 |
|---|---|---|---|---|---|
| ~~B2~~ | INTERNAL_KEYS → prototype 扫描 | 0.5d | 低 | ★★ | ✅ Batch 1 |
| ~~C2~~ | `label()` join | 0.5h | 低 | ★ | ✅ Batch 1 |
| ~~B5~~ | color modifier 保 alpha | 1h | 低 | ★ | ✅ Batch 1 |
| ~~B4~~ | mergeTheme function token 警告 | 1h | 低 | ★ | ✅ Batch 1 |
| ~~C10~~ | injectGlobal 内存去重 | 1h | 低 | ★ | ✅ Batch 1 |
| ~~N7~~ | bench 场景拆细 | 0.5d | 低 | ★ | ✅ Batch 2 |
| ~~W3.2~~ | 完整 stack-trace label | 0.5d | 中 | ★★ dev | ✅ Batch 3 |
| ~~CSS4~~ | _safeArea / _scrollSnap / _overscroll / _field | 0.3d | 低 | ★★ | ✅ Batch 4 |
| ~~edge~~ | edge case 测试集中（+33 测试） | 0.3d | 零 | ★★ 回归防护 | ✅ Batch 5 |
| **W4.2** | carrier 工厂模块级共享 | 1d | 中 | 用 N7 bench 实测决定；初步判断不做（404k 远超需求） | **不做** |
| **W6.1 完整** | csstype DataType.* 递归 generator | 1.5d | 中 | 用户透明，不做 | **不做** |
| **N8** | build size 审计 | 0.5d | 低 | 用户无感，不做 | **不做** |
| **W11.1** | Babel/SWC 编译期插件 | 3-5d | 高 | v0.5+ 长线 | 不立即 |

---

## 七、长线方向（不在当前 batch）

- **ui-vue 包**（ZThemeProvider + 5 基础组件） — 2-3d，高风险，API 设计需拍板
- **docs 站**（VitePress 内容填充） — 1-2d，低风险
- **P3.E** 二级 carrier（`s.transform.rotate.deg(45)`） — 与 W1.3 已落地的 longhand 重叠，风格分裂
- **P3.F** ESLint plugin（禁裸 emotion css） — 1d，用户量小价值低
- **W11.1** Babel/SWC 插件 — v0.5+ 路线

---

## 八、§审计清单（剩余缺口）

🔴 **严重 / 架构性** — 已无残留（A1/A2/A3 0.3.0 已修；A4 留观察）

🟠 **中等 / 完整性**

| ID | 问题 | 关联 |
|---|---|---|
| ~~B2~~ | INTERNAL_KEYS 手写白名单 | ✅ Batch 1 修复（prototype 扫描） |
| ~~B5~~ | `color.ts` darken/lighten 丢 alpha | ✅ Batch 1 修复 |
| **B6** | csstype@3.2.3；vite-plugin-dts API Extractor 升级 | 待评估（不阻塞） |

🟡 **轻微 / 改进项**

| ID | 范围 | 问题 |
|---|---|---|
| ~~C2~~ | `label()` 多次互覆盖 | ✅ Batch 1 修复（join 成 a.b.c） |
| **C3** | `_var` 与 schema token 没桥接 | escape hatch 合理，不处理 |
| **C7** | `_node` 不冻结（用户可绕过 carrier 类型） | escape hatch 合理 |
| ~~C10~~ | `injectGlobal` 没去重 | ✅ Batch 1 修复（内存指纹） |

---

## 九、自主决策日志精华

> commit 细节查 `git log`；本节只留**有教训价值**的决策。

| 项 | 决策 | 理由 |
|---|---|---|
| Proxy 方法 bind 到 `receiver` 不是 `target` | `bind(receiver)` | target 让 `_when`/`_apply` 内 fn(this) 传出原始 chain，无 carrier 路径；改 receiver 后 36/36 内建测试全过 |
| csstype `Properties` 用 `<string\|number, string\|number>` 实例化 | 让 length / time 接 number | emotion 收数字自动 px/ms，类型层与运行时对齐 |
| Generator AST parser 支持 spread + Identifier 解引用 | 允许 `keywords: [...JUSTIFY_KW, 'auto']` | 让 ENHANCED_PROPS 复用 keyword 集 |
| `mergeTheme` 走 `helpers.deepMerge` | 不可变 + 兄弟保留 | ThemeSchema 实际 2 层，deepMerge 已够 |
| `_use` 走 `deepMergeInto`（可变） | 原地写 `_node` | 与 `mergeTheme` 语义解耦 |
| blur key `2xl` / `3xl` 用字面量字符串声明 | TS 支持 + 用户访问 `theme.blur['2xl']` | 非法 ident，没有更优解 |
| Palette 同时导出 kebab 嵌套 + camelCase legacy + 展平 | 兼容 zui-back7 + tw('blue', '600') helper | 重命名时让消费者多重路径 |
| ★ 对外类型改动后必须 `pnpm build` | dist gitignored，被 IDEA / examples 通过 node_modules symlink 读 | 不 build 会 IDE 误报旧签名错 |
| W4.1 Theme.getKeymap() 懒缓存 | bench 19k → 404k ops/s（21×） | 显著提速，零破坏 |
| W4.3 `resolveTheme` 末尾 `Object.freeze` | V8 sealed class 优化 5-10% | 零成本 |
| W6.1 简化版接管 extra-keywords slot（非完整 csstype 派生） | 当下需求 + 校验 `_` 前缀 | 完整 csstype 递归不做（用户无感、generator 复杂度激增） |
| W3.2 完整版（Batch 3） | 抽到 `dev/stackTrace.ts` 独立模块 + 跨 runtime stack 解析 + framework frame 过滤 + production 降级 | 实用 + 可测试 + 与 C2 label join 协作 |
| B2（Batch 1） | INTERNAL_KEYS 改 `Chain.prototype` 自动扫描 + WeakMap 缓存 | 防 bug 永久解决（继承 Chain 加方法也工作） |
| B5（Batch 1）— color modifier 含 alpha 时输出 rgba 保 alpha | `preserveAlpha(orig, processed)` 在 hex 与 rgba 间取舍 | 不破坏现有 hex 输出习惯（alpha=1 时仍 hex） |
| W4.2 不做（Batch 2 决策） | bench 已 404k ops/s，过度优化 | 100 chain/render = 0.25ms，远低于一帧 16ms |
| W6.1 完整版不做 | 用户透明 + generator 复杂度激增 | extra-keywords slot 足够覆盖 csstype 漏的 keyword |
| Batch 4 现代 CSS 4 helper | 只选 4 个实用方向（_safeArea / _scrollSnap / _overscroll / _field） | 跳过 _anchor 实验性 — 浏览器支持 < 30%，API 易变 |
| Batch 5 edge.spec.ts | 33 个 edge case 集中放一个文件 | 防回归 + 单文件易索引 |

---

**Plan 末**。运行级操作（验证铁律 / 命令速记 / commit 节奏 / STOP 节点）见 [`AGENT.md`](./AGENT.md)。
