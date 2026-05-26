<script lang="ts">
/**
 * `ZButton` —— Material 风按钮。
 *
 * **7 种 variant**:
 * - `filled`(默认)—— 实心按钮(primary 背景 + 反色文字)
 * - `outlined` —— 描边(透明背景 + primary 边框 + primary 文字)
 * - `dashed` —— 虚线描边(同 outlined 但 border-style: dashed)
 * - `secondary` —— 半透明色底(primary.alpha(12) 恒定背景)
 * - `text` —— 文字按钮(无背景无边框)
 * - `ghost` —— 全透明背景(hover 时出现 primary.alpha(8))
 * - `link` —— 内联链接样式(下划线 + primary 色)
 *
 * **4 种 shape**: `default` / `round` / `circle` / `square`
 *
 * **tag prop**: 多态根元素(默认 `button`,可改 `a`、`div` 等)
 *
 * **API**:
 * - `color` carrier factory —— 主色(默认 `_primary`,可走 `_danger` 等)
 * - `size`(iem 倍数,默认 `1`)
 * - `loading` / `disabled` / `block`(满宽)
 * - `prefixIcon` / `suffixIcon` slot
 * - `ripple`(boolean,默认 `true`)—— 启用 Material 波纹
 * - `sxIcon` / `sxRipple`
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export type ZButtonVariant = 'filled' | 'outlined' | 'dashed' | 'secondary' | 'text' | 'ghost' | 'link'
export type ZButtonShape = 'default' | 'round' | 'circle' | 'square'

export interface ZButtonProps {
  variant?: ZButtonVariant
  shape?: ZButtonShape
  /** 多态根元素标签。默认 `'button'`。改 `'a'` 后 disabled 走 aria-disabled + tabIndex=-1。 */
  tag?: string
  /** 主色 factory(默认 `_primary`)。可写 `(c) => c._danger` 等。 */
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  /**
   * 字号尺寸 —— `number`(iem 倍数,默认 1)。
   *
   * 内部公式:
   * - `font-size` = `size` iem
   * - `height` = `height ?? size * 2` iem
   * - `padding-y` = `size * 0.5` iem
   * - `padding-x` = `size * 1` iem (circle/square 时改 0)
   * - `border-radius` = shape 决定
   * - `gap` = `size * 0.5` iem
   */
  size?: number
  /** 高度 —— `number`(iem 倍数,可选,默认 `size * 2`)。 */
  height?: number
  loading?: boolean
  disabled?: boolean
  block?: boolean
  /** 是否启用 ripple 波纹,默认 `true`。 */
  ripple?: boolean
  /** HTML type 属性(默认 `'button'`,tag 非 button 时忽略)。 */
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
import { applyAsBg } from '../_internal/color-bridge'
import { useRipple } from '../_hooks'
import { BuiltinIcons } from './icons'
import ZIcon from './ZIcon.vue'

const props = withDefaults(defineProps<ZButtonProps>(), {
  variant: 'filled',
  shape: 'default',
  tag: 'button',
  size: 1,
  loading: false,
  disabled: false,
  block: false,
  ripple: true,
  type: 'button',
})

const emit = defineEmits<ZButtonEmits>()

const theme = useZTheme()
const btnRef = ref<HTMLElement | null>(null)

const isClickDisabled = computed(() => props.disabled || props.loading)

useRipple(btnRef as Parameters<typeof useRipple>[0], {
  disabled: computed(() => !props.ripple || isClickDisabled.value),
  color: 'rgba(255, 255, 255, 0.35)',
})

const buttonClass = computed(() =>
  icss(theme.value, (s) => {
    const size = props.size ?? 1
    const height = props.height ?? size * 2
    const isCompact = props.shape === 'circle' || props.shape === 'square'

    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.gap.iem(size * 0.5)
    s.fontWeight._medium
    s.lineHeight._tight
    s.fontSize.iem(size)
    s.height.iem(height)
    s.paddingTop.iem(size * 0.5)
    s.paddingBottom.iem(size * 0.5)
    if (isCompact) {
      s.paddingLeft.px(0)
      s.paddingRight.px(0)
      s.width.iem(height)
    } else {
      s.paddingLeft.iem(size * 1)
      s.paddingRight.iem(size * 1)
    }
    // border-radius
    switch (props.shape) {
      case 'round': s.borderRadius.iem(height * 0.5); break
      case 'circle': s.borderRadius.pct(50); break
      case 'square': s.borderRadius.px(0); break
      default: s.borderRadius.iem(size * 0.375)
    }
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor.transparent
    s.cursor.pointer
    s.userSelect.none
    s.overflow.hidden
    s.position.relative
    s.transitionProperty._default
    s.transitionDuration._small
    if (props.block) s.width.pct(100)

    if (props.color) s.color(props.color)
    else s.color._primary

    const hasUserColor = !!props.color

    switch (props.variant) {
      case 'filled':
        if (!applyAsBg(s, props.color)) s.backgroundColor._primary
        s.color._bg
        s.boxShadow._tiny
        s._hover((h2) => { h2.boxShadow._small })
        s._active((a) => { a.boxShadow._tiny })
        break

      case 'outlined':
        s.borderColor.currentColor
        s.backgroundColor.transparent
        if (!hasUserColor) {
          s._hover((h2) => { h2.backgroundColor._primary.alpha(8) })
          s._active((a) => { a.backgroundColor._primary.alpha(12) })
        }
        break

      case 'dashed':
        s.borderColor.currentColor
        s.borderStyle.dashed
        s.backgroundColor.transparent
        if (!hasUserColor) {
          s._hover((h2) => { h2.backgroundColor._primary.alpha(8) })
          s._active((a) => { a.backgroundColor._primary.alpha(12) })
        }
        break

      case 'secondary':
        // 恒定半透明底(primary.alpha(12)),hover 加深到 18%,active 22%
        s.backgroundColor.transparent
        s.position.relative
        s._before((b) => {
          b.content("''")
          b.position.absolute
          b.inset.px(0)
          b.backgroundColor.currentColor
          b.opacity(0.12)
          b.borderRadius.inherit
          b.pointerEvents.none
          b._prop('transition', 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)')
        })
        s._hover((h2) => {
          h2._before((b) => { b.opacity(0.18) })
        })
        s._active((a) => {
          a._before((b) => { b.opacity(0.22) })
        })
        break

      case 'text':
        s.backgroundColor.transparent
        if (!hasUserColor) {
          s._hover((h2) => { h2.backgroundColor._primary.alpha(8) })
          s._active((a) => { a.backgroundColor._primary.alpha(12) })
        }
        break

      case 'ghost':
        // opacity 0 底,hover 出现 8%,active 12%
        s.backgroundColor.transparent
        s.position.relative
        s._before((b) => {
          b.content("''")
          b.position.absolute
          b.inset.px(0)
          b.backgroundColor.currentColor
          b.opacity(0)
          b.borderRadius.inherit
          b.pointerEvents.none
          b._prop('transition', 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)')
        })
        s._hover((h2) => {
          h2._before((b) => { b.opacity(0.08) })
        })
        s._active((a) => {
          a._before((b) => { b.opacity(0.12) })
        })
        break

      case 'link':
        s.backgroundColor.transparent
        s.textDecoration('none')
        s.borderRadius._tiny
        s._hover((h2) => { h2.textDecoration('underline') })
        break
    }

    s._focusVisible((f) => {
      f.outlineWidth._middle
      f.outlineStyle.solid
      f.outlineColor._focusRing.alpha(40)
      f.outlineOffset.px(2)
    })

    if (isClickDisabled.value) {
      s.opacity._dim
      s.cursor.notAllowed
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
    size: props.size ?? 1,
    spin: (d: Chain<ZuiSchema>['animationDuration']) => {
      d.s(0.8)
    },
  }),
)

// 非 button tag 时不传 type/disabled 原生属性;disabled 走 aria + tabIndex
const isNativeButton = computed(() => props.tag === 'button')
</script>

<template>
  <component
    :is="tag"
    ref="btnRef"
    :type="isNativeButton ? type : undefined"
    :disabled="isNativeButton ? isClickDisabled : undefined"
    :aria-disabled="isClickDisabled || undefined"
    :aria-busy="loading || undefined"
    :tabindex="!isNativeButton && isClickDisabled ? -1 : undefined"
    :class="buttonClass"
    @click="onClick"
  >
    <span
      v-if="loading"
      :ref="sxIconAttrs.ref"
      :class="[iconClass, sxIconAttrs.class]"
      :style="sxIconAttrs.style"
      v-bind="sxIconAttrs.attrs"
    >
      <component :is="loadingIcon" />
    </span>
    <span
      v-else-if="$slots.prefixIcon"
      :ref="sxIconAttrs.ref"
      :class="[iconClass, sxIconAttrs.class]"
      :style="sxIconAttrs.style"
      v-bind="sxIconAttrs.attrs"
    >
      <slot name="prefixIcon" />
    </span>
    <slot />
    <span
      v-if="$slots.suffixIcon"
      :ref="sxIconAttrs.ref"
      :class="[iconClass, sxIconAttrs.class]"
      :style="sxIconAttrs.style"
      v-bind="sxIconAttrs.attrs"
    >
      <slot name="suffixIcon" />
    </span>
  </component>
</template>
