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
 * - zui 逻辑单位：zu → `calc(N * var(--zui-unit, 1px))`（Provider 全站切换基准）
 *
 * 合计 35 个。
 */
export interface LengthUnits<TSelf> {
  // ─── 绝对 ───
  px(n: number): TSelf
  cm(n: number): TSelf
  mm(n: number): TSelf
  in(n: number): TSelf
  pt(n: number): TSelf
  pc(n: number): TSelf
  // ─── 字体相对 ───
  rem(n: number): TSelf
  em(n: number): TSelf
  ch(n: number): TSelf
  ex(n: number): TSelf
  // ─── 视口 ───
  vw(n: number): TSelf
  vh(n: number): TSelf
  vmin(n: number): TSelf
  vmax(n: number): TSelf
  // ─── 小视口（小于 vw/vh，UI 占用后） ───
  svw(n: number): TSelf
  svh(n: number): TSelf
  svmin(n: number): TSelf
  svmax(n: number): TSelf
  // ─── 大视口（UI 收起后的最大） ───
  lvw(n: number): TSelf
  lvh(n: number): TSelf
  lvmin(n: number): TSelf
  lvmax(n: number): TSelf
  // ─── 动态视口（跟随 UI 实时变化） ───
  dvw(n: number): TSelf
  dvh(n: number): TSelf
  dvmin(n: number): TSelf
  dvmax(n: number): TSelf
  // ─── 容器查询 ───
  cqw(n: number): TSelf
  cqh(n: number): TSelf
  cqi(n: number): TSelf
  cqb(n: number): TSelf
  cqmin(n: number): TSelf
  cqmax(n: number): TSelf
  // ─── 栅格 ───
  fr(n: number): TSelf
  // ─── 百分比（特殊 ident → '%'） ───
  pct(n: number): TSelf
  // ─── zui 逻辑单位（css var 后端，Provider :unit 全站切换） ───
  zu(n: number): TSelf
}

export interface TimeUnits<TSelf> {
  ms(n: number): TSelf
  s(n: number): TSelf
}

export interface AngleUnits<TSelf> {
  deg(n: number): TSelf
  rad(n: number): TSelf
  grad(n: number): TSelf
  turn(n: number): TSelf
}

/**
 * 五态 carrier 类型（W6.2）：
 *  1. callable: `prop(value)`
 *  2. token: `prop._token`（`_` 前缀，主题 token）
 *  3. keyword: `prop.keyword`（无前缀，CSS 标准关键字）
 *  4. extra-keyword: `prop._extra`（`_` 前缀，zui 补 csstype 未跟新的关键字；默认 never）
 *  5. unit 方法: `prop.px(n)` 等
 *
 * `TExtraKeywords` 是 W6 generator 接管后的 D14 扩展槽：让 zui 给某些属性补 csstype 尚未跟新的
 * keyword（必须 `_` 前缀以与 CSS 标准 keyword 隔离）。Generator 会校验 token 与 extra-keyword 不重名。
 */
export type PropCarrier<
  TSelf,
  TValue,
  TTokens extends string,
  TKeywords extends string,
  TUnits = unknown,
  TExtraKeywords extends string = never,
> = ((value: TValue) => TSelf) & { readonly [K in TTokens]: TSelf } & {
  readonly [K in TKeywords]: TSelf
} & { readonly [K in TExtraKeywords]: TSelf } & TUnits

/** 无主题 token、无 unit 方法的属性（只支持函数调用 + 全局关键字）。 */
export type PropFn<TSelf, TValue> = ((value: TValue) => TSelf) & { readonly [K in GlobalKw]: TSelf }

/**
 * 颜色 token 命中后返回的 helper：
 *  - 进入 helper 时，CSS 属性已被立即写入真值（user 不需 modifier 也能拿到色值）
 *  - 所有 modifier 基于 **token 原值**计算并覆盖写入；不是基于上次 modifier 的结果累积
 *  - n 取 0-100（百分比）；越界自动 clamp
 *
 * 所有 modifier 不返回 chain（statement-only 风格）。
 */
export interface ColorTokenValue<TSelf> {
  /** 重写为带 alpha 的 rgba。 */
  alpha(n: number): TSelf
  /** HSL 亮度加深 n%。 */
  darken(n: number): TSelf
  /** HSL 亮度提亮 n%。 */
  lighten(n: number): TSelf
  /** 与 `other` 颜色混合 n%（0 = 原色，100 = 完全 other）。 */
  mix(other: string, n: number): TSelf
  /** HSL 饱和度提升 n%。 */
  saturate(n: number): TSelf
  /** HSL 饱和度降低 n%。 */
  desaturate(n: number): TSelf
  /** 补色 —— 色相旋转 180°。 */
  complement(): TSelf
  /** 任意角度旋转色相；deg 任意数（自动 mod 360）。 */
  rotateHue(deg: number): TSelf
  /** RGB 反相（255 - 每 channel）。 */
  invert(): TSelf
  /** 与黑色按 n% 混合（RGB 混黑；比 darken 更"重"）；n 取 0-100。 */
  shade(n: number): TSelf
  /** 与白色按 n% 混合（RGB 混白；比 lighten 更"柔"）；n 取 0-100。 */
  tint(n: number): TSelf
}

/**
 * 颜色专用 carrier：token 命中返回 `ColorTokenValue<TSelf>`（暴露 `.alpha(n)`）。
 *
 * 与 `PropCarrier` 的唯一区别：token 字段类型。
 * 仅用在 `ENHANCED_PROPS[K].tokenCat === 'color'` 的属性上。
 *
 * `TExtraKeywords` 同 `PropCarrier`（W6.2 D14 扩展槽，默认 never）。
 */
export type ColorPropCarrier<
  TSelf,
  TValue,
  TTokens extends string,
  TKeywords extends string,
  TExtraKeywords extends string = never,
> = ((value: TValue) => TSelf) & { readonly [K in TTokens]: ColorTokenValue<TSelf> } & {
  readonly [K in TKeywords]: TSelf
} & { readonly [K in TExtraKeywords]: TSelf }
