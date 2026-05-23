<script lang="ts">
/**
 * `ZText` —— 行内文本基础元(ui-vue v3 chain factory props 范式)。
 *
 * **单文件 SFC + 双 `<script>` 块**:
 * - `<script>`(本块): 模块级出口 —— props 接口
 * - `<script setup>`: 组件运行时 —— 一个 `icss` chain factory 内联全部维度
 *
 * **6 维度 carrier factory**(IDE 补全聚焦该维度的完整 carrier 能力):
 * - `size`     → `fontSize` carrier      ── 默认不写(继承父字号)
 * - `weight`   → `fontWeight` carrier    ── 默认不写
 * - `color`    → `color` carrier         ── 默认 currentColor(继承)
 * - `depth`    → `opacity` carrier       ── 默认不写
 * - `leading`  → `lineHeight` carrier    ── 默认不写(继承)
 * - `tracking` → `letterSpacing` carrier ── 默认不写
 *
 * **5 状态布尔/枚举**(零参,直接驱动样式):
 * - `italic`        → `font-style: italic`
 * - `underline`     → `'always'` 常显 / `'hover'` 悬停显 / `'none'` 不显(默认)
 * - `strikethrough` → `text-decoration-line: line-through`(可与 underline 叠加)
 * - `mono`          → 系统等宽字体栈
 * - `ellipsis`      → `true` 单行截断(`_truncate`)/ `N: number` 多行截断(`_lineClamp(N)`)
 *
 * **iem 单位默认**(§13.0 ②):走 schema fontSize token 默认 1iem = 16px,跟 ZBox
 * 字号联动。复杂需求(自定义伪类 / 多段 text-decoration / 渐变文本)走 css 兜底。
 *
 * **a11y**:纯文本元素,不强加 role;`mono`/`italic`/`strikethrough` 是视觉装饰,
 * 语义层面用户通过 `tag` 切到 `code`/`em`/`del`/`ins`/`mark` 等语义标签。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SizeProp } from '../_internal/size-prop'

/**
 * `ZText` 完整 props。**size 走 union(factory | Size5 | undefined),其它 5 维度纯 factory**。
 */
export interface ZTextProps {
  /**
   * 字号 —— `factory | Size5 | undefined` union(2026-05-22 修订)。
   *
   * **默认**:不传 = 继承父字号(等同 1em)。
   *
   * **5 阶档位**(映射 schema fontSize token):
   * - `tiny` → `_tiny`(12px) / `small` → `_small`(14px) / `middle` → `_middle`(16px) /
   *   `large` → `_large`(18px) / `huge` → `_huge`(20px)
   *
   * @example
   * <ZText size="middle" />                   <!-- happy path -->
   * <ZText :size="(f) => f._middle" />        <!-- factory(等价) -->
   * <ZText :size="(f) => f.iem(1.125)" />     <!-- 1.125iem 自定义 -->
   * <ZText :size="(f) => f.px(14)" />         <!-- 字面量 -->
   */
  size?: SizeProp<'fontSize'> | undefined

  /**
   * 字重 factory —— 接 `fontWeight` carrier。
   *
   * @example
   * <ZText :weight="(w) => w._semibold" />    <!-- schema token = 600 -->
   * <ZText :weight="(w) => w(700)" />         <!-- 字面量 -->
   * <ZText :weight="(w) => w.bold" />         <!-- CSS keyword -->
   */
  weight?: ((w: Chain<ZuiSchema>['fontWeight']) => void) | undefined

  /**
   * 颜色 factory —— 接 `color` carrier。
   *
   * **默认**:`(c) => c.currentColor` —— 跟随父元素颜色。
   *
   * @example
   * <ZText :color="(c) => c._primary" />            <!-- schema token -->
   * <ZText :color="(c) => c._danger.alpha(80)" />   <!-- token + modifier -->
   * <ZText :color="(c) => c('#ff00aa')" />          <!-- 字面量 -->
   */
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined

  /**
   * 透明度 factory —— 接 `opacity` carrier。**默认**:不传 = 不写 opacity。
   *
   * @example
   * <ZText :depth="(o) => o._half" />         <!-- 50% -->
   * <ZText :depth="(o) => o(0.6)" />          <!-- 字面量 -->
   */
  depth?: ((o: Chain<ZuiSchema>['opacity']) => void) | undefined

  /**
   * 行高 factory —— 接 `lineHeight` carrier。**默认**:不传 = 继承父。
   *
   * @example
   * <ZText :leading="(l) => l._normal" />     <!-- 1.5 -->
   * <ZText :leading="(l) => l._tight" />      <!-- 1.25 -->
   */
  leading?: ((l: Chain<ZuiSchema>['lineHeight']) => void) | undefined

  /**
   * 字距 factory —— 接 `letterSpacing` carrier。**默认**:不传 = 正常字距。
   *
   * @example
   * <ZText :tracking="(t) => t._tight" />     <!-- -0.025em -->
   * <ZText :tracking="(t) => t._wide" />      <!-- 0.025em -->
   */
  tracking?: ((t: Chain<ZuiSchema>['letterSpacing']) => void) | undefined

  /** 斜体(`font-style: italic`)。 */
  italic?: boolean

  /**
   * 下划线模式:
   * - `'always'` —— 常显
   * - `'hover'`  —— 悬停时显
   * - `'none'`   —— 不显(默认)
   */
  underline?: 'always' | 'hover' | 'none'

  /** 删除线(`text-decoration-line: line-through`),可与 underline 叠加。 */
  strikethrough?: boolean

  /** 等宽字体栈(`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`)。 */
  mono?: boolean

  /**
   * 省略截断:
   * - `true`          → 单行截断(`overflow + text-overflow:ellipsis + white-space:nowrap`)
   * - `N: number`     → 多行截断(`-webkit-line-clamp: N`)
   * - `false` / 不传  → 不截断(默认)
   */
  ellipsis?: boolean | number

  /**
   * 根元素二次精细覆盖 —— 用 zui-core chain 自由写任意样式。
   *
   * 在 6 维度 + 5 状态之后调用,可覆盖任何属性,也可写 `_hover` 等伪类、
   * `_media(...)` 媒体查询、其它 chain 内建方法。**任何不在内建维度的需求统一逃生口**。
   *
   * @example
   * <ZText
   *   :css="(s) => {
   *     s._hover(h => h.color(c => c._primary))
   *     s.cursor.pointer
   *   }"
   * >点我</ZText>
   */
  css?: ((s: Chain<ZuiSchema>) => void) | undefined

  /**
   * 根元素 tag,默认 `'span'`。
   *
   * 语义场景下传:`'em'`(强调)/ `'strong'`(加重)/ `'code'`(代码)/
   * `'del'`(删除)/ `'ins'`(插入)/ `'mark'`(高亮)/ `'kbd'`(按键)等。
   */
  tag?: string
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applyTypographyBase } from './_typography-base'

const props = withDefaults(defineProps<ZTextProps>(), {
  italic: false,
  underline: 'none',
  strikethrough: false,
  mono: false,
  ellipsis: false,
  tag: 'span',
})

const theme = useZTheme()

const className = computed(() =>
  icss(theme.value, (s) => {
    applyTypographyBase(s, props)
    props.css?.(s)
  }),
)
</script>

<template>
  <component :is="tag" :class="className">
    <slot />
  </component>
</template>
