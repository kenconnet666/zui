<script lang="ts">
/**
 * `ZIcon` —— 框架无关图标容器。ui-vue 设计哲学三层覆盖模型(skill §13.0)的首个参照实现。
 *
 * **单文件 SFC + 双 `<script>` 块**:
 * - `<script>`(本块): 模块级出口 —— props 接口 + 3 个内部 const map
 * - `<script setup>`: 组件运行时 —— 一个 `icss` chain factory 内联全部维度
 *
 * **极简组件 = 直接 icss 内联,不上 `defineVariants`**: 4 个维度都是"枚举 → 几行 CSS"
 * 的简单映射,没有 hover/focus/disabled 等多状态组合。setup 内一个 `icss(theme.value, s => {...})`
 * 一气呵成,比"createVariants 工厂 + cx 拼接"少一层间接。
 * 复杂组件(Button / Input / Dialog —— 含 hover/focus/disabled/active 状态笛卡尔积)
 * 仍用 `defineVariants` / `defineParts`,见 skill §13.0 实现选择。
 *
 * **设计要点**:
 * 1. **离散预设 · size 类有 `| number` escape · 其它无连续输入** — size 5 阶 + `| number`,
 *    color / depth / spin 全枚举(默认值齐全)。props union 内联在 `ZIconProps` 字段处,
 *    不抽 `ZIconSize` 等中间子类型 alias。
 * 2. **em 优先 · 跟随父字号** — 5 阶 size 用 em 倍率(`tiny=0.75` → `huge=1.5`),
 *    物理尺寸 = N × 父字号。用户调"1em 等于多少"走 `:css-root="s => s.fontSize.px(N)"`。
 * 3. **chain shortcut 直读 schema · 无 component token namespace** —
 *    5 个语义色直接走 `s.color._primary / _success / _warning / _danger / _info`
 *    (来自 ZuiSchema 命名空间,IDE 自动补全);size / depth / spin 数值常量本地 map。
 *    要 app 级改色走 theme(`zuiLight.extend({ color: { primary: '#abc' } })`),
 *    要新增品牌色走 schema 扩展(`UserColorExt`),要单点改走 cssRoot。
 * 4. **cssRoot 是唯一逃生口** — 在 base + 维度之后调用,可覆盖任何属性 / 写 `_hover` /
 *    媒体查询 / 任意 chain method。多 slot 组件预留 `cssHeader` / `cssBody` 等并列 prop。
 * 5. **图标库无关** — default slot 或 `:component` prop 双模式。
 *
 * **a11y**: 传 `label` → `aria-label` + `role="img"`;不传 → `aria-hidden="true"`。
 */
import type { Component } from 'vue'
import type { Chain } from '@kenconnet666/zui-core'
import { icss, presetAnimations } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../../theme'

// ═══════════════════════════════════════════════════════════════════════
// 公开类型
// ═══════════════════════════════════════════════════════════════════════

/**
 * `ZIcon` 完整 props。维度全离散,union 内联表达;任意连续值 / 复杂样式走 `cssRoot`。
 */
export interface ZIconProps {
  /**
   * 图标尺寸。
   * - **5 阶枚举**(默认 `'middle'`):`tiny=0.75` / `small=0.875` / `middle=1` / `large=1.25` / `huge=1.5`
   * - **`number` escape hatch**:任意 em 倍率(如 `1.125` / `2.3` / `0.6` 等),用于"5 阶档位无法满足的精确数值"
   *
   * 物理尺寸 = N × 父字号。如需脱离父字号绑定,走 `cssRoot` 写 `s.width.zu(N)` 等。
   *
   * @example
   * <ZIcon :component="HeartIcon" size="large" />     <!-- 1.25em -->
   * <ZIcon :component="HeartIcon" :size="1.125" />    <!-- 1.125em -->
   */
  size?: 'tiny' | 'small' | 'middle' | 'large' | 'huge' | number
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  depth?: 'none' | 'subtle' | 'muted' | 'dim' | 'faded' | 'ghost'
  spin?: 'none' | 'tiny' | 'small' | 'middle' | 'large' | 'huge'

  /**
   * 根元素二次精细覆盖 —— 用 zui-core chain 自由写任意样式。
   *
   * 在 base + 4 维度之后调用,可覆盖 size / color / depth / spin 的任何属性,
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

  /** 直接以图标组件作为 prop 传入(与 default slot 互斥;slot 优先)。 */
  component?: Component
  /** 根元素 tag,默认 `'i'`(Ionic / FontAwesome 习惯)。 */
  tag?: string
  /** a11y 标签。传 → `aria-label={label}` + `role="img"`;不传 → `aria-hidden="true"`。 */
  label?: string
}

// ═══════════════════════════════════════════════════════════════════════
// 内部数值常量 —— 设计语言级档位本地写死,不开放运行时覆盖
// ═══════════════════════════════════════════════════════════════════════
//
// **为什么 inline 而非 ComponentTokenRegistry**:zui 走「Theme / Schema 扩展 / cssRoot」
// 三层覆盖模型(skill §13.0):
//   - 全组件统一改色  → `zuiLight.extend({ color: { primary: '#abc' } })`,影响所有 `_primary` 调用点
//   - 新增品牌 token  → `interface UserColorExt { brandRoyal: string }` augmentation
//   - 单点改          → `:css-root="s => s.width.em(1.2)"`
//
// 单组件 namespace 的 token 覆盖(老 `<ZConfigProvider :component-tokens>`)被砍掉了 —— 三层
// 已经覆盖所有正经业务场景,中间这层只制造概念冗余 + 补全降级。size/depth/spin 是设计师拍板
// 的固定档位,要变更直接改这里(等同 BREAKING)而不是给一个看上去能改但实际很少有人改的 prop。

/** size em 倍率: `tiny=0.75` → `huge=1.5`。物理尺寸 = N × 父字号。 */
const SIZE_MAP = {
  tiny: 0.75,
  small: 0.875,
  middle: 1,
  large: 1.25,
  huge: 1.5,
} as const

/** depth opacity: `subtle=0.8`(最清晰) → `ghost=0.15`(几乎消失)。`none` 在 setup 内分支跳过。 */
const DEPTH_MAP = {
  subtle: 0.8,
  muted: 0.6,
  dim: 0.4,
  faded: 0.25,
  ghost: 0.15,
} as const

/** spin 动画周期(秒): `tiny=0.3`(最快) → `huge=3`(最慢)。`none` 在 setup 内分支跳过。 */
const SPIN_MAP = {
  tiny: 0.3,
  small: 0.5,
  middle: 1,
  large: 2,
  huge: 3,
} as const
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { useZTheme } from '../../provider'

const props = withDefaults(defineProps<ZIconProps>(), {
  size: 'middle',
  color: 'default',
  depth: 'none',
  spin: 'none',
  tag: 'i',
})

const theme = useZTheme()

// ─── 一个 className:在同一个 chain 里内联 base + 4 维度 + cssRoot ───
// 没有 defineVariants 工厂,没有 cx 拼接 —— 极简组件直接 icss 一气呵成。
const className = computed(() =>
  icss(theme.value, (s) => {
    // base
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.flexShrink(0)
    s.lineHeight(1)

    // size —— em 倍率,物理尺寸 = N × inherited font-size(父字号)。
    // **只设 width/height、不设 font-size**:避免 em 复合(若也写 fontSize.em(N),
    // width 的 em 会相对新 fontSize 算成 N² × 父字号,与"N × 父字号"语义不符)。
    // 不写 fontSize 还保留了 slot 内文本继承父字号,不被 ZIcon 影响。
    //
    // size 接受字符串档位(命中 SIZE_MAP)或 number escape(任意自定义 em 倍率)。
    const sizeN = typeof props.size === 'number' ? props.size : SIZE_MAP[props.size]
    s.width.em(sizeN)
    s.height.em(sizeN)

    // color —— 5 个语义色直接走 chain shortcut,IDE 自动补全 schema token,
    // 也跟随 `zuiLight.extend({ color: {...} })` 的 app 级覆盖。
    // 'default' 显式写 currentColor,与 'none' 状态区分,也明确表达"跟随父 color 继承"。
    switch (props.color) {
      case 'default':
        s.color.currentColor
        break
      case 'primary':
        s.color._primary
        break
      case 'success':
        s.color._success
        break
      case 'warning':
        s.color._warning
        break
      case 'danger':
        s.color._danger
        break
      case 'info':
        s.color._info
        break
    }

    // depth —— 'none' 不应用 opacity
    if (props.depth !== 'none') {
      s.opacity(DEPTH_MAP[props.depth])
    }

    // spin —— 'none' 不旋转
    if (props.spin !== 'none') {
      s.animationName(presetAnimations.spin)
      s.animationDuration.s(SPIN_MAP[props.spin])
      s.animationIterationCount.infinite
      s.animationTimingFunction.linear
    }

    // cssRoot 用户覆盖(最后调用,可覆盖以上任何属性)
    props.cssRoot?.(s)
  }),
)

// ─── a11y 属性 ───
const a11y = computed(() =>
  props.label ? { 'aria-label': props.label, role: 'img' } : { 'aria-hidden': 'true' },
)
</script>

<template>
  <component :is="tag" :class="className" v-bind="a11y">
    <slot>
      <component :is="component" v-if="component" />
    </slot>
  </component>
</template>
