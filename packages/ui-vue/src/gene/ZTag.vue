<script lang="ts">
/**
 * `ZTag` —— 标签(对应 antd Tag / naive NTag)。
 *
 * - `color` carrier factory —— 主色(默认 `_textSecondary`)
 * - `variant: 'filled' | 'outlined' | 'soft'`(默认 `'soft'`)
 * - `size?: SizePropMulti` —— 尺寸 factory(默认等价 `TAG_SIZE_MAP.middle`)
 * - `closable: boolean` —— 关闭按钮 + emit close
 * - `round: boolean` —— 圆角胶囊形
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'
import type { SizePropMulti } from '../_internal/size-prop'
import { makeSizeMap } from '../_internal/size-prop'

export interface ZTagProps {
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  variant?: 'filled' | 'outlined' | 'soft'
  /** 尺寸 —— 纯 factory(默认等价 `TAG_SIZE_MAP.middle`,影响 fontSize + padding-y 双轴)。 */
  size?: SizePropMulti
  closable?: boolean
  round?: boolean
  sxClose?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZTagEmits {
  (e: 'close', evt: MouseEvent): void
}

/** ZTag size 档位 —— 同时影响 fontSize + padding-y(多 carrier 维度,3 阶实现 + fallback)。 */
const TAG_SIZE_MAP = makeSizeMap<Chain<ZuiSchema>>({
  small: (s) => {
    s.fontSize._tiny
    s.paddingTop.iem(0.125)
    s.paddingBottom.iem(0.125)
  },
  middle: (s) => {
    s.fontSize._small
    s.paddingTop.iem(0.25)
    s.paddingBottom.iem(0.25)
  },
  large: (s) => {
    s.fontSize._middle
    s.paddingTop.iem(0.375)
    s.paddingBottom.iem(0.375)
  },
})
</script>

<script lang="ts" setup>
import { computed, h } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { applyAsBg } from '../_internal/color-bridge'
import { applySizeProp } from '../_internal/size-prop'
import { BuiltinIcons } from './icons'
import ZIcon from './ZIcon.vue'

const props = withDefaults(defineProps<ZTagProps>(), {
  variant: 'soft',
  size: TAG_SIZE_MAP.middle,
  closable: false,
  round: false,
})

const emit = defineEmits<ZTagEmits>()

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap._tiny
    s.lineHeight._tight
    applySizeProp(props.size, s)
    s.paddingLeft._small
    s.paddingRight._small
    if (props.round) s.borderRadius._full
    else s.borderRadius.iem(0.25)
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
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.cursor.pointer
    s.backgroundColor.transparent
    s.borderStyle.none
    s.padding.px(0)
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
