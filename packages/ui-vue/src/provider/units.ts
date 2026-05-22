/**
 * `ZIemPreset` —— `<ZBox :iem>` 常用预设。
 *
 * **iem = "intrinsic em" / "我自己使用的 em"**,跟 CSS `rem`(root em)对称:
 * - `rem` = 根元素 font-size 倍率(浏览器掌控)
 * - `iem` = ZBox 注入的基准倍率(应用层掌控,默认 1iem = 16px,等同 1rem)
 *
 * 数字 / 字符串都可直接传给 `:iem`;这里提供"语义化命名"避免业务侧记 `'16px'` 等字面量。
 *
 * | preset | 物理意义 | 适用场景 |
 * |---|---|---|
 * | `default` (`'16px'`) | 1iem = 16px | **默认基准**(等同 1rem,设计稿主基线) |
 * | `large`   (`'20px'`) | 1iem = 20px | 大字模式(整站放大 25%) |
 * | `compact` (`'14px'`) | 1iem = 14px | 紧凑模式(整站缩小 12.5%) |
 * | `em`      (`'1em'`)  | 1iem = 1em(跟父字号)| 嵌套自动跟随父容器字号 |
 * | `rem`     (`'1rem'`) | 1iem = 1rem(跟浏览器根字号)| a11y 大字模式立即生效 |
 *
 * **嵌套 Provider 通过 css cascade 自然覆盖,兄弟 Provider 各自独立 —— 零运行时合并开销**。
 * 用户也可直接传任意 css length(`'0.05vw'` / `'clamp(...)'` 等)或 number(按 px 处理)。
 *
 * @example
 * ```vue
 * <!-- 默认 16px 基准 -->
 * <ZBox :iem="ZIemPreset.default">
 *   <App />
 * </ZBox>
 *
 * <!-- 嵌套覆盖:子树用 20px,兄弟不受影响 -->
 * <ZBox :iem="'16px'">
 *   <Card />                                  <!-- 1iem = 16px -->
 *   <ZBox :iem="'20px'">
 *     <Sidebar />                             <!-- 1iem = 20px(嵌套覆盖) -->
 *   </ZBox>
 *   <Main />                                  <!-- 1iem = 16px(回到外层) -->
 * </ZBox>
 *
 * <!-- 兄弟 Provider 互不影响 -->
 * <ZBox :iem="ZIemPreset.compact"><Compact /></ZBox>
 * <ZBox :iem="ZIemPreset.large"><Cozy /></ZBox>
 * ```
 */
export const ZIemPreset = {
  /** **默认基准**:1iem = 16px(等同 1rem,设计稿主基线)。 */
  default: '16px',
  /** 大字模式:1iem = 20px(整站放大 25%)。 */
  large: '20px',
  /** 紧凑模式:1iem = 14px(整站缩小 12.5%)。 */
  compact: '14px',
  /** 跟父字号:1iem = 1em。嵌套自动跟随父容器字号缩放。 */
  em: '1em',
  /** 跟浏览器根字号:1iem = 1rem。a11y 大字模式立即生效。 */
  rem: '1rem',
} as const

export type ZIem = string | number
