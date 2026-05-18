# 新项目计划：`@kenconnet666/zui-core`

> **框架无关**的 CSS-in-JS 工具库，基于 `@emotion/css`。
> **class 泛型 + 继承**做类型系统，用户通过 `extends` / 泛型实例化获得强类型主题体验。
> **不提供 provider 层**：只暴露纯类 + 工具函数，Vue / Svelte / React / Solid 用户自己拼装。

---

## 〇、一句话定位

> **核心是 `class Chain<TSchema>`**：用户定义自己的 `ThemeSchema`，就拿到完整 IDE 补全的 `s.color._primary` / `s.padding.px(16)` / `s.color('red')` 等四态访问；
> 框架适配（响应式包装、Provider）由用户在外面套，库只给原料。

---

## 一、设计目标与边界

### ✅ 库提供（核心）
1. **`class Theme<T>`**：用户继承或实例化定义主题，自动获得 `theme.color.primary` 强类型
2. **`class Chain<T>`**：链式 builder，所有 CSS 属性 + 内建嵌套 + 增强 carrier，全部按 `T` 推断类型
3. **`class PropCarrier<...>` / `PropFn<...>`**：属性级别的类型（callable + tokens + keywords + units）
4. **工具函数**：
   - `resolveTheme(schema)` → ResolvedTheme（function token 展开）
   - `mergeTheme(parent, partial)` → Theme（partial 覆盖父级，用于嵌套）
   - `toClassName(chain)` → string（调 emotion `css()` 出 className）
   - `icss(theme, factory)` → string（一行 shortcut）
5. **内置 default schema**：Tailwind 风（用户不想自己定义时直接用）
6. **内建嵌套链方法**：`_hover` / `_focus` / `_media` / `_when` / `_truncate` 等
7. **`cx` / `ikeyframes` / `injectGlobal`** 辅助（透传 emotion）

### ❌ 库**不**做
- 任何框架专用代码（无 Vue composable、无 React hook、无 Svelte store）
- 任何 Provider 组件（用户自己写 5-10 行）
- 响应式封装（用户用所在框架的响应式系统：Vue `computed` / React `useMemo` / Svelte `$:`）
- 组件库 / recipe / 变体
- **token → CSS variable 的自动桥接**（token 出值始终是 JS 真值；不生成 `--zui-color-primary` 这类变量）

### ✅ 用 generator，但只做"派生类型"
`scripts/generate-properties.mjs` 读 **csstype `Properties` 接口的 JSDoc** + **`enhanced-props.ts` 的 ENHANCED_PROPS 名单**，派生 `src/types/properties.generated.ts`：
- ENHANCED_PROPS 中的属性 → `PropCarrier` / `ColorPropCarrier`（四态）
- 其余 ~785 个属性 → `PropFn`（函数态 + 全局关键字）
- 每个属性带完整 JSDoc（MDN 链接、浏览器兼容表、Syntax、Initial value）

**为什么用 generator**：300+ CSS 属性 × 平均 10 行 JSDoc = 3000 行精确的 MDN/浏览器兼容数据，手抄不现实。生成器**不做** token 推断（那是 class 泛型的工作），只做 csstype JSDoc 抽取 + 按 ENHANCED_PROPS 分流类型形态。**ENHANCED_PROPS 是类型 + 运行时双向对齐的 single source of truth**，零漂移可能。

> 注：库**仍然提供** `_var('--my-custom', '#fff')` 内建方法，让用户**主动**写自定义 CSS 属性 —— 这是"不做 token→CSS variable 自动桥接"和"提供逃生舱"的区别。

### 关键决策
| 项 | 决定 |
|---|---|
| 类型系统 | **class 泛型 + 继承**（不用 generator 脚本） |
| 主题定义 | 用户 `extends Theme<T>` 或 `new Theme(schema)` |
| 框架支持 | 框架无关；用户自己拼 Provider（库出 recipe） |
| 入口 | `class Chain<T>` 是核心，配 `icss(theme, factory)` 一行 shortcut |
| Chain 风格 | **statement-only**：`s => { s.padding.px(16); s.color._primary }`，每条独立一行，**不支持链式 return** |
| Chain 构造 | **必传 theme**（`new Chain(defaultLight)` / `new Chain(myTheme)`）；不暗自走 DefaultSchema |
| 四态访问 | 函数调用 / token (`_`前缀) / CSS keyword / unit 方法 |
| Token 出值 | JS 真值（不做 token→CSS variable 自动桥接；`_var()` 是独立的"主动写自定义属性"逃生舱） |
| alpha 简写 | **`chain.color._primary.alpha(50)`**：token 命中立即赋值真值，返回带 `.alpha(n)` 的 helper；调用 `.alpha(n)` 会**重写**该属性为带 alpha 的 rgba（参数 0-100，单位 %）|
| 保留属性名 | 不在 ThemeSchema 类型上做强约束（不 Exclude `label` 等），改在 README 写明禁用 schema category 名：`label`/`constructor`/`toString`/`toCSSObject`/`_node`/`_theme`/`_keymap`/`_carriers` |
| 内置 schema | Tailwind 风的 `DefaultSchema`，用户继承扩展或全替换 |
| 局部覆盖 | `mergeTheme(parent, partial)` 工具，用户自己决定何时调用 |
| 性能取舍 | 优先**类型完整 + IDE 补全**；运行时 chain 比原生 emotion css 慢 2-3× 可接受；用户在响应式系统层用 `computed`/`useMemo` 自行缓存 |

---

## 二、核心 API 表面

```ts
// ─── 主题类 ───
export class Theme<T extends ThemeSchema> {
  constructor(public schema: T)
  resolve(): ResolvedTheme<T>
  merge<P extends DeepPartial<T>>(partial: P): Theme<T>
}
// 通过 declaration merging 让 theme.<cat>.<key> 强类型:
export interface Theme<T extends ThemeSchema> extends ResolvedTheme<T> {}

// ─── 链类 ───
export class Chain<T extends ThemeSchema = DefaultSchema> {
  constructor(theme: ResolvedTheme<T> | Theme<T>)

  // ↓ 增强属性 (PropCarrier 形态)
  // 颜色属性用 ColorPropCarrier（token 命中返回 ColorTokenValue，支持 .alpha(n)）
  declare color: ColorPropCarrier<this, csstype.Property.Color, ColorTokens<T>, ColorKeywords>
  declare backgroundColor: ColorPropCarrier<this, csstype.Property.BackgroundColor, ColorTokens<T>, ColorKeywords>
  declare padding: PropCarrier<this, csstype.Property.Padding<string|number>, SpacingTokens<T>, 'auto'|GlobalKw, LengthUnits<this>>
  declare margin: PropCarrier<this, csstype.Property.Margin<string|number>, SpacingTokens<T>, 'auto'|GlobalKw, LengthUnits<this>>
  declare borderRadius: PropCarrier<this, csstype.Property.BorderRadius<string|number>, RadiusTokens<T>, GlobalKw, LengthUnits<this>>
  declare fontSize: PropCarrier<this, csstype.Property.FontSize<string|number>, FontSizeTokens<T>, GlobalKw, LengthUnits<this>>
  declare boxShadow: PropCarrier<this, csstype.Property.BoxShadow, ShadowTokens<T>, 'none'|GlobalKw>
  // ... ENHANCED_PROPS 名单上的所有属性

  // ↓ 未增强属性 (PropFn 形态, 只支持函数调用 + GlobalKeywords)
  declare alignSelf: PropFn<this, csstype.Property.AlignSelf>
  declare appearance: PropFn<this, csstype.Property.Appearance>
  declare cursor: PropFn<this, csstype.Property.Cursor>
  // ... 其余 ~240 个

  // ↓ 内建嵌套方法（按职责分组，全部从 zui-back7 chain.ts 移植成 class method，去掉与 _var/_token 自动接 CSS variable 相关的逻辑）
  label(name: string): this

  // 逃生舱（直接操作 _node）
  _prop(name: string, value: unknown): this                // 任意属性（绕过类型）
  _var(name: `--${string}`, value: string | number): this  // CSS 自定义属性
  _use(input: CSSObject): this                             // 深合并外部 CSSObject
  _apply(fn: (s: this) => this): this                      // 复用样式片段

  // 伪类（状态、表单、链接/目标、结构）
  _hover(fn: (s: this) => void): this
  _active(fn: (s: this) => void): this
  _focus(fn: (s: this) => void): this
  _focusVisible(fn: (s: this) => void): this
  _focusWithin(fn: (s: this) => void): this
  _disabled(fn: (s: this) => void): this
  _checked(fn: (s: this) => void): this
  // _required / _optional / _valid / _invalid / _readOnly / _placeholderShown / _inRange / _outOfRange ...
  // _link / _visited / _target / _dir(direction, fn)
  // _firstChild / _lastChild / _only / _empty / _nthChild(arg, fn) / _nthOfType(arg, fn)
  _before(fn: (s: this) => void): this
  _after(fn: (s: this) => void): this
  _placeholder(fn: (s: this) => void): this
  _selection(fn: (s: this) => void): this
  _marker(fn: (s: this) => void): this

  // group / peer（Tailwind 风组合选择器）
  _groupHover(fn: (s: this) => void): this
  _groupFocus(fn: (s: this) => void): this
  _groupActive(fn: (s: this) => void): this
  _peerHover(fn: (s: this) => void): this
  _peerFocus(fn: (s: this) => void): this
  _peerChecked(fn: (s: this) => void): this

  // 选择器 / 条件
  _selector(selector: string, fn: (s: this) => void): this
  _and(selectorTail: string, fn: (s: this) => void): this
  _when(cond: unknown, fn: (s: this) => void): this
  _unless(cond: unknown, fn: (s: this) => void): this

  // At 规则（_media / _container 支持 `_md` 断点 token 简写）
  _media(query: string, fn: (s: this) => void): this
  _supports(query: string, fn: (s: this) => void): this
  _container(query: string, fn: (s: this) => void): this

  // 媒体修饰符简写
  _dark(fn: (s: this) => void): this
  _light(fn: (s: this) => void): this
  _motionSafe(fn: (s: this) => void): this
  _motionReduce(fn: (s: this) => void): this
  _print(fn: (s: this) => void): this
  _rtl(fn: (s: this) => void): this
  _ltr(fn: (s: this) => void): this

  // 工具组合（Tailwind 招牌 "合并写法"）
  _truncate(): this
  _lineClamp(lines: number): this
  _srOnly(): this
  _centered(): this
  _absoluteCenter(): this

  // 模糊 helper（要求 schema 有 `blur` category）
  _blur(token: string): this
  _backdropBlur(token: string): this

  // ↓ 输出
  toCSSObject(): CSSObject
  toString(): string                                // = toClassName(this)
}

// ─── 类型工具 ───
export interface ThemeSchema {
  color?: Record<string, ThemeValue>
  spacing?: Record<string, ThemeValue>
  radius?: Record<string, ThemeValue>
  shadow?: Record<string, ThemeValue>
  fontSize?: Record<string, ThemeValue>
  fontWeight?: Record<string, ThemeValue>
  lineHeight?: Record<string, ThemeValue>
  letterSpacing?: Record<string, ThemeValue>
  fonts?: Record<string, ThemeValue>
  borders?: Record<string, ThemeValue>
  zIndex?: Record<string, ThemeValue>
  duration?: Record<string, ThemeValue>
  easing?: Record<string, ThemeValue>
  opacity?: Record<string, ThemeValue>
  aspectRatio?: Record<string, ThemeValue>
  breakpoint?: Record<string, ThemeValue>
  sizes?: Record<string, ThemeValue>
  cursor?: Record<string, ThemeValue>
  blur?: Record<string, ThemeValue>
  // ↓ 用户可加自定义 category, 库不强制完整
  [customCategory: string]: Record<string, ThemeValue> | undefined
}

export type ThemeValue =
  | string
  | number
  | ((t: ResolvedThemeContext) => string | number)

export type ResolvedTheme<T extends ThemeSchema> = {
  [Cat in keyof T]: { [K in keyof T[Cat]]: string | number }
}

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }

// ─── 工具函数 ───
export function resolveTheme<T extends ThemeSchema>(schema: T): ResolvedTheme<T>
export function mergeTheme<T extends ThemeSchema, P extends DeepPartial<T>>(
  parent: ResolvedTheme<T>,
  partial: P,
): ResolvedTheme<T>
/** `toClassName(c)` 是 `c.toString()` 的显式别名（toString 是约定方法，cx / 模板字符串需要它）。 */
export function toClassName(chain: Chain<any>): string
export function icss<T extends ThemeSchema>(
  theme: ResolvedTheme<T> | Theme<T>,
  factory: (s: Chain<T>) => void,
): string

// ─── 关键帧 + 类合并 + 全局注入 ───
export function ikeyframes(factory: (k: KeyframesBuilder) => void): string
export function cx(...args: (string | false | null | undefined)[]): string
export function injectGlobal(styles: CSSObject | string): void

// ─── 默认 schema (Tailwind 风) ───
export const DefaultSchema: ThemeSchema      // 完整 Tailwind palette + spacing + ...
export const defaultLight: Theme<DefaultSchema>
export const defaultDark: Theme<DefaultSchema>
export type DefaultSchema = typeof DefaultSchema
```

---

## 三、class 泛型 + 继承的关键技巧

### 3.1 type intersection + const 强转：让 `theme.color.primary` 强类型

```ts
// internal class (不直接对外)
class _ThemeClass<T extends ThemeSchema> {
  private _resolved: ResolvedTheme<T> | null = null
  constructor(public schema: T) {
    Object.assign(this, schema)        // 把 schema 各 category 拷到自身
  }
  resolve(): ResolvedTheme<T> { /* ... */ }
  merge<P extends DeepPartial<T>>(partial: P): Theme<T> { /* ... */ }
}

// ★ 类型 alias：intersection 注入 ResolvedTheme<T> 的字段
export type Theme<T extends ThemeSchema> = _ThemeClass<T> & ResolvedTheme<T>

// ★ 值（构造器）：const 强转，保留 new / extends 能力
export const Theme = _ThemeClass as unknown as {
  new <T extends ThemeSchema>(schema: T): Theme<T>
  readonly prototype: _ThemeClass<ThemeSchema>
}

// 用法
const theme = new Theme({
  color: { primary: '#2563eb', danger: '#dc2626' },
  spacing: { xs: '4px', lg: '24px' },
})

theme.color.primary    // ✅ 类型 = string, IDE 补全 'primary' | 'danger'
theme.spacing.lg       // ✅
theme.resolve()        // ✅ 类方法依然存在

// 继承也工作
class MyTheme extends Theme<MySchema> {
  constructor() { super({ /* ... */ }) }
}
```

**为什么不用 `interface Theme<T> extends ResolvedTheme<T>`**：在 `verbatimModuleSyntax` / 严格模式下 TS 报 `TS2312: An interface can only extend an object type or intersection of object types with statically known members` —— interface 不能 extend mapped type。换成 type intersection 既绕开限制又保留体验。

### 3.2 用户**继承**扩展（推荐场景：库级主题）

```ts
import { Theme, type ThemeSchema } from '@kenconnet666/zui-core'

interface BrandSchema extends ThemeSchema {
  color: {
    primary: string
    danger: string
    brand: string       // 新增
  }
  spacing: {
    xs: string
    sm: string
    md: string
  }
  brand: {              // 全新 category
    logo: number
    accent: string
  }
}

class BrandTheme extends Theme<BrandSchema> {
  constructor() {
    super({
      color:   { primary: '#2563eb', danger: '#dc2626', brand: '#7c3aed' },
      spacing: { xs: '4px', sm: '8px', md: '16px' },
      brand:   { logo: 80, accent: '#a78bfa' },
    })
  }
  // 可选: 加业务方法
  toggleBrand(c: string): this {
    this.color.brand = c
    return this
  }
}

const theme = new BrandTheme()
theme.color.brand            // ✅ '#7c3aed'
theme.brand.accent           // ✅ '#a78bfa'
```

### 3.3 `Chain<T>` 自动按主题 schema 推断 token union

```ts
// 给 Chain 一个完整类型的 theme, carrier 上的 token key 自动展开
const chain = new Chain(theme)

chain.color._primary         // ✅ 推断自 BrandSchema['color']
chain.color._brand           // ✅
chain.padding._md            // ✅ 推断自 BrandSchema['spacing']
chain.color._notExist        // ❌ TS 飘红
```

实现要点：
```ts
type ColorTokens<T extends ThemeSchema> = T['color'] extends Record<string, any>
  ? ToIdent<keyof T['color'] & string>     // 'primary' → '_primary', 'blue-600' → '_blue600'
  : never

type SpacingTokens<T extends ThemeSchema> = T['spacing'] extends Record<string, any>
  ? ToIdent<keyof T['spacing'] & string>
  : never
// ... 每个 category 一个工具类型

// 安全标识符转换
type ToIdent<K extends string> = `_${RemoveHyphen<DotToUnderscore<K>>}`
type RemoveHyphen<S extends string> = S extends `${infer A}-${infer B}` ? `${A}${RemoveHyphen<B>}` : S
type DotToUnderscore<S extends string> = S extends `${infer A}.${infer B}` ? `${A}_${DotToUnderscore<B>}` : S
```

### 3.4 PropCarrier 类型 = 四态交叉

```ts
type GlobalKw = 'inherit' | 'unset' | 'initial' | 'revert' | 'revertLayer'

type LengthUnits<TSelf> = {
  px(n: number): TSelf
  vw(n: number): TSelf
  vh(n: number): TSelf
  rem(n: number): TSelf
  em(n: number): TSelf
  pct(n: number): TSelf
  ch(n: number): TSelf
  // ...
}

export type PropCarrier<TSelf, TValue, TTokens extends string, TKeywords extends string, TUnits = {}> =
  & ((value: TValue) => TSelf)                              // 1. 逃生舱
  & { readonly [K in TTokens]: TSelf }                      // 2. 主题 token (_前缀)
  & { readonly [K in TKeywords]: TSelf }                    // 3. CSS keyword (无前缀)
  & TUnits                                                  // 4. unit 方法

export type PropFn<TSelf, TValue> =
  & ((value: TValue) => TSelf)
  & { readonly [K in GlobalKw]: TSelf }

// ─── 颜色专用 carrier：token 命中后返回 ColorTokenValue（带 .alpha(n)）───

/**
 * token 命中后立刻把真值写进 chain._node[prop]。
 * 返回的 helper 提供 `.alpha(n)`（n: 0-100），调用后**重写**该属性为带 alpha 的 rgba。
 * 不返回 chain（与 statement-only 风格一致）。
 */
export interface ColorTokenValue<TSelf> {
  /** 把当前已写入的颜色重写为带 alpha 的 rgba。n 取值 0-100（百分比）。 */
  alpha(n: number): TSelf
}

export type ColorPropCarrier<TSelf, TValue, TTokens extends string, TKeywords extends string> =
  & ((value: TValue) => TSelf)
  & { readonly [K in TTokens]: ColorTokenValue<TSelf> }   // ★ 与 PropCarrier 唯一区别
  & { readonly [K in TKeywords]: TSelf }
```

注释提示：`ColorPropCarrier` **只**用在 tokenCat === `'color'` 的属性上（color / backgroundColor / borderColor / ...）。其它 token category（spacing / radius / shadow 等）不需要 alpha，保持 `PropCarrier`。

### 3.5 运行时实现（Chain 构造时返回 Proxy）

```ts
export class Chain<T extends ThemeSchema = DefaultSchema> {
  private node: Record<string, unknown> = {}
  private theme: ResolvedTheme<T>
  private keymap: Map<string, Map<string, string>>          // ident → original key

  constructor(theme: ResolvedTheme<T> | Theme<T>) {
    this.theme = theme instanceof Theme ? theme.resolve() : theme
    this.keymap = buildKeymap(this.theme)
    return makeChainProxy(this)                              // ← 返回 Proxy
  }

  // 内建方法 (普通 class 方法)
  _hover(fn: (s: this) => void): this { /* ... */ return this }
  _media(query: string, fn: (s: this) => void): this { /* ... */ return this }
  // ...

  toCSSObject(): CSSObject { return this.node as CSSObject }
  toString(): string { return css(this.node as CSSObject) }
}

// Proxy 拦截属性访问, 区分: 内建方法 / 增强 carrier / 未增强函数
function makeChainProxy(chain: Chain<any>): Chain<any> {
  return new Proxy(chain, {
    get(target, prop, receiver) {
      // 1. 内建方法 (label / _hover / _media / toString / ...)
      const builtin = Reflect.get(target, prop, receiver)
      if (typeof builtin === 'function' || prop === 'theme' || prop === 'keymap' || prop === 'node') {
        return typeof builtin === 'function' ? builtin.bind(target) : builtin
      }

      // 2. CSS 属性 (区分增强 vs 未增强, 都返回 callable)
      if (typeof prop === 'string') {
        return getOrCreateCarrier(target, prop)
      }

      return undefined
    },
  })
}
```

#### 3.5.1 ★ 闭包陷阱（嵌套时必须读最新 `_node`）

```ts
// ❌ 错误：carrier 闭包捕获 _node 引用
function makeCarrierWrong(chain: Chain<any>, prop: string) {
  const node = chain._node                             // 此处快照
  return new Proxy(function (v: unknown) {
    node[prop] = v                                     // _hover 嵌套后写错位置
    return chain
  }, /* ... */)
}

// ✅ 正确：每次写都走 chain._node（最新引用）
function makeCarrierOk(chain: Chain<any>, prop: string) {
  const fn = function (v: unknown) {
    chain._node[prop] = v                              // ← 关键：每次重新读
    return chain
  }
  return new Proxy(fn, /* ... 同上，但每次访问内部 _node 都走 chain._node */)
}
```

**原因**：内建嵌套方法（`_hover` / `_media` / ...）实现是临时切换 `chain._node` 引用到子节点：

```ts
private _nest(sel: string, fn: (s: this) => void): this {
  const prev = this._node
  const child: Record<string, unknown> = {}
  prev[sel] = child
  this._node = child           // ← 切换
  try { fn(this) } finally {
    this._node = prev          // ← 还原
  }
  return this
}
```

如果 carrier 闭包捕获了构造时的 `_node`，在 `_hover` 内部写入会写进父节点而不是子节点。**所有 carrier 必须通过 `chain._node`（getter 形式或动态访问）读写**。

#### 3.5.1.5 ★ alpha 简写（`chain.color._primary.alpha(50)`）

token 命中后**立刻**把真值写进 `chain._node[prop]`；返回的 helper 暴露 `.alpha(n)` 方法。调用 `.alpha(n)` 时按 token 原值算出 rgba，**覆盖**已写入的值。

```ts
// 运行时（在 getOrCreateCarrier 的 token 命中分支）
if (cfg?.tokenCat && key.startsWith('_')) {
  const ident = key
  const catMap = chain._keymap.get(cfg.tokenCat)
  const origKey = catMap?.get(ident)
  if (origKey !== undefined) {
    const slot = chain._theme[cfg.tokenCat] as Record<string, string | number>
    const value = slot?.[origKey]
    chain._node[prop] = value                   // ① 立即写入真值

    // ② 颜色专用：返回 ColorTokenValue（带 .alpha(n)）
    if (cfg.tokenCat === 'color' && typeof value === 'string') {
      return {
        alpha(n: number) {
          chain._node[prop] = setAlpha(value, n / 100)   // ③ 重写为 rgba
          return chain
        },
      }
    }
    return chain                                // 非颜色 token 直接返回 chain
  }
}
```

`setAlpha(color, alpha)` 实现（用 [color2k](https://github.com/ricokahler/color2k)，~2kb gzip）：

```ts
import { parseToRgba } from 'color2k'

export function setAlpha(color: string, alpha: number): string {
  try {
    const [r, g, b] = parseToRgba(color)
    const clamped = Math.max(0, Math.min(1, alpha))
    return `rgba(${r}, ${g}, ${b}, ${clamped})`
  } catch {
    return color
  }
}
```

**陷阱**：
- alpha helper 持有 `value`（token 原值）的闭包；如果用户后续调 `chain.color('red')` 覆盖了颜色再调 `.alpha(50)`，alpha 仍用原 token 值算 —— 用户应**理解为"alpha 是 token 的修饰"，不是"当前 color 值的修饰"**。
- 非颜色 token（`chain.padding._md.alpha(50)`）类型层就不允许（PropCarrier 没 `.alpha`），运行时直接返回 chain。
- `color2k` 进 `dependencies`（peerDep 不合适，体积小且 API 稳定）。

#### 3.5.2 ★ carrier 缓存（性能）

`chain.color` 每次访问都建一个 callable Proxy 浪费。在 `chain` 实例上挂一个 `_carriers: Map<string, callable>` 缓存：

```ts
export function getOrCreateCarrier(chain: Chain<any>, prop: string): unknown {
  let cached = chain._carriers.get(prop)
  if (cached) return cached
  cached = buildCarrier(chain, prop)
  chain._carriers.set(prop, cached)
  return cached
}
```

注意：缓存对象只引用 `chain`（不引用 `_node`），所以 §3.5.1 的闭包陷阱依旧适用 —— 内部读写走 `chain._node`。

---

## 四、用户用法（按框架场景）

### 4.1 最简（无主题，逃生舱模式）

```ts
import { Chain, toClassName } from '@kenconnet666/zui-core'

const c = new Chain()
c.color('red')                // 函数调用, csstype 严格
c.padding(16)                 // emotion 自动 px
c._hover(h => { h.color('blue') })

const cls = toClassName(c)    // emotion className
```

### 4.2 用默认 Tailwind 主题

```ts
import { Chain, defaultLight, icss } from '@kenconnet666/zui-core'

// 长写法
const c = new Chain(defaultLight)
c.color._primary
c.padding._lg
c.color.white
const cls = c.toString()

// 一行 shortcut
const cls2 = icss(defaultLight, s => {
  s.color._primary
  s.padding.px(16)
  s._hover(h => { h.opacity(0.9) })
})
```

### 4.3 自定义主题（继承）

```ts
import { Theme, Chain, icss, type ThemeSchema } from '@kenconnet666/zui-core'

interface MySchema extends ThemeSchema {
  color: { primary: string; danger: string; brand: string }
  spacing: { xs: string; sm: string; md: string; lg: string }
}

class MyTheme extends Theme<MySchema> {
  constructor() {
    super({
      color: { primary: '#2563eb', danger: '#dc2626', brand: '#7c3aed' },
      spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
    })
  }
}

const myTheme = new MyTheme()

const cls = icss(myTheme, s => {
  s.color._primary             // '#2563eb'
  s.color._brand               // '#7c3aed' ★ 用户自加
  s.padding._lg                // '24px'
  s.padding.px(8)              // unit 方法
  s.color.white                // CSS keyword
  s.color('red')               // 原始
})
```

### 4.4 Vue 用户自己拼 provider（库**不**提供，给 recipe）

```ts
// === user's themeContext.ts ===
import { ref, computed, inject, provide, type InjectionKey, type Ref } from 'vue'
import { mergeTheme, type ResolvedTheme, type DeepPartial } from '@kenconnet666/zui-core'
import type { MySchema } from './schema'

const KEY: InjectionKey<Ref<ResolvedTheme<MySchema>>> = Symbol('theme')
const globalTheme = ref<ResolvedTheme<MySchema>>(/* ... */)

export function setTheme(theme: ResolvedTheme<MySchema>) {
  globalTheme.value = theme
}

// === user's ZThemeProvider.vue ===
<script setup lang="ts">
import type { DeepPartial } from '@kenconnet666/zui-core'
const props = defineProps<{ theme: DeepPartial<MySchema> }>()
const parent = inject(KEY, null)
const merged = computed(() =>
  mergeTheme(parent?.value ?? globalTheme.value, props.theme)
)
provide(KEY, merged)
</script>
<template><slot /></template>

// === user's useIcss.ts ===
import { computed, inject } from 'vue'
import { Chain, toClassName } from '@kenconnet666/zui-core'

export function useIcss() {
  const themeRef = inject(KEY) ?? globalTheme
  return (factory: (s: Chain<MySchema>) => void) =>
    computed(() => {
      const c = new Chain(themeRef.value)
      factory(c)
      return toClassName(c)
    })
}
```

库**只**提供：`Chain` / `Theme` / `mergeTheme` / `toClassName` / `icss` / 类型工具。
其余 30 行的 provider 由用户写。

### 4.5 React 用户拼 provider（同理）

```ts
import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { Chain, toClassName, mergeTheme, type ResolvedTheme, type DeepPartial } from '@kenconnet666/zui-core'

const ThemeCtx = createContext<ResolvedTheme<MySchema>>(/* ... */)

export function ZThemeProvider({ theme, children }: { theme: DeepPartial<MySchema>; children: ReactNode }) {
  const parent = useContext(ThemeCtx)
  const merged = useMemo(() => mergeTheme(parent, theme), [parent, theme])
  return <ThemeCtx.Provider value={merged}>{children}</ThemeCtx.Provider>
}

export function useIcss(factory: (s: Chain<MySchema>) => void): string {
  const theme = useContext(ThemeCtx)
  return useMemo(() => {
    const c = new Chain(theme)
    factory(c)
    return toClassName(c)
  }, [theme, factory])
}
```

### 4.6 Svelte / Solid 用户：同样 30-50 行自己写

---

## 五、项目骨架

```
@kenconnet666/zui-core/
├── (workspace-root) scripts/
│   └── generate-properties.mjs       # ★ 读 csstype + ENHANCED_PROPS, 生成 properties.generated.ts
├── src/
│   ├── theme/
│   │   ├── Theme.ts            # class Theme<T> + interface declaration merging
│   │   ├── ThemeSchema.ts      # interface ThemeSchema + ThemeValue + DeepPartial
│   │   ├── resolveTheme.ts     # 函数: 解 function token
│   │   ├── mergeTheme.ts       # 函数: parent + partial → resolved
│   │   ├── keymap.ts           # '_blue600' ↔ 'blue-600' 双向映射
│   │   ├── defaults/
│   │   │   ├── palette.ts      # Tailwind 22×11
│   │   │   ├── light.ts        # defaultLight: Theme<DefaultSchema>
│   │   │   ├── dark.ts         # defaultDark: Theme<DefaultSchema>
│   │   │   └── schema.ts       # DefaultSchema 类型
│   │   └── types.ts            # ResolvedTheme<T>, ResolvedThemeContext
│   │
│   ├── chain/
│   │   ├── Chain.ts            # ★ class Chain<T> 主体, declare 各 carrier; 所有内建方法 (_hover/_media/_when/_truncate/...) 直接放在类原型上
│   │   ├── proxy.ts            # makeChainProxy: get 拦截 + carrier 分派
│   │   ├── carrier.ts          # getOrCreateCarrier + callable Proxy 实现 (含 alpha 颜色专用分支)
│   │   ├── units.ts            # LENGTH / TIME / ANGLE 单位表 + prop→unit class 映射
│   │   ├── keywords.ts         # CSS keyword 白名单 + KEYWORD_TO_CSS 映射
│   │   ├── enhanced-props.ts   # ENHANCED_PROPS 配置 (运行时元数据, 跟类型一致)
│   │   ├── color.ts            # setAlpha(color, n) 工具 (基于 color2k.parseToRgba)
│   │   └── helpers.ts          # deepMerge / isPlainObject
│   │
│   ├── types/
│   │   ├── carrier.ts                # PropCarrier / ColorPropCarrier / PropFn / GlobalKw / LengthUnits / ColorTokenValue / ...
│   │   ├── tokens.ts                 # ToIdent / ColorTokens<T> / SpacingTokens<T> / ... (18 个 TokensXxx 工具)
│   │   └── properties.generated.ts   # ★ 自动生成 (pnpm generate): IcxPropMethods<TSelf, T> 含 857 个属性 + csstype JSDoc
│   │
│   ├── icss.ts                 # icss(theme, factory) shortcut
│   ├── toClassName.ts          # toClassName(chain) → emotion css()
│   ├── ikeyframes.ts
│   ├── cx.ts
│   ├── injectGlobal.ts
│   │
│   └── index.ts                # 导出表
│
├── recipes/                    # ★ 框架集成 recipe (md + 复制粘贴代码), 不打包
│   ├── vue.md                  # 30 行 Vue Provider + useIcss
│   ├── react.md
│   ├── svelte.md
│   └── solid.md
│
├── tests/
│   ├── theme.spec.ts           # Theme<T> 实例化 + 继承 + merge
│   ├── chain-fn.spec.ts        # 函数调用形态 (逃生舱)
│   ├── chain-carrier.spec.ts   # 四态全覆盖
│   ├── chain-builtins.spec.ts  # _hover / _media / ...
│   └── types.spec.ts           # expect-type 类型测试
│
├── examples/
│   ├── vanilla-button/         # 不用任何框架的 demo
│   └── vue-button/             # 配 recipe 演示
│
├── package.json                # 只 export ESM, peerDep @emotion/css
├── tsconfig.json
└── README.md
```

**关键变化（对比之前 Plan）**：
- 没有 `provider/` 目录
- 没有 `useIcss.ts` 入口（只有纯函数 `icss()` shortcut）
- `recipes/` 是 markdown，不打包，给用户拷代码
- 框架特定逻辑全在 recipes，不在 src

---

## 六、ENHANCED_PROPS 名单（手写运行时元数据，类型由 generator 派生）

运行时手写 `chain/enhanced-props.ts` 的 `ENHANCED_PROPS` 元数据（当前 72 条）；类型层 `IcxPropMethods<TSelf, T>` 由 `scripts/generate-properties.mjs` 派生，**不手写**。

```ts
// chain/enhanced-props.ts
export const ENHANCED_PROPS: Record<string, EnhancedPropConfig> = {
  color:           { tokenCat: 'color',     unitClass: null,     keywords: ['white', 'black', 'transparent', 'currentColor'] },
  backgroundColor: { tokenCat: 'color',     unitClass: null,     keywords: ['white', 'black', 'transparent', 'currentColor'] },
  borderColor:     { tokenCat: 'color',     unitClass: null,     keywords: ['white', 'black', 'transparent', 'currentColor'] },
  padding:         { tokenCat: 'spacing',   unitClass: 'length', keywords: ['auto'] },
  margin:          { tokenCat: 'spacing',   unitClass: 'length', keywords: ['auto'] },
  width:           { tokenCat: 'sizes',     unitClass: 'length', keywords: ['auto', 'minContent', 'maxContent', 'fitContent'] },
  height:          { tokenCat: 'sizes',     unitClass: 'length', keywords: ['auto', 'minContent', 'maxContent', 'fitContent'] },
  fontSize:        { tokenCat: 'fontSize',  unitClass: 'length', keywords: null },
  fontWeight:      { tokenCat: 'fontWeight', unitClass: null,    keywords: ['normal', 'bold'] },
  lineHeight:      { tokenCat: 'lineHeight', unitClass: 'length', keywords: ['normal'] },
  borderRadius:    { tokenCat: 'radius',    unitClass: 'length', keywords: null },
  boxShadow:       { tokenCat: 'shadow',    unitClass: null,     keywords: ['none'] },
  zIndex:          { tokenCat: 'zIndex',    unitClass: null,     keywords: ['auto'] },
  opacity:         { tokenCat: 'opacity',   unitClass: null,     keywords: null },
  transitionDuration: { tokenCat: 'duration', unitClass: 'time', keywords: null },
  display:         { tokenCat: null,        unitClass: null,
    keywords: ['block', 'inline', 'inlineBlock', 'flex', 'inlineFlex', 'grid', 'inlineGrid', 'none', 'contents'] },
  position:        { tokenCat: null,        unitClass: null,     keywords: ['static', 'relative', 'absolute', 'fixed', 'sticky'] },
  cursor:          { tokenCat: 'cursor',    unitClass: null,
    keywords: ['auto', 'default', 'pointer', 'text', 'wait', 'move', 'notAllowed', 'grab', 'grabbing'] },
  // ... 共约 60 条 (Phase 1 起步 15-20 条, 后续逐步扩)
}

// 类型层与之手动对齐 (types/properties.ts)
```

**为什么 generator 化**：300+ CSS 属性 × 平均 10 行 JSDoc 不可能手写。一旦类型层走 generator 派生，对齐问题自动消失（generator 单向消费 ENHANCED_PROPS）。

### 六.1 ENHANCED_PROPS 是 SSoT，类型由 generator 派生（零漂移）

```
src/chain/enhanced-props.ts (SSoT)
   ├── tokenCat:   'color' / 'spacing' / 'sizes' / ... / null
   ├── unitClass:  'length' / 'time' / 'angle' / null
   └── keywords:   readonly string[] / null
        │
        ▼ (pnpm generate, 即 node scripts/generate-properties.mjs)
        │
src/types/properties.generated.ts (派生, commit 进 git)
   └── interface IcxPropMethods<TSelf, T> { ... }
        ├── 增强属性 → ColorPropCarrier / PropCarrier (含 token / keyword / unit 字段)
        └── 其余属性 → PropFn (仅 fn + GlobalKw)
        │
        ▼ (declaration merging)
src/chain/Chain.ts
   └── interface Chain<T> extends IcxPropMethods<Chain<T>, T> {}
```

**新增 / 修改 ENHANCED_PROPS 流程**：
1. 改 `src/chain/enhanced-props.ts`（加 keyword 时也要同步 `src/chain/keywords.ts` 的 `KEYWORD_TO_CSS` 映射 + 用到的 token category 要同步 `src/types/tokens.ts` 的 `TokensXxx` 工具类型）
2. `pnpm generate`
3. `pnpm type-check && pnpm test`
4. commit `enhanced-props.ts` + `properties.generated.ts`（generated 文件入库，让 fork 用户不跑 generator 也能用）

**CI 校验**：在 CI 增加 `pnpm generate && git diff --exit-code src/types/properties.generated.ts`，保证生成器与源对齐。

---

## 七、核心代码骨架

### 7.1 `theme/Theme.ts`
```ts
import { resolveTheme } from './resolveTheme'
import { mergeTheme } from './mergeTheme'
import type { ThemeSchema, ResolvedTheme, DeepPartial } from './types'

// internal class
class _ThemeClass<T extends ThemeSchema> {
  private _resolved: ResolvedTheme<T> | null = null

  constructor(public schema: T) {
    Object.assign(this, schema)
    // 注意：schema 含 function token 时，instance 上拿到的是函数（未求值）；
    // 类型上是 string | number。访问真值请走 `theme.resolve()` 或 Chain 内部 `_theme`。
  }

  resolve(): ResolvedTheme<T> {
    if (this._resolved === null) this._resolved = resolveTheme(this.schema)
    return this._resolved
  }

  merge<P extends DeepPartial<T>>(partial: P): Theme<T> {
    const next = mergeTheme(this.resolve(), partial) as unknown as T
    return new Theme(next) as Theme<T>
  }
}

/** 主题类型：intersection 注入 ResolvedTheme<T> 字段。 */
export type Theme<T extends ThemeSchema> = _ThemeClass<T> & ResolvedTheme<T>

/** 主题构造器（运行时值）。`new Theme(schema)` / `class MyTheme extends Theme<MySchema>`。 */
export const Theme = _ThemeClass as unknown as {
  new <T extends ThemeSchema>(schema: T): Theme<T>
  readonly prototype: _ThemeClass<ThemeSchema>
}
```

### 7.2 `chain/Chain.ts`
```ts
import { css } from '@emotion/css'
import { makeChainProxy } from './proxy'
import { buildKeymap } from '../theme/keymap'
import { Theme } from '../theme/Theme'
import type { CSSObject } from '@emotion/css/create-instance'
import type { ResolvedTheme, ThemeSchema } from '../theme/types'
import type { DefaultSchema } from '../theme/defaults/schema'
import type { IcxPropMethods } from '../types/properties'

export class Chain<T extends ThemeSchema = DefaultSchema> {
  /* internal state (Proxy 也透传) */
  public _node: Record<string, unknown> = {}
  public _theme: ResolvedTheme<T>
  public _keymap: Map<string, Map<string, string>>

  constructor(theme: ResolvedTheme<T> | Theme<T>) {
    this._theme = theme instanceof Theme ? theme.resolve() : theme
    this._keymap = buildKeymap(this._theme)
    return makeChainProxy(this) as Chain<T>
  }

  // ─── 内建方法 ───
  label(name: string): this {
    this._node.label = name
    return this
  }

  _hover(fn: (s: this) => void): this {
    return this._nest('&:hover', fn)
  }

  _media(query: string, fn: (s: this) => void): this {
    return this._nest(query.startsWith('@media') ? query : `@media ${query}`, fn)
  }

  _when(cond: unknown, fn: (s: this) => void): this {
    if (cond) fn(this)
    return this
  }

  // ... 其余从 zui chain.ts 移植

  private _nest(sel: string, fn: (s: this) => void): this {
    // 复制 zui 的 withNested 逻辑
    return this
  }

  // ─── 输出 ───
  toCSSObject(): CSSObject {
    return this._node as CSSObject
  }

  toString(): string {
    return css(this._node as CSSObject)
  }
}

// ★ declaration merging: 注入 IcxPropMethods 的所有 declare 属性
export interface Chain<T extends ThemeSchema = DefaultSchema>
  extends IcxPropMethods<Chain<T>, T> {}
```

### 7.3 `chain/proxy.ts` 和 `chain/carrier.ts`
跟之前 Plan 类似 —— `get` 拦截分派到 builtin / carrier / fn，carrier 是 callable Proxy 实现四态。

### 7.4 `icss.ts`
```ts
import { Chain } from './chain/Chain'
import { Theme } from './theme/Theme'
import type { ResolvedTheme, ThemeSchema } from './theme/types'

export function icss<T extends ThemeSchema>(
  theme: ResolvedTheme<T> | Theme<T>,
  factory: (s: Chain<T>) => void,
): string {
  const c = new Chain<T>(theme)
  factory(c)
  return c.toString()
}
```

---

## 八、实现节奏

> **现状（2026-05）**：Phase 1 Day 1-3 骨架已完成 —— `packages/core/src` 下 Theme/Chain/Proxy/carrier/units/keywords/enhanced-props/icss/ikeyframes/cx/injectGlobal 全部存在。Phase 1 后半 + Phase 2 是剩余工作量。

### Phase 1 ✅ 已完成（骨架）
- `theme/` 全套：`Theme.ts` / `ThemeSchema.ts` / `resolveTheme.ts` / `mergeTheme.ts` / `keymap.ts` / `defaults/{light,dark,palette,schema,index}.ts`
- `chain/` 全套：`Chain.ts` / `proxy.ts` / `carrier.ts` / `units.ts` / `keywords.ts` / `enhanced-props.ts` / `builtins.ts` / `helpers.ts`
- `types/` 全套：`carrier.ts` / `tokens.ts` / `properties.ts`（17 个增强属性 + 2 个 PropFn）
- 顶层入口：`icss.ts` / `toClassName.ts` / `ikeyframes.ts` / `cx.ts` / `injectGlobal.ts` / `index.ts`
- 测试：`tests/theme.spec.ts` / `tests/chain-fn.spec.ts`
- vite/tsconfig/package.json 全部就绪

### Phase 1 剩余（2-3 天 → 0.1.0）

**P1.A — 内建方法移植完整**（0.5 天）
- `chain/builtins.ts` 当前只是占位；从 `C:\code\zui-back7\packages\ui\src\emotion\chain.ts` 移植 §二 列出的 30+ 个内建方法到 `Chain` 原型上（注意 §3.5.1 闭包陷阱 + §9 try/finally）
- 移植时要去掉旧版的 `resolveTokenValue` 字符串解析逻辑（新版 token 经由 carrier `_token` 路径访问）
- 保留 `_use` / `_apply` / `_var` / `_prop` 作为逃生舱
- `_blur` / `_backdropBlur` 需要 schema 有 `blur` category；DefaultSchema 不含 blur 时优雅降级（返回 chain 但不写入）

**P1.B — carrier 缓存 + 闭包陷阱修复 + alpha 简写**（0.5 天）
- Chain 加 `_carriers: Map<string, callable>` 字段
- `getOrCreateCarrier` 优先查缓存
- 校验：`_hover` 嵌套时 `chain.color._primary` 仍写入子节点（写 spec 复现 §3.5.1 场景）
- 新增 `chain/color.ts`：`setAlpha(color: string, alpha: number): string`，依赖 `color2k.parseToRgba`
- 更新 `carrier.ts`：token 命中分支，若 `tokenCat === 'color'` 且 value 是字符串，返回 `{ alpha(n) { ... } }`；否则返回 chain
- 更新 `types/carrier.ts`：加 `ColorPropCarrier<TSelf, ...>` + `ColorTokenValue<TSelf>`；`color`/`backgroundColor`/`borderColor`/... 在 IcxPropMethods 用 `ColorPropCarrier`
- `package.json` 加 `"color2k": "^2.0.3"` 到 dependencies
- 加 spec：`chain.color._primary.alpha(50)` 出 `rgba(...)` className

**P1.C — 测试补齐到 5 个文件**（0.5 天）
- ✅ `theme.spec.ts`、✅ `chain-fn.spec.ts`
- 新增 `chain-carrier.spec.ts`：四态全覆盖（fn / `_token` / keyword / `.px(n)`）
- 新增 `chain-builtins.spec.ts`：`_hover` / `_media` / `_when` / `_truncate` / 嵌套写入正确性
- 新增 `parity.spec.ts`：§六.1 的 ENHANCED_PROPS ↔ IcxPropMethods 守护
- 新增 `types.spec.ts`：用 `expect-type` 做 IDE 补全验证（`_notExist` 应 `toBeNever`）

**P1.D — 示例 + recipes + README**（0.5 天）
- `examples/vanilla-button/`：纯 TS（无框架）按钮 demo
- `recipes/vue.md` ✅ 已有占位；补完整 30 行 ZThemeProvider + useIcss
- `recipes/react.md` ✅ 已有占位；同上
- README 含完整四态访问 + 自定义主题（继承 / 实例化）+ 框架接入示例
- 发布 0.1.0（`npm publish --access public`）

### Phase 2（3-4 天 → 0.2.0）—— 扩展 + 完整默认主题
- **ENHANCED_PROPS 扩到 ~60 条**：补 padding/margin 系列（Top/Right/Bottom/Left）、gap 系列、border 系列、transition 系列、grid 相关；类型层 IcxPropMethods 同步扩
- **PropFn 形态属性扩展**：把常用 ~50 个剩余 CSS 属性（cursor 类、animation 类、grid 模板、filter、transform 等）加进 `IcxPropMethods` 的 PropFn 字段（运行时 fallback 已能跑，类型补全只是 IDE 体验）
- **DefaultSchema 扩到完整 Tailwind palette**：把 `flattenPalette(TAILWIND_PALETTE)` 接进 `defaults/light.ts` 和 `defaults/dark.ts`；schema 类型加 `PaletteToken`
- **断点 token 简写**：`_media('_md', s => ...)` 自动从 `theme.breakpoint.md` 取值（从 zui-back7 移植 `resolveBreakpointQuery`）
- **`recipes/svelte.md` / `recipes/solid.md`**
- **`examples/vue-button/` + `examples/react-button/`**：消费 core，与 docs 集成
- **性能 baseline**：vitest bench，记录"建链 + 出 className"耗时基线
- 发布 0.2.0

### Phase 3+（不在本 Plan 范围，留给 ui-vue 包）
- alpha 简写最终方案（§十一 开放问题）
- SSR / extractCritical wrapper
- 二级 carrier（`s.transform.rotate.deg(45)`）
- ESLint plugin（不允许 chain 之外的 emotion css 直接调用）

---

## 九、关键陷阱 / 边界

| 项 | 处理 |
|---|---|
| `interface X<T> extends T` declaration merging | ⚠️ 在 `verbatimModuleSyntax` 严格模式下 interface 不能 extend mapped type（如 `ResolvedTheme<T>`）。改用 `type Theme<T> = _ThemeClass<T> & ResolvedTheme<T>` + const 强转。见 §3.1 / §7.1 |
| class 实例返回 Proxy | `constructor() { return new Proxy(this, ...) }` 合法，TS 推断为 `this`，`instanceof` 仍然工作。但 TS 严格模式下需要 `return makeChainProxy(this) as unknown as Chain<T>` 双断言 |
| `declare` 字段 vs 真实字段 | declare 只声明类型不生成代码，正好配合 Proxy 拦截 |
| 用户继承时类型扩展 | `class MyChain extends Chain<MySchema>` 完全支持，可加自定义内建方法 |
| 没有响应式封装 | 用户自己用 Vue computed / React useMemo / Svelte $: 等，库不操心 |
| `_node` 等内部字段污染 instance | 用 `_` 前缀；不要写成 `#private`（Proxy 拦不到 private slot） |
| 多 Chain 实例的 emotion 缓存 | emotion 基于内容 hash, 不同 instance 内容相同也共享 className |
| keymap 跨实例重复算 | Theme 类内部 cache resolved+keymap, Chain 复用 Theme 缓存 |
| **保留属性名冲突** | `label` / `toString` / `toCSSObject` / `constructor` 不能作为用户访问的 CSS 属性。Proxy 的 INTERNAL_KEYS 白名单 + 原型方法兜底，遇到这些名时走 builtin。**用户的 schema 不要起名 `label`** |
| **token 与 keyword 命名冲突** | token 强制 `_` 前缀（`_white`），keyword 无前缀（`white`）。任何情况下不能让某个 token 与 keyword 同名后裸用 —— 因为 keyword 路径在 carrier proxy `get` 里更优先。Plan 强约束：**keymap 永远只接受 `_`-前缀键** |
| **carrier 闭包陷阱** | 见 §3.5.1。carrier 必须通过 `chain._node` 间接访问，**不能闭包捕获 _node 自身**，否则 `_hover` 嵌套写入会污染父节点 |
| **嵌套时 try/finally** | `_nest` 必须用 try/finally 还原 `_node` 引用；fn 内部抛错时父链状态可恢复 |
| **TS 实例化深度** | `ColorTokens<T>` 在 T['color'] 包含 200+ key 时（如完整 Tailwind palette）会触发 "Type instantiation is excessively deep"。缓解：拆 `PaletteColorTokens` + `SemanticColorTokens`，最终 union；或限制 DefaultSchema 只暴露语义色（palette 走值，不暴露 token 字面量） |
| **schema function token 直接访问** | `new Theme({ color: { primary: t => t.color.bg } })` 后，`theme.color.primary` 类型上是 string\|number，运行时是函数。值访问入口统一走 `theme.resolve()` 或 Chain 内部 `_theme`（已缓存 resolved） |
| **SSR / emotion 实例** | `@emotion/css` 默认共享全局缓存，多 app 隔离需要 `createInstance({ key })`。Phase 1 不提供 wrapper，开放问题 §十一 列出；高级用户自己 import `@emotion/css/create-instance` |
| **alpha 简写** | 旧版 `_primary/50` 透明度简写四态 carrier 暂不支持（`/50` 非合法 JS ident）。Phase 1 不做，Phase 2 探索 `chain.color._primary({ alpha: 0.5 })` 或单独 helper `alpha('_primary', 0.5, theme)`。开放问题 §十一 列出 |
| **csstype `Property.*` 在 schema 里** | csstype 的 `Property.X` 经常是带通配 `string` 的 union（自动放过任意值），看起来"类型不严"。这是 csstype 设计，链上 carrier 第一态 `prop(value)` 用 csstype 是合理的（既不挡用户合法值，又给关键字补全）|

---

## 十、参考资料

| 来源 | 借鉴点 |
|---|---|
| **`C:\code\zui\packages\ui\src\emotion\chain.ts`** | 内建嵌套方法、Proxy 拦截逻辑（移植成 class method） |
| **`C:\code\zui\packages\ui\src\emotion\helpers.ts`** | 直接复制 |
| **`C:\code\zui\packages\ui\src\provider\theme\*`** | palette / light / dark / tokens / resolve 整套复制 |
| **csstype** | 全部 CSS 属性 + 字面量值类型 |
| **Stitches `createStitches({ theme })`** | 工厂式 + 类型推断思路，但我们用 class 替代 |
| **Chakra `sx` + `_hover` 前缀** | 命名约定 |

---

## 十一、开放问题

### 已决
1. **库名**：`@kenconnet666/zui-core`
2. **emotion 版本**：`peerDependency: "@emotion/css": "^11.13.0"`
3. **是否支持 React-only / Solid-only adapter 包**：暂不做，0.3.0+ 再考虑
4. **`Theme<T>` 是 class 还是纯函数 factory**：**class**（用户可继承）
5. **`Chain<T>` 构造签名**：**必传 theme**（`new Chain(defaultLight)` / `new Chain(myTheme)`），不做"无参默认 DefaultSchema"
6. **`Chain` 是否暴露 `_node` 等内部字段**：暴露但加 `_` 前缀，方便适配器和插件
7. **测试栈**：Vitest + expect-type + happy-dom（仅 DOM 测试需要）
8. **构建**：Vite (lib mode) + vite-plugin-dts，只 ESM 输出
9. **`csstype`** + **`color2k`**：都放 `dependencies`（体积小、API 稳定、版本紧耦合内部实现），不放 peerDep
10. **`DefaultSchema` 命名**：类型与值同名 OK（TS 支持 namespace merging）；值入口是 `defaultLight` / `defaultDark`，类型入口是 `DefaultSchema`（interface）。运行时 `DefaultSchema = defaultLight.schema` 用作 `Chain<DefaultSchema>` 默认实参，不对外作为"主入口"暴露
11. **Chain 风格**：**statement-only**，每条独立一行；token 命中**不返回 chain**（颜色 token 返回 `ColorTokenValue` 暴露 `.alpha(n)`，其它 token 返回 chain 但用户**不应**继续链式）
12. **alpha 简写 API**：**`chain.color._primary.alpha(50)`**（参数 0-100，单位 %）。token 命中立即写真值，`.alpha(n)` 重写为 rgba。运行时用 color2k 的 `parseToRgba`。**仅 color category 提供**
13. **CSS 变量定位**：库**不**做 token→CSS variable 自动桥接（token 出值始终是 JS 真值）；提供 `_var('--my-custom', '#fff')` 作为"主动写自定义属性"的逃生舱
14. **保留属性名约束**：不在 ThemeSchema 类型层强制 Exclude；README 写明禁用 schema category 名：`label` / `constructor` / `toString` / `toCSSObject` / `_node` / `_theme` / `_keymap` / `_carriers`；运行时 INTERNAL_KEYS 白名单兜底
15. **性能取舍**：类型完整 + IDE 补全优先；运行时 ~2-3× 原生 emotion css 可接受；用户在响应式系统层用 `computed` / `useMemo` 缓存

### 待决（Phase 2 前再拍）

16. **SSR / extractCritical**：emotion 11 提供 `extractCritical`，但需要用户自己创建 emotion 实例。Phase 1 不 wrap；Phase 3+ 给 `createIcssInstance(emotion)` 工厂返回一组绑定到该实例的 `Chain` / `icss` / `cx` / ...
17. **`@emotion/css` 多实例**：用户用 `createInstance({ key })` 时，目前库内部 `import { css }` 写死默认实例。同 16 的解决方案
18. **断点 token 语法**：保留旧版 `_media('_md', ...)` 字符串 token 简写？还是改成 `_media(s => s.breakpoint.md, ...)` 拿 theme 字段？倾向**保留字符串简写**
19. **async factory**：目前 `icss(theme, factory)` 同步。Phase 1 不支持 await，文档明确

---

## 十二、新会话开工提示

### 12.1 项目脚手架（pnpm workspaces，3 包结构）

```
my-icx/
├── packages/
│   ├── core/         # @kenconnet666/zui-core   (框架无关 CSS DSL, 本 Plan 主体)
│   ├── ui-vue/          # @kenconnet666/zui-vue    (Vue 组件库, 消费 core)
│   └── docs/             # 私有, VitePress 演示文档
├── pnpm-workspace.yaml
├── package.json          # 根, 只放 dev tools + 编排脚本
├── tsconfig.base.json
├── .npmrc
└── .gitignore
```

**Bootstrap 命令序列**：

```bash
# 1. 起根
mkdir my-icx && cd my-icx
git init
pnpm init

# 2. workspace 配置
cat > pnpm-workspace.yaml <<'EOF'
packages:
  - "packages/*"
EOF

cat > .npmrc <<'EOF'
shamefully-hoist=false
strict-peer-dependencies=false
auto-install-peers=true
EOF

# 3. 根级 dev deps
pnpm add -D -w typescript vitest @types/node

# 4. core (本 Plan 主体, Phase 1)
mkdir -p packages/core/src
cd packages/core
pnpm init
pnpm add @emotion/css
pnpm add -D vite vite-plugin-dts csstype expect-type happy-dom
cd ../..

# 5. ui-vue (Phase 3+, 起包就行先空着)
mkdir -p packages/ui-vue/src
cd packages/ui-vue
pnpm init
pnpm add vue @kenconnet666/zui-core@workspace:*
pnpm add -D vite @vitejs/plugin-vue vue-tsc vite-plugin-dts @vue/test-utils happy-dom
cd ../..

# 6. docs (VitePress)
mkdir -p packages/docs
cd packages/docs
pnpm init
pnpm add -D vitepress
pnpm add vue @kenconnet666/zui-core@workspace:* @kenconnet666/zui-vue@workspace:*
pnpm dlx vitepress init    # 交互式, 选 Vue, 路径选当前目录
cd ../..
```

### 12.2 关键配置文件（拷贝即用）

**根 `package.json`** 编排脚本：
```json
{
  "name": "my-icx",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel --filter !docs run dev",
    "docs:dev": "pnpm --filter docs run dev",
    "build": "pnpm --filter @kenconnet666/zui-core build && pnpm --filter @kenconnet666/zui-vue build && pnpm --filter docs run build",
    "test": "pnpm -r run test",
    "typecheck": "pnpm -r run typecheck"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vitest": "^2.0.0",
    "@types/node": "^22.0.0"
  },
  "packageManager": "pnpm@9.0.0"
}
```

**`tsconfig.base.json`**：
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  }
}
```

**`packages/core/package.json`**（关键 fields）：
```json
{
  "name": "@kenconnet666/zui-core",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" }
  },
  "files": ["dist"],
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": { "@emotion/css": "^11.13.0" }
}
```

**`packages/core/vite.config.ts`**：
```ts
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index' },
    rollupOptions: { external: ['@emotion/css', 'csstype'] },
    sourcemap: true,
  },
  plugins: [dts({ rollupTypes: true, tsconfigPath: './tsconfig.json' })],
})
```

**`packages/ui-vue/vite.config.ts`**：
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index' },
    rollupOptions: { external: ['vue', '@kenconnet666/zui-core', '@emotion/css'] },
    sourcemap: true,
  },
  plugins: [vue(), dts({ rollupTypes: true, tsconfigPath: './tsconfig.json' })],
})
```

### 12.3 首次跑通

```bash
pnpm install                                    # 装所有, 自动 link workspace 包
pnpm --filter @kenconnet666/zui-core build           # 先建 core (产 dist + .d.ts)
pnpm --filter @kenconnet666/zui-vue build            # 再建 vue
pnpm docs:dev                                    # 启动文档站, 默认 http://localhost:5173
```

### 12.4 开发流程建议

- **core 改动时**：`pnpm --filter @kenconnet666/zui-core dev`（watch 模式持续 rebuild）
- **同时改 ui-vue + docs**：起两个终端
  - 终端 1: `pnpm --filter @kenconnet666/zui-vue dev`
  - 终端 2: `pnpm docs:dev`
- **VitePress 默认 HMR**，core/vue 的 dist 一变 docs 自动刷新

### 12.5 包命名建议

| 包 | 名 | 说明 |
|---|---|---|
| CSS 核心 | `@kenconnet666/zui-core` | Plan.md 主体, Phase 1-2 |
| Vue 组件库 | `@kenconnet666/zui-vue` | 消费 core; 单独节奏 |
| 文档站 | `@kenconnet666/zui-docs`（private: true） | 不发布 |

---

### 12.6 严格约束（再强调）

```
1. cd 到 packages/core 后再按本 Plan.md 第八节「实现节奏」推进
   (Phase 1-2 主战场都在 core 里)

2. ★ core 严格框架无关, 不装 vue/react/svelte ★

3. ui-vue 包先空着, Phase 1-2 完成后再做 Vue 组件库 (Phase 3)
   ui-vue 里会消费 core, 例如:
     import { Chain, Theme, icss } from '@kenconnet666/zui-core'
   并提供 Vue 专属的 ZThemeProvider.vue / useIcss.ts (基于 inject/computed)
   这部分代码就是 Plan 里的 recipes/vue.md 落地

4. docs 用 VitePress, markdown 里直接写 Vue 组件 demo:
     <script setup>
       import { Btn } from '@kenconnet666/zui-vue'
     </script>
     <Btn>Hello</Btn>

5. 参考文件 (zui 仓库, Read-only):
   - C:\code\zui\packages\ui\src\emotion\chain.ts          (内建嵌套方法逻辑, 移植成 class method)
   - C:\code\zui\packages\ui\src\emotion\helpers.ts        (直接复制)
   - C:\code\zui\packages\ui\src\provider\theme\palette.ts (直接复制)
   - C:\code\zui\packages\ui\src\provider\theme\light.ts   (直接复制, 清理 white/black/transparent 出 color)
   - C:\code\zui\packages\ui\src\provider\theme\dark.ts    (直接复制, 同上)
   - C:\code\zui\packages\ui\src\provider\theme\types.ts   (直接复制)
   - C:\code\zui\packages\ui\src\provider\resolveTheme.ts  (直接复制, 改成纯函数)
   - C:\code\zui\packages\ui\src\provider\tokens.ts        (interface 改名 DefaultSchema)

6. 按本 Plan.md 第八节「实现节奏」5+4 天推进 core

7. 核心约定 (再强调):
   ★ class Theme<T> + class Chain<T>, interface declaration merging 展开 T 成员
   ★ core 框架无关: 不 import vue / react / svelte, 不写 composable / hook
   ★ 用户继承 Theme<T> 或实例化 Theme(schema) 拿强类型
   ★ Chain<T> 通过 declare 字段 + Proxy 实现四态 carrier
   ★ 四态访问:
     - s.color('red')             (函数调用, csstype 严格)
     - s.color._primary           (主题 token, _前缀)
     - s.color.white              (CSS keyword, 无前缀)
     - s.padding.px(16)           (unit 方法)
   ★ 内建方法全 _ 前缀 (class method, 放 prototype 上)
   ★ 不用 CSS 变量, 不做 recipe 变体
   ★ Provider 由 ui-vue 包提供, core 只给 mergeTheme/resolveTheme/Chain/toClassName 等工具
   ★ docs 用 VitePress, 直接消费 core + ui-vue 演示
```

---

**Plan 起草完毕。骨架已就绪（见 §八「现状」），剩余 2-3 天到 0.1.0，再 3-4 天到 0.2.0。**

---

## 十三、现状对照表（packages/core 已有 vs Plan 余量）

| 文件 / 入口 | 现状 | Plan 要求 | 差距 |
|---|---|---|---|
| `theme/Theme.ts` | ✅ class + `resolve()` lazy cache + `merge()` + declaration merging `extends ResolvedTheme<T>` | 同 | — |
| `theme/ThemeSchema.ts` | ✅ 转发 types | 同 | — |
| `theme/types.ts` | ✅ ThemeSchema / ThemeValue / ResolvedTheme / DeepPartial | 同 | — |
| `theme/resolveTheme.ts` | ✅ 两遍扫描，function token 求值 | 旧版用 Proxy 懒求值 + 环检测 | 可选优化：换成 Proxy 懒求值 + 环检测（参考 zui-back7） |
| `theme/mergeTheme.ts` | ✅ deepMerge，浅一层 | partial 含嵌套对象时 spread 不够；要 deep | 改成递归（用 helpers.deepMerge） |
| `theme/keymap.ts` | ✅ `toIdent` + `buildKeymap` | 同 | — |
| `theme/defaults/light.ts` & `dark.ts` & `palette.ts` & `schema.ts` | ✅ 精简 DefaultSchema (7 category) | Phase 2 扩到完整 Tailwind palette | P2 任务 |
| `chain/Chain.ts` | ✅ 类 + 构造返回 Proxy + 6 个内建方法 | 需补完 30+ 内建方法（§二） | P1.A |
| `chain/proxy.ts` | ✅ get 分派 + INTERNAL_KEYS 白名单 | 同 | — |
| `chain/carrier.ts` | ✅ 四态 callable Proxy，每次新建 | 加缓存（§3.5.2） | P1.B |
| ~~`chain/builtins.ts`~~ | ✅ **已删**（2026-05 决策：内建方法直接放在 `Chain.ts` 原型上） | — | — |
| `chain/color.ts` | ❌ 未建 | 新增：`setAlpha(color, n)`（基于 color2k.parseToRgba），供 carrier 颜色分支用 | P1.B |
| `chain/enhanced-props.ts` | ✅ **72 条**（color×13 / spacing×22 / sizes×6 / 字体×5 / radius×5 / borders×6 / shadow+z+opacity+aspect×4 / 布局×7 / 过渡×4） | Phase 2 用户自行扩 | — |
| `scripts/generate-properties.mjs` | ✅ **新增**：读 csstype + ENHANCED_PROPS 派生类型；857 属性 / 72 增强 | 同 | — |
| `chain/keywords.ts` | ✅ KEYWORD_TO_CSS + GLOBAL_KEYWORDS | 同 | — |
| `chain/units.ts` | ✅ LENGTH/TIME/ANGLE + withUnit | 同 | — |
| `chain/helpers.ts` | ✅ isPlainObject + deepMerge | 同 | — |
| `types/carrier.ts` | ✅ PropCarrier / PropFn / LengthUnits / TimeUnits / AngleUnits | 同 | — |
| `types/tokens.ts` | ✅ ToIdent + 12 个 TokensXXX 工具类型 | 同 | — |
| ~~`types/properties.ts`~~ → `types/properties.generated.ts` | ✅ **改造**：手写文件已删，generator 派生 857 属性 + 完整 csstype JSDoc | — | — |
| `icss.ts` / `toClassName.ts` / `cx.ts` / `injectGlobal.ts` | ✅ 全部最小实现 | 同 | — |
| `ikeyframes.ts` | ✅ builder.at/from/to | 已比旧版 frame map 更简洁 | — |
| `index.ts` | ✅ 类型 + 值 + 默认主题导出齐全 | 同 | — |
| `tests/theme.spec.ts` & `tests/chain-fn.spec.ts` | ✅ 2 个 | 5 个（+carrier/builtins/parity/types） | P1.C |
| `examples/vanilla-button/index.ts` | ✅ 占位 | 完整 demo | P1.D |
| `recipes/vue.md` & `recipes/react.md` | ✅ 占位 | 完整 30 行 provider + useIcss | P1.D |
| `README.md` | ✅ 存在 | 四态 + 自定义主题 + 框架接入 | P1.D |

**结论**：骨架 ~80% 完成，剩余主要是「内建方法移植 + carrier 缓存 + 4 个测试 + 示例补全」，共 2-3 天到 0.1.0。

### 13.1 推荐起步指令（新会话）

```bash
# 1. 进 core 包
cd C:\code\zui\packages\core

# 2. 验证骨架可运行
pnpm install          # 根目录已 install 过的话可跳过
pnpm test             # 当前 2 个 spec 应该全绿
pnpm type-check       # tsc --noEmit

# 3. P1.A 起步: 内建方法移植
#    参考 C:\code\zui-back7\packages\ui\src\emotion\chain.ts (IcxRuntime 类)
#    复制 _hover/_focus/_active/.../_truncate/_lineClamp 等到 src/chain/Chain.ts 的 class 体
#    去掉 resolveTokenValue / resolveBreakpointQuery 字符串解析（新版用 carrier）
```
