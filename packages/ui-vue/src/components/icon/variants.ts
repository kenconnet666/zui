/**
 * `ZIcon` —— 离散维度 variants（intent × depth）。
 *
 * 工厂模式：导出 `createIconVariants(theme)`，**不导出常量**。
 * ZConfigProvider 嵌套切主题时 useVariants 会重新调工厂、emotion 自动按内容 hash 复用类名。
 *
 * **token 读取**：`withComponentTokens` 把所有 component token flatten 到 `theme.color`
 * 命名空间（`iconDefaultSize` / `iconDepth1Opacity` 等）。本工厂从 `theme.color.iconXxx`
 * 直接读字面量值，再喂给对应 chain method —— 比走 `_iconXxx` token 访问跨 carrier 类别更稳。
 */
import { defineVariants, type ResolvedTheme, type ThemeSchema } from '@kenconnet666/zui-core'

interface ReadIconTokensResult {
  defaultColor: string
  defaultSize: string
  depth1: number
  depth2: number
  depth3: number
  depth4: number
  depth5: number
  successColor: string
  warningColor: string
  dangerColor: string
  infoColor: string
}

/**
 * 从 `theme.color` 读出 11 项 icon token，缺失时用 deriveIconTokens 的硬编码 fallback。
 */
function readIconTokens<S extends ThemeSchema>(theme: ResolvedTheme<S>): ReadIconTokensResult {
  const slot = (theme as unknown as { color?: Record<string, string | number> }).color ?? {}
  const read = (key: string, fallback: string): string => {
    const v = slot[key]
    return typeof v === 'string' || typeof v === 'number' ? String(v) : fallback
  }
  const readNum = (key: string, fallback: number): number => {
    const v = slot[key]
    if (typeof v === 'number') return v
    if (typeof v === 'string') {
      const n = parseFloat(v)
      if (!Number.isNaN(n)) return n
    }
    return fallback
  }
  return {
    defaultColor: read('iconDefaultColor', 'currentColor'),
    defaultSize: read('iconDefaultSize', '1em'),
    depth1: readNum('iconDepth1Opacity', 1),
    depth2: readNum('iconDepth2Opacity', 0.8),
    depth3: readNum('iconDepth3Opacity', 0.6),
    depth4: readNum('iconDepth4Opacity', 0.4),
    depth5: readNum('iconDepth5Opacity', 0.2),
    successColor: read('iconSuccessColor', '#22c55e'),
    warningColor: read('iconWarningColor', '#f59e0b'),
    dangerColor: read('iconDangerColor', '#ef4444'),
    infoColor: read('iconInfoColor', '#06b6d4'),
  }
}

/**
 * 派生 ZIcon 的 variants 工厂。
 *
 * 维度：
 * - `intent`: `default / success / warning / danger / info`
 *   - `default` 不应用语义色（由 `color` prop 或 `iconDefaultColor` 决定）
 * - `depth`: `none / '1' / '2' / '3' / '4' / '5'`（5 阶 + none）
 *   - `none` 不应用 opacity
 *
 * base 样式：
 * - `inline-flex` + 居中 —— 让图标在文本中自然对齐
 * - `flex-shrink: 0` —— 防止在弹性容器内被压扁
 * - `line-height: 1` —— 抵消 inherit 的行高
 * - 默认 color / size 由 token 注入（可被 Provider 覆盖）
 *
 * `size` / `color` / `spin` 是连续维度，**不在** variants 内处理，由 ZIcon.vue 的 dynamic styles 负责。
 */
export function createIconVariants<S extends ThemeSchema = ThemeSchema>(theme: ResolvedTheme<S>) {
  const t = readIconTokens(theme)
  return defineVariants(theme, {
    base: (s) => {
      s.display('inline-flex')
      s.alignItems('center')
      s.justifyContent('center')
      s.flexShrink(0)
      s.lineHeight(1)
      s.color(t.defaultColor)
      s.width(t.defaultSize)
      s.height(t.defaultSize)
      s.fontSize(t.defaultSize)
    },
    variants: {
      intent: {
        default: () => {
          /* 不应用语义色 */
        },
        success: (s) => {
          s.color(t.successColor)
        },
        warning: (s) => {
          s.color(t.warningColor)
        },
        danger: (s) => {
          s.color(t.dangerColor)
        },
        info: (s) => {
          s.color(t.infoColor)
        },
      },
      depth: {
        none: () => {
          /* 不应用 opacity */
        },
        '1': (s) => {
          s.opacity(t.depth1)
        },
        '2': (s) => {
          s.opacity(t.depth2)
        },
        '3': (s) => {
          s.opacity(t.depth3)
        },
        '4': (s) => {
          s.opacity(t.depth4)
        },
        '5': (s) => {
          s.opacity(t.depth5)
        },
      },
    },
    defaultVariants: { intent: 'default', depth: 'none' },
  })
}
