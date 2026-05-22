/**
 * `@kenconnet666/zui-vue/theme` —— 设计系统层入口。
 *
 * 暴露：
 * - `ZuiSchema` —— 业务侧标准 schema（含 semantic + 5 阶 + 命名 scale）
 * - `SemanticColorTokens` —— 11 个语义色 key union
 * - `zuiLight` / `zuiDark` —— 完整 Theme 实例
 */
export { zuiLight } from './zui-light'
export { zuiDark } from './zui-dark'
export type { ZuiSchema, SemanticColorTokens } from './schema'

// 用户扩展锚点（13 个）—— 用户在自家 zui.d.ts `declare module` augmentation 即扩展 ZuiSchema
export type {
  UserColorExt,
  UserSpacingExt,
  UserRadiusExt,
  UserFontSizeExt,
  UserFontWeightExt,
  UserShadowExt,
  UserBlurExt,
  UserDurationExt,
  UserEasingExt,
  UserBreakpointExt,
  UserZIndexExt,
  UserOpacityExt,
  UserLineHeightExt,
  UserLetterSpacingExt,
  UserAspectRatioExt,
  UserFontsExt,
  UserSizesExt,
  UserBordersExt,
  UserTransitionPropertyExt,
} from './schema'
