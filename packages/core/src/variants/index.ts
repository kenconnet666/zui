/**
 * `@kenconnet666/zui-core/variants` — 组件库 variants 系统 subpath 入口。
 *
 * 含：
 * - `defineVariants`：cva 风变体抽象（单 className）
 * - `defineParts`：多 slot 组件（Dialog / Tabs / Select 等）
 * - `composeVariants` / `extendVariants`：变体复合与继承
 * - `defineMixin`：可重用样式片段
 * - 所有相关类型工具：`VariantPropsOf` / `VariantPropsOfParts` / 等
 *
 * 与主入口 `@kenconnet666/zui-core` 重叠（主入口已 re-export），
 * subpath 版让用户在组件库代码里精确表达"只用 variants 系统"，bundler 可更激进
 * tree-shake。
 *
 * @example
 * import {
 *   defineVariants,
 *   defineParts,
 *   composeVariants,
 *   defineMixin,
 *   type VariantPropsOf,
 * } from '@kenconnet666/zui-core/variants'
 */

export { defineVariants } from './defineVariants'
export type {
  VariantOptions,
  VariantMap,
  VariantProps,
  CompoundVariant,
  DefineVariantsConfig,
  BoolFriendly,
} from './defineVariants'

export { defineMixin } from './defineMixin'

export { composeVariants, extendVariants } from './composeVariants'
export type { VariantPropsOf } from './composeVariants'

export { defineParts } from './defineParts'
export type {
  SlotFactory,
  PartsBase,
  PartsVariantValue,
  PartsVariantMap,
  PartsCompoundVariant,
  DefinePartsConfig,
  PartFactory,
  PartsResult,
  VariantPropsOfParts,
} from './defineParts'
