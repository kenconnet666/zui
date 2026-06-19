<script lang="ts">
/**
 * `ZDrawer` —— 抽屉(类 Modal 但从 left/right/top/bottom 滑入)。
 *
 * **API**(跟 ZModal 类似):
 * - `v-model:visible`
 * - `placement?: 'left' | 'right' | 'top' | 'bottom'` —— 默认 `'right'`
 * - `size?: number` —— 尺寸(px 倍数,1 单位 = 16px),默认 24(= 384px);left/right placement 控制 width,top/bottom 控制 height。
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

export type ZDrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

export interface ZDrawerProps {
  visible?: boolean
  placement?: ZDrawerPlacement
  /**
   * 抽屉宽度(left/right placement)或高度(top/bottom placement)—— `number`(px 倍数(1 单位 = 16px),默认 24 = 384px,对齐 antd Drawer 378px)。
   *
   * 2026-05-24 B7:数值尺寸 prop 改 `number`。
   *
   * `placement` 决定 size 应用到哪条轴:left/right → width;top/bottom → height。
   * 非标准尺寸(如 vh / pct)走 `css` 兜底。
   *
   * @example
   * <ZDrawer :size="25" />                 <!-- 25 × 16 = 400px 宽抽屉 -->
   * <ZDrawer placement="top" :size="20" /> <!-- 20 × 16 = 320px 高顶部抽屉 -->
   * <ZDrawer placement="top" :css="(s) => s.height.vh(50)" />  <!-- vh 走 css -->
   */
  size?: number
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
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { useOverlay } from '../_hooks/useOverlay'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(number 是 px 倍数(1 单位 = 16px),默认 1 单位 = 16px @ 1080p):
 *
 *   ┌─────────────────────────────────────────────────────┐
 *   │ mask  position fixed inset 0  z-index _modal        │   bg _overlayBg.alpha(50)
 *   │                                                     │
 *   │   ┌──────────────────────────────────────┐ (right) │   drawer:
 *   │   │ drawer                               │         │     position fixed
 *   │   │   left/right → width: sizePx(`size`) │         │     bg _bg / color _text
 *   │   │   top/bottom → height: sizePx(`size`)│         │     boxShadow _huge
 *   │   │     默认 size=24(384px @ 1080p)      │         │     flex column
 *   │   │     传 size=20 → 320px               │         │
 *   │   │                                      │         │
 *   │   │  ┌────────────────────────────────┐  │         │   head(条件):
 *   │   │  │ head: title + close            │  │         │     pad _middle
 *   │   │  │   pad _middle  border-b _thin  │  │         │     border-b _thin _border
 *   │   │  │   fontSize _large  _semibold   │  │         │
 *   │   │  └────────────────────────────────┘  │         │
 *   │   │  ┌────────────────────────────────┐  │         │   body:
 *   │   │  │ body: #default                 │  │         │     pad _middle
 *   │   │  │   pad _middle  flex-grow 1     │  │         │     overflow-y auto
 *   │   │  │   overflow-y auto              │  │         │
 *   │   │  └────────────────────────────────┘  │         │
 *   │   │  ┌────────────────────────────────┐  │         │   foot(条件):
 *   │   │  │ foot(条件):#foot slot         │  │         │     pad _middle
 *   │   │  │   pad _middle  border-t _thin  │  │         │     border-t _thin _border
 *   │   │  │   flex-end gap _small          │  │         │
 *   │   │  └────────────────────────────────┘  │         │
 *   │   └──────────────────────────────────────┘         │
 *   └─────────────────────────────────────────────────────┘
 *
 * 用户改 size 数字 → drawer 宽/高等比缩(其它布局走固定 spacing token,不缩)。
 * placement 决定 size 作用轴:left/right → width;top/bottom → height。
 * 非标准尺寸(vh / pct)走 `:css` 兜底:`s.height.vh(50)`。
 */
const props = withDefaults(defineProps<ZDrawerProps>(), {
  visible: false,
  placement: 'right',
  size: 24,
  closable: true,
  maskClosable: true,
})

const emit = defineEmits<ZDrawerEmits>()

const theme = useZTheme()

const sxMaskAttrs = computed(() => extractSxAttrs(props.sxMask))
const sxDrawerAttrs = computed(() => extractSxAttrs(props.sxDrawer))
const sxHeadAttrs = computed(() => extractSxAttrs(props.sxHead))
const sxBodyAttrs = computed(() => extractSxAttrs(props.sxBody))
const sxFootAttrs = computed(() => extractSxAttrs(props.sxFoot))

// ─── 共享 overlay 逻辑 ──────────────────────────────────────────────────────
const {
  bodyClass,
  bodyScrollerClass,
  footClass,
  closeBtnClass,
  bodyOverlay: drawerBodyOverlay,
  closeIconNode,
  rootRef,
  bindMask,
  onCloseClick,
  handleMaskClick: onMaskClick,
} = useOverlay(theme, {
  visible: () => props.visible,
  maskClosable: () => props.maskClosable,
  onClose: () => {
    emit('update:visible', false)
    emit('close')
  },
  onMaskClick: () => {
    emit('mask-click')
  },
  sxBody: () => props.sxBody,
  sxFoot: () => props.sxFoot,
  sxMaskRef: () => sxMaskAttrs.value.ref,
})

// ─── Drawer 专属：maskClass（纯遮罩，无布局属性）────────────────────────────
const maskClass = computed(() =>
  icss(theme.value, s => {
    s.position.fixed
    s.inset.px(0)
    s.backgroundColor._overlayBg.alpha(50)
    s.zIndex._modal
    applySx(s, props.sxMask)
  }),
)

// ─── Drawer 专属：drawerClass（四方向定位）──────────────────────────────────
const drawerClass = computed(() =>
  icss(theme.value, s => {
    s.position.fixed
    s.backgroundColor._bg
    s.color._text
    s.boxShadow._huge
    s.display.flex
    s.flexDirection.column
    s.zIndex._modal

    const size = props.size ?? 20
    switch (props.placement) {
      case 'left':
        s.top.px(0)
        s.left.px(0)
        s.bottom.px(0)
        s.width.px(sizePx(size))
        break
      case 'right':
        s.top.px(0)
        s.right.px(0)
        s.bottom.px(0)
        s.width.px(sizePx(size))
        break
      case 'top':
        s.top.px(0)
        s.left.px(0)
        s.right.px(0)
        s.height.px(sizePx(size))
        break
      case 'bottom':
        s.bottom.px(0)
        s.left.px(0)
        s.right.px(0)
        s.height.px(sizePx(size))
        break
    }
    props.css?.(s)
    applySx(s, props.sxDrawer)
  }),
)

// ─── Drawer headClass（与 Modal headClass 对齐：gap._small 防止长标题挤压关闭按钮）─────────
const headClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.alignItems.center
    s.justifyContent.spaceBetween
    s.gap._small
    s.padding._middle
    s.borderBottomWidth._thin
    s.borderBottomStyle.solid
    s.borderBottomColor._border
    s.fontWeight._semibold
    s.fontSize._large
    applySx(s, props.sxHead)
  }),
)

defineExpose({ rootRef })
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      :ref="bindMask"
      :class="[maskClass, sxMaskAttrs.class]"
      :style="sxMaskAttrs.style"
      v-bind="sxMaskAttrs.attrs"
      @click.self="onMaskClick"
    />
    <div
      v-if="visible"
      :ref="sxDrawerAttrs.ref"
      :class="[drawerClass, sxDrawerAttrs.class]"
      :style="sxDrawerAttrs.style"
      role="dialog"
      aria-modal="true"
      v-bind="sxDrawerAttrs.attrs"
    >
      <div
        v-if="title || $slots.head || closable"
        :ref="sxHeadAttrs.ref"
        :class="[headClass, sxHeadAttrs.class]"
        :style="sxHeadAttrs.style"
        v-bind="sxHeadAttrs.attrs"
      >
        <div>
          <slot name="head">{{ title }}</slot>
        </div>
        <button
          v-if="closable"
          type="button"
          :class="closeBtnClass"
          aria-label="关闭"
          @click="onCloseClick"
        >
          <component :is="closeIconNode" />
        </button>
      </div>
      <div
        :ref="sxBodyAttrs.ref"
        :class="[bodyClass, sxBodyAttrs.class]"
        :style="sxBodyAttrs.style"
        v-bind="sxBodyAttrs.attrs"
        @mouseenter="drawerBodyOverlay.isHovered.value = true"
        @mouseleave="drawerBodyOverlay.isHovered.value = false"
        @focusin="drawerBodyOverlay.isFocused.value = true"
        @focusout="drawerBodyOverlay.isFocused.value = false"
      >
        <div
          :ref="drawerBodyOverlay.scrollEl"
          :class="bodyScrollerClass"
          @scroll="drawerBodyOverlay.onScroll"
        >
          <slot />
        </div>
        <Transition
          enter-active-class="__zs-fade-in"
          leave-active-class="__zs-fade-out"
          enter-from-class="__zs-fade-from"
          leave-to-class="__zs-fade-from"
        >
          <div
            v-if="drawerBodyOverlay.thumbVisible.value"
            :class="drawerBodyOverlay.trackClass.value"
          >
            <div
              :class="drawerBodyOverlay.thumbClass.value"
              :style="drawerBodyOverlay.thumbStyle.value"
            />
          </div>
        </Transition>
      </div>
      <div
        v-if="$slots.foot"
        :ref="sxFootAttrs.ref"
        :class="[footClass, sxFootAttrs.class]"
        :style="sxFootAttrs.style"
        v-bind="sxFootAttrs.attrs"
      >
        <slot name="foot" />
      </div>
    </div>
  </Teleport>
</template>
