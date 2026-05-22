/**
 * `ZUnitPreset` —— `<ZConfigProvider :unit>` 常用预设。
 *
 * 数字 / 字符串都可直接传给 `:unit`；这里提供"语义化命名"避免业务侧记 `'0.0625rem'` 这种神秘字面量。
 *
 * | preset | 物理意义 | 适用场景 |
 * |---|---|---|
 * | `pixel` (`'1px'`)   | 1zu = 1px            | **默认**。设计师按 px 思考，CSS 行为与传统一致 |
 * | `rem`   (`'0.0625rem'`) | 1zu = 1/16 rem (跟 root font-size) | **a11y 友好**。用户浏览器调大字号，整站尺寸同步放大 |
 * | `retina` (`'2px'`)  | 1zu = 2px            | 超大屏 / 远距离显示器整站放大 2 倍 |
 *
 * 用户也可直接传任意 css length（`'0.05vw'` / `'clamp(...)'` 等）或 number（按 px 处理）。
 *
 * @example
 * ```vue
 * <ZConfigProvider :unit="ZUnitPreset.rem">
 *   <App />   <!-- 整站走 rem，浏览器大字模式自动适配 -->
 * </ZConfigProvider>
 *
 * <ZConfigProvider :unit="ZUnitPreset.retina">
 *   <App />   <!-- 整站 UI 放大 2× -->
 * </ZConfigProvider>
 *
 * <!-- 或直接传任意字符串 -->
 * <ZConfigProvider :unit="'0.05vw'">
 *   <App />   <!-- 响应式 fluid sizing -->
 * </ZConfigProvider>
 * ```
 */
export const ZUnitPreset = {
  /** 默认。1zu = 1px。 */
  pixel: '1px',
  /** A11y 友好。1zu = 1/16 rem，跟随浏览器根字号，大字模式整站同步放大。 */
  rem: '0.0625rem',
  /** 大屏放大。1zu = 2px。 */
  retina: '2px',
} as const

export type ZUnit = string | number
