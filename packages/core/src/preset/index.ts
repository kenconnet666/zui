/**
 * `preset` — 预设资源聚合（内部模块，经主入口 `@kenconnet666/zui-core` re-export）。
 *
 * 含：
 * - `presetAnimations`：15 个常用 keyframes（fadeIn / spin / pulse 等）
 * - `PRESET_ANIMATION_DEFS` / `PresetAnimationName`：底层 stops 数据 + 类型
 * - `PREFLIGHT_STYLES`：normalize 风全局 reset 样式对象
 *
 * @example
 * import { presetAnimations } from '@kenconnet666/zui-core'
 * icss(theme, s => { s.animationName(presetAnimations.fadeIn) })
 */

export { presetAnimations } from './animations'
export type { PresetAnimationName } from './animations'
export { PRESET_ANIMATION_DEFS } from './animation-defs'
export type { KeyframeStops } from './animation-defs'
export { PREFLIGHT_STYLES } from './preflightStyles'
