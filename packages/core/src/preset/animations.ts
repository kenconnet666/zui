/**
 * `presetAnimations` — 15 个组件库常用 keyframes 预设。
 *
 * 每个名字通过 `ikeyframes` 注册到 emotion，返回 emotion 内部的 animation-name 字符串。
 * emotion 按内容 hash，多次注册同样 keyframes 不会重复注入 DOM。
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

import { ikeyframes } from '../ikeyframes'

// ── Fade ────────────────────────────────────────────────────────────────

const fadeIn = ikeyframes(k => {
  k.from({ opacity: 0 })
  k.to({ opacity: 1 })
})

const fadeOut = ikeyframes(k => {
  k.from({ opacity: 1 })
  k.to({ opacity: 0 })
})

// ── Slide ───────────────────────────────────────────────────────────────

const slideInUp = ikeyframes(k => {
  k.from({ transform: 'translateY(100%)', opacity: 0 })
  k.to({ transform: 'translateY(0)', opacity: 1 })
})

const slideInDown = ikeyframes(k => {
  k.from({ transform: 'translateY(-100%)', opacity: 0 })
  k.to({ transform: 'translateY(0)', opacity: 1 })
})

const slideInLeft = ikeyframes(k => {
  k.from({ transform: 'translateX(-100%)', opacity: 0 })
  k.to({ transform: 'translateX(0)', opacity: 1 })
})

const slideInRight = ikeyframes(k => {
  k.from({ transform: 'translateX(100%)', opacity: 0 })
  k.to({ transform: 'translateX(0)', opacity: 1 })
})

const slideOutDown = ikeyframes(k => {
  k.from({ transform: 'translateY(0)', opacity: 1 })
  k.to({ transform: 'translateY(100%)', opacity: 0 })
})

// ── Scale / Zoom ────────────────────────────────────────────────────────

const scaleIn = ikeyframes(k => {
  k.from({ transform: 'scale(0.95)', opacity: 0 })
  k.to({ transform: 'scale(1)', opacity: 1 })
})

const scaleOut = ikeyframes(k => {
  k.from({ transform: 'scale(1)', opacity: 1 })
  k.to({ transform: 'scale(0.95)', opacity: 0 })
})

const zoomIn = ikeyframes(k => {
  k.from({ transform: 'scale(0)', opacity: 0 })
  k.to({ transform: 'scale(1)', opacity: 1 })
})

// ── 强调 / 循环 ─────────────────────────────────────────────────────────

const spin = ikeyframes(k => {
  k.from({ transform: 'rotate(0deg)' })
  k.to({ transform: 'rotate(360deg)' })
})

const pulse = ikeyframes(k => {
  k.at('0%', { opacity: 1 })
  k.at('50%', { opacity: 0.5 })
  k.at('100%', { opacity: 1 })
})

const bounce = ikeyframes(k => {
  k.at('0%', { transform: 'translateY(0)' })
  k.at('25%', { transform: 'translateY(-25%)' })
  k.at('50%', { transform: 'translateY(0)' })
  k.at('75%', { transform: 'translateY(-12%)' })
  k.at('100%', { transform: 'translateY(0)' })
})

const ping = ikeyframes(k => {
  k.at('75%, 100%', { transform: 'scale(2)', opacity: 0 })
})

const shake = ikeyframes(k => {
  k.at('0%, 100%', { transform: 'translateX(0)' })
  k.at('10%, 30%, 50%, 70%, 90%', { transform: 'translateX(-4px)' })
  k.at('20%, 40%, 60%, 80%', { transform: 'translateX(4px)' })
})

/**
 * 15 个组件库常用动画预设。每个值是 emotion 注册后的 animation-name 字符串，
 * 直接传给 `s.animationName(...)` 使用。
 */
export const presetAnimations = {
  // Fade
  fadeIn,
  fadeOut,
  // Slide
  slideInUp,
  slideInDown,
  slideInLeft,
  slideInRight,
  slideOutDown,
  // Scale / Zoom
  scaleIn,
  scaleOut,
  zoomIn,
  // 强调 / 循环
  spin,
  pulse,
  bounce,
  ping,
  shake,
} as const

/** 预设动画名称的字符串字面量 union（用于类型层约束）。 */
export type PresetAnimationName = keyof typeof presetAnimations
