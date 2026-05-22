<script lang="ts">
/**
 * `ZTag` —— 标签(对应 antd Tag / naive NTag)。
 *
 * - `color` carrier factory —— 主色(默认 `_textSecondary`)
 * - `variant: 'filled' | 'outlined' | 'soft'`(默认 `'soft'`)
 * - `size: 'small' | 'middle' | 'large'`
 * - `closable: boolean` —— 关闭按钮 + emit close
 * - `round: boolean` —— 圆角胶囊形
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export type ZTagVariant = 'filled' | 'outlined' | 'soft'
export type ZTagSize = 'small' | 'middle' | 'large'

export interface ZTagProps {
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  variant?: ZTagVariant
  size?: ZTagSize
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
import { BuiltinIcons } from './icons'
import ZIcon from './ZIcon.vue'

const props = withDefaults(defineProps<ZTagProps>(), {
  variant: 'soft',
  size: 'middle',
  closable: false,
  round: false,
})

const emit = defineEmits<ZTagEmits>()

const theme = useZTheme()

const SIZE_FONT: Record<ZTagSize, 'tiny' | 'small' | 'middle'> = {
  small: 'tiny',
  middle: 'small',
  large: 'middle',
}

const SIZE_PADDING_Y: Record<ZTagSize, number> = {
  small: 0.125,
  middle: 0.25,
  large: 0.375,
}

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap._tiny
    s.fontSize[`_${SIZE_FONT[props.size]}`]
    s.lineHeight._tight
    s.paddingTop.iem(SIZE_PADDING_Y[props.size])
    s.paddingBottom.iem(SIZE_PADDING_Y[props.size])
    s.paddingLeft._small
    s.paddingRight._small
    s.borderRadius(props.round ? '9999px' : 'calc(0.25 * var(--zui-iem, 16px))')
    s.borderWidth._thin
    s.borderStyle.solid
    s._prop('whiteSpace', 'nowrap')

    if (props.color) s.color(props.color)
    else s.color._textSecondary

    switch (props.variant) {
      case 'filled':
        s.backgroundColor.currentColor
        s.color._bg
        s._prop('borderColor', 'transparent')
        break
      case 'outlined':
        s.backgroundColor.transparent
        s._prop('borderColor', 'currentColor')
        break
      case 'soft':
        if (props.color) s.backgroundColor(props.color)
        else s.backgroundColor._textSecondary
        // soft 时通过 currentColor + opacity 模拟低饱和:用 background-color rgba alpha 8
        // 由于 user color 时 alpha 不可链,这里用 inset 加层方案的简化:soft 仅做透明度
        s.opacity._strong
        s._prop('borderColor', 'transparent')
        break
    }
    props.css?.(s)
  }),
)

const closeBtnClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.cursor.pointer
    s.backgroundColor.transparent
    s.borderStyle.none
    s.padding('0')
    s.color.currentColor
    s.opacity._strong
    s._hover((h2) => {
      h2.opacity._full
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
