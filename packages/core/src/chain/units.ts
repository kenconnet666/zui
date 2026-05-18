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
 */
export const LENGTH_UNITS = [
  // 绝对
  'px', 'cm', 'mm', 'in', 'pt', 'pc',
  // 字体相对
  'rem', 'em', 'ch', 'ex',
  // 视口
  'vw', 'vh', 'vmin', 'vmax',
  // small / large / dynamic viewport（CSS Values 4）
  'svw', 'svh', 'svmin', 'svmax',
  'lvw', 'lvh', 'lvmin', 'lvmax',
  'dvw', 'dvh', 'dvmin', 'dvmax',
  // 容器查询单位（CSS Containment 3）
  'cqw', 'cqh', 'cqi', 'cqb', 'cqmin', 'cqmax',
  // 栅格
  'fr',
  // 百分比（特殊 ident → '%'）
  'pct',
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
    case 'length': return LENGTH_UNITS
    case 'time': return TIME_UNITS
    case 'angle': return ANGLE_UNITS
  }
}

/** 拼成 CSS 值字符串。 */
export function withUnit(n: number, ident: string): string {
  const cssUnit = UNIT_IDENT_TO_CSS[ident] ?? ident
  return `${n}${cssUnit}`
}
