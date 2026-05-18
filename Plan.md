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

> **现状（2026-05-18）**：Phase 1 完成（0.1.0 ready）—— 内建方法 59 个 / carrier 缓存 + alpha 简写 / 6 套测试 83 个 case 全绿 / vanilla-button vite app / vue+react recipes / README 重写。Phase 2 待启动。

### Phase 1 ✅ 全部完成
- **骨架**（之前 session 已完成）：theme/ chain/ types/ 入口 icss/toClassName/ikeyframes/cx/injectGlobal + 2 个基础测试 + vite/tsconfig 就绪
- **P1.A ✅ 内建方法移植**（commit `3cce92c`）：从 zui-back7 移植 53 个 `_xx` 方法到 `Chain.ts`（伪类 / 表单 / 伪元素 / 结构伪类 / group·peer / 选择器 / 条件 / at-rules / 媒体修饰符 / 工具组合 / filter / 逃生舱）；helpers 补 `deepClone` + `deepMergeInto`；proxy.ts INTERNAL_KEYS 加 `_carriers` / `_resolveBlurValue`
- **P1.B ✅ carrier 缓存 + alpha 简写**（commit `9d680e4`）：装 `color2k ^2.0.3`；新增 `chain/color.ts`（`setAlpha`）；`carrier.ts` 加 `_carriers` Map 缓存 + 颜色 token 返回 `ColorTokenValue { alpha(n) }`；`_carriers` 字段在 Chain 构造时已初始化
- **P1.C ✅ 测试补齐 + 修关键 bug**（commit `d5e521f`）：新增 chain-carrier (20) / chain-builtins (36) / parity (7) / types (13)，6 套 83 测试全绿；★ 关键修复：proxy.ts 方法 bind 改 `receiver`（原 `bind target` 导致 `_nest` / `_when` / `_apply` 内部 `fn(this)` 传出原始 chain，carrier 路径失效）
- **P1.D ✅ 示例 + recipes + README**（本提交）：mergeTheme 改走 `deepMerge` + 加 2 个深合并测试；DefaultSchema 加 `blur` category（none/xs/sm/base/md/lg/xl/2xl/3xl）；`vanilla-button` 升级为独立 vite app（package.json + index.html + vite.config.ts，pnpm-workspace.yaml 注册 `packages/core/examples/*`）；vue.md + react.md 改成 30 行级可复制 ZThemeProvider + useIcss；README.md 重写（四态 / 自定义 schema / 59 内建方法表 / 限制说明）

### Phase 2 ✅ 已完成（0.2.0）
- **P2.A ✅** ENHANCED_PROPS 扩到 **129 条**（commit `851bc52`）：flex 容器 8 / flex 项目 4 /
  grid 4 / 边框样式 7 / 阴影 1 / 动画 7 / transform 5 / object 2 / 文字 10 / 背景 4 /
  交互 4。generator 加 SpreadElement 支持。
- **P2.B ✅** DefaultSchema 接完整 Tailwind palette **242 色 + 11 语义色 = 253 token**
  （commit `eda78df`）：schema.ts 拆 `PaletteToken` + `SemanticColorTokens` 两 union
  预防 TS2589；实测当前配置下不爆。+7 个 palette 专项测试。
- **P2.C ✅** bench baseline（commit `1bda4a9`）：vitest bench 3 组场景；
  baseline.md 记录 icss ~19k ops/s（~50μs/chain），~46× 慢于原生 emotion；
  列 3 个 P3+ 优化候选（keymap 缓存到 Theme / carrier 工厂模块级 / token slot 冻结）
- **P2.D ✅** recipes/svelte.md + solid.md（commit `4bba6df`）：Svelte 5 runes 风 +
  Solid createMemo 风格 30 行级 ZThemeProvider + useIcss
- **P2.E ✅** examples/vue-button + react-button（commit `873acc2`）：两个独立 vite app
  演示主题切换 + Primary/Ghost/Danger 三种按钮，vite alias 直吃 core 源码
- **P2.F ✅** GitHub Actions CI（commit `1a12986`）：generator drift check +
  typecheck + test + build core + build 3 examples
- **P2.G ✅** changesets 接入（commit `dd7f25d`）：`@changesets/cli` + config
  access: public + ignore 3 examples；README 加发布流程章节；publish 仍手动
- **P2.H ✅** ColorTokenValue 扩 5 个 modifier（commit `a3ffb34`）：
  `darken / lighten / mix / saturate / desaturate`（基于 color2k）；
  +5 个测试；types/carrier.ts ColorTokenValue 接口同步扩

**Phase 2 数字**：
- 测试：6 套 83 → 7 套 95（+ palette 专项 + 5 modifier）
- ENHANCED_PROPS：72 → 129
- 颜色 token：~10 → 253（242 palette + 11 语义）
- 包大小：bundle 19.88kb / 4.91kb gzip（未变 —— 类型扩展不增运行时）
- bench: icss ~19k ops/s

### Phase 3+（待启动 —— 开工前请参考 [`AGENT.md`](./AGENT.md) §九 候选清单）

| 候选 | 工作量 | 风险 | 价值 |
|---|---|---|---|
| **P3.A** 性能优化（keymap 缓存到 Theme，按 bench/baseline.md 三候选） | 0.5 天 | 中 | bench 19k → 40k+ ops/s |
| **P3.B** SSR / `createIcssInstance(emotion)` wrapper | 1 天 | 中 | 解决 §十一.16-17 |
| **P3.C** ui-vue 包启动（ZThemeProvider + 5 基础组件） | 2-3 天 | 高（API 设计） | 落地组件库 |
| **P3.D** docs 站（VitePress） | 1-2 天 | 低 | 文档 + 在线 demo |
| **P3.E** 二级 carrier（`s.transform.rotate.deg(45)`） | 1 天 | 中（DSL 设计） | 表达力升级 |
| **P3.F** ESLint plugin（禁直接 emotion css） | 1 天 | 低 | 大型项目防错 |

**推荐启动顺序**（agent 自主推进时）：D（docs） → B（SSR） → A（perf） → C（ui-vue） →
E（二级 carrier） → F（ESLint plugin）。每条都属于 P3 决策点，开工前需用户确认范围。

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

| 文件 / 入口 | 现状 | 差距 |
|---|---|---|
| `theme/Theme.ts` | ✅ class + lazy resolve cache + merge + type intersection 注入 ResolvedTheme 字段 | — |
| `theme/types.ts` | ✅ ThemeSchema / ThemeValue / ResolvedTheme / DeepPartial | — |
| `theme/resolveTheme.ts` | ✅ 两遍扫描，function token 求值 | 0.1.0 决定不换 Proxy 懒求值（已 work）；环检测留 P2+ |
| `theme/mergeTheme.ts` | ✅ 走 helpers.deepMerge（不可变深合并）+ 2 个新增测试覆盖兄弟保留与 immutable | — |
| `theme/keymap.ts` | ✅ `toIdent` + `buildKeymap` | — |
| `theme/defaults/light.ts` & `dark.ts` & `palette.ts` & `schema.ts` | ✅ 7 category + blur 9 token（Phase 1 末尾补） | P2 扩完整 Tailwind palette |
| `chain/Chain.ts` | ✅ 59 个内建方法（伪类 / 表单 / 伪元素 / 结构 / group·peer / 选择器 / 条件 / at-rules / 媒体修饰符 / 工具组合 / filter / 逃生舱） | — |
| `chain/proxy.ts` | ✅ INTERNAL_KEYS 含 `_carriers` / `_resolveBlurValue`；方法 bind 到 receiver（修复关键 bug） | — |
| `chain/carrier.ts` | ✅ `_carriers` Map 缓存 + 颜色 token 返回 ColorTokenValue { alpha } | — |
| `chain/color.ts` | ✅ `setAlpha(color, n)`（基于 color2k.parseToRgba） | — |
| `chain/enhanced-props.ts` | ✅ 72 条 | P2 扩到 ~120 |
| `scripts/generate-properties.mjs` | ✅ 读 csstype + ENHANCED_PROPS（含 Identifier 解引用）派生 857 属性 / 72 增强 | — |
| `chain/keywords.ts` | ✅ KEYWORD_TO_CSS + GLOBAL_KEYWORDS | — |
| `chain/units.ts` | ✅ LENGTH/TIME/ANGLE + withUnit | — |
| `chain/helpers.ts` | ✅ isPlainObject + deepClone + deepMerge + deepMergeInto | — |
| `types/carrier.ts` | ✅ PropCarrier / ColorPropCarrier / ColorTokenValue / PropFn / LengthUnits / TimeUnits / AngleUnits | — |
| `types/tokens.ts` | ✅ ToIdent + 18 个 TokensXXX 工具类型 | — |
| `types/properties.generated.ts` | ✅ generator 派生，含完整 csstype JSDoc + MDN 链接 + 兼容表 | — |
| `icss.ts` / `toClassName.ts` / `cx.ts` / `injectGlobal.ts` / `ikeyframes.ts` | ✅ 全部最小实现 | — |
| `index.ts` | ✅ 完整导出（含 ColorPropCarrier / ColorTokenValue / DefaultSchema） | — |
| `tests/*.spec.ts` | ✅ 6 套 / 83 测试（theme 5 / chain-fn 2 / chain-carrier 20 / chain-builtins 36 / parity 7 / types 13） | — |
| `examples/vanilla-button/` | ✅ 独立 vite app（package.json + index.html + vite.config.ts，3 种按钮 demo） | P2 加 vue/react examples |
| `recipes/vue.md` & `recipes/react.md` | ✅ 完整 30 行 provider + useIcss + dark-mode toggle | P2 加 svelte/solid |
| `README.md` | ✅ 四态 + 自定义 schema + 59 内建方法表 + 限制说明 + dev 命令 | — |
| `pnpm-workspace.yaml` | ✅ 包含 `packages/*` + `packages/core/examples/*` | — |

**结论**：Phase 1（0.1.0）+ Phase 2（0.2.0）全部完成。等用户审完后发 npm。

### 13.1 0.1.0 ready 后的恢复指令（下次会话）

```bash
cd C:\code\zui

# 1. 验证当前状态
pnpm --filter @kenconnet666/zui-core test          # 应 83/83 全绿
pnpm --filter @kenconnet666/zui-core exec tsc --noEmit --project tsconfig.json

# 2. 跑 vanilla-button demo（浏览器预览）
pnpm --filter @kenconnet666/example-vanilla-button dev

# 3. 改 ENHANCED_PROPS 后重生成
node scripts/generate-properties.mjs

# 4. 发 0.1.0（**手动**）
cd packages/core
pnpm publish --access public        # 需先 npm login
```

---

## 十四、自主决策日志（agent 自主推进时的边角决策）

> agent 在用户离线期间遇到的非阻塞设计决策记录于此。每条都是"按 zui-back7 既有实现/最直接方式处理"风格，回来后可统一审。

| 时间 | 文件 / 范围 | 问题 | 决策 | 理由 / 参考 |
|---|---|---|---|---|
| 2026-05-18 | P1.A: chain/Chain.ts `_truncate` | 是否保留旧 Chain.ts 的"`_truncate(lines = 1)` 多行 fallback" | **拆**：`_truncate()` 仅单行；多行用 `_lineClamp(n)` | 对齐 zui-back7（语义更清晰，符合 Tailwind 命名） |
| 2026-05-18 | P1.A: chain/Chain.ts `_nest` | 嵌套 fn 内容 + 父节点同名 selector 已有内容时如何处理 | 复用 existing 对象，新写入 merge 进去；空 fn 不留空 selector | 与 zui-back7 `withNested` 行为一致；避免重复 selector 块 |
| 2026-05-18 | P1.A: chain/helpers.ts | 既有 `deepMerge`（不可变）与 zui-back7 `deepMerge`（可变）同名 | 既有保留为不可变 `deepMerge`；新增 `deepMergeInto`（可变）；`Chain._use` 走可变 | 两份语义都有用：`mergeTheme` 需要返回新对象，`_use` 需要原地写 `_node` |
| 2026-05-18 | P1.C: chain/proxy.ts ★ bug fix | 测试中 `_when(true, s => s.color._primary)` 抛 `Cannot read properties of undefined`：fn(this) 传出的是 target 不是 proxy | 修改两处 `.bind(target)` → `.bind(receiver)`，让方法内 `this === proxy`；carrier 仍闭包到 target 不受影响 | 实测后 36/36 内建测试全过；记入 §九陷阱表 |
| 2026-05-18 | P1.D: theme/mergeTheme | Plan §十三 标注"浅一层，要 deep"。审后认为 ThemeSchema 实际只 2 层（Cat→key→leaf），现有实现已够 | 改写为统一走 `helpers.deepMerge`（行为不变，代码更短）+ 加 2 个 immutable / sibling-preserve 测试守护 | 函数对 ResolvedTheme 形状语义不变，代码更短更通用 |
| 2026-05-18 | P1.D: defaults | DefaultSchema 加 blur category 时键名 `2xl` / `3xl` 与 schema interface 冲突（不是合法 ident） | 用 `'2xl': string` / `'3xl': string` 字符串字面量 key 声明 | TS 支持，访问时也只能用 `theme.blur['2xl']` 字符串形式（用户少用，可接受） |
| 2026-05-18 | P1.D: chain-builtins 测试 | 加 blur 后"找不到 blur token → 原值透传"测试失败（因为 defaultLight 现在有 blur） | 改用 `new Theme({ color: ... })` 故意不带 blur 的临时主题 | 测试意图不变，仍守护无 blur 时的优雅降级 |
| 2026-05-18 | P1.D: vanilla-button | pnpm-workspace.yaml 只含 `packages/*`，example 拿不到 workspace dep | 追加 `packages/core/examples/*` 到 workspace 列表 | 让 example 用 `workspace:*` 链 core 源码，dev 时直接吃 src（vite alias 配合） |

### 14.1 复盘清单（回来审时关注）

1. **proxy bind 改 receiver 的副作用**：所有内建方法的 `this` 现在是 proxy。访问 `this._node` 走 INTERNAL_KEYS 白名单（已配齐）；访问其他属性走 carrier 分支。如未来加新私有方法记得同步白名单。
2. **DefaultSchema blur key `2xl`/`3xl`**：访问形式 `theme.blur['2xl']`，不是 `theme.blur._2xl`。Chain 上用 `_blur('_2xl')` 也不行（resolveBlurValue 去掉 `_` 后查 `blur['2xl']`，要 token 名带 `_` 时去 `_2xl`，但用户最自然写法是 `_blur('2xl')` 不带 `_` 直接命中）。功能 OK 但命名要在 README 标注。
3. **mergeTheme 改成走 deepMerge**：与 zui-back7 实现等价（zui-back7 也是 2 层 spread）；测试覆盖了兄弟保留 + immutable。如 P2 加深嵌套 category（如 `motion.duration.fast`），deepMerge 已经能处理。
4. **vanilla-button 用 vite alias 引 src**：dev 时直接吃 src（无需先 build），生产 build 出 33.85kb / 12.42kb gzip。
5. **★ 对外类型改动后必须 `pnpm build`**：dist gitignored 但被 IDEA / 其它消费者通过 node_modules symlink 读取；不重 build 会导致 IDE 误报旧签名错。加入了 AGENT.md §四.3 验证铁律。
6. **examples tsconfig path mapping**：vue-button / react-button 现在通过 `paths` 直接走 src，让 IDE 与 vite 行为一致；vanilla-button 没 tsconfig（纯 vite），不影响。

### 14.2 Phase 2 新增决策

| 时间 | 文件 / 范围 | 问题 | 决策 | 理由 / 参考 |
|---|---|---|---|---|
| 2026-05-18 | P1.E: scripts/generate-properties.mjs | tests typecheck 后 `padding(16)` 数字报错（csstype 默认 TLength=string\|0） | CssValueOf 用 `Properties<string\|number, string\|number>`，让 length/time 属性都接 number | emotion 收数字自动 px/ms，类型层与运行时对齐；不影响 color 等非长度属性 |
| 2026-05-18 | P1.E: tests/chain-builtins.spec.ts | `interface X extends Omit<DefaultSchema, 'blur'>` 让 SpacingTokens 推断为 never | 改回 `interface X extends DefaultSchema { breakpoint: ... }`，不覆盖 blur，让 SchemaWithBreakpoint 继承默认 blur | TS 6.0.3 对 `extends mapped type` 处理不稳定；直接 extends DefaultSchema 信息保留完整 |
| 2026-05-18 | P1.E: package.json | 是否在 `prepublishOnly` 串 typecheck + test + build | 是。`prepublishOnly: "pnpm run type-check && pnpm run test && pnpm run build"` | 兜底防止用户误发未通过验证的版本 |
| 2026-05-18 | P2.A: scripts/generate-properties.mjs | `keywords: [...JUSTIFY_KW, 'auto']` spread 让 generator 漏掉 spread 部分 | AST parser 加 SpreadElement 处理：识别 spread + 解引用 const 数组 + 拼接 | parity 测试守护成功；以后允许 ENHANCED_PROPS 用 spread 复用 keyword 集 |
| 2026-05-18 | P2.B: schema.ts | 完整 Tailwind palette 触发 TS2589 风险 | 拆 `PaletteToken` + `SemanticColorTokens` 两 union（预案），实测当前 TS 配置不爆 | 提前拆好让用户自定义 schema 用 `Pick<DefaultColorTokens, ...>` 时灵活 |
| 2026-05-18 | P2.B: palette.ts | zui-back7 palette 命名是 kebab (`blue-600`)，P1 light/dark 引用驼峰 (`palette.blue600`) | 同时导出：嵌套 `TAILWIND_PALETTE` (kebab key) + 展平 `FLAT_PALETTE` (kebab token) + legacy `palette` (camelCase 兼容字段) | light/dark 不需要重写；用户既可用 `_blue600` 也可访问 `palette.blue600` |
| 2026-05-18 | P2.C: bench | icss ~19k ops/s, ~46× 慢于原生 emotion（Plan §一 决策 15 预期 2-3×） | 不立即优化，记入 baseline.md + 列 3 个 P3+ 候选 | 实际应用感知（100 chain/render = 5ms）仍宽裕；过早优化反而牵动太多核心代码 |
| 2026-05-18 | P2.D: svelte.md | Svelte 5 runes + setContext 模式不支持直接传 `$state` Ref，需要类包装 | 用 `class ThemeStore { current = $state(...) }` 暴露 store；getContext 拿 instance 而非 ref | 是 Svelte 5 当前推荐的"reactive state 跨组件传递"惯用法 |
| 2026-05-18 | P2.G: .changeset/config.json | examples 不该参与版本管理 | ignore 3 个 example 包名 + access: public | example 包是 `private: true` 不会发包，但 ignore 防止 `changeset version` 误处理 |
| 2026-05-18 | P2 post-release: toClassName.ts | `toClassName(chain: Chain<never>)` 让用户传 `Chain<DefaultSchema>` 时 TS2345（T 不变性，never 拒绝其它实例化） | 改 generic：`toClassName<T extends ThemeSchema>(chain: Chain<T>): string` | 0.2.1 hotfix；examples 没受影响（vite build 跳过严格 typecheck），但 IDEA TS service 报错 |
| 2026-05-18 | P2 post-release: dist/index.d.ts | 改 src/toClassName.ts 后 commit + push，但用户 IDEA 仍报旧错。原因：上次 `pnpm test` 后没 `pnpm build`，dist 仍是 0.2.0 P2.H 时刻的产物；IDEA 通过 node_modules symlink → packages/core/dist/index.d.ts 读到旧签名 | 重新 `pnpm build` 同步 dist；并把"对外类型改动后必跑 build"写进 AGENT.md §四.3 验证铁律 | dist gitignored 不入库，但 IDEA 走 node_modules 解析；examples vite alias 仅影响 vite，不影响 IDE TS 服务 |
| 2026-05-18 | P2 post-release: examples/{vue,react}-button/tsconfig.json | examples 没配 path mapping，IDEA TS 服务通过 node_modules 读 dist 而非 src | 加 `baseUrl + paths: "@kenconnet666/zui-core" → ../../src/index.ts` + `ignoreDeprecations: "6.0"` | 让 IDE 行为跟 vite.config.ts 的 resolve.alias 一致；dist 即使过期也不影响 dev 体验 |
| 2026-05-18 | 会话末尾 | 经验沉淀给下次接手 agent | 新建 `C:\code\zui\AGENT.md`（operational guide，10 节），含坑速记 + 命令速记 + Phase 3 候选清单 | Plan.md 是 source of truth（设计 / 决策），AGENT.md 是 operational guide（工作流 / 陷阱）；二者职责分离 |

---

## 十五、长线路线图（Phase 3+）— 无人值守路线

> 本章是给"无人值守 agent"看的可执行路线。源自 2026-05-19 会话讨论（用户拍板 D6–D19）。
> 与 §十四 决策日志的关系：本章规划"将要做"，§十四 记录"已做"。每个 W* 完成后，回填决策到 §十四。
> AGENT.md §九 候选清单是这里的精简索引；本章是详细落地说明。

### 15.0 设计原则（所有 W* 共享）

1. **每个 W* 单独 commit**：信息密度高、便于审与回滚
2. **每阶段末 push 一次**：见 §十五.15 STOP 节点
3. **不破坏 statement-only 风格**：所有"组合写法"走 chain method（`_xxx()` 调用），不引入二级 carrier
4. **不引入 CSS Variable 自动桥接**：维持 §一决策 #13；如未来要做（争议方向），先建独立 D-决策
5. **不开放插件机制**（D9）：carrier / chain 保持封闭集合，扩展通过 declaration merging 而非 plugin registry
6. **保持 core 框架无关**：所有"框架特定"代码（ConfigProvider / hooks）都在 recipes / 未来 ui-vue 包，不进 core
7. **不发版本**：所有改动只 commit + push 到 main；npm publish 用户手动

### 15.1 决策日志（Phase 3 拍板 D6–D19）

| ID | 决策 | 选项 | 拍板 | 理由 |
|---|---|---|---|---|
| **D6** | Transform 用 shorthand 还是 longhand | shorthand / longhand / 双模式 | **longhand** | CSS Working Group 方向、Tailwind v4 风 |
| **D7** | Dev label 自动注入 | auto / opt-in | **opt-in**（`new Chain(theme, { debug: true })`） | 避免影响 bench / 漏数据 |
| **D8** | 做 SSR wrapper（`createIcssInstance`） | 做 / 不做 | **做** | 收口 §十一.16-17 |
| **D9** | 开放插件接入点（`defineVariant`） | 做 / 不做 | **不做** | 破坏 chain 封闭性，等真有需求再开 |
| **D10** | 做 keyframes 注册 + per-instance vs global | 做 + per | **做 + per-instance** | 与 W5.1 SSR 隔离一致 |
| **D11** | `injectPreflight()` 风格 | 完整 / 仅 normalize / 不做 | **仅 normalize** | 不抢用户 CSS reset 选择权 |
| **D12** | `@property` 注册 helper | 做 / 不做 | **做** | 配合 W1.3 transform 可做动画 |
| **D13** | enhanced-props 拆分 + generator 接管 | a) 拆三份 + 生成 / b) 维持手写 | **a** | 减手写、自动跟 csstype |
| **D14** | extra-keywords 扩展槽是否暴露给用户 | a) 仅 core 内部 / b) 用户 augment | **a 仅内部** | 避免接口过早冻结 |
| **D15** | KEYWORD_TO_CSS 一并 generator 化 | a) 接管 / b) 保持手写 | **a** | 同一处来源，避免漂移 |
| **D16** | Pattern 库（`_stack` / `_grid` 等） | 做 / 不做 | **做** | 高频，且仍是方法调用形态（符合现有规则） |
| **D17** | StyleProps 类型工具 | 做 / 不做 | **做** | core 出工具，组件库消费，不违背边界 |
| **D18** | strict mode（禁裸字符串） | 做 / 不做 | **不做** | 与四态 carrier 灵活定位冲突 |
| **D19** | Babel/SWC 编译期插件 | 列路线 / 完全不做 | **列 v0.5+ 路线** | 远期价值高，0.3-0.4 不做 |

### 15.2 关键字命名空间规则（D13 落地）

| 来源 | 前缀 | 例 | 实现 |
|---|---|---|---|
| **CSS 标准 keyword**（csstype 已知） | 无 | `c.borderStyle.solid` / `c.display.block` | generator 从 csstype 派生 |
| **主题 token** | `_` | `c.color._primary` / `c.padding._md` | `tokens.config.ts` + theme schema |
| **zui 补 csstype 未跟新的关键字** | `_` | `c.textWrap._balance`（假设 csstype 漏） | `extra-keywords.config.ts` 扩展槽 |
| **zui 自定义 utility 组合** | `_` + 方法调用 | `c._truncate()` / `c._stack({...})` | chain method（不变） |

token 与 extra-keyword 共用 `_` 前缀，**generator 校验不重名**；运行时分派优先级 token > extra-keyword > csstype-keyword > global-keyword。

### 15.3 阶段 0 — Generator 接管（前置基础）

> ⚠️ 跨破坏面改动 —— 单独一个阶段，做完单独停一次让用户审。

#### W6.1 拆分 enhanced-props 为三份 config + generator 派生
[**1.5d**][无依赖][中风险]

**目标**：把 `src/chain/enhanced-props.ts` 一份 244 行手写大表，拆成 3 份小 config + generator 派生的 `enhanced-props.generated.ts`。

**新文件**：
- `src/chain/config/tokens.config.ts`（~30 行）：`PROP_TOKEN_CAT = { color: 'color', padding: 'spacing', ... }`
- `src/chain/config/units.config.ts`（~50 行）：`PROP_UNIT_CLASS = { padding: 'length', transitionDuration: 'time', rotate: 'angle', ... }`
- `src/chain/config/extra-keywords.config.ts`（默认空）：`EXTRA_KEYWORDS: Record<string, readonly string[]> = {}`，所有项必须 `_` 前缀（generator 校验）
- `src/chain/enhanced-props.generated.ts`（生成，入库）：合成 `ENHANCED_PROPS` 全表

**Generator 改造**（`scripts/generate-properties.mjs`）：
- 解析 csstype `Properties`，对每个属性递归展开 `DataType.*` 引用，收集字面量 keyword
- 把字面量 keyword kebab→camelCase + 反向映射进 `chain/keyword-to-css.generated.ts`（一并接管 D15）
- 合并 3 份手写 config + csstype keywords 生成 `enhanced-props.generated.ts`

**兼容**：`src/chain/enhanced-props.ts` 改为 re-export `enhanced-props.generated` 的 `ENHANCED_PROPS`（不破坏现有 import）

**验证**：
- 旧 244 行手写表 与新 generated 行为一致 → parity test 守护
- 跑 `pnpm test` 95/95 仍绿
- 跑 `pnpm bench` 不退化

#### W6.2 PropCarrier 类型扩第 5 元 TExtraKeywords
[**0.5d**][依赖 W6.1][低风险]

```ts
export type PropCarrier<
  TSelf, TValue,
  TTokens extends string,
  TKeywords extends string,
  TUnits = unknown,
  TExtraKeywords extends string = never
> =
  & ((value: TValue) => TSelf)
  & { readonly [K in TTokens]: TSelf }
  & { readonly [K in TKeywords]: TSelf }
  & { readonly [K in TExtraKeywords]: TSelf }
  & TUnits
```

Generator 同步派生 `ExtraKeywordsOf<'prop'>` 工具类型。

#### W6.3 Generator 校验：token 与 extra-keyword 不重名
[**0.5h**][依赖 W6.2][低风险]

Generator 运行时检查：对每个属性，若 `tokens.config.ts` 给的 tokenCat 解析出的 ident 与 `extra-keywords.config.ts` 列的 keyword 重名 → throw + 列冲突属性 / token 名。

**阶段 0 总计 2.5 天 / 4 commits**。

### 15.4 阶段 1 — 核心补完

#### W1.1 Palette 简化（删 legacy camelCase）
[**0.5h**][无依赖][低风险]

- 删 `palette.ts` 中：`palette` (camelCase legacy export)、`LegacyPaletteShape`、`buildLegacyPalette`
- 保留：`TAILWIND_PALETTE`、`PALETTE_NAMES`、`PALETTE_SHADES`、`flattenPalette`、`FLAT_PALETTE`
- 顺手加 `tw(name, shade)` 取值 helper
- `light.ts` / `dark.ts` 把 13 处 `palette.blue600` 改为 `tw('blue', '600')`
- §十四 加一条决策记录

公开 API 影响：0（`palette` 没在 `index.ts` 导出过）。

#### W1.2 ComponentTokenRegistry
[**1d**][依赖 W1.1][低风险]

新增 `src/types/components.ts`：

```ts
export interface ComponentTokenRegistry {}

export type FlattenComponentTokens<R = ComponentTokenRegistry> = {
  [C in keyof R]: R[C] extends Record<string, unknown>
    ? { [K in keyof R[C]]: `${C & string}${Capitalize<K & string>}` }[keyof R[C]]
    : never
}[keyof R]

export type ComponentTokenNames<C extends keyof ComponentTokenRegistry> =
  ComponentTokenRegistry[C] extends Record<string, unknown>
    ? `_${C & string}${Capitalize<keyof ComponentTokenRegistry[C] & string>}`
    : never
```

修改 `theme/defaults/schema.ts` 让 `DefaultSchema['color']` 自动包含 `Record<FlattenComponentTokens, string>`（intersection）。

新增 `src/theme/componentTokens.ts`：`withComponentTokens(theme, derivers, overrides)` 纯函数 helper。

**约束**（按 D14）：仅 core 内部用；不在 README 写 augment 用法（暴露门面 `declare module '@kenconnet666/zui-core'` 仍工作，但不主推）。

**验证**：3-5 个测试（registry augment / flatten / override / TS2589 守护）。

#### W1.6' ENHANCED_PROPS 补 ~45 条（在新 config 文件里加）
[**1d**][依赖 W6.1][低风险]

按 §十五.14 ENHANCED_PROPS 补完清单完整落地。**重点**：补 `filter` + `backdropFilter`（W1.4 helper 前置）。

#### W1.7 新关键字 + 容器查询单位
[**0.5h**][无依赖][低风险]

- 关键字补：`textWrap` / `fieldSizing` / `interpolateSize` / `overflowAnchor`（已在 W1.6' 清单中）
- `LENGTH_UNITS` 补：`cqw` / `cqh` / `cqi` / `cqb` / `cqmin` / `cqmax`（容器查询单位）+ `svw` / `svh` / `lvw` / `lvh` / `dvw` / `dvh`（动态视口单位）

#### W1.8 default token category 补 8 个 ★ 重要
[**0.5d**][无依赖][低风险]

`schema.ts` + `light.ts` + `dark.ts` 三处同步补：

```ts
duration: { fast: '150ms', normal: '300ms', slow: '500ms' }
easing: {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
}
breakpoint: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' }  // ★ 修 A3
zIndex: {
  auto: 'auto', '0': 0, '10': 10, '20': 20, '30': 30, '40': 40, '50': 50,
  modal: 1000, popover: 1100, tooltip: 1200, toast: 1300,
}
opacity: { '0': 0, '5': 0.05, '10': 0.1, '20': 0.2, '25': 0.25, '30': 0.3, '40': 0.4,
           '50': 0.5, '60': 0.6, '70': 0.7, '75': 0.75, '80': 0.8, '90': 0.9, '95': 0.95, '100': 1 }
lineHeight: { none: 1, tight: 1.25, snug: 1.375, normal: 1.5, relaxed: 1.625, loose: 2 }
letterSpacing: { tighter: '-0.05em', tight: '-0.025em', normal: '0', wide: '0.025em', wider: '0.05em', widest: '0.1em' }
aspectRatio: { square: '1 / 1', video: '16 / 9', portrait: '3 / 4', landscape: '4 / 3' }
```

**影响**：`breakpoint` 加进 default 后，`_media('_md', ...)` 终于真正工作。同步：
- README 示例 audit
- recipes/{vue,react,svelte,solid}.md 示例 audit
- examples 加一个 responsive demo

#### W1.3 Transform longhand helpers（D6=longhand）
[**0.5d**][依赖 W6.1][低风险]

Chain 加：`_translate(x, y?)` / `_translateX(v)` / `_translateY(v)` / `_translateZ(v)` / `_rotate(deg)` / `_rotateX(deg)` / `_rotateY(deg)` / `_rotateZ(deg)` / `_scale(n, ny?)` / `_scaleX(n)` / `_scaleY(n)` / `_scaleZ(n)` / `_skew(x, y?)` / `_perspective(v)` / `_transformOrigin(v)` / `_preserve3d()`

实现：直接写 `_node.translate` / `_node.rotate` / `_node.scale` 等 **longhand 字段**（v4 风），不拼 `transform` shorthand。

#### W1.4 Filter / Backdrop helpers
[**0.5d**][依赖 W1.6'][低风险]

Chain 加：`_filterBlur(px)` / `_filterBrightness(pct)` / `_filterContrast(pct)` / `_filterGrayscale(pct)` / `_filterHueRotate(deg)` / `_filterInvert(pct)` / `_filterSaturate(pct)` / `_filterSepia(pct)` / `_filterDropShadow(spec)`；同上 `_backdropXxx` 系列。

实现：累加到 `_node.filter` / `_node.backdropFilter`（filter 没 longhand 替代，必须拼字符串）。

#### W1.5 Gradient helpers
[**0.5d**][无依赖][低风险]

- `_linearGradient(angle: number | string, stops: string[])` — `stops: ['#fff 0%', '#000 100%']`
- `_radialGradient(shape, stops)`
- `_conicGradient(angle, stops)`

设 `_node.backgroundImage`。

**阶段 1 总计 ~4 天 / 8 commits**。

### 15.5 阶段 2 — Variant 通用化（Tailwind v4 对齐）

#### W2.1 通用属性选择器
[**0.5d**][无依赖][低风险]

Chain 加：
- `_data(attr, value?, fn)` → `&[data-${attr}]` / `&[data-${attr}="${value}"]`
- `_aria(attr, value?, fn)` → `&[aria-${attr}]` / `&[aria-${attr}="${value}"]`
- `_has(selector, fn)` → `&:has(${selector})`
- `_not(selector, fn)` → `&:not(${selector})`
- `_is(selectorList, fn)` → `&:is(${list})`
- `_where(selectorList, fn)` → `&:where(${list})`

#### W2.2 状态属性 variant
[**0.5h**][无依赖][低风险]

- `_open(fn)` → `&[open], &[data-state="open"]`
- `_closed(fn)` → `&:not([open]), &[data-state="closed"]`
- `_loading(fn)` → `&[data-loading="true"]`
- `_inert(fn)` → `&[inert]`
- `_forcedColors(fn)` → `@media (forced-colors: active)`

#### W2.3 `@starting-style` 与 transition 衍生
[**0.5h**][无依赖][低风险]

- `_starting(fn)` → `@starting-style { & { ... } }`

#### W2.4 Container query variant 简写
[**0.5h**][依赖 W1.8 加 breakpoint][低风险]

补 `_containerSm` / `_containerMd` / `_containerLg` / `_containerXl` / `_container2xl`。

#### W2.5 group / peer data 变种
[**0.5h**][依赖 W2.1][低风险]

`_groupData(attr, value, fn)` / `_peerData(...)` / `_groupAria(...)` / `_peerAria(...)`。

**阶段 2 总计 ~2 天 / 5 commits**。

### 15.6 阶段 3 — DX / Debug

#### W3.1 `c._inspect()`
[**0.5d**][无依赖][低风险]

```ts
c._inspect()                              // 默认 'css' 格式
c._inspect({ format: 'css' | 'tree' | 'json' })
```

返回带 selector 注释的字符串（`css` 格式）/ 树形结构 / JSON。便于 `console.log` debug。

#### W3.2 Dev label 自动注入（D7 opt-in）
[**0.5d**][无依赖][中风险]

`new Chain(theme, { debug: true })` 时，从 `new Error().stack` 抽取调用 callsite，自动加 emotion label。`process.env.NODE_ENV === 'production'` 时即使设 `debug: true` 也降级 noop（避免线上栈泄露）。

需要 `Chain` 构造签名加 `options?` 参数 —— 与 W5.1 `createIcssInstance` 协同。

#### W3.3 `assertSchemaConsistency`
[**0.5d**][无依赖][低风险]

dev helper。检查：function token 引用闭环 / 重名 / palette 命名规范 / 必填语义色齐全。返回 issue 列表。

```ts
import { assertSchemaConsistency } from '@kenconnet666/zui-core/dev'
const issues = assertSchemaConsistency(myTheme)  // string[]
```

**阶段 3 总计 ~1.5 天 / 3 commits**。

### 15.7 阶段 4 — 性能

#### W4.1 Keymap 缓存到 Theme（修 B3）
[**0.5d**][无依赖][中风险]

`Theme` 类加 `_keymap` 缓存字段：

```ts
class _ThemeClass<T> {
  private _resolved: ResolvedTheme<T> | null = null
  private _keymap: Map<string, Map<string, string>> | null = null

  getKeymap(): Map<string, Map<string, string>> {
    if (this._keymap == null) this._keymap = buildKeymap(this.resolve())
    return this._keymap
  }
}
```

`Chain` 构造时优先用 `theme.getKeymap()`，无 Theme 实例（裸 `ResolvedTheme`）才 `buildKeymap`。

**预期**：bench icss ~19k → 40k+ ops/s。

#### W4.2 Carrier 工厂模块级共享（探索）
[**1d**][依赖 W4.1][中风险]

把 carrier proxy 工厂模块级化，避免每个 Chain instance 重建。**风险**：Proxy reuse + Chain GC 验证。**本任务可降级**：如不达预期收益（>2× 增益），回退。

#### W4.3 `Object.freeze(theme)`
[**0.5h**][无依赖][低风险]

`resolveTheme` 末尾对 ctx 各 category `Object.freeze`。V8 sealed-class 优化（5-10% 提速预期）。

**阶段 4 总计 ~1.5 天 / 3 commits**。

### 15.8 阶段 5 — 架构性

> ⚠️ W5.1 跨破坏面，单独停一次。

#### W5.1 `createIcssInstance(emotion)` SSR wrapper（D8 落地）
[**1d**][无依赖][中风险]

```ts
import { createInstance } from '@emotion/css/create-instance'

export function createIcssInstance(emotion: ReturnType<typeof createInstance>) {
  return {
    Chain: class LocalChain<T> extends Chain<T> {
      override toString(): string {
        return emotion.css(this._node as CSSObject)
      }
    },
    icss: <T>(theme, factory) => { /* 用 LocalChain */ },
    cx: emotion.cx,
    injectGlobal: emotion.injectGlobal,
    ikeyframes: /* 包装 emotion.keyframes */,
    extractCritical: emotion.flush,  // SSR
    registerAnimation,                // 见 W5.3
    registerCustomProperty,           // 见 W5.5
  }
}
```

收口 §十一 待决 16-17。

#### W5.3 Keyframes & Animation 注册（D10 per-instance）
[**1d**][依赖 W5.1][中风险]

```ts
const { registerAnimation } = createIcssInstance(emotion)
const fadeIn = registerAnimation('fadeIn', {
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})
// 之后 c.animationName._fadeIn 命中
```

per-instance：避免全局污染 + SSR 多 app 隔离。注册行为：把 keyframes 注入 emotion instance + 把 animation 名加进 `schema.animation`（如果有）或 `ComponentTokenRegistry` 的 animation namespace。

#### W5.4 `injectPreflight()` 仅 normalize（D11）
[**0.5d**][无依赖][低风险]

```ts
export function injectPreflight() {
  injectGlobal({
    '*, *::before, *::after': { boxSizing: 'border-box' },
    body: { margin: 0, lineHeight: 1.5, WebkitFontSmoothing: 'antialiased' },
    'h1,h2,h3,h4,h5,h6,p': { margin: 0 },
    'button,input,textarea,select': { font: 'inherit', color: 'inherit' },
    'img,svg,video,canvas,audio,iframe,embed,object': { display: 'block', maxWidth: '100%' },
    'ul,ol': { listStyle: 'none', padding: 0, margin: 0 },
  })
}
```

**不**做完整 Tailwind preflight（避免抢用户 CSS reset 选择权）。

#### W5.5 `@property` 注册 helper（D12）
[**0.5d**][无依赖][低风险]

```ts
registerCustomProperty('--my-grad-angle', {
  syntax: '<angle>',
  inherits: false,
  initialValue: '0deg',
})
// 注入到 injectGlobal：@property --my-grad-angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
```

让自定义属性可参与 CSS animation。

**阶段 5 总计 ~3 天 / 4 commits**。

### 15.9 阶段 7 — Pattern 库（D16）

#### W7.1 `_stack({ direction, gap, align?, justify? })`
[**0.5d**][依赖 W1.8][低风险]

```ts
c._stack({ direction: 'row', gap: '_md', align: 'center', justify: 'spaceBetween' })
// → display: flex; flex-direction: row; gap: 16px; align-items: center; justify-content: space-between
```

#### W7.2 `_grid({ cols, rows?, gap? })`
[**0.5d**][依赖 W1.8][低风险]

```ts
c._grid({ cols: 3, gap: '_md' })
// → display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px
```

#### W7.3 比例简写
[**0.5h**][依赖 W1.8][低风险]

`_aspectVideo()` / `_aspectSquare()` / `_aspectPortrait()` / `_aspectLandscape()`

#### W7.4 `_focusRing(opts)` a11y
[**0.5h**][无依赖][低风险]

```ts
c._focusRing({ color: '_primary', width: 2, offset: 2 })
// → &:focus-visible { outline: 2px solid <color>; outline-offset: 2px }
```

#### W7.5 a11y utilities
[**0.5h**][无依赖][低风险]

`_visuallyHidden()`（= 现有 `_srOnly()` 的别名 + 更明确命名）/ `_skipLink()`

#### W7.6 定位组合
[**0.5h**][无依赖][低风险]

`_centerAbs()`（= 现有 `_absoluteCenter()` 的简写别名）/ `_fillParent()`（`position: absolute; inset: 0`）

**阶段 7 总计 ~2 天 / 6 commits**。

### 15.10 阶段 8 — @layer / @font-face

#### W8.1 `injectLayer(name, factory)`
[**0.5d**][依赖 W5.1][低风险]

```ts
injectLayer('components', () => {
  injectGlobal({ '.btn': { padding: '8px 16px' } })
})
// → @layer components { .btn { ... } }
```

#### W8.2 `_layer(name, fn)` chain 方法
[**0.5h**][依赖 W8.1][低风险]

#### W8.4 `registerFont(family, sources)` `@font-face`
[**0.5d**][依赖 W5.1][低风险]

```ts
registerFont('Inter', [
  { src: 'url(/fonts/Inter.woff2)', format: 'woff2', weight: 400 },
  { src: 'url(/fonts/Inter-Bold.woff2)', format: 'woff2', weight: 700 },
])
```

**阶段 8 总计 ~1.5 天 / 3 commits**。

### 15.11 阶段 9 — DX 类型工具（D17）

#### W10.1 `StyleProps<T>`
[**0.5d**][无依赖][低风险]

```ts
export type StyleProps<T extends ThemeSchema = DefaultSchema> = Partial<{
  // 常用 short alias（参考 Theme UI / Chakra）
  color: ColorTokens<T> | (string & {})
  bg: ColorTokens<T> | (string & {})
  p: SpacingTokens<T> | number
  px: SpacingTokens<T> | number  // padding-inline
  py: SpacingTokens<T> | number  // padding-block
  m: SpacingTokens<T> | number
  mx: SpacingTokens<T> | number
  my: SpacingTokens<T> | number
  rounded: RadiusTokens<T> | number
  shadow: ShadowTokens<T> | string
  fontSize: FontSizeTokens<T> | string | number
  // ... ~30-50 个常用 prop alias
}>

/** 把 StyleProps 应用到 chain（组件库内部用）。 */
export function applyStyleProps<T extends ThemeSchema>(chain: Chain<T>, props: StyleProps<T>): void
```

#### W10.2 `TokenOf<Cat, T>` 工具类型
[**0.5h**][依赖 W10.1][低风险]

```ts
type ButtonProps = {
  color: TokenOf<'color', DefaultSchema>      // = ColorTokens<DefaultSchema>
  spacing: TokenOf<'spacing', DefaultSchema>  // = SpacingTokens<DefaultSchema>
}
```

**修 C9**：顺手把 `BordersTokens` / `ZIndexTokens` 等所有 token 类型在 `index.ts` 导出。

**阶段 9 总计 ~1 天 / 2 commits**。

### 15.12 长线（不立即做）

#### W11.1 Babel/SWC 编译期插件（D19，v0.5+）
[**3-5d**][高风险][v0.5+]

把 `icss(theme, s => { s.color._primary })` 编译为静态 className。参考 Linaria / Compiled / Panda。**v0.5+ 路线**，0.3-0.4 不做。

### 15.13 阶段执行总顺序（无人值守按此跑）

```
阶段 0 (W6.x)         ── 2.5d ── 跨破坏面，做完停一次审 ──┐
   ↓                                                       │
阶段 1 (W1.x)         ── 4d   ── 顺手跑，纯加法            │
   ↓                                                       │
阶段 2 (W2.x)         ── 2d                                │
   ↓                                                       │
阶段 3 (W3.x)         ── 1.5d                              │
   ↓                                                       │
阶段 4 (W4.x)         ── 1.5d ── bench 验证                │
   ↓                                                       │
阶段 5 (W5.x)         ── 3d   ── W5.1 跨破坏面，做完停 ──┐
   ↓                                                       │
阶段 7 (W7.x)         ── 2d                                │
   ↓                                                       │
阶段 8 (W8.x)         ── 1.5d                              │
   ↓                                                       │
阶段 9 (W10.x)        ── 1d                                │
                                                           │
长线 W11.1              ── 不做 ──                         │
```

每阶段末 push 一次。总估时 **~19 工作日**，分 4-5 次会话跑完。

### 15.14 ENHANCED_PROPS 补完清单（W1.6' 落地，按 Tailwind v3/v4 高频度排序）

| 分类 | 属性 | 配置 |
|---|---|---|
| **Filter ★ 必须** | `filter` | keywords `['none']` |
| **Filter ★ 必须** | `backdropFilter` | keywords `['none']` |
| **Tables** | `borderCollapse` | keywords `['collapse', 'separate']` |
| **Tables** | `borderSpacing` | tokenCat `'spacing'`, unitClass `'length'` |
| **Tables** | `tableLayout` | keywords `['auto', 'fixed']` |
| **Tables** | `captionSide` | keywords `['top', 'bottom', 'blockStart', 'blockEnd', 'inlineStart', 'inlineEnd']` |
| **Lists** | `listStyleType` | keywords `['disc', 'decimal', 'none']` |
| **Lists** | `listStylePosition` | keywords `['inside', 'outside']` |
| **Lists** | `listStyleImage` | keywords `['none']` |
| **SVG** | `strokeWidth` | tokenCat `'borders'`, unitClass `'length'` |
| **SVG** | `strokeLinecap` | keywords `['butt', 'round', 'square']` |
| **SVG** | `strokeLinejoin` | keywords `['miter', 'round', 'bevel']` |
| **SVG** | `strokeDasharray` | （无 token, 用户自填字符串） |
| **Scroll snap** | `scrollSnapType` | keywords `['none', 'x', 'y', 'block', 'inline', 'both', 'mandatory', 'proximity']` |
| **Scroll snap** | `scrollSnapAlign` | keywords `['none', 'start', 'end', 'center']` |
| **Scroll snap** | `scrollSnapStop` | keywords `['normal', 'always']` |
| **Scroll snap** | `scrollMargin{Top,Right,Bottom,Left,Block,Inline}` | tokenCat `'spacing'`, unitClass `'length'` |
| **Scroll snap** | `scrollPadding{Top,Right,Bottom,Left,Block,Inline}` | 同上 |
| **Pointer / 系统** | `touchAction` | keywords `['auto','none','panX','panY','panLeft','panRight','panUp','panDown','pinchZoom','manipulation']` |
| **Pointer / 系统** | `appearance` | keywords `['none','auto','textfield','menulistButton']` |
| **Pointer / 系统** | `willChange` | keywords `['auto','scrollPosition','contents']` |
| **Pointer / 系统** | `colorScheme` | keywords `['normal','light','dark','lightDark','only']` |
| **Layout** | `boxSizing` | keywords `['borderBox','contentBox']` |
| **Layout** | `boxDecorationBreak` | keywords `['slice','clone']` |
| **Layout** | `float` | keywords `['left','right','none','inlineStart','inlineEnd']` |
| **Layout** | `clear` | keywords `['left','right','none','both','inlineStart','inlineEnd']` |
| **Layout** | `isolation` | keywords `['auto','isolate']` |
| **Blend** | `mixBlendMode` | keywords `['normal','multiply','screen','overlay','darken','lighten','colorDodge','colorBurn','hardLight','softLight','difference','exclusion','hue','saturation','color','luminosity','plusDarker','plusLighter']` |
| **Blend** | `backgroundBlendMode` | 同上 |
| **Writing** | `writingMode` | keywords `['horizontalTb','verticalRl','verticalLr','sidewaysRl','sidewaysLr']` |
| **Writing** | `direction` | keywords `['ltr','rtl']` |
| **Writing** | `textOrientation` | keywords `['mixed','upright','sideways']` |
| **Columns** | `columns` / `columnCount` / `columnWidth` | unitClass `'length'`，keywords `['auto']` |
| **Columns** | `columnSpan` | keywords `['none','all']` |
| **Columns** | `columnFill` | keywords `['auto','balance','balanceAll']` |
| **Columns** | `columnRule{Width,Style,Color}` | width: borders/length, style: BORDER_STYLE_KW, color: tokenCat 'color' |
| **Columns** | `breakBefore` / `breakAfter` / `breakInside` | keywords `['auto','avoid','always','all','avoidPage','page','left','right','recto','verso','avoidColumn','column','avoidRegion','region']` |
| **现代 CSS 4** | `textWrap` | keywords `['wrap','nowrap','balance','pretty','stable']` |
| **现代 CSS 4** | `fieldSizing` | keywords `['content','fixed']` |
| **现代 CSS 4** | `interpolateSize` | keywords `['allowKeywords','numericOnly']` |
| **现代 CSS 4** | `overflowAnchor` | keywords `['auto','none']` |
| **现代 CSS 4** | `anchorName` / `positionAnchor` | keywords `['none']` |

**合计 ~45 条**。

**注意**：W6.1 generator 接管后，这些 keyword **不应**写进 `tokens.config.ts` —— 大部分会被 csstype 派生覆盖。需要手写的只有：
- `tokens.config.ts`：上表中 tokenCat 不为 null 的（spacing / borders / color 三类，~14 条）
- `units.config.ts`：上表中 unitClass 不为 null 的（length，~14 条）
- csstype 已知的关键字：自动派生
- csstype 未跟新的（如 v4 新关键字）：进 `extra-keywords.config.ts` 扩展槽

### 15.15 STOP 节点（无人值守必停）

按 AGENT.md §七.1 + 本次补充：

1. **每个阶段末**（W6.x / W1.x / ... 全做完）→ 跑全量 test + type-check + build + bench → 推一次 → 停下让用户审
2. **跨破坏面改动**：
   - W6.1（generator 接管 enhanced-props）
   - W6.2（PropCarrier 加第 5 元 slot）
   - W5.1（SSR wrapper，引入 instance scope 概念）
   - 各单独停一次
3. **触发任何**：
   - TS2589 / 任何 type-check 红
   - test 红（含 parity 守护 / 95+ 测试任何一条）
   - generator 输出 diff 超 30% 行数（多半是 csstype 升级带来意外）
   - bench 退化 >20%
4. **遇 §九 陷阱表 / §十一 待决问题** —— 不要自决，停下问
5. **要发版本**（bump version + tag + push tag）—— 始终用户手动

### 15.16 验证铁律（push 前必跑）

```powershell
# 全套
pnpm --filter @kenconnet666/zui-core run type-check
pnpm --filter @kenconnet666/zui-core test               # 应全绿
pnpm --filter @kenconnet666/zui-core build              # ★ 更新 dist

# 改 ENHANCED_PROPS / generator 后必须
node scripts/generate-properties.mjs
pnpm --filter @kenconnet666/zui-core test -- parity

# 阶段末额外
pnpm --filter @kenconnet666/zui-core bench
```

每个 W* commit message 模板：

```
W?.? <子任务标题>

<2-4 行中文 body 描述改动与理由>

验证：
- type-check OK
- test N/N 全绿
- build 输出 ?kb / ?kb gzip
- (如需要) bench 19k → XXk ops/s

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

### 15.17 启动 checklist（agent 起手必读）

1. ✅ 读 `AGENT.md` §四 工作流
2. ✅ 读 `Plan.md` §十四 决策日志最新 + §十五 长线路线图
3. ✅ 跑 `pnpm --filter @kenconnet666/zui-core test` 确认基线绿（当前应 95/95）
4. ✅ 跑 `pnpm --filter @kenconnet666/zui-core run type-check` 确认 src + tests 干净
5. ✅ `git log --oneline -10` 看最近 commit
6. ✅ 查看 §十五.18 审计清单看是否有新发现
7. ✅ 用 `TaskCreate` 把当前阶段所有 W* 拆出来 + 标依赖（参考 §十五.13 总顺序图）
8. ✅ 按 W* 编号顺序执行，每个完成 → `TaskUpdate completed` → commit
9. ✅ 阶段末跑全量验证 → push → 把决策追加进 §十四

### 15.18 审计发现（2026-05-19）packages/core 现状缺口清单

> 全面 audit 结论。按严重程度分。每条都标关联 W*（如不处理列为"未规划"）。

#### 🔴 严重 / 架构性

| ID | 文件 / 范围 | 问题 | 关联 W* |
|---|---|---|---|
| **A1** | `chain/enhanced-props.ts` | 手写 244 行，`keywords` 字段重复 csstype 已知信息；每条都得填三个字段 | **W6.1** |
| **A2** | `theme/defaults/{light,dark}.ts` + `schema.ts` | ENHANCED_PROPS 引用 18 个 token category，default 只填 7 个；`c.transitionDuration._fast` 会 keymap miss 但静默不报 | **W1.8** |
| **A3** | `theme/defaults/schema.ts` 缺 `breakpoint` | `_media('_md', ...)` 在 default schema 下无值；recipes 示例都假设有 | **W1.8** |
| **A4** | `scripts/generate-properties.mjs` | csstype `Properties` 含 SVG 子集（`fillRule` / `mask` 等），可能让 IDE 补全噪音；当前生成 ~857 属性 | **W6.1 评估**（生成时按 namespace 分组或 opt-in 排除 SVG） |

#### 🟠 中等 / 完整性

| ID | 文件 / 范围 | 问题 | 关联 W* |
|---|---|---|---|
| **B1** | `chain/Chain.ts` 构造签名 | `new Chain(theme)` 没 options 参数；未来加 `{ debug, instance }` 要破坏签名 | **W3.2 / W5.1**（同时改） |
| **B2** | `chain/proxy.ts` `INTERNAL_KEYS` | 白名单手写；新增内部方法易漏（如 W1.3 加 `_translate` 等） | （建议重构为 prototype 扫描） |
| **B3** | `theme/keymap.ts` | 每个 Chain 重建 keymap，O(n) 浪费 | **W4.1** |
| **B4** | `theme/mergeTheme.ts` | partial 含 function token 时不校验，覆盖后下游拿到 function 实例 | （dev 警告，**W3.3** 顺手加） |
| **B5** | `chain/color.ts` | `darken/lighten` 后 `toHex()` 丢失 alpha 信息；原色含 alpha 时结果不带 alpha | （记 §九 陷阱表；改 toHex 为 toRgba） |
| **B6** | csstype@3.2.3 停留 | 跟不上 v4 标准 keyword（如 `text-wrap: balance`）；升 csstype 6.0 时 vite-plugin-dts API Extractor 报 newer-than 警告 | **W1.7 部分缓解**（extra-keywords 扩展槽暂补） |

#### 🟡 轻微 / 改进项

| ID | 范围 | 问题 | 关联 |
|---|---|---|---|
| **C1** | `chain/keywords.ts` `KEYWORD_TO_CSS` | 手写 + 与 csstype 关键字重复 | **W6.1 (D15)** |
| **C2** | `chain/Chain.ts` `label()` | 多次 label 互相覆盖（无 dedup） | （加 join：`label1.label2`） |
| **C3** | `chain/Chain.ts` `_var` | 与 schema token 没桥接，无法 `_var('--my-x', '_primary')` | （未规划，escape hatch 合理） |
| **C4** | `examples/` | 只有按钮，缺 form / layout / card / responsive | **W1.8 顺手加 responsive demo** |
| **C5** | `recipes/` | 静态文档，没 e2e 跑过 | （未规划，靠 examples 兜底） |
| **C6** | `bench/` | 只 3 场景，缺 carrier-only / token-resolve 单测 | **W4.2 配套** |
| **C7** | `chain/Chain.ts` `_node` 不冻结 | 用户可直接改 `chain._node.color = 'red'` 绕过 carrier 类型 | （escape hatch 合理，不处理） |
| **C8** | `chain/Chain.ts` `_focusVisible` | `:focus-visible` 浏览器兼容性（iOS Safari 14- 不支持）；recipes 未提示 | （README 兼容性章节加一条） |
| **C9** | `index.ts` 未导出全部 token 类型 | 用户做 component prop 类型时拿不到 `BordersTokens` / `ZIndexTokens` 等 | **W10.2 顺手补** |
| **C10** | `injectGlobal.ts` | 没去重；多次调同 styles 重复注入（emotion 自己 hash 兜底，但内存累加） | （记 §九） |
| **C11** | `chain/proxy.ts` Symbol 访问 | `Reflect.get(target, Symbol)` 透传，Symbol-keyed 内部状态可能被外部访问 | （次要，不处理） |
| **C12** | `chain/Chain.ts` `_srOnly` vs `_visuallyHidden` | 命名风格不一致；前者 Tailwind 风、后者 a11y 风 | **W7.5**（加 `_visuallyHidden` 别名） |
| **C13** | `chain/Chain.ts` `_absoluteCenter` 用 transform shorthand | W1.3 改 longhand 后这里也要跟 | **W1.3 顺手改** |
| **C14** | `csstype.Properties` 含 vendor prefix (`-webkit-*`) | generator 当前 skip kebab key，但 vendor prefix 属性如 `WebkitLineClamp` 已被自动收（合理） | （无 action） |
| **C15** | `theme/Theme.ts` `Object.assign(this, schema)` | 把 schema 各 category 挂在 instance 上，含 function token 时 instance 上是函数；类型层标 `string \| number`（不一致） | （记 §九，已部分有但需补强 README 警示） |

### 15.19 总工作量预估

| 阶段 | 工作量 | 累计 | 主要 commit 数 |
|---|---|---|---|
| 阶段 0（W6.x） | 2.5d | 2.5d | 4 |
| 阶段 1（W1.x） | 4d | 6.5d | 8 |
| 阶段 2（W2.x） | 2d | 8.5d | 5 |
| 阶段 3（W3.x） | 1.5d | 10d | 3 |
| 阶段 4（W4.x） | 1.5d | 11.5d | 3 |
| 阶段 5（W5.x） | 3d | 14.5d | 4 |
| 阶段 7（W7.x） | 2d | 16.5d | 6 |
| 阶段 8（W8.x） | 1.5d | 18d | 3 |
| 阶段 9（W10.x） | 1d | 19d | 2 |
| **总计** | **~19d** | — | **~38 commits** |
| 长线 W11.1 | 不计 | — | — |

每阶段末 push 一次（共 **8 次 push 节点**），其中 W6.1 / W6.2 / W5.1 各**单独**停一次审，共 **11 个 STOP 节点**。

---

**Plan 起草完毕（含 Phase 3+ 长线路线图）。** 下次 agent 接手时优先级：W6.1（generator 接管）→ W1.1 + W1.2（palette 简化 + ComponentTokenRegistry）→ 按阶段顺序推进。
