/**
 * `presetAnimations` — 15 个组件库常用 keyframes 预设（全局 emotion 注册版本）。
 *
 * **S4 重构**：keyframes stops 定义抽到 `animation-defs.ts`；本模块仅"用全局 emotion
 * 注册"。多实例 SSR 场景请用 `createIcssInstance(emotion).presetAnimations`
 * （那个版本会注册到该 instance 的 emotion）。
 *
 * **副作用警示**：import 这个模块（或从主入口 import `presetAnimations`）会触发
 * 15 个 keyframes 注册到全局 emotion。如果不用预设动画，请勿 import。
 * `package.json` sideEffects 已精确标注本文件为 side-effectful，bundler 不会误裁。
 *
 * @example
 * import { presetAnimations, icss, defaultLight } from '@kenconnet666/zui-core'
 *
 * const cls = icss(defaultLight, s => {
 *   s.animationName(presetAnimations.fadeIn)
 *   s.animationDuration('300ms')
 *   s.animationFillMode('both')
 * })
 */

import { keyframes } from '@emotion/css'
import { PRESET_ANIMATION_DEFS, type PresetAnimationName } from './animation-defs'

type PresetAnimationsMap = Record<PresetAnimationName, string>

/** 把 PRESET_ANIMATION_DEFS 一次性注册到全局 emotion，返回 name 映射。 */
function registerAllPresetAnimations(): PresetAnimationsMap {
  const out = {} as PresetAnimationsMap
  for (const [name, stops] of Object.entries(PRESET_ANIMATION_DEFS) as Array<
    [PresetAnimationName, Record<string, object>]
  >) {
    out[name] = keyframes(stops as never)
  }
  return out
}

/**
 * 15 个组件库常用动画预设（注册到**全局** emotion）。
 *
 * 每个值是 emotion 注册后的 animation-name 字符串，直接传给 `s.animationName(...)`。
 *
 * 多实例 SSR 隔离：用 `createIcssInstance(emotion).presetAnimations` 获取注册到该
 * instance 的版本。
 */
export const presetAnimations: PresetAnimationsMap = registerAllPresetAnimations()

export type { PresetAnimationName }
