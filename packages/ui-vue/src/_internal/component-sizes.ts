/**
 * 共享 SIZE_MAP —— 把"输入框尺寸"等多组件共用的 size 实现集中放此,避免散落重复。
 *
 * 各组件文件 import 这里的 const + `applySizeProp` 应用。如果某组件需要差异化档位,
 * 直接在该组件内自定义 SIZE_MAP(不要 fork 这里的常量)。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import { makeSizeMap, type SizeMap } from './size-prop'

/**
 * 输入框尺寸 —— 同时影响 fontSize + padding-y,适用于 ZInput / ZTextarea / ZInputNumber /
 * ZSelect / ZAutoComplete / ZDatePicker / ZTimePicker / ZTreeSelect 等所有"输入框"类组件。
 *
 * 3 阶实际实现 + Size5 fallback(tiny→small / huge→large)。
 *
 * **跟 schema fontSize 5 阶对齐**:`_tiny`(12px) / `_small`(14px) / `_middle`(16px) /
 * `_large`(18px) / `_huge`(20px)。
 *
 * **跟 iem 联动**:padding-y 走 `iem(N)`,ZBox `:iem` 切换基准时跟着缩放。
 */
export const INPUT_SIZE_MAP: SizeMap<Chain<ZuiSchema>> = makeSizeMap<Chain<ZuiSchema>>({
  small: (s) => {
    s.fontSize._small
    s.paddingTop.iem(0.25)
    s.paddingBottom.iem(0.25)
  },
  middle: (s) => {
    s.fontSize._middle
    s.paddingTop.iem(0.375)
    s.paddingBottom.iem(0.375)
  },
  large: (s) => {
    s.fontSize._large
    s.paddingTop.iem(0.5)
    s.paddingBottom.iem(0.5)
  },
})

/**
 * 列表/卡片紧凑尺寸 —— 影响 padding 整体(上下左右一致),适用于 ZList / ZDescriptions /
 * ZCard 内部分级等。
 *
 * 3 阶实际实现 + Size5 fallback。
 */
export const COMPACT_PADDING_MAP: SizeMap<Chain<ZuiSchema>> = makeSizeMap<Chain<ZuiSchema>>({
  small: (s) => {
    s.padding._small
  },
  middle: (s) => {
    s.padding._middle
  },
  large: (s) => {
    s.padding._large
  },
})
