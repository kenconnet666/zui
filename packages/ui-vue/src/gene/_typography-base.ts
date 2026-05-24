/**
 * `_typography-base` —— Typography 组件共享 chain 应用 helper。
 *
 * **不对外暴露**(下划线前缀 + 不在 `gene/index.ts` 导出)。供 ZText / ZTitle / ZParagraph /
 * ZLink / ZCode / ZBlockquote / ZGradientText 等组件复用「6 维度 carrier factory + 5 状态」
 * 的 chain 应用逻辑,避免每个 SFC 重复 30+ 行同款代码。
 *
 * **设计约束**:
 * - 不读取 `props.css` —— 每个组件自己控制 css 调用时机
 * - 不强加默认值 —— 默认走 `withDefaults`,这里只处理「传了就写」
 * - 不读取组件维度的 default(如 ZLink `_primary` / ZTitle level 映射)—— 这些由各组件在
 *   调用此 helper 之前/之后自行处理
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import { applySizeProp, type SizeMap, type SizeProp } from '../_internal/size-prop'

/**
 * Typography 组件共享 props —— 6 维度 carrier factory + 5 状态布尔/枚举。
 *
 * `size` 走 **纯 factory**(2026-05-23 撤销 Size5 union):`((f: Chain<ZuiSchema>['fontSize']) => void) | undefined`。
 * 业务想走 5 阶档位可以复用 `TYPOGRAPHY_SIZE_MAP.middle` 等导出。
 *
 * 各 SFC 在 `export interface Z<Component>Props` 中**重复展开这些字段**(而不是 extends),
 * 这样 IDE 悬停看 props 类型时一眼看到全集,符合 ZIcon 范式。
 */
export interface ZTypographyBaseProps {
  /**
   * 字号 —— 纯 factory(`SizeProp<'fontSize'>`)。默认不传 = 继承父字号。
   * 想走 5 阶 token 复用 `TYPOGRAPHY_SIZE_MAP.middle`(_middle)等。
   */
  size?: SizeProp<'fontSize'> | undefined
  weight?: ((w: Chain<ZuiSchema>['fontWeight']) => void) | undefined
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  depth?: ((o: Chain<ZuiSchema>['opacity']) => void) | undefined
  leading?: ((l: Chain<ZuiSchema>['lineHeight']) => void) | undefined
  tracking?: ((t: Chain<ZuiSchema>['letterSpacing']) => void) | undefined
  italic?: boolean
  /** 始终下划线,默认 `false`。 */
  underline?: boolean
  /** 仅 hover 时下划线,默认 `false`。 */
  underlineOnHover?: boolean
  strikethrough?: boolean
  mono?: boolean
  ellipsis?: boolean | number
}

/**
 * Typography 共享 size map —— 字符串档位直接映射 schema fontSize token。
 *
 * 因为 schema fontSize 的 key 跟 Size5 完全一致(tiny/small/middle/large/huge),
 * 用户写 `size="middle"` 等价于 `:size="(f) => f._middle"`。
 *
 * 业务方在 `zuiLight.extend({ fontSize: { ... } })` 覆盖 schema 时,这个映射也跟着变。
 */
export const TYPOGRAPHY_SIZE_MAP: SizeMap<Chain<ZuiSchema>['fontSize']> = {
  tiny: (f) => {
    f._tiny
  },
  small: (f) => {
    f._small
  },
  middle: (f) => {
    f._middle
  },
  large: (f) => {
    f._large
  },
  huge: (f) => {
    f._huge
  },
}

/**
 * 把 6 维度 + 5 状态应用到 chain。**传了即写、不传不写**,保留 CSS cascade 行为。
 *
 * **调用时机**:在组件 `icss(theme, (s) => { ... })` 内,通常在「组件级默认」之后、
 * 「css 用户覆盖」之前调用。各组件自行控制顺序。
 *
 * @example
 * icss(theme.value, (s) => {
 *   // 组件默认(可被 props 覆盖,所以放最前)
 *   if (!props.color) s.color._primary
 *   // 共享 6+5 维度
 *   applyTypographyBase(s, props)
 *   // css 用户覆盖
 *   props.css?.(s)
 * })
 */
export function applyTypographyBase(
  s: Chain<ZuiSchema>,
  props: ZTypographyBaseProps,
): void {
  // ─── size: 纯 factory(2026-05-23 撤销字符串 union)。用户可直接复用 TYPOGRAPHY_SIZE_MAP.middle 等。 ───
  applySizeProp(props.size, s.fontSize)
  if (props.weight) s.fontWeight(props.weight)
  if (props.color) s.color(props.color)
  if (props.depth) s.opacity(props.depth)
  if (props.leading) s.lineHeight(props.leading)
  if (props.tracking) s.letterSpacing(props.tracking)

  // ─── 斜体 ─── fontStyle 不在 ENHANCED_PROPS,走 PropFn 函数调用
  if (props.italic) s.fontStyle('italic')

  // ─── 装饰线(underline + strikethrough 可叠加,空格分隔多值) ───
  const baseLines: string[] = []
  if (props.underline) baseLines.push('underline')
  if (props.strikethrough) baseLines.push('line-through')
  if (baseLines.length > 0) s.textDecorationLine(baseLines.join(' '))
  if (props.underlineOnHover) {
    const hoverLines = [...baseLines, 'underline'].join(' ')
    s._hover((h) => {
      h.textDecorationLine(hoverLines)
    })
  }

  // ─── 等宽字体 ─── 走 schema fonts._mono token,用户可在 `<ZBox :theme-patch>` /
  // `zuiLight.extend({ fonts: { mono: '...' } })` 覆盖
  if (props.mono) s.fontFamily._mono

  // ─── 省略 ───
  if (props.ellipsis === true) s._truncate()
  else if (typeof props.ellipsis === 'number') s._lineClamp(props.ellipsis)
}
