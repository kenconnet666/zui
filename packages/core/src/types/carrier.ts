/** CSS 全局关键字。 */
export type GlobalKw = 'inherit' | 'unset' | 'initial' | 'revert' | 'revertLayer'

/**
 * 长度类 unit 方法集。**与 `chain/units.ts` 的 `LENGTH_UNITS` 严格对齐**：
 *
 * - 绝对：px / cm / mm / in / pt / pc
 * - 字体相对：rem / em / ch / ex
 * - 视口：vw / vh / vmin / vmax
 * - 小 / 大 / 动态视口（CSS Values 4）：svw / svh / svmin / svmax / lvw / lvh / lvmin / lvmax / dvw / dvh / dvmin / dvmax
 * - 容器查询（CSS Containment 3）：cqw / cqh / cqi / cqb / cqmin / cqmax
 * - 栅格：fr
 * - 百分比：pct → `'%'`
 *
 * 合计 34 个。
 *
 * **Statement-only**：所有 unit 方法**返回 `void`**，调用后即终结（运行时仍返回 chain 以支持
 * Proxy 内部状态切换，类型层不暴露，参见 2026-05-22 决策文档）。
 */
export interface LengthUnits {
  // ─── 绝对 ───
  px(n: number): void
  cm(n: number): void
  mm(n: number): void
  in(n: number): void
  pt(n: number): void
  pc(n: number): void
  // ─── 字体相对 ───
  rem(n: number): void
  em(n: number): void
  ch(n: number): void
  ex(n: number): void
  // ─── 视口 ───
  vw(n: number): void
  vh(n: number): void
  vmin(n: number): void
  vmax(n: number): void
  // ─── 小视口（小于 vw/vh，UI 占用后） ───
  svw(n: number): void
  svh(n: number): void
  svmin(n: number): void
  svmax(n: number): void
  // ─── 大视口（UI 收起后的最大） ───
  lvw(n: number): void
  lvh(n: number): void
  lvmin(n: number): void
  lvmax(n: number): void
  // ─── 动态视口（跟随 UI 实时变化） ───
  dvw(n: number): void
  dvh(n: number): void
  dvmin(n: number): void
  dvmax(n: number): void
  // ─── 容器查询 ───
  cqw(n: number): void
  cqh(n: number): void
  cqi(n: number): void
  cqb(n: number): void
  cqmin(n: number): void
  cqmax(n: number): void
  // ─── 栅格 ───
  fr(n: number): void
  // ─── 百分比（特殊 ident → '%'） ───
  pct(n: number): void
}

export interface TimeUnits {
  ms(n: number): void
  s(n: number): void
}

export interface AngleUnits {
  deg(n: number): void
  rad(n: number): void
  grad(n: number): void
  turn(n: number): void
}

/**
 * 六态 carrier 类型（W6.2 + 2026-05-22 factory 形态）：
 *  1. callable: `prop(value)` —— 字面量
 *  2. callable factory: `prop(c => c._token)` —— 把 carrier 自身传给 factory，供组件 prop 直传
 *  3. token: `prop._token`（`_` 前缀，主题 token）
 *  4. keyword: `prop.keyword`（无前缀，CSS 标准关键字）
 *  5. extra-keyword: `prop._extra`（`_` 前缀，zui 补 csstype 未跟新的关键字；默认 never）
 *  6. unit 方法: `prop.px(n)` 等
 *
 * **Statement-only**（2026-05-22 决策）：每条 setter 表达式即一条 CSS 行，类型层**所有返回类型为 `void`**，
 * 不再暴露 chain 自身。运行时 chain.color / chain.color('red') / chain.color._primary / chain.color.red 等
 * 仍返回 chain 实例（Proxy 兼容性），但 IDE 补全在 setter 表达式之后不再展开 Chain 表面，阻止
 * `s.color.red.padding.px(8)` 这种反范式链式。
 *
 * 函数态签名拆成 **三个重载交叉**（而非 `TValue | TTokens` 单 union）的原因：
 * csstype 的 `Property.*` 多数包含 `(string & {})` 惯用法，这会让 IDE 补全弹窗
 * 把外层 union 的字面量"吸收"成 `string` 形态而不显示候选。重载交叉等价于函数重载列表，
 * IDE 按重载顺序显示候选 —— 第一个重载只含 token 字面量，逃生舱补全得以可见。
 *
 * **factory 形态**（2026-05-22）：第三个重载 `(factory: (c: ThisCarrier) => void) => void` 是 self-ref，
 * 让组件 prop 可以直接接 `(c) => c._primary` 这种工厂，setup 内只需 `s.color(props.color)` 一行即可
 * 应用任意 token / keyword / 字面量 / modifier 链。详见 `.claude/decisions/2026-05-22-carrier-factory-prop.md`。
 *
 * `TExtraKeywords` 是 W6 generator 接管后的 D14 扩展槽：让 zui 给某些属性补 csstype 尚未跟新的
 * keyword（必须 `_` 前缀以与 CSS 标准 keyword 隔离）。Generator 会校验 token 与 extra-keyword 不重名。
 */
export type PropCarrier<
  TValue,
  TTokens extends string,
  TKeywords extends string,
  TUnits = unknown,
  TExtraKeywords extends string = never,
> = ((value: TTokens) => void) &
  ((value: TValue) => void) &
  ((
    factory: (c: PropCarrier<TValue, TTokens, TKeywords, TUnits, TExtraKeywords>) => void,
  ) => void) & { readonly [K in TTokens]: void } & {
    readonly [K in TKeywords]: void
  } & { readonly [K in TExtraKeywords]: void } & TUnits

/**
 * 无主题 token、无 unit 方法的属性（只支持函数调用 + 全局关键字）。
 *
 * **Statement-only**：返回 `void`，参见 `PropCarrier` 注释。
 * **factory 形态**：`prop(c => c.inherit)` 同样支持。
 */
export type PropFn<TValue> = ((value: TValue) => void) &
  ((factory: (c: PropFn<TValue>) => void) => void) & {
    readonly [K in GlobalKw]: void
  }

/**
 * 颜色 token 命中后返回的 helper：
 *  - 进入 helper 时，CSS 属性已被立即写入真值（user 不需 modifier 也能拿到色值）
 *  - 所有 modifier 基于 **token 原值**计算并覆盖写入；不是基于上次 modifier 的结果累积
 *  - n 取 0-100（百分比）；越界自动 clamp
 *
 * **Statement-only**：所有 modifier 返回 `void`，调用后即终结。
 */
export interface ColorTokenValue {
  /** 重写为带 alpha 的 rgba。 */
  alpha(n: number): void
  /** HSL 亮度加深 n%。 */
  darken(n: number): void
  /** HSL 亮度提亮 n%。 */
  lighten(n: number): void
  /** 与 `other` 颜色混合 n%（0 = 原色，100 = 完全 other）。 */
  mix(other: string, n: number): void
  /** HSL 饱和度提升 n%。 */
  saturate(n: number): void
  /** HSL 饱和度降低 n%。 */
  desaturate(n: number): void
  /** 补色 —— 色相旋转 180°。 */
  complement(): void
  /** 任意角度旋转色相；deg 任意数（自动 mod 360）。 */
  rotateHue(deg: number): void
  /** RGB 反相（255 - 每 channel）。 */
  invert(): void
  /** 与黑色按 n% 混合（RGB 混黑；比 darken 更"重"）；n 取 0-100。 */
  shade(n: number): void
  /** 与白色按 n% 混合（RGB 混白；比 lighten 更"柔"）；n 取 0-100。 */
  tint(n: number): void
}

/**
 * 颜色专用 carrier：token 命中返回 `ColorTokenValue`（暴露 `.alpha(n)` 等 11 个 modifier）。
 *
 * 与 `PropCarrier` 的唯一区别：token 字段类型不是 `void` 而是 `ColorTokenValue`，给颜色一个
 * 语义延伸窗口（modifier 调用后才 terminating 到 `void`）。
 *
 * 仅用在 `ENHANCED_PROPS[K].tokenCat === 'color'` 的属性上。
 *
 * `TExtraKeywords` 同 `PropCarrier`（W6.2 D14 扩展槽，默认 never）。
 */
export type ColorPropCarrier<
  TValue,
  TTokens extends string,
  TKeywords extends string,
  TExtraKeywords extends string = never,
> = ((value: TTokens) => void) &
  ((value: TValue) => void) &
  ((factory: (c: ColorPropCarrier<TValue, TTokens, TKeywords, TExtraKeywords>) => void) => void) & {
    readonly [K in TTokens]: ColorTokenValue
  } & {
    readonly [K in TKeywords]: void
  } & { readonly [K in TExtraKeywords]: void }
