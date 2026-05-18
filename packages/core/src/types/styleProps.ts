import type {
  ColorTokens,
  SpacingTokens,
  RadiusTokens,
  ShadowTokens,
  FontSizeTokens,
} from './tokens'
import type { ThemeSchema } from '../theme/types'
import type { Chain } from '../chain/Chain'
import type { DefaultSchema } from '../theme/defaults/schema'

/**
 * W10.1 — 组件 props 风格的 style alias 类型集合（Theme UI / Chakra 风）。
 *
 * 给组件库做 `<Box mt={4} p="md" color="_primary">` 类 prop API 用。
 * 配合 `applyStyleProps` 把 props 应用到 chain。
 *
 * 所有 alias 都接受 token（如 `'_primary'` / `'_md'`）或字面值（string / number）。
 */
export type StyleProps<T extends ThemeSchema = DefaultSchema> = Partial<{
  // ─── 颜色 ───
  color: ColorTokens<T> | (string & {})
  bg: ColorTokens<T> | (string & {})
  backgroundColor: ColorTokens<T> | (string & {})
  borderColor: ColorTokens<T> | (string & {})

  // ─── padding / margin ───
  p: SpacingTokens<T> | number | string
  px: SpacingTokens<T> | number | string
  py: SpacingTokens<T> | number | string
  pt: SpacingTokens<T> | number | string
  pr: SpacingTokens<T> | number | string
  pb: SpacingTokens<T> | number | string
  pl: SpacingTokens<T> | number | string

  m: SpacingTokens<T> | number | string
  mx: SpacingTokens<T> | number | string
  my: SpacingTokens<T> | number | string
  mt: SpacingTokens<T> | number | string
  mr: SpacingTokens<T> | number | string
  mb: SpacingTokens<T> | number | string
  ml: SpacingTokens<T> | number | string

  // ─── 尺寸 ───
  w: number | string
  h: number | string
  minW: number | string
  minH: number | string
  maxW: number | string
  maxH: number | string

  // ─── 圆角 / 阴影 ───
  rounded: RadiusTokens<T> | number | string
  shadow: ShadowTokens<T> | string

  // ─── 字体 ───
  fontSize: FontSizeTokens<T> | string | number
  fontWeight: number | string

  // ─── 布局 ───
  display: string
  position: string
  zIndex: number
  opacity: number

  // ─── flex / grid ───
  flex: number | string
  gap: SpacingTokens<T> | number | string
  flexDirection: 'row' | 'column' | 'rowReverse' | 'columnReverse'
  alignItems: string
  justifyContent: string
}>

/** 把 StyleProps 中的 alias 映射到真实 CSS property（运行时表）。 */
const ALIAS_MAP: Record<string, string | string[]> = {
  bg: 'backgroundColor',
  p: 'padding',
  px: ['paddingLeft', 'paddingRight'],
  py: ['paddingTop', 'paddingBottom'],
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  m: 'margin',
  mx: ['marginLeft', 'marginRight'],
  my: ['marginTop', 'marginBottom'],
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
  w: 'width',
  h: 'height',
  minW: 'minWidth',
  minH: 'minHeight',
  maxW: 'maxWidth',
  maxH: 'maxHeight',
  rounded: 'borderRadius',
  shadow: 'boxShadow',
}

/**
 * 把 StyleProps 应用到 chain（组件库内部用）。
 *
 * 对每个 prop：
 *  - alias 形（p / px / mx / ...）→ 查 ALIAS_MAP 转 1-2 个真 CSS prop
 *  - 值是 `_xxx` token 形 → 走 chain 的 carrier token 路径
 *  - 否则字面值 → 走 fn(value)
 *
 * @example
 * applyStyleProps(chain, { p: '_md', bg: '_primary', rounded: 8 })
 */
export function applyStyleProps<T extends ThemeSchema>(
  chain: Chain<T>,
  props: StyleProps<T>,
): void {
  const propsRecord = props as Record<string, unknown>
  for (const key in propsRecord) {
    const value = propsRecord[key]
    if (value == null) continue
    const targets = ALIAS_MAP[key] ?? key
    const propNames = Array.isArray(targets) ? targets : [targets]

    for (const cssProp of propNames) {
      // 通过 carrier 走完整四态分派（token / keyword / fn）
      const carrier = (chain as unknown as Record<string, unknown>)[cssProp]
      if (typeof value === 'string' && value.startsWith('_')) {
        // token 路径：访问 _xxx 字段触发 token 命中
        ;(carrier as Record<string, unknown>)[value]
      } else if (typeof carrier === 'function') {
        ;(carrier as (v: unknown) => unknown)(value)
      } else {
        // 兜底：直接写 _node
        ;(chain as unknown as { _node: Record<string, unknown> })._node[cssProp] = value
      }
    }
  }
}

/**
 * W10.2 — 拿单 category 的 token union（修 C9 顺手）。
 *
 * @example
 * type ButtonColor = TokenOf<'color', DefaultSchema>  // '_primary' | '_danger' | ...
 * type ButtonGap = TokenOf<'spacing', DefaultSchema>  // '_xs' | '_sm' | '_md' | ...
 */
export type TokenOf<Cat extends keyof ThemeSchema, T extends ThemeSchema = DefaultSchema> =
  Cat extends 'color' ? ColorTokens<T> :
  Cat extends 'spacing' ? SpacingTokens<T> :
  Cat extends 'radius' ? RadiusTokens<T> :
  Cat extends 'shadow' ? ShadowTokens<T> :
  Cat extends 'fontSize' ? FontSizeTokens<T> :
  string
