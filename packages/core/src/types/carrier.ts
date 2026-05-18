/** CSS 全局关键字。 */
export type GlobalKw = 'inherit' | 'unset' | 'initial' | 'revert' | 'revertLayer'

/** 长度类 unit 方法集。 */
export interface LengthUnits<TSelf> {
  px(n: number): TSelf
  rem(n: number): TSelf
  em(n: number): TSelf
  ch(n: number): TSelf
  ex(n: number): TSelf
  vw(n: number): TSelf
  vh(n: number): TSelf
  vmin(n: number): TSelf
  vmax(n: number): TSelf
  pct(n: number): TSelf
  cm(n: number): TSelf
  mm(n: number): TSelf
  in(n: number): TSelf
  pt(n: number): TSelf
  pc(n: number): TSelf
  fr(n: number): TSelf
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
> =
  & ((value: TValue) => TSelf)
  & { readonly [K in TTokens]: TSelf }
  & { readonly [K in TKeywords]: TSelf }
  & { readonly [K in TExtraKeywords]: TSelf }
  & TUnits

/** 无主题 token、无 unit 方法的属性（只支持函数调用 + 全局关键字）。 */
export type PropFn<TSelf, TValue> =
  & ((value: TValue) => TSelf)
  & { readonly [K in GlobalKw]: TSelf }

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
> =
  & ((value: TValue) => TSelf)
  & { readonly [K in TTokens]: ColorTokenValue<TSelf> }
  & { readonly [K in TKeywords]: TSelf }
  & { readonly [K in TExtraKeywords]: TSelf }
