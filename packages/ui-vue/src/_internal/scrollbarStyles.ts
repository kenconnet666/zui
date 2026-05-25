import type { Chain } from '@kenconnet666/zui-core'
import type { ResolvedTheme } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import { themeColorScheme } from './colorScheme'

/**
 * 将统一的 overlay 自动隐藏滚动条样式写入 Chain。
 *
 * 行为：
 * - 默认不显示滚动条（容器内容可滚动但滚动条透明）
 * - 鼠标进入容器或容器内有焦点时显示半透明细滚动条
 * - 滚动条以 overlay 模式悬浮在内容上方，不占布局空间（Chrome/Edge）
 * - Firefox 走 `scrollbar-width: thin` + `scrollbar-color`
 *
 * 调用者仍需在自己的 chain 里设置 `s.overflow.auto`（或 `s.overflowY.auto`）。
 * 本函数在其后追加 `overflow: overlay` 覆盖，使 Chrome/Edge 走浮层模式。
 */
export function applyScrollbarStyles(
  s: Chain<ZuiSchema>,
  theme: ResolvedTheme<ZuiSchema>,
): void {
  const dark = themeColorScheme(theme) === 'dark'
  const thumb = dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)'
  const thumbHover = dark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.42)'

  // Chrome/Edge: overlay（不占位）；Firefox/其他：fallback 到已有的 overflow:auto
  s._prop('overflow', 'overlay')

  // ── Firefox ──────────────────────────────────────────────────────────
  s._prop('scrollbar-width', 'thin')
  s._prop('scrollbar-color', 'transparent transparent')
  s._selector('&:hover, &:focus-within', (h) => {
    h._prop('scrollbar-color', `${thumb} transparent`)
  })

  // ── WebKit / Blink ────────────────────────────────────────────────────
  s._selector('&::-webkit-scrollbar', (sb) => {
    sb._prop('width', '6px')
    sb._prop('height', '6px')
  })
  s._selector('&::-webkit-scrollbar-track', (t) => {
    t._prop('background', 'transparent')
  })
  s._selector('&::-webkit-scrollbar-thumb', (b) => {
    b._prop('background', 'transparent')
    b._prop('border-radius', '3px')
    b._prop('transition', 'background 150ms')
  })
  s._selector('&:hover::-webkit-scrollbar-thumb, &:focus-within::-webkit-scrollbar-thumb', (b) => {
    b._prop('background', thumb)
  })
  s._selector('&:hover::-webkit-scrollbar-thumb:hover', (b) => {
    b._prop('background', thumbHover)
  })
}
