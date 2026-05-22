<script lang="ts">
/**
 * `ZIcon` —— 框架无关图标容器。**ui-vue v3 chain factory props** 范式参照实现。
 *
 * **单文件 SFC + 双 `<script>` 块**:
 * - `<script>`(本块): 模块级出口 —— props 接口
 * - `<script setup>`: 组件运行时 —— 一个 `icss` chain factory 内联全部维度
 *
 * **API 极致一致 = 4 维度全部接单 carrier factory**(2026-05-22 v3):
 * - `size`  → `width` carrier(height 自动镜像 width,保证图标永远正方形)
 * - `color` → `color` carrier
 * - `depth` → `opacity` carrier
 * - `spin`  → `animationDuration` carrier(name / iteration / timing 启用时自动加)
 *
 * **单 carrier factory 的优势**:
 * - IDE 补全聚焦该维度的完整 carrier 能力(token / keyword / 字面量 / modifier / unit method)
 * - 输入 `_p` 模糊筛选 schema token —— 设计完主题直接挂组件库上
 * - 用户写法极简 `(w) => w.em(1.25)` 一行表达,不需嵌入多行多属性
 * - 任何不在该 carrier 表达力内的需求(非正方形 / 自定义 easing / 反向旋转)走 css 兜底
 *
 * **iem 单位默认**(§13.0 ②):图标默认 1iem(默认 16px,Provider 控制基准),跟 Provider 字号
 * 联动,整站统一图标尺寸。**只设 width(height 镜像)、不设 fontSize**(无 em 复合问题)。
 * 想"跟父字号"的局部场景走 css 显式写 `s.width.em(N)`。
 *
 * **设计档位由 theme schema 承担** —— 用户走 `(d) => d._middle` / `(o) => o._half` 用 schema token,
 * 不在组件内硬编码 SIZE_MAP / DEPTH_MAP / SPIN_MAP。要 app 级调整走 `zuiLight.extend(...)`。
 *
 * **a11y**: 传 `label` → `aria-label` + `role="img"`;不传 → `aria-hidden="true"`。
 */
import type { Component } from 'vue'
import type { Chain } from '@kenconnet666/zui-core'
import { icss, presetAnimations } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

// ═══════════════════════════════════════════════════════════════════════
// 公开类型
// ═══════════════════════════════════════════════════════════════════════

/**
 * `ZIcon` 完整 props。**4 个外观维度全部是单 carrier factory**,API 一致极简。
 */
export interface ZIconProps {
  /**
   * 图标尺寸 factory —— 接 `width` carrier,**height 自动镜像 width**(图标始终正方形)。
   *
   * **默认**:`(w) => w.iem(1)` —— 1iem × 1iem(默认 16px × 16px,跟随 ZBox 字号联动)。
   *
   * 想表达非正方形 → 走 `css` 兜底单独设 width / height。
   * 想"跟父容器字号"(罕见)→ `(w) => w.em(1)` 显式 em。
   *
   * @example
   * <ZIcon :size="(w) => w.iem(1)" />      <!-- 1iem,默认 16px,Provider 控制 -->
   * <ZIcon :size="(w) => w.iem(1.5)" />    <!-- 1.5iem,默认 24px -->
   * <ZIcon :size="(w) => w.em(1.25)" />    <!-- 1.25em,跟父字号 -->
   * <ZIcon :size="(w) => w.px(20)" />      <!-- 字面量 -->
   */
  size?: ((w: Chain<ZuiSchema>['width']) => void) | undefined

  /**
   * 图标颜色 factory —— 接 `color` carrier。
   *
   * **默认**:`(c) => c.currentColor` —— 跟随父 color 继承。
   *
   * IDE 补全展开:`_primary` / `_danger` / `red` / `('#abc')` / `_primary.alpha(50)` 等。
   * schema 扩展(`UserColorExt`)走声明合并,自动跟随补全。
   *
   * @example
   * <ZIcon :color="(c) => c._primary" />                <!-- schema token -->
   * <ZIcon :color="(c) => c._danger.alpha(50)" />       <!-- token + modifier -->
   * <ZIcon :color="(c) => c('#ff00aa')" />              <!-- 字面量 -->
   * <ZIcon :color="(c) => c.currentColor" />            <!-- CSS keyword -->
   */
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined

  /**
   * 图标透明度 factory —— 接 `opacity` carrier。
   *
   * **默认**:不传 = 不写 opacity(等于 100%)。
   *
   * @example
   * <ZIcon :depth="(o) => o(0.5)" />          <!-- 字面量 -->
   * <ZIcon :depth="(o) => o._half" />         <!-- schema token -->
   * <ZIcon :depth="(o) => o._strong" />
   */
  depth?: ((o: Chain<ZuiSchema>['opacity']) => void) | undefined

  /**
   * 旋转动画 factory —— 接 `animationDuration` carrier,**用户只控制速度**。
   *
   * 传了就自动启用:`animationName(presetAnimations.spin)` + `infinite` + `linear`。
   * 不传 = 不旋转。
   *
   * 想自定义 easing / 反向旋转 → css 兜底覆盖 `animationTimingFunction` / `animationDirection` 等。
   *
   * @example
   * <ZIcon :spin="(d) => d.s(1)" />          <!-- 1 秒一圈 -->
   * <ZIcon :spin="(d) => d.ms(300)" />       <!-- 300ms -->
   * <ZIcon :spin="(d) => d._middle" />       <!-- schema duration token -->
   * <ZIcon
   *   :spin="(d) => d.s(2)"
   *   :css="(s) => { s.animationTimingFunction('ease-in-out'); s.animationDirection.reverse }"
   * />
   */
  spin?: ((d: Chain<ZuiSchema>['animationDuration']) => void) | undefined

  /**
   * 根元素二次精细覆盖 —— 用 zui-core chain 自由写任意样式。
   *
   * 在 base + 4 维度之后调用,可覆盖 size / color / depth / spin 的任何属性,
   * 也可写 `_hover` 等伪类、`_media(...)` 媒体查询、其它 chain 内建方法。
   * 这是"任何不在四个维度里的需求"的统一逃生口。
   *
   * @example
   * <ZIcon
   *   :component="HeartIcon"
   *   :css="(s) => {
   *     s.cursor.pointer
   *     s._hover(h => h.color(c => c._primary))
   *     s.fontSize.px(24)
   *   }"
   * />
   */
  css?: ((s: Chain<ZuiSchema>) => void) | undefined

  /** 直接以图标组件作为 prop 传入(与 default slot 互斥;slot 优先)。 */
  component?: Component
  /** 根元素 tag,默认 `'i'`(Ionic / FontAwesome 习惯)。 */
  tag?: string
  /** a11y 标签。传 → `aria-label={label}` + `role="img"`;不传 → `aria-hidden="true"`。 */
  label?: string
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZIconProps>(), {
  // Vue defineProps:Function 类型 prop 的 default 直接给函数本身(不需 () => 工厂)
  size: (w: Chain<ZuiSchema>['width']) => {
    w.iem(1)
  },
  color: (c: Chain<ZuiSchema>['color']) => {
    c.currentColor
  },
  tag: 'i',
})

const theme = useZTheme()

// ─── 一个 className:base + 4 维度 factory + css,5 行内联 ───
const className = computed(() =>
  icss(theme.value, (s) => {
    // base
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.flexShrink(0)
    s.lineHeight(1)

    // size:用户只控制 width carrier;height 自动镜像 width(保证图标正方形)
    props.size(s.width)
    if (s._node.width !== undefined) s._node.height = s._node.width

    // color:单 carrier factory(s.color 的 factory 重载吃 props.color)
    s.color(props.color)

    // depth:单 carrier factory;不传 = 不写 opacity
    if (props.depth) s.opacity(props.depth)

    // spin:启用时自动加 name / iteration / timing,用户只控制速度
    if (props.spin) {
      s.animationName(presetAnimations.spin)
      s.animationIterationCount.infinite
      s.animationTimingFunction.linear
      s.animationDuration(props.spin)
    }

    // css 用户覆盖(最后调用,可覆盖以上任何属性)
    props.css?.(s)
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
