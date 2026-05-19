<script setup lang="ts" generic="S extends ThemeSchema = ThemeSchema">
/**
 * `ZIcon` —— 框架无关图标容器。
 *
 * **设计要点**：
 * 1. **图标库无关**：通过 default slot **或** `component` prop 接收任意 SVG / `@vicons/*` /
 *    自定义图标组件。两种模式可任选其一保持代码风格统一；同时给时 slot 优先。
 * 2. **完整 12 项 token**：所有外观（默认色、默认尺寸、5 阶 depth opacity、4 种 intent 色、
 *    spin duration）都由 `ComponentTokenRegistry.icon` 暴露，**ZConfigProvider 可全量覆盖**。
 * 3. **离散 × 连续解耦**：intent / depth → variants 工厂；size / color / spin → dynamic styles。
 *    主题切换时 variants 工厂会被 useVariants 重新调用，emotion 自动按内容 hash 复用 className。
 * 4. **响应式**：size / color 支持 `{ base, _tiny, _small, _middle, _large, _huge }` 响应式对象，
 *    通过 `applyResponsive` 展开成 media query。
 *
 * **a11y**：
 * - 传 `label` → `aria-label` + `role="img"`
 * - 不传 `label` → `aria-hidden="true"`（默认装饰性图标）
 *
 * @example
 * // slot 模式
 * <ZIcon size="24" intent="danger" :label="'删除'">
 *   <TrashOutline />
 * </ZIcon>
 *
 * @example
 * // component prop 模式
 * <ZIcon :component="HomeOutline" :size="{ base: 16, _middle: 24 }" />
 *
 * @example
 * // loading 旋转
 * <ZIcon :component="ReloadOutline" spin />
 */
import { computed, type Component } from 'vue'
import {
  Chain,
  applyResponsive,
  cx,
  presetAnimations,
  toClassName,
  withComponentTokens,
  type ResolvedTheme,
  type ResponsiveValue,
  type ThemeSchema,
} from '@kenconnet666/zui-core'
import { useZComponentTokens, useZTheme } from '../../provider'
import { createIconVariants } from './variants'
import { iconTokenDerivers } from './tokens'
import type { ZIconDepth, ZIconIntent, ZIconSize, ZIconColor, ZIconSpin } from './types'

const props = withDefaults(
  defineProps<{
    size?: ZIconSize
    color?: ZIconColor
    intent?: ZIconIntent
    depth?: ZIconDepth
    spin?: ZIconSpin
    component?: Component
    tag?: string
    label?: string
  }>(),
  {
    intent: 'default',
    depth: 'none',
    spin: false,
    tag: 'i',
  },
)

defineSlots<{
  default(): unknown
}>()

// ─── 主题 + componentTokens 覆盖派生 ───
const theme = useZTheme<S>()
const overrides = useZComponentTokens()
const themed = computed<ResolvedTheme<S>>(() =>
  withComponentTokens(theme.value, iconTokenDerivers, overrides.value) as ResolvedTheme<S>,
)

// ─── 离散 variants（intent × depth）───
// 注：**不**走 `useVariants` —— 那个 composable 内部用 raw `useZTheme()`，
// 会绕过 `withComponentTokens` 注入的 icon override。必须用 `themed.value` 才能让
// Provider componentTokens 覆盖生效。
const variantsFn = computed(() => createIconVariants<S>(themed.value))
const variantsCls = computed(() =>
  variantsFn.value({ intent: props.intent, depth: props.depth }),
)

// ─── 解析 color token 引用：'_primary' → theme.color.primary ───
function resolveColorRef(value: string, t: ResolvedTheme<S>): string {
  if (!value.startsWith('_')) return value
  const key = value.slice(1)
  const slot = (t as unknown as { color?: Record<string, string | number> }).color
  const v = slot?.[key]
  return typeof v === 'string' || typeof v === 'number' ? String(v) : value
}

// ─── 把 number / string size 归一化为 CSS length 字符串 ───
function toLength(v: string | number): string {
  return typeof v === 'number' ? `${v}px` : v
}

// ─── 读 spin duration token（fallback '1s'）───
function readSpinDuration(t: ResolvedTheme<S>): string {
  const slot = (t as unknown as { color?: Record<string, string | number> }).color
  const v = slot?.iconSpinDuration
  return typeof v === 'string' || typeof v === 'number' ? String(v) : '1s'
}

// ─── 连续维度 dynamic styles（size / color / spin）───
const dynamicCls = computed(() => {
  const t = themed.value
  const c = new Chain<S>(t)

  // size —— 覆盖 base 的 defaultSize
  if (props.size !== undefined) {
    applyResponsive<S, string | number>(c, props.size as ResponsiveValue<string | number>, (s, v) => {
      const len = toLength(v)
      s.width(len)
      s.height(len)
      s.fontSize(len)
    })
  }

  // color —— 覆盖 base / intent 的颜色（优先级最高）
  if (props.color !== undefined) {
    applyResponsive<S, string>(c, props.color as ResponsiveValue<string>, (s, v) => {
      s.color(resolveColorRef(v, t))
    })
  }

  // spin —— 旋转动画
  if (props.spin !== false && props.spin !== undefined) {
    const dur =
      props.spin === true
        ? readSpinDuration(t)
        : typeof props.spin === 'number'
          ? `${props.spin}s`
          : props.spin
    c.animationName(presetAnimations.spin)
    c.animationDuration(dur)
    c.animationIterationCount('infinite')
    c.animationTimingFunction('linear')
  }

  return toClassName(c)
})

const className = computed(() => cx(variantsCls.value, dynamicCls.value))

// ─── a11y 属性 ───
const a11y = computed(() => {
  if (props.label !== undefined && props.label !== '') {
    return { 'aria-label': props.label, role: 'img' }
  }
  return { 'aria-hidden': 'true' }
})

</script>

<template>
  <component :is="tag" :class="className" v-bind="a11y">
    <slot>
      <component :is="component" v-if="component" />
    </slot>
  </component>
</template>
