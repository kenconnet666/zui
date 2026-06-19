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
  /**
   * 尺寸 —— `number`(px 倍数,默认 0.75 = 12px,1 单位 = 16px)。
   *
   * 内部按比例:
   * - `padding-y` = `size * 0.25`
   * - `padding-x` = `size * 0.5`
   *
   * 2026-05-24 B7:数值尺寸 prop 改 `number`。
   */
  size?: number
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  offset?: [number, number]
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(number 是 px 倍数,1 单位 = 16px,sizePx(n) = n × 16):
 *
 *   ┌──────────────────────────────────────────────┐
 *   │ ZBadge wrapper                               │   有 slot → inline-flex,position: relative
 *   │  ┌────────────┐                              │   无 slot → inline-flex 仅渲染徽标
 *   │  │ slot       │                              │
 *   │  │ (子内容)   │                              │
 *   │  └────────────┘                              │
 *   │                       ┌──────┐               │
 *   │                       │ N+/  │  徽标:        │
 *   │                       │  •   │    font-size: sizePx(size)         默认 size=0.75(12px)
 *   │                       └──────┘    padding-y: sizePx(size*0.25)    ≈ 3px
 *   │                                   padding-x: sizePx(size*0.5)     ≈ 6px
 *   │                                   min-width: sizePx(size*1.5)     ≈ 18px
 *   │                                   height: sizePx(size*1.5)        ≈ 18px
 *   │                       dot=true → width/height: sizePx(size*0.667) ≈ 8px,圆点
 *   │                       border-radius: _full
 *   └──────────────────────────────────────────────┘
 *
 * 用户改 size 数字 → 徽标 padding / min-width / height / fontSize 等比缩(整体比例不变)。
 * 非 px 单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZBadgeProps>(), {
  dot: false,
  max: 99,
  showZero: false,
  size: 0.75,
  // 徽标背景默认 `_danger`(角标常用红色)
  color: (c: Chain<ZuiSchema>['color']) => {
    c._danger
  },
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
  icss(theme.value, s => {
    if (hasSlot.value) {
      s.position.relative
      s.display.inlineFlex
    } else {
      s.display.inlineFlex
    }
    props.css?.(s)
  }),
)

const badgeClass = computed(() =>
  icss(theme.value, s => {
    const size = props.size ?? 0.75
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.color._bg
    // color factory(默认 `_danger`,从 withDefaults 提供)桥接到 backgroundColor carrier
    s.backgroundColor(props.color)

    if (props.dot) {
      s.width.px(sizePx(size * 0.667))
      s.height.px(sizePx(size * 0.667))
      s.borderRadius._full
    } else {
      s.paddingTop.px(sizePx(size * 0.25))
      s.paddingBottom.px(sizePx(size * 0.25))
      s.paddingLeft.px(sizePx(size * 0.5))
      s.paddingRight.px(sizePx(size * 0.5))
      s.minWidth.px(sizePx(size * 1.5))
      s.height.px(sizePx(size * 1.5))
      s.borderRadius._full
      s.fontSize.px(sizePx(size))
      s.fontWeight._semibold
      s.lineHeight._tight
    }

    if (hasSlot.value) {
      s.position.absolute
      const x = props.offset?.[0] ?? 0
      const y = props.offset?.[1] ?? 0
      s.top.px(y)
      s.right.px(-x)
      s.transform('translate(50%, -50%)')
      s.zIndex._tiny
    }
  }),
)
</script>

<template>
  <span :class="wrapperClass">
    <slot />
    <span v-if="shouldShow" :class="badgeClass" :aria-label="displayText || undefined">{{
      displayText
    }}</span>
  </span>
</template>
