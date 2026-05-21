<script setup lang="ts">
/**
 * `ZIcon` —— 框架无关图标容器。**v2.1 极简版**。
 *
 * **设计要点**：
 * 1. **4 维度全离散**：size / color / depth / spin 都是枚举值，全走 `defineVariants`；
 *    无 dynamic styles / 无 applyResponsive / 无 token resolution。
 * 2. **完整 21 项 token**：所有外观（size 5 阶、6 种 color、5 阶 depth 领域词、5 阶 spin）
 *    都暴露为 `ComponentTokenRegistry.icon`，**ZConfigProvider 可全量覆盖**。
 * 3. **cssRoot factory 是逃生口**：任何不在 4 维度里的需求（hover / 媒体查询 / 任意 chain method）
 *    通过 `:css-root="s => { ... }"` 用 zui-core chain 自由写，在 variants 之后应用可覆盖任何属性。
 *    单节点目前只有 `cssRoot`；后续多 slot 组件会有 `cssHeader` / `cssBody` 等并列 prop。
 * 4. **图标库无关**：default slot 或 `:component` prop 双模式。
 *
 * **a11y**：
 * - 传 `label` → `aria-label` + `role="img"`
 * - 不传 → `aria-hidden="true"`
 *
 * **类型注**：组件层不再穿透 `<S>` 泛型。用户工程通过 module augmentation 扩
 * `ThemeSchema` 即可让 `:css-root` 回调里的 `Chain<ZuiSchema>` 获得自定义 token 的 IDE 补全。
 */
import { computed, type Component } from 'vue'
import {
  Chain,
  cx,
  icss,
  withComponentTokens,
  type ResolvedTheme} from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../../theme'
import { useZComponentTokens, useZTheme } from '../../provider'
import { createIconVariants } from './variants'
import { iconTokenDerivers } from './tokens'
import type { ZIconColor, ZIconDepth, ZIconSize, ZIconSpin } from './types'

const props = withDefaults(
  defineProps<{
    size?: ZIconSize
    color?: ZIconColor
    depth?: ZIconDepth
    spin?: ZIconSpin
    /**
     * 根元素 `font-size`（即"1em 等于多少"）。不传跟随父字号；
     * 传则用 inline style 写到根元素，覆盖 variants 内的 `font-size: Nem`，
     * 让 width/height 的 em 单位 resolved 到这个绝对值。
     */
    baseFontSize?: string
    cssRoot?: (s: Chain<ZuiSchema>) => void
    component?: Component
    tag?: string
    label?: string
  }>(),
  {
    size: 'middle',
    color: 'default',
    depth: 'none',
    spin: 'none',
    tag: 'i',
  },
)

defineSlots<{
  default(): unknown
}>()

// ─── 主题 + componentTokens 覆盖派生 ───
const theme = useZTheme()
const overrides = useZComponentTokens()
const themed = computed<ResolvedTheme<ZuiSchema>>(() =>
  withComponentTokens(theme.value, iconTokenDerivers, overrides.value) as ResolvedTheme<ZuiSchema>,
)

// ─── 离散 variants（4 维度全离散）───
// 注：**不**走 `useVariants` —— 那个 composable 内部用 raw `useZTheme()`，绕过 Provider 覆盖。
const variantsCls = computed(() =>
  createIconVariants(themed.value)({
    size: props.size,
    color: props.color,
    depth: props.depth,
    spin: props.spin,
  }),
)

// ─── 用户精细覆盖：用 zui-core chain 自由写 ───
const cssRootCls = computed(() => (props.cssRoot ? icss(themed.value, props.cssRoot) : ''))

const className = computed(() => cx(variantsCls.value, cssRootCls.value))

// ─── a11y 属性 ───
const a11y = computed(() => {
  if (props.label !== undefined && props.label !== '') {
    return { 'aria-label': props.label, role: 'img' }
  }
  return { 'aria-hidden': 'true' }
})

// ─── baseFontSize → inline style（不传时不写 style） ───
const rootStyle = computed(() =>
  props.baseFontSize !== undefined && props.baseFontSize !== ''
    ? { fontSize: props.baseFontSize }
    : undefined,
)
</script>

<template>
  <component :is="tag" :class="className" :style="rootStyle" v-bind="a11y">
    <slot>
      <component :is="component" v-if="component" />
    </slot>
  </component>
</template>
