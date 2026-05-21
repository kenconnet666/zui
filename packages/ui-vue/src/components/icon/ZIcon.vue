<script lang="ts">
/**
 * `ZIcon` —— 框架无关图标容器。ui-vue 设计哲学五件套（skill §13.0）的首个参照实现。
 *
 * **单文件 SFC + 双 `<script>` 块**：
 * - `<script>`（本块）：模块级出口 —— props/token 接口、`declare module` 注册、deriver
 * - `<script setup>`：组件运行时 —— setup 逻辑 + 一个 `icss` chain factory 内联全部维度
 *
 * **极简组件 = 直接 icss 内联，不上 `defineVariants`**：4 个维度都是"枚举 → 几行 CSS"
 * 的简单映射，没有 hover/focus/disabled 等多状态组合。setup 内一个 `icss(themed.value, s => {...})`
 * 一气呵成，比"createVariants 工厂 + cx 拼接"少一层间接。
 * 复杂组件（Button / Input / Dialog —— 含 hover/focus/disabled/active 状态笛卡尔积）
 * 仍用 `defineVariants` / `defineParts`，见 skill §13.0 实现选择。
 *
 * **设计要点**：
 * 1. **离散预设 · 无连续输入** — size / color / depth / spin 4 维度全枚举（默认值齐全）。
 *    props union 内联在 `ZIconProps` 字段处，不抽 `ZIconSize` 等中间子类型 alias。
 * 2. **em 优先 · 跟随父字号** — 5 阶 size 用 em 倍率（`tiny=0.75` → `huge=1.5`），
 *    物理尺寸 = N × 父字号。用户调"1em 等于多少"走 `:css-root="s => s.fontSize.px(N)"`。
 * 3. **cssRoot 是唯一逃生口** — 在 base + 维度之后调用，可覆盖任何属性 / 写 `_hover` /
 *    媒体查询 / 任意 chain method。多 slot 组件预留 `cssHeader` / `cssBody` 等并列 prop。
 * 4. **完整 21 项 token · Provider 可全量覆盖** — `ComponentTokenRegistry.icon` 暴露
 *    size 5 + color 6 + depth 5 + spin 5，可被 `<ZConfigProvider :component-tokens>` 嵌套覆盖。
 * 5. **图标库无关** — default slot 或 `:component` prop 双模式。
 *
 * **a11y**：传 `label` → `aria-label` + `role="img"`；不传 → `aria-hidden="true"`。
 */
import type { Component } from 'vue'
import type { ComponentTokenDerivers, ResolvedTheme } from '@kenconnet666/zui-core'
import {
  Chain,
  componentTokensFor,
  icss,
  presetAnimations,
  withComponentTokens,
} from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../../theme'

// ═══════════════════════════════════════════════════════════════════════
// 公开类型
// ═══════════════════════════════════════════════════════════════════════

/**
 * `ZIcon` 完整 props。维度全离散，union 内联表达；任意连续值 / 复杂样式走 `cssRoot`。
 */
export interface ZIconProps {
  size?: 'tiny' | 'small' | 'middle' | 'large' | 'huge'
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  depth?: 'none' | 'subtle' | 'muted' | 'dim' | 'faded' | 'ghost'
  spin?: 'none' | 'tiny' | 'small' | 'middle' | 'large' | 'huge'

  /**
   * 根元素二次精细覆盖 —— 用 zui-core chain 自由写任意样式。
   *
   * 在 base + 4 维度之后调用，可覆盖 size / color / depth / spin 的任何属性，
   * 也可写 `_hover` 等伪类、`_media(...)` 媒体查询、其它 chain 内建方法。
   * 这是"任何不在四个枚举维度里的需求"的统一逃生口。
   *
   * @example
   * <ZIcon
   *   :component="HeartIcon"
   *   :css-root="s => {
   *     s.cursor.pointer
   *     s._hover(h => { h.color._primary })
   *     s.fontSize.px(24)
   *   }"
   * />
   */
  cssRoot?: (s: Chain<ZuiSchema>) => void

  /** 直接以图标组件作为 prop 传入（与 default slot 互斥；slot 优先）。 */
  component?: Component
  /** 根元素 tag，默认 `'i'`（Ionic / FontAwesome 习惯）。 */
  tag?: string
  /** a11y 标签。传 → `aria-label={label}` + `role="img"`；不传 → `aria-hidden="true"`。 */
  label?: string
}

/**
 * `ZIcon` 21 项 component token。注册到 `ComponentTokenRegistry.icon`，
 * 可被 `<ZConfigProvider :component-tokens="{ icon: { ... } }">` 全量覆盖。
 *
 * - 5 × `sizeXxx` —— em 倍率（跟父字号缩放，最终 width = N × font-size）
 * - 6 × `xxxColor` —— default + 5 种语义色
 * - 5 × `depthXxxOpacity` —— 0..1 浮点，由清晰到几乎消失
 * - 5 × `spinXxxDuration` —— 秒；tiny=快/短周期 → huge=慢/长周期
 */
export interface ZIconTokens {
  sizeTiny: number
  sizeSmall: number
  sizeMiddle: number
  sizeLarge: number
  sizeHuge: number

  defaultColor: string
  primaryColor: string
  successColor: string
  warningColor: string
  dangerColor: string
  infoColor: string

  depthSubtleOpacity: number
  depthMutedOpacity: number
  depthDimOpacity: number
  depthFadedOpacity: number
  depthGhostOpacity: number

  spinTinyDuration: number
  spinSmallDuration: number
  spinMiddleDuration: number
  spinLargeDuration: number
  spinHugeDuration: number
}

declare module '@kenconnet666/zui-core' {
  interface ComponentTokenRegistry {
    icon: ZIconTokens
  }
}

// ═══════════════════════════════════════════════════════════════════════
// 内部 deriver（模块级，仅供 withComponentTokens 注册，不导出）
// ═══════════════════════════════════════════════════════════════════════

/**
 * 派生默认 ZIcon tokens。size / depth / spin 全部字面量；5 种语义色从 `theme.color` 直读
 * （core ResolvedTheme 已让 ZuiSchema 字面量类型穿透，无需 narrow / cast）。
 * `withComponentTokens` 会把这 21 项 flatten 到 `theme.color.iconXxx`，运行时通过
 * `componentTokensFor('icon', themed)` 反推回强类型 `ZIconTokens`。
 */
function deriveIconTokens(theme: ResolvedTheme<ZuiSchema>): ZIconTokens {
  return {
    sizeTiny: 0.75,
    sizeSmall: 0.875,
    sizeMiddle: 1,
    sizeLarge: 1.25,
    sizeHuge: 1.5,

    defaultColor: 'currentColor',
    primaryColor: theme.color.primary,
    successColor: theme.color.success,
    warningColor: theme.color.warning,
    dangerColor: theme.color.danger,
    infoColor: theme.color.info,

    depthSubtleOpacity: 0.8,
    depthMutedOpacity: 0.6,
    depthDimOpacity: 0.4,
    depthFadedOpacity: 0.25,
    depthGhostOpacity: 0.15,

    spinTinyDuration: 0.3,
    spinSmallDuration: 0.5,
    spinMiddleDuration: 1,
    spinLargeDuration: 2,
    spinHugeDuration: 3,
  }
}

const iconTokenDerivers = {
  icon: deriveIconTokens,
} satisfies ComponentTokenDerivers<ZuiSchema>
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { useZComponentTokens, useZTheme } from '../../provider'

const props = withDefaults(defineProps<ZIconProps>(), {
  size: 'middle',
  color: 'default',
  depth: 'none',
  spin: 'none',
  tag: 'i',
})

// ─── 主题 + componentTokens 覆盖派生 ───
const theme = useZTheme()
const overrides = useZComponentTokens()
const themed = computed(() =>
  withComponentTokens(theme.value, iconTokenDerivers, overrides.value),
)

// ─── 一个 className：在同一个 chain 里内联 base + 4 维度 + cssRoot ───
// 没有 defineVariants 工厂，没有 cx 拼接 —— 极简组件直接 icss 一气呵成。
const className = computed(() =>
  icss(themed.value, (s) => {
    const t = componentTokensFor('icon', themed.value) as ZIconTokens

    // base
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.flexShrink(0)
    s.lineHeight(1)

    // size —— em 倍率（width / height / font-size 全设 N em）
    const sizeN = {
      tiny: t.sizeTiny,
      small: t.sizeSmall,
      middle: t.sizeMiddle,
      large: t.sizeLarge,
      huge: t.sizeHuge,
    }[props.size]
    s.width.em(sizeN)
    s.height.em(sizeN)
    s.fontSize.em(sizeN)

    // color
    s.color(
      {
        default: t.defaultColor,
        primary: t.primaryColor,
        success: t.successColor,
        warning: t.warningColor,
        danger: t.dangerColor,
        info: t.infoColor,
      }[props.color],
    )

    // depth —— 'none' 不应用 opacity
    if (props.depth !== 'none') {
      s.opacity(
        {
          subtle: t.depthSubtleOpacity,
          muted: t.depthMutedOpacity,
          dim: t.depthDimOpacity,
          faded: t.depthFadedOpacity,
          ghost: t.depthGhostOpacity,
        }[props.depth],
      )
    }

    // spin —— 'none' 不旋转
    if (props.spin !== 'none') {
      const dur = {
        tiny: t.spinTinyDuration,
        small: t.spinSmallDuration,
        middle: t.spinMiddleDuration,
        large: t.spinLargeDuration,
        huge: t.spinHugeDuration,
      }[props.spin]
      s.animationName(presetAnimations.spin)
      s.animationDuration.s(dur)
      s.animationIterationCount.infinite
      s.animationTimingFunction.linear
    }

    // cssRoot 用户覆盖（最后调用，可覆盖以上任何属性）
    props.cssRoot?.(s)
  }),
)

// ─── a11y 属性 ───
const a11y = computed(() =>
  props.label
    ? { 'aria-label': props.label, role: 'img' }
    : { 'aria-hidden': 'true' },
)
</script>

<template>
  <component :is="tag" :class="className" v-bind="a11y">
    <slot>
      <component :is="component" v-if="component" />
    </slot>
  </component>
</template>
