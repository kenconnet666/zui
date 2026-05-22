/**
 * 长度单位（CSS 中和 `<length>` / `<percentage>` / `<flex>` 适用的）。
 *
 * 分组：
 * - **绝对单位**: px / cm / mm / in / pt / pc
 * - **相对字体**: rem / em / ch / ex
 * - **小视口（svw/svh）**: 排除浏览器 UI 占用高度的视口
 * - **大视口（lvw/lvh）**: 假设 UI 收起后的最大视口
 * - **动态视口（dvw/dvh）**: 跟随 UI 动态变化（CSS Values 4）
 * - **容器查询单位（cqw/cqh/cqi/cqb/cqmin/cqmax）**: 基于最近 container parent
 * - **栅格分数**: fr
 * - **百分比**: pct → '%'
 * - **zui 逻辑单位 iem**: `calc(N * var(--zui-iem, 16px))` —— "我自己使用的 em",跟 rem 对称
 *   (rem = root em / iem = ZBox em)。默认 `1iem = 16px`(等同 1rem);
 *   ui-vue `<ZBox :iem>` 通过 css var `--zui-iem` 全站切换 1iem 物理意义,
 *   嵌套 Provider 通过 css cascade 自动覆盖,兄弟 Provider 各自独立 —— 零运行时合并开销。
 */
export const LENGTH_UNITS = [
  // 绝对
  'px',
  'cm',
  'mm',
  'in',
  'pt',
  'pc',
  // 字体相对
  'rem',
  'em',
  'ch',
  'ex',
  // 视口
  'vw',
  'vh',
  'vmin',
  'vmax',
  // small / large / dynamic viewport（CSS Values 4）
  'svw',
  'svh',
  'svmin',
  'svmax',
  'lvw',
  'lvh',
  'lvmin',
  'lvmax',
  'dvw',
  'dvh',
  'dvmin',
  'dvmax',
  // 容器查询单位（CSS Containment 3）
  'cqw',
  'cqh',
  'cqi',
  'cqb',
  'cqmin',
  'cqmax',
  // 栅格
  'fr',
  // 百分比（特殊 ident → '%'）
  'pct',
  // zui 逻辑单位 iem(intrinsic / ZBox em,默认 1iem = 16px)
  'iem',
] as const

/** 时间单位。 */
export const TIME_UNITS = ['ms', 's'] as const

/** 角度单位。 */
export const ANGLE_UNITS = ['deg', 'rad', 'grad', 'turn'] as const

/** ident → 真实 CSS 单位的映射（处理 `pct → %` 等特殊情况）。 */
export const UNIT_IDENT_TO_CSS: Record<string, string> = {
  pct: '%',
}

export type LengthUnit = (typeof LENGTH_UNITS)[number]
export type TimeUnit = (typeof TIME_UNITS)[number]
export type AngleUnit = (typeof ANGLE_UNITS)[number]
export type UnitClass = 'length' | 'time' | 'angle'

export function getUnitList(cls: UnitClass): readonly string[] {
  switch (cls) {
    case 'length':
      return LENGTH_UNITS
    case 'time':
      return TIME_UNITS
    case 'angle':
      return ANGLE_UNITS
  }
}

/**
 * zui 逻辑单位 helper —— 任意 number → `calc(N * var(--zui-iem, 16px))`。
 *
 * **iem = "intrinsic em" / "我自己使用的 em"**,跟 CSS `rem`(root em)对称:
 * - `rem` = 根元素 font-size 倍率(浏览器掌控)
 * - `iem` = ZBox 注入的基准倍率(应用层掌控)
 *
 * **物理意义由 ui-vue `<ZBox :iem>` 注入的 css var `--zui-iem` 决定**:
 * - 默认 `16px`(不在 Provider 内 / Provider 未传 `:iem`)—— 1iem = 16px(等同 1rem)
 * - `<ZBox :iem="'20px'">` —— 整站 UI 放大 25%(大字模式)
 * - `<ZBox :iem="'1em'">` —— 跟父字号(嵌套自动)
 * - `<ZBox :iem="'1rem'">` —— 跟浏览器根字号(a11y)
 *
 * **嵌套 Provider 通过 css cascade 自动覆盖,兄弟 Provider 各自独立 —— 零运行时合并开销**。
 *
 * 用于:
 * - chain method:`s.padding.iem(1)` / `s.width.iem(1.5)` 等所有 length-class 属性自动可用
 * - theme token 表:`spacing: { tiny: iem(0.25), middle: iem(1), ... }`(默认物理像素 4/16/...)
 */
export function iem(n: number): string {
  return `calc(${n} * var(--zui-iem, 16px))`
}

/**
 * **纯 TS** 的 iem 基准工厂 —— 无 css var 依赖,在编译/运行的 TS 层就把 `iem(N)` 算成具体值。
 *
 * 与 `iem(n)` 互补:
 * - `iem(n)` 走 css var,跟随 `<ZBox :iem>` cascade(默认用法)
 * - `iemWith(base)(n)` 在 TS 层直接计算,不依赖 css var(SSR / 静态生成 / 测试 / 非 Vue 环境)
 *
 * **解析规则**:
 * - `base: number`        → 视为 px,例 `iemWith(20)(1) = '20px'`
 * - `base: '<num><unit>'` → 数值×N + 单位,例 `iemWith('1rem')(1.25) = '1.25rem'`
 * - 其它(`calc()` / `clamp()` / `var(--x)` / 含空格)→ 退化为 `calc(N * <base>)`,保证仍是合法 css
 *
 * **浮点污染防御**:计算结果 round 到 6 位小数,避免 `1.0625 * 16 = 17.000000000000004`。
 *
 * @example
 * const iemPx = iemWith(20)
 * iemPx(1)        // '20px'  ← TS 直接算好
 *
 * const iemRem = iemWith('1rem')
 * iemRem(1.5)     // '1.5rem'
 *
 * const iemFluid = iemWith('clamp(14px, 1vw, 20px)')
 * iemFluid(1)     // 'calc(1 * clamp(14px, 1vw, 20px))' ← 复杂表达式退化
 */
export function iemWith(base: string | number): (n: number) => string {
  if (typeof base === 'number') {
    return (n: number) => `${roundNice(n * base)}px`
  }
  const m = base.match(/^(-?\d+(?:\.\d+)?)([a-zA-Z%]+)$/)
  if (m) {
    const factor = parseFloat(m[1]!)
    const unit = m[2]!
    return (n: number) => `${roundNice(n * factor)}${unit}`
  }
  // 复杂 css 表达式 → 退化 calc(),保留可读性 + 仍是合法 css length
  return (n: number) => `calc(${n} * ${base})`
}

/** 浮点 round 到 6 位小数,避免 `0.1 + 0.2 = 0.30000000000000004` 这类污染。 */
function roundNice(n: number): number {
  return Math.round(n * 1_000_000) / 1_000_000
}

/** 拼成 CSS 值字符串。iem 走 css var 表达式，其它按 `${n}${unit}` 拼接。 */
export function withUnit(n: number, ident: string): string {
  if (ident === 'iem') return iem(n)
  const cssUnit = UNIT_IDENT_TO_CSS[ident] ?? ident
  return `${n}${cssUnit}`
}
