import type { CSSObject } from '@emotion/css/create-instance'

/**
 * 预设动画的 keyframes stops 定义（与具体 emotion 实例解耦）。
 *
 * `preset/animations.ts` 用全局 emotion 注册成 `presetAnimations`；
 * `createIcssInstance` 用 instance.keyframes 重新注册一份，
 * 让 SSR 多实例隔离时预设动画也走该 instance。
 *
 * **S4 重构**：之前 keyframes 在 module body 顶层 eager 注册到全局，
 * 现在 stops 是纯数据，注册时机由消费者控制。
 */

/** 单个 keyframes 的 stops 表（`{ from: {...}, to: {...} }` 形式，或多个百分比 stop）。 */
export type KeyframeStops = Record<string, CSSObject>

/** 15 个预设动画的 stops 定义。 */
export const PRESET_ANIMATION_DEFS = {
  // ── Fade ──────────────────────────────────────────────────────────
  fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
  fadeOut: { from: { opacity: 1 }, to: { opacity: 0 } },

  // ── Slide ─────────────────────────────────────────────────────────
  slideInUp: {
    from: { transform: 'translateY(100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideInDown: {
    from: { transform: 'translateY(-100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideInLeft: {
    from: { transform: 'translateX(-100%)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
  slideInRight: {
    from: { transform: 'translateX(100%)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
  slideOutDown: {
    from: { transform: 'translateY(0)', opacity: 1 },
    to: { transform: 'translateY(100%)', opacity: 0 },
  },

  // ── Scale / Zoom ──────────────────────────────────────────────────
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
  scaleOut: {
    from: { transform: 'scale(1)', opacity: 1 },
    to: { transform: 'scale(0.95)', opacity: 0 },
  },
  zoomIn: {
    from: { transform: 'scale(0)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },

  // ── 强调 / 循环 ───────────────────────────────────────────────────
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  pulse: {
    '0%': { opacity: 1 },
    '50%': { opacity: 0.5 },
    '100%': { opacity: 1 },
  },
  bounce: {
    '0%': { transform: 'translateY(0)' },
    '25%': { transform: 'translateY(-25%)' },
    '50%': { transform: 'translateY(0)' },
    '75%': { transform: 'translateY(-12%)' },
    '100%': { transform: 'translateY(0)' },
  },
  ping: {
    '75%, 100%': { transform: 'scale(2)', opacity: 0 },
  },
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
  },
} as const satisfies Record<string, KeyframeStops>

/** 预设动画名称的字符串字面量 union。 */
export type PresetAnimationName = keyof typeof PRESET_ANIMATION_DEFS
