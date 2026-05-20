export { paletteLight } from './palette-light'
export { paletteDark } from './palette-dark'
export type { BaseSchema } from './schema'
export {
  tw,
  TAILWIND_PALETTE,
  FLAT_PALETTE,
  PALETTE_NAMES,
  PALETTE_SHADES,
  flattenPalette,
} from './palette'

// 注：core 不预填 semantic 色 / 5 阶 size scale 等设计系统 token。
// 设计系统层（含 11 semantic 色、spacing/radius/fontSize/shadow/blur/duration/
// breakpoint/easing/fontWeight/zIndex/lineHeight/letterSpacing/opacity/aspectRatio
// 等）由 ui-vue 的 `ZuiSchema` + `zuiLight` / `zuiDark` 承载。
//
// 业务侧消费推荐：`import { zuiLight } from '@kenconnet666/zui-vue'`
//
// 仅 palette 场景（少见）：`import { paletteLight } from '@kenconnet666/zui-core'`
