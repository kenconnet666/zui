<script lang="ts">
/**
 * `ZButton` —— Material 风按钮(Stage 6.6,Phase α 收尾)。
 *
 * **5 种 variant**(M3 命名习惯):
 * - `filled`(默认)—— 实心按钮(primary 背景 + 反色文字)
 * - `outlined` —— 描边(透明背景 + primary 边框 + primary 文字)
 * - `text` —— 文字按钮(无背景无边框)
 * - `ghost` —— 半透明背景(`primary.alpha(8)`,跟 hover state 同色)
 * - `link` —— 内联链接样式(下划线 + primary 色)
 *
 * **API**:
 * - `color` carrier factory —— 主色(默认 `_primary`,可走 `_danger` 等)
 * - `size`(small/middle/large)
 * - `loading` / `disabled` / `block`(满宽)
 * - `prefixIcon` / `suffixIcon` slot
 * - `ripple`(boolean,默认 `true`)—— 启用 Material 波纹
 * - sx:sxIcon / sxRipple
 *
 * **Material 行为**:
 * - useRipple 启用 pointerdown 波纹
 * - hover state layer:`primary.alpha(8)` 叠层
 * - active state layer:`primary.alpha(12)` 叠层
 * - `:focus-visible` → primary 外环(2px outline,offset 2px)
 *
 * **a11y**:`aria-disabled` / `aria-busy`(loading 时) / `aria-label`(透传)。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export type ZButtonVariant = 'filled' | 'outlined' | 'text' | 'ghost' | 'link'
export type ZButtonSize = 'small' | 'middle' | 'large'

export interface ZButtonProps {
  variant?: ZButtonVariant
  /** 主色 factory(默认 `_primary`)。可写 `(c) => c._danger` 等。 */
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  size?: ZButtonSize
  loading?: boolean
  disabled?: boolean
  block?: boolean
  /** 是否启用 ripple 波纹,默认 `true`(`filled` / `ghost` / `outlined` 推荐;`text` / `link` 可关)。 */
  ripple?: boolean
  /** HTML type 属性(默认 `'button'`)。 */
  type?: 'button' | 'submit' | 'reset'

  sxIcon?: SxObject
  sxRipple?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZButtonEmits {
  (e: 'click', evt: MouseEvent): void
}
</script>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { useRipple } from '../_hooks'
import { BuiltinIcons } from './icons'
import ZIcon from './ZIcon.vue'

const props = withDefaults(defineProps<ZButtonProps>(), {
  variant: 'filled',
  size: 'middle',
  loading: false,
  disabled: false,
  block: false,
  ripple: true,
  type: 'button',
})

const emit = defineEmits<ZButtonEmits>()

const theme = useZTheme()
const btnRef = ref<HTMLButtonElement | null>(null)

const SIZE_PADDING_Y: Record<ZButtonSize, number> = {
  small: 0.25,
  middle: 0.5,
  large: 0.75,
}

const SIZE_PADDING_X: Record<ZButtonSize, 'small' | 'middle' | 'large'> = {
  small: 'small',
  middle: 'middle',
  large: 'large',
}

const SIZE_FONT: Record<ZButtonSize, 'small' | 'middle' | 'large'> = {
  small: 'small',
  middle: 'middle',
  large: 'large',
}

const isClickDisabled = computed(() => props.disabled || props.loading)

useRipple(btnRef, {
  disabled: computed(() => !props.ripple || isClickDisabled.value),
  color: 'rgba(255, 255, 255, 0.35)',
})

const buttonClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.gap._tiny
    s.fontSize[`_${SIZE_FONT[props.size]}`]
    s.fontWeight._medium
    s.lineHeight._tight
    s.paddingTop.iem(SIZE_PADDING_Y[props.size])
    s.paddingBottom.iem(SIZE_PADDING_Y[props.size])
    s.paddingLeft[`_${SIZE_PADDING_X[props.size]}`]
    s.paddingRight[`_${SIZE_PADDING_X[props.size]}`]
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s._prop('borderColor', 'transparent')
    s.cursor.pointer
    s._prop('userSelect', 'none')
    s._prop('overflow', 'hidden')
    s._prop('position', 'relative')
    s.transitionProperty._default
    s.transitionDuration._small
    if (props.block) s.width.pct(100)

    // color factory:用户指定 → 走 chain;默认 _primary
    // 用作"主色"挂在 color carrier(供 outlined/text/link/ghost 用)
    if (props.color) s.color(props.color)
    else s.color._primary

    // variant 区分。State layer 用 `_primary.alpha(...)` 统一;用户传 user color 时通过
    // `currentColor` + ::before / box-shadow 模拟有偏。本 v1 简化:user color 时 hover/active
    // 仅靠 elevation/opacity 变化,不叠 state layer。
    const hasUserColor = !!props.color

    switch (props.variant) {
      case 'filled':
        s.backgroundColor.currentColor
        s.color._bg
        s.boxShadow._tiny
        s._hover((h2) => {
          h2.boxShadow._small
        })
        s._active((a) => {
          a.boxShadow._tiny
        })
        break
      case 'outlined':
        s._prop('borderColor', 'currentColor')
        s.backgroundColor.transparent
        if (!hasUserColor) {
          s._hover((h2) => {
            h2.backgroundColor._primary.alpha(8)
          })
          s._active((a) => {
            a.backgroundColor._primary.alpha(12)
          })
        }
        break
      case 'text':
        s.backgroundColor.transparent
        if (!hasUserColor) {
          s._hover((h2) => {
            h2.backgroundColor._primary.alpha(8)
          })
          s._active((a) => {
            a.backgroundColor._primary.alpha(12)
          })
        }
        break
      case 'ghost':
        if (!hasUserColor) {
          s.backgroundColor._primary.alpha(8)
          s._hover((h2) => {
            h2.backgroundColor._primary.alpha(12)
          })
        } else {
          // user color 时,ghost 走 currentColor opacity 模拟(text 颜色由 user color 决定)
          s.opacity(0.92)
          s._hover((h2) => {
            h2.opacity(1)
          })
        }
        break
      case 'link':
        s.backgroundColor.transparent
        s._prop('textDecoration', 'none')
        s.borderRadius._tiny
        s._hover((h2) => {
          h2._prop('textDecoration', 'underline')
        })
        break
    }

    // :focus-visible outline ring(M3 模式)── 用户 color 时走 _primary 备份
    s._focusVisible((f) => {
      f._prop('outlineWidth', '2px')
      f._prop('outlineStyle', 'solid')
      f.outlineColor._focusRing.alpha(40)
      f._prop('outlineOffset', '2px')
    })

    if (isClickDisabled.value) {
      s.opacity._dim
      s._prop('cursor', 'not-allowed')
    }

    props.css?.(s)
  }),
)

const iconClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.flexShrink(0)
    applySx(s, props.sxIcon)
  }),
)
const sxIconAttrs = computed(() => extractSxAttrs(props.sxIcon))

function onClick(e: MouseEvent): void {
  if (isClickDisabled.value) return
  emit('click', e)
}

const loadingIcon = computed(() =>
  h(ZIcon, {
    component: BuiltinIcons.refresh,
    spin: (d: Chain<ZuiSchema>['animationDuration']) => {
      d.s(0.8)
    },
  }),
)
</script>

<template>
  <button
    ref="btnRef"
    :type="type"
    :class="buttonClass"
    :disabled="isClickDisabled"
    :aria-disabled="isClickDisabled"
    :aria-busy="loading"
    @click="onClick"
  >
    <span
      v-if="loading"
      :class="[iconClass, sxIconAttrs.class]"
      :style="sxIconAttrs.style"
      v-bind="sxIconAttrs.attrs"
    >
      <component :is="loadingIcon" />
    </span>
    <span
      v-else-if="$slots.prefixIcon"
      :class="[iconClass, sxIconAttrs.class]"
      :style="sxIconAttrs.style"
      v-bind="sxIconAttrs.attrs"
    >
      <slot name="prefixIcon" />
    </span>
    <slot />
    <span
      v-if="$slots.suffixIcon"
      :class="[iconClass, sxIconAttrs.class]"
      :style="sxIconAttrs.style"
      v-bind="sxIconAttrs.attrs"
    >
      <slot name="suffixIcon" />
    </span>
  </button>
</template>
