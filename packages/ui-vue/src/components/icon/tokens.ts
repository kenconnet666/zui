/**
 * `ZIcon` —— Component Token 注册 + 默认 deriver。
 *
 * 用法：在 root 应用类型增量声明里 import 本文件（通过 import side-effect），
 * 即可让 `interface ComponentTokenRegistry` 多一条 `icon` namespace。
 *
 * 通过 `withComponentTokens(theme, iconTokenDerivers, overrides)` 把 token 派生
 * + 用户 ZConfigProvider override 合并到 theme.color flatten 命名空间：
 *
 * - `theme.color.iconDefaultColor`
 * - `theme.color.iconDepth1Opacity` ... `iconDepth5Opacity`
 * - `theme.color.iconSuccessColor` / `iconWarningColor` / `iconDangerColor` / `iconInfoColor`
 *
 * Chain 内通过 `_iconXxx` 命中 token 访问。
 */

import type {
  ComponentTokenDerivers,
  ResolvedTheme,
  ThemeSchema,
} from '@kenconnet666/zui-core'

/**
 * ZIcon 完整 token 集（12 项）—— 哲学：尽量在组件级 token 里"画完整像素"，
 * 用户改 Provider 就能定制全部表现，无须修组件源码。
 */
export interface ZIconTokens {
  /** 默认颜色（`color` prop / `intent` 都没传时用）。默认 `'currentColor'`。 */
  defaultColor: string
  /** 默认尺寸（`size` prop 没传时用）。默认 `'1em'`。 */
  defaultSize: string
  /** 旋转动画一个周期。默认 `'1s'`。 */
  spinDuration: string

  /** depth='1' 对应 opacity 值。默认 `'1'`（最显著）。 */
  depth1Opacity: string
  /** depth='2'。默认 `'0.8'`。 */
  depth2Opacity: string
  /** depth='3'。默认 `'0.6'`。 */
  depth3Opacity: string
  /** depth='4'。默认 `'0.4'`。 */
  depth4Opacity: string
  /** depth='5'。默认 `'0.2'`（最弱）。 */
  depth5Opacity: string

  /** intent='success' 对应的颜色。默认 `theme.color.success`。 */
  successColor: string
  /** intent='warning'。默认 `theme.color.warning`。 */
  warningColor: string
  /** intent='danger'。默认 `theme.color.danger`。 */
  dangerColor: string
  /** intent='info'。默认 `theme.color.info`。 */
  infoColor: string
}

declare module '@kenconnet666/zui-core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ComponentTokenRegistry {
    icon: ZIconTokens
  }
}

/**
 * 派生默认 ZIcon tokens：颜色绑当前 theme 语义色，opacity 写死 5 阶。
 *
 * 该函数从 theme.color 安全读 `success / warning / danger / info`（用 `as Record`
 * 软读，避免 user 自定义 schema 缺这些 key 时编译报错；缺失时回落硬编码 fallback）。
 */
export function deriveIconTokens<S extends ThemeSchema>(
  theme: ResolvedTheme<S>,
): ZIconTokens {
  const colorSlot = (theme as unknown as { color?: Record<string, string | number> }).color
  const read = (key: string, fallback: string): string => {
    const v = colorSlot?.[key]
    return typeof v === 'string' || typeof v === 'number' ? String(v) : fallback
  }
  return {
    defaultColor: 'currentColor',
    defaultSize: '1em',
    spinDuration: '1s',
    depth1Opacity: '1',
    depth2Opacity: '0.8',
    depth3Opacity: '0.6',
    depth4Opacity: '0.4',
    depth5Opacity: '0.2',
    successColor: read('success', '#22c55e'),
    warningColor: read('warning', '#f59e0b'),
    dangerColor: read('danger', '#ef4444'),
    infoColor: read('info', '#06b6d4'),
  }
}

/**
 * 直接喂给 `withComponentTokens` 的 derivers 对象。
 *
 * @example
 * import { withComponentTokens } from '@kenconnet666/zui-core'
 * import { iconTokenDerivers } from '@kenconnet666/zui-vue'
 *
 * const themed = withComponentTokens(theme.value, iconTokenDerivers, overrides.value)
 */
export const iconTokenDerivers = {
  icon: deriveIconTokens,
} satisfies ComponentTokenDerivers<ThemeSchema>
