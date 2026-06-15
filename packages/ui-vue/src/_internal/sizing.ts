/**
 * 尺寸基准 —— 组件数值尺寸 prop（`size` / `itemSize` / `optionSize` / `rowSize` / 列宽 等）
 * 是"基准倍数"，1 个单位 = `BASE_PX` 像素。
 *
 * 0.9.x 移除自创 iem 逻辑单位后，基准固定为 **16px**（CSS 默认根字号），不再随 `<ZBox>` 切换。
 * 对齐 Element Plus / Naive UI 的纯 px 模式 —— 布局、定位、JS 计算都是确定像素，便于心算。
 *
 * - **CSS 维度**走 chain：`s.padding.px(size * BASE_PX)`
 * - **JS 布局计算**（虚拟列表高度 / 列宽 px 等）：`sizePx(size)`
 */
export const BASE_PX = 16

/** 把"基准倍数"换算成像素数值（`n * BASE_PX`）。 */
export function sizePx(n: number): number {
  return n * BASE_PX
}
