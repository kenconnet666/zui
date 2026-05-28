/**
 * `_typography-base` —— Typography 组件共享 chain 应用 helper。
 *
 * **不对外暴露**(下划线前缀 + 不在 `gene/index.ts` 导出)。供 ZText / ZTitle / ZParagraph /
 * ZLink / ZCode / ZBlockquote / ZGradientText 等组件复用「5 维度 carrier factory + 5 状态」
 * 的 chain 应用逻辑,避免每个 SFC 重复 30+ 行同款代码。
 *
 * **设计约束**:
 * - 不读取 `props.css` —— 每个组件自己控制 css 调用时机
 * - 不强加默认值 —— 默认走 `withDefaults`,这里只处理「传了就写」
 * - 不读取组件维度的 default(如 ZLink `_primary` / ZTitle level 映射)—— 这些由各组件在
 *   调用此 helper 之前/之后自行处理
 *
 * **size 是 `number`(2026-05-24 B7 决策)** —— iem 倍数,在 ZText / ZParagraph / ZLink 这种
 * 文字组件里 `size === undefined` 表示继承父字号,有值则 `fontSize.iem(size)`。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

/**
 * Typography 组件共享 props —— 5 维度 carrier factory + size number + 5 状态布尔/枚举。
 *
 * **size 是 `number`(2026-05-24 B7)**:iem 倍数,默认 undefined = 继承父字号。
 *
 * 各 SFC 在 `export interface Z<Component>Props` 中**重复展开这些字段**(而不是 extends),
 * 这样 IDE 悬停看 props 类型时一眼看到全集,符合 ZIcon 范式。
 */
export interface ZTypographyBaseProps {
  /**
   * 字号 —— `number`(iem 倍数,默认 undefined = 继承父字号)。
   *
   * @example
   * <ZText :size="1" />        <!-- 1iem (默认 16px) -->
   * <ZText :size="1.25" />     <!-- 1.25iem -->
   */
  size?: number | undefined
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
 * 把 5 维度 + size + 5 状态应用到 chain。**传了即写、不传不写**,保留 CSS cascade 行为。
 *
 * **调用时机**:在组件 `icss(theme, (s) => { ... })` 内,通常在「组件级默认」之后、
 * 「css 用户覆盖」之前调用。各组件自行控制顺序。
 *
 * @example
 * icss(theme.value, (s) => {
 *   // 组件默认(可被 props 覆盖,所以放最前)
 *   if (!props.color) s.color._primary
 *   // 共享 5+5 维度
 *   applyTypographyBase(s, props)
 *   // css 用户覆盖
 *   props.css?.(s)
 * })
 */
export function applyTypographyBase(s: Chain<ZuiSchema>, props: ZTypographyBaseProps): void {
  // ─── size: number(2026-05-24 B7 决策)。undefined = 继承父字号 ───
  if (props.size !== undefined) s.fontSize.iem(props.size)
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
    s._hover(h => {
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
