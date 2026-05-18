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
 * 四态 carrier 类型：
 *  1. callable: `prop(value)`
 *  2. token: `prop._token`（`_` 前缀）
 *  3. keyword: `prop.keyword`（无前缀）
 *  4. unit 方法: `prop.px(n)` 等
 */
export type PropCarrier<TSelf, TValue, TTokens extends string, TKeywords extends string, TUnits = unknown> =
  & ((value: TValue) => TSelf)
  & { readonly [K in TTokens]: TSelf }
  & { readonly [K in TKeywords]: TSelf }
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
 */
export type ColorPropCarrier<TSelf, TValue, TTokens extends string, TKeywords extends string> =
  & ((value: TValue) => TSelf)
  & { readonly [K in TTokens]: ColorTokenValue<TSelf> }
  & { readonly [K in TKeywords]: TSelf }
