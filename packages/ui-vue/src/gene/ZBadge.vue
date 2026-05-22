<script lang="ts">
/**
 * `ZBadge` —— 徽标(角标 / 红点 / 数字)。
 *
 * **形态**:
 * - `value: number | string` —— 显示文字 / 数字
 * - `dot: boolean` —— 红点模式(忽略 value,只显小圆点)
 * - `max?: number` —— 数字超过显示 `${max}+`(默认 `99`)
 * - `showZero?: boolean` —— value=0 是否显示(默认 `false`,隐藏)
 *
 * **挂载**:
 * - 有 default slot → 子元素右上角浮挂徽标(`position: absolute`)
 * - 无 slot → inline 显示徽标本身
 *
 * - `color` carrier factory —— 徽标背景色(默认 `_danger`)
 * - `offset?: [number, number]` —— [x, y] 偏移 px
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZBadgeProps {
  value?: number | string
  dot?: boolean
  max?: number
  showZero?: boolean
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  offset?: [number, number]
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZBadgeProps>(), {
  dot: false,
  max: 99,
  showZero: false,
})

const slots = useSlots()
const theme = useZTheme()

const hasSlot = computed(() => !!slots.default)

const displayText = computed(() => {
  if (props.dot) return ''
  if (props.value === undefined) return ''
  if (typeof props.value === 'number') {
    if (props.value === 0 && !props.showZero) return ''
    if (props.value > props.max) return `${props.max}+`
    return String(props.value)
  }
  return String(props.value)
})

const shouldShow = computed(() => {
  if (props.dot) return true
  return displayText.value !== ''
})

const wrapperClass = computed(() =>
  icss(theme.value, (s) => {
    if (hasSlot.value) {
      s._prop('position', 'relative')
      s.display.inlineFlex
    } else {
      s.display.inlineFlex
    }
    props.css?.(s)
  }),
)

const badgeClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.color._bg
    if (props.color) s.backgroundColor(props.color)
    else s.backgroundColor._danger

    if (props.dot) {
      s._prop('width', 'calc(0.5 * var(--zui-iem, 16px))')
      s._prop('height', 'calc(0.5 * var(--zui-iem, 16px))')
      s.borderRadius._full
    } else {
      s.paddingLeft._tiny
      s.paddingRight._tiny
      s._prop('minWidth', 'calc(1.125 * var(--zui-iem, 16px))')
      s._prop('height', 'calc(1.125 * var(--zui-iem, 16px))')
      s.borderRadius._full
      s.fontSize._tiny
      s.fontWeight._semibold
      s.lineHeight._tight
    }

    if (hasSlot.value) {
      s._prop('position', 'absolute')
      const x = props.offset?.[0] ?? 0
      const y = props.offset?.[1] ?? 0
      s._prop('top', `calc(0px + ${y}px)`)
      s._prop('right', `calc(0px - ${x}px)`)
      s._prop('transform', 'translate(50%, -50%)')
      s.zIndex._tiny
    }
  }),
)
</script>

<template>
  <span :class="wrapperClass">
    <slot />
    <span v-if="shouldShow" :class="badgeClass" :aria-label="String(value)">{{ displayText }}</span>
  </span>
</template>
