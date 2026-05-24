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
import type { SizePropMulti } from '../_internal/size-prop'

export interface ZProgressProps {
  value: number
  type?: 'line' | 'circle'
  /** 尺寸 —— 纯 factory(line=rail height,circle=容器 width+height)。默认等价 middle(line 8px / circle 100px)。 */
  size?: SizePropMulti
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
import { applyAsBg, getThemeColor } from '../_internal/color-bridge'

const props = withDefaults(defineProps<ZProgressProps>(), {
  type: 'line',
  showText: false,
})

const theme = useZTheme()

const clampedValue = computed(() => Math.max(0, Math.min(100, props.value)))

/** line 默认高度 px(等价旧 middle 档位)。size factory 可覆盖。 */
const DEFAULT_LINE_HEIGHT_PX = 8
/** circle 默认直径 px(等价旧 middle 档位)。size factory 可覆盖容器,但 SVG viewBox 始终 100x100。 */
const DEFAULT_CIRCLE_DIAMETER_PX = 100

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
    s.height.px(DEFAULT_LINE_HEIGHT_PX)
    if (props.size) props.size(s)
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

// circle 模式 —— SVG viewBox 始终 100x100,容器尺寸由 size factory(或默认 100px)决定
const circleDiameter = DEFAULT_CIRCLE_DIAMETER_PX
const circleRadius = circleDiameter / 2 - 6
const circumference = 2 * Math.PI * circleRadius
const dashOffset = computed(() => circumference * (1 - clampedValue.value / 100))

const circleRootClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.relative
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.width.px(circleDiameter)
    s.height.px(circleDiameter)
    if (props.size) props.size(s)
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
 * circle 模式 stroke 色:用户传 `color` factory 时无法直接 sample(carrier 抽象不返色串),
 * 仍读 theme.primary。要自定义 circle stroke 走 `css` 覆盖或自渲。
 *
 * TODO:理想方案是把 color factory 投射到一个 probe schema 后取出色值。当前简化:
 * - 用户传 `color` factory → fill 应用到 `backgroundColor` carrier(line OK)
 * - circle SVG stroke 暂仍走 primary 主色(后续 follow-up)
 */
const fillColor = computed(() => getThemeColor(theme.value, 'primary', '#1976d2'))
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
