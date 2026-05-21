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
 * - **zui 逻辑单位 zu**: `calc(N * var(--zui-unit, 1px))` —— ui-vue `<ZConfigProvider :unit>`
 *   通过 css var `--zui-unit` 全站切换 1zu 物理意义（默认 `1px`，可改 `'1rem'` / `'2px'` / `'0.05vw'` 等）
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
  // zui 逻辑单位（css var 后端，Provider 可全站切换基准）
  'zu',
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
 * zui 逻辑单位 helper —— 任意 number → `calc(N * var(--zui-unit, 1px))`。
 *
 * **物理意义由 ui-vue `<ZConfigProvider :unit>` 注入的 css var `--zui-unit` 决定**：
 * - 默认 `1px`（不在 Provider 内 / Provider 未传 `:unit`）
 * - `<ZConfigProvider :unit="'2px'">` —— 整站 UI 放大 2 倍（适合超大屏）
 * - `<ZConfigProvider :unit="'0.0625rem'">` —— 跟浏览器根字号（a11y 大字模式整站同步）
 * - `<ZConfigProvider :unit="'0.05vw'">` —— 响应式 fluid sizing
 * - `<ZConfigProvider :unit="'clamp(12px, 1vw, 20px)'">` —— 任意 css length 表达式
 *
 * 嵌套 Provider 通过 css cascade 自然覆盖，无运行时合并开销。
 *
 * 用于：
 * - chain method：`s.padding.zu(8)` / `s.width.zu(16)` 等所有 length-class 属性自动可用
 * - theme token 表：`spacing: { tiny: zu(4), middle: zu(16), ... }`
 */
export function zu(n: number): string {
  return `calc(${n} * var(--zui-unit, 1px))`
}

/** 拼成 CSS 值字符串。zu 走 css var 表达式，其它按 `${n}${unit}` 拼接。 */
export function withUnit(n: number, ident: string): string {
  if (ident === 'zu') return zu(n)
  const cssUnit = UNIT_IDENT_TO_CSS[ident] ?? ident
  return `${n}${cssUnit}`
}
