/**
 * `@kenconnet666/zui-vue/components/icon` —— ZIcon 子入口。
 *
 * 暴露：
 * - `ZIcon` 组件
 * - `createIconVariants` —— 工厂，可被 `extendVariants(theme, parent, ...)` 继承扩展
 * - `iconTokenDerivers` / `deriveIconTokens` —— 默认 token 派生器
 * - `ZIconTokens` —— component token 接口（已用 declaration merging 注册到 ComponentTokenRegistry）
 * - 各类型
 */
export { default as ZIcon } from './ZIcon.vue'
export { createIconVariants } from './variants'
export { deriveIconTokens, iconTokenDerivers, type ZIconTokens } from './tokens'
export type {
  ZIconProps,
  ZIconSize,
  ZIconColor,
  ZIconDepth,
  ZIconSpin,
  ZIconSpinPreset,
} from './types'
