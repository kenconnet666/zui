/**
 * @kenconnet666/zui-vue — Vue 3 集成层。
 *
 * Phase 1-2 主战场在 `@kenconnet666/zui-core`，此包先空置。
 * Phase 3 起将加入：
 *   - `ZThemeProvider.vue` — 主题注入组件
 *   - `useIcss()` — composable
 *   - 基础 Vue 组件（Btn 等）
 *
 * 暂时只做 re-export，避免空包发布时下游消费报错。
 */
export {
  Theme,
  Chain,
  icss,
  toClassName,
  mergeTheme,
  resolveTheme,
  defaultLight,
  defaultDark,
} from '@kenconnet666/zui-core'

export type { ThemeSchema, ResolvedTheme, DeepPartial } from '@kenconnet666/zui-core'
