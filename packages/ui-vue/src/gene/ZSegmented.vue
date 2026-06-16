<script lang="ts">
/**
 * `ZSegmented` —— 分段控制器(类 iOS Segmented Control / antd Segmented)。
 *
 * - `v-model:value` —— 选中的 key
 * - `options: Array<{ value, label, disabled? }>`
 * - `size?: 'small' | 'middle' | 'large'`
 * - `block?: boolean` —— 满宽
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZSegmentedOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface ZSegmentedProps {
  value?: string | number
  options: ZSegmentedOption[]
  /**
   * 字号尺寸 —— `number`(px 倍数,默认 1 = 16px,1 单位 = 16px)。
   *
   * 2026-05-24 B7:数值尺寸 prop 改 `number`,组件按比例算所有维度(同 ZButton)。
   */
  size?: number
  /** 高度 —— `number`(px 倍数,可选,默认 `size * 2`,即 32px @ size=1)。 */
  height?: number
  block?: boolean
  disabled?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZSegmentedEmits {
  /** 选中值变化(支持 `v-model:value`)。v0.2 删除等价的 `change`。 */
  (e: 'update:value', value: string | number): void
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(number 是 px 倍数,1 单位 = 16px,sizePx(n) = n × 16):
 *
 *   ┌─────────────────────────────────────────────────────┐
 *   │ root  inline-flex / pad _tiny / gap _tiny           │   bg _bgMuted / border-radius _small
 *   │   block=true → width: 100%                          │   disabled → opacity _dim
 *   │                                                     │
 *   │  ┌──────────┐ ┌──────────┐ ┌──────────┐             │   每个 item(button):
 *   │  │ option 1 │ │ option 2 │ │ option 3 │             │     font-size: sizePx(size)
 *   │  │  active  │ │          │ │          │             │       默认 size=1(16px)
 *   │  │  bg _bg  │ │ inactive │ │ disabled │             │     height: sizePx(height)
 *   │  │  shadow  │ │ _2nd     │ │ opacity  │             │       默认 height=size*2 → 32px
 *   │  │  _tiny   │ │ hover    │ │   _dim   │             │     padding-y: sizePx(size*0.5) = 8px
 *   │  └──────────┘ └──────────┘ └──────────┘             │     padding-x: sizePx(size*1)   = 16px
 *   │                                                     │     gap: sizePx(size*0.5)       = 8px
 *   │                                                     │     border-radius: sizePx(size*0.375) = 6px
 *   └─────────────────────────────────────────────────────┘     active → bg _bg + boxShadow _tiny
 *
 * 用户改 size 数字 → 每个 item 所有 px 维度等比缩(整体比例不变)。height 可独立覆盖。
 * 非 px 单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZSegmentedProps>(), {
  size: 1,
  block: false,
  disabled: false,
})

const emit = defineEmits<ZSegmentedEmits>()

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.padding._tiny
    s.backgroundColor._bgMuted
    s.borderRadius._small
    s.gap._tiny
    if (props.block) s.width.pct(100)
    if (props.disabled) s.opacity._dim
    props.css?.(s)
  }),
)

const itemClass = (opt: ZSegmentedOption): string => {
  const isActive = props.value === opt.value
  const isDisabled = opt.disabled || props.disabled
  const size = props.size ?? 1
  const height = props.height ?? size * 2
  return icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.borderStyle.none
    s.cursor(isDisabled ? 'not-allowed' : 'pointer')
    s.borderRadius.px(sizePx(size * 0.375))
    s.fontSize.px(sizePx(size))
    s.fontWeight._medium
    s.height.px(sizePx(height))
    s.paddingTop.px(sizePx(size * 0.5))
    s.paddingBottom.px(sizePx(size * 0.5))
    s.paddingLeft.px(sizePx(size * 1))
    s.paddingRight.px(sizePx(size * 1))
    s.gap.px(sizePx(size * 0.5))
    s.transitionProperty._colors
    s.transitionDuration._small
    if (props.block) s.flexGrow(1)
    if (isActive) {
      s.backgroundColor._bg
      s.color._text
      s.boxShadow._tiny
    } else {
      s.backgroundColor.transparent
      s.color._textSecondary
      s._hover(h => {
        if (!isDisabled) h.color._text
      })
    }
    if (isDisabled) s.opacity._dim
  })
}

function select(opt: ZSegmentedOption): void {
  if (opt.disabled || props.disabled) return
  if (props.value === opt.value) return
  emit('update:value', opt.value)
}
</script>

<template>
  <div :class="rootClass" role="radiogroup">
    <button
      v-for="opt in options"
      :key="String(opt.value)"
      type="button"
      :class="itemClass(opt)"
      role="radio"
      :aria-checked="value === opt.value"
      :disabled="opt.disabled || disabled"
      @click="select(opt)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
