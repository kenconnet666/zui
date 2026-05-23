<script lang="ts">
/**
 * `ZDrawer` —— 抽屉(类 Modal 但从 left/right/top/bottom 滑入)。
 *
 * **API**(跟 ZModal 类似):
 * - `v-model:visible`
 * - `placement?: 'left' | 'right' | 'top' | 'bottom'` —— 默认 `'right'`
 * - `size?: string | number` —— 宽度(left/right)或高度(top/bottom),默认 `'320px'`
 * - `title?: string`
 * - `closable?: boolean`
 * - `maskClosable?: boolean`
 * - sx:sxMask / sxDrawer / sxHead / sxBody / sxFoot
 *
 * **a11y**:`role="dialog"` + `aria-modal`。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'
import type { Size5 } from '../_internal/size-prop'

export type ZDrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

export interface ZDrawerProps {
  visible?: boolean
  placement?: ZDrawerPlacement
  /**
   * 抽屉宽度(left/right)或高度(top/bottom)。
   *
   * 接受 3 种形态:
   * - **`Size5` 档位字符串**(`'tiny'`/`'small'`/`'middle'`(默认)/`'large'`/`'huge'`)→ iem 联动 8/12/20/28/40iem(128/192/320/448/640px @ 默认 iem)
   * - **`number`** → `${N}px` 字面量
   * - **其它字符串** → 原样作为 CSS 值(如 `'50%'` / `'30vw'`)
   *
   * **不接 factory**(placement 决定 width vs height,factory 表达不直观;复杂控制走 `css`)。
   */
  size?: Size5 | number | string
  title?: string
  closable?: boolean
  maskClosable?: boolean
  sxMask?: SxObject
  sxDrawer?: SxObject
  sxHead?: SxObject
  sxBody?: SxObject
  sxFoot?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZDrawerEmits {
  (e: 'update:visible', value: boolean): void
  (e: 'close'): void
  (e: 'mask-click'): void
}
</script>

<script lang="ts" setup>
import { computed, h, onScopeDispose, watch } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { useEscapeStack } from '../_hooks'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { lockBodyScroll } from '../_internal/body-scroll-lock'
import { BuiltinIcons, ZIcon } from '../gene'

const props = withDefaults(defineProps<ZDrawerProps>(), {
  visible: false,
  placement: 'right',
  size: 'middle',
  closable: true,
  maskClosable: true,
})

const emit = defineEmits<ZDrawerEmits>()

const theme = useZTheme()

const visibleRef = computed(() => props.visible)

useEscapeStack(
  () => {
    if (props.visible) {
      emit('update:visible', false)
      emit('close')
    }
  },
  { enabled: visibleRef },
)

/** Size5 → iem 倍率(数值=iem 倍数,默认 16px 基准 = 128/192/320/448/640px)。 */
const SIZE_IEM: Record<Size5, number> = {
  tiny: 8,
  small: 12,
  middle: 20,
  large: 28,
  huge: 40,
}

function isSize5(v: string): v is Size5 {
  return v === 'tiny' || v === 'small' || v === 'middle' || v === 'large' || v === 'huge'
}

const sizeValue = computed(() => {
  const s = props.size
  if (typeof s === 'number') return `${s}px`
  if (isSize5(s)) return `calc(${SIZE_IEM[s]} * var(--zui-iem, 16px))`
  return s
})

const maskClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.fixed
    s.inset.px(0)
    s.backgroundColor._overlayBg.alpha(50)
    s.zIndex._modal
    applySx(s, props.sxMask)
  }),
)
const sxMaskAttrs = computed(() => extractSxAttrs(props.sxMask))

const drawerClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.fixed
    s.backgroundColor._bg
    s.color._text
    s.boxShadow._huge
    s.display.flex
    s.flexDirection.column
    s.zIndex._modal

    switch (props.placement) {
      case 'left':
        s.top.px(0)
        s.left.px(0)
        s.bottom.px(0)
        s.width(sizeValue.value)
        break
      case 'right':
        s.top.px(0)
        s.right.px(0)
        s.bottom.px(0)
        s.width(sizeValue.value)
        break
      case 'top':
        s.top.px(0)
        s.left.px(0)
        s.right.px(0)
        s.height(sizeValue.value)
        break
      case 'bottom':
        s.bottom.px(0)
        s.left.px(0)
        s.right.px(0)
        s.height(sizeValue.value)
        break
    }
    props.css?.(s)
    applySx(s, props.sxDrawer)
  }),
)
const sxDrawerAttrs = computed(() => extractSxAttrs(props.sxDrawer))

const headClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.alignItems.center
    s.justifyContent.spaceBetween
    s.padding._middle
    s.borderBottomWidth._thin
    s.borderBottomStyle.solid
    s.borderBottomColor._border
    s.fontWeight._semibold
    s.fontSize._large
    applySx(s, props.sxHead)
  }),
)
const sxHeadAttrs = computed(() => extractSxAttrs(props.sxHead))

const bodyClass = computed(() =>
  icss(theme.value, (s) => {
    s.padding._middle
    s.flexGrow(1)
    s.overflowY.auto
    applySx(s, props.sxBody)
  }),
)
const sxBodyAttrs = computed(() => extractSxAttrs(props.sxBody))

const footClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.justifyContent.flexEnd
    s.gap._small
    s.padding._middle
    s.borderTopWidth._thin
    s.borderTopStyle.solid
    s.borderTopColor._border
    applySx(s, props.sxFoot)
  }),
)
const sxFootAttrs = computed(() => extractSxAttrs(props.sxFoot))

const closeBtnClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.cursor.pointer
    s.backgroundColor.transparent
    s.borderStyle.none
    s.padding._tiny
    s.fontSize._middle
    s.color._textSecondary
    s.borderRadius._tiny
    s._hover((h2) => {
      h2.backgroundColor._textSecondary.alpha(8)
    })
  }),
)

function onMaskClick(): void {
  emit('mask-click')
  if (props.maskClosable) {
    emit('update:visible', false)
    emit('close')
  }
}
function onCloseClick(): void {
  emit('update:visible', false)
  emit('close')
}

// body scroll lock —— 多实例共享(2026-05-23 技术债务修复)
let releaseLock: (() => void) | null = null
watch(
  () => props.visible,
  (v) => {
    if (v && !releaseLock) {
      releaseLock = lockBodyScroll()
    } else if (!v && releaseLock) {
      releaseLock()
      releaseLock = null
    }
  },
  { immediate: true },
)
onScopeDispose(() => {
  if (releaseLock) {
    releaseLock()
    releaseLock = null
  }
})

const closeIconNode = computed(() => h(ZIcon, { component: BuiltinIcons.close }))
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" :class="[maskClass, sxMaskAttrs.class]" :style="sxMaskAttrs.style" v-bind="sxMaskAttrs.attrs" @click.self="onMaskClick" />
    <div
      v-if="visible"
      :class="[drawerClass, sxDrawerAttrs.class]"
      :style="sxDrawerAttrs.style"
      role="dialog"
      aria-modal="true"
      v-bind="sxDrawerAttrs.attrs"
    >
      <div
        v-if="title || $slots.head || closable"
        :class="[headClass, sxHeadAttrs.class]"
        :style="sxHeadAttrs.style"
        v-bind="sxHeadAttrs.attrs"
      >
        <div>
          <slot name="head">{{ title }}</slot>
        </div>
        <button v-if="closable" type="button" :class="closeBtnClass" aria-label="关闭" @click="onCloseClick">
          <component :is="closeIconNode" />
        </button>
      </div>
      <div
        :class="[bodyClass, sxBodyAttrs.class]"
        :style="sxBodyAttrs.style"
        v-bind="sxBodyAttrs.attrs"
      >
        <slot />
      </div>
      <div
        v-if="$slots.foot"
        :class="[footClass, sxFootAttrs.class]"
        :style="sxFootAttrs.style"
        v-bind="sxFootAttrs.attrs"
      >
        <slot name="foot" />
      </div>
    </div>
  </Teleport>
</template>
