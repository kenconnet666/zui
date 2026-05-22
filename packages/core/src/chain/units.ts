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

/**
 * **纯 TS** 的 zu 基准工厂 —— 无 css var 依赖,在编译/运行的 TS 层就把 `zu(N)` 算成具体值。
 *
 * 与 `zu(n)` 互补:
 * - `zu(n)` 走 css var,跟随 `<ZConfigProvider :unit>` cascade(默认用法)
 * - `zuWith(base)(n)` 在 TS 层直接计算,不依赖 css var(SSR / 静态生成 / 测试 / 非 Vue 环境)
 *
 * **解析规则**:
 * - `base: number`        → 视为 px,例 `zuWith(2)(8) = '16px'`
 * - `base: '<num><unit>'` → 数值×N + 单位,例 `zuWith('0.0625rem')(16) = '1rem'`
 * - 其它(`calc()` / `clamp()` / `var(--x)` / 含空格)→ 退化为 `calc(N * <base>)`,保证仍是合法 css
 *
 * **浮点污染防御**:计算结果 round 到 6 位小数,避免 `1.0625 * 16 = 17.000000000000004`。
 *
 * @example
 * const zuPx = zuWith(2)
 * zuPx(8)       // '16px'  ← TS 直接算好
 *
 * const zuRem = zuWith('0.0625rem')
 * zuRem(16)     // '1rem'
 *
 * const zuFluid = zuWith('clamp(0.5px, 0.1vw, 2px)')
 * zuFluid(8)    // 'calc(8 * clamp(0.5px, 0.1vw, 2px))' ← 复杂表达式退化
 */
export function zuWith(base: string | number): (n: number) => string {
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

/** 拼成 CSS 值字符串。zu 走 css var 表达式，其它按 `${n}${unit}` 拼接。 */
export function withUnit(n: number, ident: string): string {
  if (ident === 'zu') return zu(n)
  const cssUnit = UNIT_IDENT_TO_CSS[ident] ?? ident
  return `${n}${cssUnit}`
}
