/**
 * `ZIemPreset` —— `<ZBox :iem>` 单位预设。
 *
 * **iem = "intrinsic em" / "我自己使用的 em"**,跟 CSS `rem`(root em)对称:
 * - `rem` = 根元素 font-size 倍率(浏览器掌控)
 * - `iem` = ZBox 注入的基准倍率(应用层掌控)
 *
 * **v0.2 BREAKING**(2026-05-24):
 * 1. **默认改为 `'0.8333vw'`(5/6vw,1920px 屏 = 16px)** —— 整站响应式等比缩放,
 *    16:9 屏从 1366 到 8K 视觉一致
 * 2. **限制只允许 `px` / `vw` 字面值** —— ZBox 内部要 resolve 出实际像素值
 *    `provide` 给虚拟列表等 JS 算法层使用,em / rem / clamp 无法可靠 JS 解析,故移除
 * 3. **`em` / `rem` preset 已删除** —— 业务方需要"跟父字号"/"跟根字号"请直接写 CSS
 *
 * @example
 * ```vue
 * <!-- 默认:响应式 vw,5/6vw = 16px @ 1920 屏 -->
 * <ZBox :iem="ZIemPreset.default">
 *   <App />
 * </ZBox>
 *
 * <!-- 固定 px:不随屏宽缩放 -->
 * <ZBox :iem="ZIemPreset.fixed">
 *   <FixedPanel />
 * </ZBox>
 *
 * <!-- 嵌套覆盖:子树固定,父树响应式 -->
 * <ZBox :iem="ZIemPreset.default">
 *   <Resizable />
 *   <ZBox :iem="ZIemPreset.fixed">
 *     <Fixed />
 *   </ZBox>
 * </ZBox>
 * ```
 */
export const ZIemPreset = {
  /**
   * **默认基准**:`'0.8333vw'`(= 5/6 vw,1920px 屏 = 16px)。
   *
   * 响应式 —— 屏宽变化时所有 iem token 等比缩放,16:9 屏跨屏宽视觉一致。
   */
  default: '0.8333vw',
  /**
   * **固定 px 模式**:`'16px'`,opt-out 响应式,适合精确控制场景。
   */
  fixed: '16px',
  /**
   * 大字模式:`'1.0417vw'`(= 5/6vw × 1.25,1920 屏 = 20px),整站放大 25%。
   */
  large: '1.0417vw',
  /**
   * 紧凑模式:`'0.7292vw'`(= 5/6vw × 0.875,1920 屏 = 14px),整站缩小 12.5%。
   */
  compact: '0.7292vw',
} as const

/**
 * `ZIem` —— `<ZBox :iem>` 接受的值类型。
 *
 * 限制:仅 `px` / `vw` 字面字符串(或 number 当 px)。
 * 其它 CSS 长度(`em` / `rem` / `clamp(...)` / `calc(...)`)v0.2 不再支持。
 */
export type ZIem = `${number}px` | `${number}vw` | number
