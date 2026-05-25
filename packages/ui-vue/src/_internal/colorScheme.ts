import type { ResolvedTheme } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

/**
 * 从已解析主题的 `color.bg` 亮度判断是否为暗色主题。
 * 用于需要手动设置 CSS `color-scheme` 属性的场合（ZBox 根元素、Teleport 浮层等）。
 */
export function themeColorScheme(theme: ResolvedTheme<ZuiSchema>): 'dark' | 'light' {
  const bg = (theme.color as Record<string, string> | undefined)?.bg
  if (!bg || !bg.startsWith('#')) return 'light'
  const hex = bg.replace('#', '')
  if (hex.length < 6) return 'light'
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5 ? 'dark' : 'light'
}
