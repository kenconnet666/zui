<script lang="ts">
/**
 * `ZTag` —— 标签(对应 antd Tag / naive NTag)。
 *
 * - `color` carrier factory —— 主色(默认 `_textSecondary`)
 * - `variant: 'filled' | 'outlined' | 'soft'`(默认 `'soft'`)
 * - `size?: number` —— 字号尺寸(px 倍数,1 单位 = 16px),默认 0.875(= 14px)
 * - `closable: boolean` —— 关闭按钮 + emit close
 * - `round: boolean` —— 圆角胶囊形
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export type ZTagVariant = 'filled' | 'outlined' | 'soft'

export interface ZTagProps {
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  variant?: ZTagVariant
  /**
   * 尺寸 —— `number`(px 倍数,默认 0.875 = 14px,1 单位 = 16px)。
   *
   * 内部按比例算其它维度:
   * - `padding-y` = `size * 0.125`
   * - `padding-x` = `size * 0.5`
   * - `border-radius` = `size * 0.25`
   *
   * 2026-05-24 B7:数值尺寸 prop 改 `number`。
   *
   * @example
   * <ZTag :size="0.875" />        <!-- 默认 -->
   * <ZTag :size="1" />            <!-- 1 × 16 = 16px -->
   * <ZTag :size="1.25" />         <!-- 大号 -->
   */
  size?: number
  closable?: boolean
  round?: boolean
  sxClose?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZTagEmits {
  (e: 'close', evt: MouseEvent): void
}
</script>

<script lang="ts" setup>
import { computed, h } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { applyAsBg } from '../_internal/color-bridge'
import { BuiltinIcons } from './icons'
import ZIcon from './ZIcon.vue'
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(number 是 px 倍数,1 单位 = 16px,sizePx(n) = n × 16):
 *
 *   ┌──────────────────────────────────────────┐
 *   │ ZTag                                     │   inline-flex,gap: _tiny
 *   │   font-size: sizePx(size)                │   默认 size=0.875(14px)
 *   │   padding-y: sizePx(size*0.125)          │   ≈ 1.75px
 *   │   padding-x: sizePx(size*0.5)            │   ≈ 7px
 *   │   border-radius: sizePx(size*0.25)       │   ≈ 3.5px
 *   │     round=true → _full                   │   border-width: _thin
 *   │                                          │
 *   │  ┌─────────┐ ┌────────────┐             │
 *   │  │  slot   │ │ close btn  │(closable)   │
 *   │  │ default │ │ ZIcon close│             │
 *   │  └─────────┘ └────────────┘             │
 *   └──────────────────────────────────────────┘
 *
 * 用户改 size 数字 → 所有 px 维度等比缩放(整体比例不变)。
 * 3 个 variant: filled(bg color + 反色文字) / outlined(透明 bg + 主色边框文字) /
 * soft(主色 alpha(12) 浅 bg + 主色文字)。非 px 单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZTagProps>(), {
  variant: 'soft',
  size: 0.875,
  closable: false,
  round: false,
})

const emit = defineEmits<ZTagEmits>()

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, s => {
    const size = props.size ?? 0.875
    s.display.inlineFlex
    s.alignItems.center
    s.gap._tiny
    s.lineHeight._tight
    s.fontSize.px(sizePx(size))
    s.paddingTop.px(sizePx(size * 0.125))
    s.paddingBottom.px(sizePx(size * 0.125))
    s.paddingLeft.px(sizePx(size * 0.5))
    s.paddingRight.px(sizePx(size * 0.5))
    if (props.round) s.borderRadius._full
    else s.borderRadius.px(sizePx(size * 0.25))
    s.borderWidth._thin
    s.borderStyle.solid
    s.whiteSpace.nowrap

    // 2026-05-23 技术债务修复:filled 不用 `backgroundColor.currentColor` 桥接(避免 currentColor
    // 在 paint 时被后续 color 改写);soft 不用 `opacity` 整体淡化(会让文字/图标一起淡)。
    const hasUserColor = !!props.color

    if (hasUserColor) s.color(props.color)
    else s.color._textSecondary

    switch (props.variant) {
      case 'filled':
        if (!applyAsBg(s, props.color)) {
          s.backgroundColor._textSecondary
        }
        s.color._bg
        s.borderColor.transparent
        break
      case 'outlined':
        s.backgroundColor.transparent
        s.borderColor.currentColor
        break
      case 'soft':
        // 默认 color → 走 alpha 浅背景 + 主色文字;user color 时降级为透明背景 + 文字(像 outlined 无边框)
        if (hasUserColor) {
          s.backgroundColor.transparent
        } else {
          s.backgroundColor._textSecondary.alpha(12)
        }
        s.borderColor.transparent
        break
    }
    props.css?.(s)
  }),
)

const closeBtnClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.cursor.pointer
    s.backgroundColor.transparent
    s.borderStyle.none
    s.padding.px(0)
    s.color.currentColor
    s.opacity._strong
    s._hover(h2 => {
      h2.opacity._full
    })
    s._focusVisible(f => {
      f.outlineWidth._middle
      f.outlineStyle.solid
      f.outlineColor._focusRing.alpha(40)
      f.outlineOffset.px(1)
    })
    applySx(s, props.sxClose)
  }),
)
const sxCloseAttrs = computed(() => extractSxAttrs(props.sxClose))

function onClose(e: MouseEvent): void {
  e.stopPropagation()
  emit('close', e)
}

const closeIcon = computed(() => h(ZIcon, { component: BuiltinIcons.close }))
</script>

<template>
  <span :class="rootClass">
    <slot />
    <button
      v-if="closable"
      type="button"
      :ref="sxCloseAttrs.ref"
      :class="[closeBtnClass, sxCloseAttrs.class]"
      :style="sxCloseAttrs.style"
      aria-label="关闭"
      v-bind="sxCloseAttrs.attrs"
      @click="onClose"
    >
      <component :is="closeIcon" />
    </button>
  </span>
</template>
