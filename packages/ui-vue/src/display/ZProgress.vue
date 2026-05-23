<script lang="ts">
/**
 * `ZProgress` —— 进度条(线性 + 环形)。
 *
 * **API**:
 * - `value: number` —— 0~100(超出自动 clamp)
 * - `type?: 'line' | 'circle'` —— 默认 `'line'`
 * - `size?: 'small' | 'middle' | 'large'` —— 线性高度 / 环形直径档位
 * - `color` carrier factory —— 进度色(默认 `_primary`)
 * - `showText?: boolean` —— 显示百分比文字(line 在右,circle 在中)
 * - `status?: 'normal' | 'success' | 'warning' | 'danger'` —— 覆盖 color(优先)
 *
 * **a11y**:`role="progressbar"` + `aria-valuenow / aria-valuemin / aria-valuemax`。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { Size5 } from '../_internal/size-prop'

export type ZProgressType = 'line' | 'circle'
/** ZProgress size 仅接 Size5 档位(尺寸是 px 数字,factory 路径无意义)。 */
export type ZProgressSize = Size5
export type ZProgressStatus = 'normal' | 'success' | 'warning' | 'danger'

export interface ZProgressProps {
  value: number
  type?: ZProgressType
  /** 尺寸档位(`Size5`,影响 line 高度 / circle 直径)。 */
  size?: ZProgressSize
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  showText?: boolean
  status?: ZProgressStatus
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
  size: 'middle',
  showText: false,
  status: 'normal',
})

const theme = useZTheme()

const clampedValue = computed(() => Math.max(0, Math.min(100, props.value)))

/** line 高度 px(5 阶,tiny/huge 各加一档)。 */
const SIZE_HEIGHT: Record<ZProgressSize, number> = {
  tiny: 2,
  small: 4,
  middle: 8,
  large: 12,
  huge: 16,
}

/** circle 直径 px(5 阶)。 */
const CIRCLE_DIAMETER: Record<ZProgressSize, number> = {
  tiny: 40,
  small: 60,
  middle: 100,
  large: 140,
  huge: 180,
}

const STATUS_COLOR: Record<ZProgressStatus, 'success' | 'warning' | 'danger' | null> = {
  normal: null,
  success: 'success',
  warning: 'warning',
  danger: 'danger',
}

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
    s._prop('overflow', 'hidden')
    s._prop('height', `${SIZE_HEIGHT[props.size]}px`)
  }),
)

const fillClass = computed(() =>
  icss(theme.value, (s) => {
    const statusKey = STATUS_COLOR[props.status]
    if (statusKey) {
      s.backgroundColor[`_${statusKey}` as const]
    } else if (!applyAsBg(s, props.color)) {
      s.backgroundColor._primary
    }
    s._prop('height', '100%')
    s._prop('width', `${clampedValue.value}%`)
    s.transitionProperty._sizes
    s.transitionDuration._small
  }),
)

const textClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._textSecondary
    s.fontSize._small
    s.flexShrink(0)
    s._prop('minWidth', '3em')
    s._prop('textAlign', 'right')
  }),
)

// circle 模式
const circleDiameter = computed(() => CIRCLE_DIAMETER[props.size])
const circleRadius = computed(() => circleDiameter.value / 2 - 6)
const circumference = computed(() => 2 * Math.PI * circleRadius.value)
const dashOffset = computed(() => circumference.value * (1 - clampedValue.value / 100))

const circleRootClass = computed(() =>
  icss(theme.value, (s) => {
    s._prop('position', 'relative')
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s._prop('width', `${circleDiameter.value}px`)
    s._prop('height', `${circleDiameter.value}px`)
    props.css?.(s)
  }),
)

const circleTextClass = computed(() =>
  icss(theme.value, (s) => {
    s._prop('position', 'absolute')
    s.color._text
    s.fontWeight._semibold
    s.fontSize._large
  }),
)

const trackColor = computed(() => getThemeColor(theme.value, 'bgMuted', '#e5e7eb'))

const fillColor = computed(() => {
  const statusKey = STATUS_COLOR[props.status]
  if (statusKey) return getThemeColor(theme.value, statusKey, '#1976d2')
  return getThemeColor(theme.value, 'primary', '#1976d2')
})
</script>

<template>
  <div v-if="type === 'line'" :class="trackClass" role="progressbar" :aria-valuenow="clampedValue" aria-valuemin="0" aria-valuemax="100">
    <div :class="railClass">
      <div :class="fillClass" />
    </div>
    <span v-if="showText" :class="textClass">{{ clampedValue }}%</span>
  </div>

  <div v-else :class="circleRootClass" role="progressbar" :aria-valuenow="clampedValue" aria-valuemin="0" aria-valuemax="100">
    <svg :width="circleDiameter" :height="circleDiameter" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        :r="circleRadius / (circleDiameter / 100)"
        fill="none"
        :stroke="trackColor"
        stroke-width="8"
      />
      <circle
        cx="50"
        cy="50"
        :r="circleRadius / (circleDiameter / 100)"
        fill="none"
        :stroke="fillColor"
        stroke-width="8"
        stroke-linecap="round"
        :stroke-dasharray="circumference / (circleDiameter / 100)"
        :stroke-dashoffset="dashOffset / (circleDiameter / 100)"
        transform="rotate(-90 50 50)"
        style="transition: stroke-dashoffset 300ms ease"
      />
    </svg>
    <span v-if="showText" :class="circleTextClass">{{ clampedValue }}%</span>
  </div>
</template>
