<script lang="ts">
/**
 * `ZProgress` —— 进度条(线性 + 环形)。
 *
 * **API**:
 * - `value: number` —— 0~100(超出自动 clamp)
 * - `type?: 'line' | 'circle'` —— 默认 `'line'`
 * - `size?: SizePropMulti` —— 尺寸 factory;line 模式覆盖 rail 高度,circle 模式覆盖外层 width/height。默认等价 middle(line=8px / circle=100px)。
 * - `color?: factory` —— 进度色 carrier factory(默认 `_primary`)。
 *   - B6:删除原 `status?: 'normal'|'success'|'warning'|'danger'`,合并到 `color` factory,
 *     用户直接 `color={(c) => c._success}` 即可。
 * - `showText?: boolean` —— 显示百分比文字(line 在右,circle 在中)
 *
 * **size factory 限制**:仅覆盖 CSS 端高度/直径,内部 SVG viewBox 始终 100x100(circle 模式)。
 * 想缩放 SVG 直径,用 factory 同时改 width + height(SVG 自动 scale 跟随容器)。
 *
 * **a11y**:`role="progressbar"` + `aria-valuenow / aria-valuemin / aria-valuemax`。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZProgressProps {
  value: number
  type?: 'line' | 'circle'
  /**
   * 尺寸 —— `number`(iem 倍数)。
   *
   * 2026-05-24 B7:数值尺寸 prop 改 `number`。
   *
   * - line 模式:rail 高度,默认 0.5(8px @ 16px iem)
   * - circle 模式:容器 width + height,默认 7.5(120px,对齐 antd circle default 120px)
   */
  size?: number
  /** 进度色 carrier factory,默认 `_primary`。 */
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  showText?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applyAsBg, getThemeColor, resolveColor } from '../_internal/color-bridge'

/**
 * 盒子模型(iem,Provider 控制基准;number 是 iem 倍数,默认 1iem=16px @ 1080p):
 *
 *   line 模式:
 *   ┌──────────────────────────────────────────────────┐
 *   │ track  flex / center / gap _small / width 100%   │
 *   │  ┌────────────────────────────────────┐ ┌──────┐ │
 *   │  │ rail                               │ │ text │ │   rail:
 *   │  │   height: `size` iem               │ │ N%   │ │     默认 size=0.5(8px @ 1080p)
 *   │  │   bg _bgMuted  border-radius _full │ │_small│ │     传 size=1 → 1iem(16px)粗
 *   │  │  ┌──────────────────┐              │ └──────┘ │   fill:
 *   │  │  │ fill  width: N%  │              │          │     bg color factory 或 _primary
 *   │  │  │ bg: _primary 或 color factory   │          │     height 100% / 跟 rail 等高
 *   │  │  └──────────────────┘              │          │
 *   │  └────────────────────────────────────┘          │
 *   └──────────────────────────────────────────────────┘
 *
 *   circle 模式:
 *   ┌──────────────────────┐
 *   │ circle root          │
 *   │  inline-flex center  │   width/height: `size` iem
 *   │   ╭─────────────╮    │     默认 size=7.5(120px @ 1080p)
 *   │   │   SVG ring  │    │     传 size=10 → 10iem(160px)
 *   │   │  ┌───────┐  │    │   SVG viewBox 100x100(逻辑,跟 size 解耦)
 *   │   │  │  N%   │  │    │   track stroke: _bgMuted 8px
 *   │   │  └───────┘  │    │   fill stroke: _primary 8px round
 *   │   ╰─────────────╯    │   text(条件): position absolute,_large _semibold
 *   └──────────────────────┘
 *
 * 用户改 size 数字 → line 模式 rail 高度 / circle 模式直径等比缩。
 * SVG viewBox 固定 100x100(stroke 宽度不缩),想缩 stroke 走 `:css` 覆盖。
 * 非 iem 单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZProgressProps>(), {
  type: 'line',
  showText: false,
})

const theme = useZTheme()

const clampedValue = computed(() => Math.max(0, Math.min(100, props.value)))

/** line 默认 rail 高度 iem(0.5 = 8px @ 16px iem)。 */
const DEFAULT_LINE_HEIGHT_IEM = 0.5
/** circle 默认直径 iem(7.5 = 120px @ 16px iem,对齐 antd circle default)。SVG viewBox 始终 100x100。 */
const DEFAULT_CIRCLE_DIAMETER_IEM = 7.5
/** SVG viewBox 像素基准(用于 stroke-dasharray / 几何计算,逻辑值,跟 CSS 尺寸解耦)。 */
const SVG_VIEWBOX_BASE = 100

const trackClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.alignItems.center
    s.gap._small
    s.width.pct(100)
    props.css?.(s)
  }),
)

const railClass = computed(() =>
  icss(theme.value, (s) => {
    s.flexGrow(1)
    s.backgroundColor._bgMuted
    s.borderRadius._full
    s.overflow.hidden
    s.height.iem(props.size ?? DEFAULT_LINE_HEIGHT_IEM)
  }),
)

const fillClass = computed(() =>
  icss(theme.value, (s) => {
    if (!applyAsBg(s, props.color)) {
      s.backgroundColor._primary
    }
    s.height.pct(100)
    s.width.pct(clampedValue.value)
    s.transitionProperty._sizes
    s.transitionDuration._small
  }),
)

const textClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._textSecondary
    s.fontSize._small
    s.flexShrink(0)
    s.minWidth.em(3)
    s.textAlign.right
  }),
)

// circle 模式 —— SVG viewBox 100x100(逻辑值,跟 CSS 尺寸解耦),容器 iem 由 size 决定
const circleRadius = SVG_VIEWBOX_BASE / 2 - 6
const circumference = 2 * Math.PI * circleRadius
const dashOffset = computed(() => circumference * (1 - clampedValue.value / 100))

const circleRootClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.relative
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.width.iem(props.size ?? DEFAULT_CIRCLE_DIAMETER_IEM)
    s.height.iem(props.size ?? DEFAULT_CIRCLE_DIAMETER_IEM)
    props.css?.(s)
  }),
)

const circleTextClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.absolute
    s.color._text
    s.fontWeight._semibold
    s.fontSize._large
  }),
)

const trackColor = computed(() => getThemeColor(theme.value, 'bgMuted', '#e5e7eb'))

/**
 * circle 模式 stroke 色:SVG `stroke` 是 attribute 不是 CSS class,需要裸字符串。
 *
 * 2026-05-25(T1.A):用 `resolveCarrier(theme, 'color', factory)` 把用户传的
 * `color` factory 投射一遍取出最终值串(支持 token / `.alpha(N)` modifier /
 * keyword / 字面量 / 字符串逃生舱)。factory 未传时回退 theme.primary。
 */
const fillColor = computed<string>(() =>
  resolveColor(theme.value, props.color, getThemeColor(theme.value, 'primary', '#1976d2')),
)
</script>

<template>
  <div v-if="type === 'line'" :class="trackClass" role="progressbar" :aria-valuenow="clampedValue" aria-valuemin="0" aria-valuemax="100">
    <div :class="railClass">
      <div :class="fillClass" />
    </div>
    <span v-if="showText" :class="textClass">{{ clampedValue }}%</span>
  </div>

  <div v-else :class="circleRootClass" role="progressbar" :aria-valuenow="clampedValue" aria-valuemin="0" aria-valuemax="100">
    <svg width="100%" height="100%" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        :r="circleRadius"
        fill="none"
        :stroke="trackColor"
        stroke-width="8"
      />
      <circle
        cx="50"
        cy="50"
        :r="circleRadius"
        fill="none"
        :stroke="fillColor"
        stroke-width="8"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        transform="rotate(-90 50 50)"
        style="transition: stroke-dashoffset 300ms ease"
      />
    </svg>
    <span v-if="showText" :class="circleTextClass">{{ clampedValue }}%</span>
  </div>
</template>
