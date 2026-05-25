import type { Chain } from '@kenconnet666/zui-core'
import type { ResolvedTheme } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import { themeColorScheme } from './colorScheme'

/**
 * 将统一的无布局偏移滚动条样式写入 Chain。
 *
 * 行为：
 * - 原生滚动条完全隐藏（`scrollbar-width: none` + webkit），**不占任何布局宽度**
 * - 不影响 `overflow` 属性（调用者自行设置 `s.overflow.auto` / `s.overflowY.auto`）
 *
 * 注：此函数仅隐藏原生滚动条，不提供自定义可视 thumb。
 * 需要悬浮半透明 thumb 的场景请直接使用 `<ZScrollbar>` 组件。
 */
export function applyScrollbarStyles(
  s: Chain<ZuiSchema>,
  theme: ResolvedTheme<ZuiSchema>,
): void {
  const dark = themeColorScheme(theme) === 'dark'
  void dark // 保留参数签名兼容性

  // 隐藏原生滚动条——不占布局空间
  s._prop('scrollbarWidth', 'none')
  s._prop('msOverflowStyle', 'none')
  s._selector('&::-webkit-scrollbar', (sb) => {
    sb._prop('display', 'none')
  })
}
