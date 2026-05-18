/** 长度单位（CSS 中和 `<length>` / `<percentage>` 适用的）。 */
export const LENGTH_UNITS = [
  'px', 'rem', 'em', 'ch', 'ex', 'vw', 'vh', 'vmin', 'vmax',
  'pct', 'cm', 'mm', 'in', 'pt', 'pc', 'fr',
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
