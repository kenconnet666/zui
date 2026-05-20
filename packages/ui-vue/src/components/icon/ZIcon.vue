<script setup lang="ts" generic="S extends ThemeSchema = ThemeSchema">
/**
 * `ZIcon` —— 框架无关图标容器。**v2.1 极简版**。
 *
 * **设计要点**：
 * 1. **4 维度全离散**：size / color / depth / spin 都是枚举值，全走 `defineVariants`；
 *    无 dynamic styles / 无 applyResponsive / 无 token resolution。
 * 2. **完整 21 项 token**：所有外观（size 5 阶、6 种 color、5 阶 depth 领域词、5 阶 spin）
 *    都暴露为 `ComponentTokenRegistry.icon`，**ZConfigProvider 可全量覆盖**。
 * 3. **css factory 是逃生口**：任何不在 4 维度里的需求（hover / 媒体查询 / 任意 chain method）
 *    通过 `:css="s => { ... }"` 用 zui-core chain 自由写，在 variants 之后应用可覆盖任何属性。
 * 4. **图标库无关**：default slot 或 `:component` prop 双模式。
 *
 * **a11y**：
 * - 传 `label` → `aria-label` + `role="img"`
 * - 不传 → `aria-hidden="true"`
 */
import { computed, type Component } from 'vue'
import {
  Chain,
  cx,
  toClassName,
  withComponentTokens,
  type ResolvedTheme,
  type ThemeSchema,
} from '@kenconnet666/zui-core'
import { useZComponentTokens, useZTheme } from '../../provider'
import { createIconVariants } from './variants'
import { iconTokenDerivers } from './tokens'
import type { ZIconColor, ZIconDepth, ZIconSize, ZIconSpin, ZIconSpinPreset } from './types'

const props = withDefaults(
  defineProps<{
    size?: ZIconSize
    color?: ZIconColor
    depth?: ZIconDepth
    spin?: ZIconSpin
    css?: (s: Chain<S>) => void
    component?: Component
    tag?: string
    label?: string
  }>(),
  {
    size: 'middle',
    color: 'default',
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

// ─── spin 归一化：false → 'none'；true → 'middle'；string 原样 ───
const spinKey = computed<'none' | ZIconSpinPreset>(() => {
  const v = props.spin
  if (v === false || v === undefined) return 'none'
  if (v === true) return 'middle'
  return v
})

// ─── 离散 variants（4 维度全离散）───
// 注：**不**走 `useVariants` —— 那个 composable 内部用 raw `useZTheme()`，绕过 Provider 覆盖。
const variantsCls = computed(() =>
  createIconVariants<S>(themed.value)({
    size: props.size,
    color: props.color,
    depth: props.depth,
    spin: spinKey.value,
  }),
)

// ─── 用户精细覆盖：用 zui-core chain 自由写 ───
const cssCls = computed(() => {
  if (!props.css) return ''
  const c = new Chain<S>(themed.value)
  props.css(c)
  return toClassName(c)
})

const className = computed(() => cx(variantsCls.value, cssCls.value))

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
