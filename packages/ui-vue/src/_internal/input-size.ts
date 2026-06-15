/**
 * `_internal/input-size` —— 输入框类组件共享 size 应用 helper(2026-05-24 B7 决策)。
 *
 * 输入框类组件(ZInput / ZSelect / ZInputNumber / ZAutoComplete / ZTreeSelect / ZDatePicker /
 * ZTimePicker / ZCascader)用统一的 size + height 计算公式,这里提供单一函数避免组件内
 * 重复手写同样的 5 行尺寸计算。
 *
 * **公式**(`size` 是尺寸倍数,1 单位 = 16px;`height` 可选倍数,默认 `size * 2`):
 * - `font-size` = `size * 16` px
 * - `height` = `(height ?? size * 2) * 16` px
 * - `padding-y` = `size * 0.375 * 16` px
 * - `padding-x` = `size * 0.75 * 16` px
 * - `border-radius` = `size * 0.25 * 16` px
 *
 * **不暴露**(下划线前缀)。各 input 组件直接 import `applyInputSize`。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import { sizePx } from './sizing'

/**
 * 把 size + height 应用到 chain,按 input 类通用公式算所有尺寸维度(1 单位 = 16px)。
 *
 * @param s - chain 目标
 * @param size - 字号倍数(默认 1)
 * @param height - 高度倍数(可选,默认 `size * 2`)
 */
export function applyInputSize(
  s: Chain<ZuiSchema>,
  size: number | undefined,
  height: number | undefined,
): void {
  const sz = size ?? 1
  const h = height ?? sz * 2
  s.fontSize.px(sizePx(sz))
  s.height.px(sizePx(h))
  s.paddingTop.px(sizePx(sz * 0.375))
  s.paddingBottom.px(sizePx(sz * 0.375))
  s.paddingLeft.px(sizePx(sz * 0.75))
  s.paddingRight.px(sizePx(sz * 0.75))
  s.borderRadius.px(sizePx(sz * 0.25))
}

/**
 * 把 size 应用到 chain,**不设 height**(给 ZTextarea / ZMention 这类高度由 rows 决定的组件)。
 */
export function applyInputSizeNoHeight(s: Chain<ZuiSchema>, size: number | undefined): void {
  const sz = size ?? 1
  s.fontSize.px(sizePx(sz))
  s.paddingTop.px(sizePx(sz * 0.375))
  s.paddingBottom.px(sizePx(sz * 0.375))
  s.paddingLeft.px(sizePx(sz * 0.75))
  s.paddingRight.px(sizePx(sz * 0.75))
  s.borderRadius.px(sizePx(sz * 0.25))
}
