<script lang="ts">
/**
 * `ZModal` —— 居中对话框(基于 `usePortal` + `useEscapeStack`,a11y `role="dialog"`)。
 *
 * **API**:
 * - `v-model:visible` —— 双向绑定开关
 * - `title?: string` —— 头部标题(`#head` slot 优先)
 * - `width?: number` —— 宽度(px 倍数,1 单位 = 16px),默认 30(= 480px)
 * - `centered?: boolean` —— 垂直居中,默认 `true`
 * - `closable?: boolean` —— 头部关闭按钮,默认 `true`
 * - `maskClosable?: boolean` —— 点击 mask 关闭,默认 `true`
 * - `to?: string | HTMLElement` —— Teleport target,默认 `body`
 * - `zIndex?: number` —— mask + dialog 共用基准 zIndex(dialog = +1),默认走 schema `zIndex.modal`
 * - `sxMask / sxDialog / sxHead / sxBody / sxFoot` —— sx 配置
 *
 * **slots**:`default`(body) / `head`(自定义头) / `foot`(底部按钮区) / `closeIcon`
 *
 * **不在 v1 内**:focus trap(后续 phase 通过 `@vueuse/integrations/useFocusTrap` 加)。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export interface ZModalProps {
  /** 是否显示(`v-model:visible` 推荐)。 */
  visible?: boolean
  title?: string
  /**
   * 对话框宽度 —— `number`(px 倍数(1 单位 = 16px),默认 30 = 480px)。
   *
   * 2026-05-24 B7:数值尺寸 prop 改 `number`。非标准尺寸走 `css` 兜底。
   *
   * @example
   * <ZModal :width="40" />     <!-- 40 × 16 = 640px -->
   * <ZModal :width="20" />     <!-- 320px 小窗 -->
   * <ZModal :css="(s) => s.width.pct(80)" />   <!-- 80% 视口走 css -->
   */
  width?: number
  centered?: boolean
  closable?: boolean
  maskClosable?: boolean
  /** Teleport target。 */
  to?: string | HTMLElement
  /** mask 自定义 z-index(dialog 自动 +1)。 */
  zIndex?: number

  sxMask?: SxObject
  sxDialog?: SxObject
  sxHead?: SxObject
  sxBody?: SxObject
  sxFoot?: SxObject

  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZModalEmits {
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
import { useZId } from '../_hooks'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { sizePx } from '../_internal/sizing'
import ZButton from '../gene/ZButton.vue'

/**
 * 盒子模型(number 是 px 倍数(1 单位 = 16px),默认 1 单位 = 16px @ 1080p):
 *
 *   ┌─────────────────────────────────────────────────────┐
 *   │ mask  position fixed inset 0  z-index _modal        │   bg _overlayBg.alpha(50)
 *   │   flex / center(centered=true) 或 flex-start        │
 *   │                                                     │
 *   │   ┌───────────────────────────────────────────┐     │
 *   │   │ dialog                                    │     │   宽度 480px(= 30 × 16px)
 *   │   │   max-w: 100vw - 32px 留白               │     │     默认 width=30(480px @ 1080p)
 *   │   │   max-h: 100vh - 32px                    │     │     传 width=40 → 640px
 *   │   │   border-radius: _large                   │     │   bg: _bg / boxShadow: _huge
 *   │   │   flex column                             │     │   z-index: _modal (+1)
 *   │   │                                           │     │
 *   │   │  ┌─────────────────────────────────────┐  │     │   head(条件渲染):
 *   │   │  │ head: title  + close btn           │  │     │     padding _middle
 *   │   │  │   pad _middle  border-b _thin       │  │     │     border-b _thin _border
 *   │   │  │   fontSize _large  _semibold        │  │     │
 *   │   │  └─────────────────────────────────────┘  │     │
 *   │   │  ┌─────────────────────────────────────┐  │     │
 *   │   │  │ body: #default                      │  │     │   body:
 *   │   │  │   pad _middle  flex-grow 1          │  │     │     padding _middle
 *   │   │  │   overflow-y: auto                  │  │     │     overflow-y auto
 *   │   │  └─────────────────────────────────────┘  │     │
 *   │   │  ┌─────────────────────────────────────┐  │     │
 *   │   │  │ foot(条件,#foot slot)            │  │     │   foot(条件渲染):
 *   │   │  │   pad _middle  border-t _thin       │  │     │     padding _middle
 *   │   │  │   flex-end  gap _small              │  │     │     border-t _thin _border
 *   │   │  └─────────────────────────────────────┘  │     │
 *   │   └───────────────────────────────────────────┘     │
 *   └─────────────────────────────────────────────────────┘
 *
 * 用户改 width 数字 → dialog 宽度等比缩(其它布局走固定 spacing token,不缩)。
 * ESC 关 / mask 点击关(maskClosable) / body scroll lock(多实例共享)。
 * 非标准尺寸(vh / pct)走 `:css` 兜底:`s.width.pct(80)`。
 */
const props = withDefaults(defineProps<ZModalProps>(), {
  visible: false,
  width: 30,
  centered: true,
  closable: true,
  maskClosable: true,
  to: 'body',
})

const emit = defineEmits<ZModalEmits>()

const theme = useZTheme()

/** 对话框标题 id，用于 aria-labelledby。 */
const titleId = useZId('modal-title')

const sxMaskAttrs = computed(() => extractSxAttrs(props.sxMask))
const sxDialogAttrs = computed(() => extractSxAttrs(props.sxDialog))
const sxHeadAttrs = computed(() => extractSxAttrs(props.sxHead))
const sxBodyAttrs = computed(() => extractSxAttrs(props.sxBody))
const sxFootAttrs = computed(() => extractSxAttrs(props.sxFoot))

// ─── 共享 overlay 逻辑 ──────────────────────────────────────────────────────
const {
  bodyClass,
  bodyScrollerClass,
  footClass,
  bodyOverlay,
  closeIconNode,
  rootRef,
  bindMask,
  onCloseClick,
  handleMaskClick: overlayHandleMaskClick,
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

// ─── Modal 专属：maskClass（居中布局 + zIndex prop 逻辑）────────────────────
const maskClass = computed(() =>
  icss(theme.value, s => {
    s.position.fixed
    s.inset.px(0)
    s.display.flex
    s.justifyContent.center
    s.alignItems(props.centered ? 'center' : 'flex-start')
    s.backgroundColor._overlayMask
    if (props.zIndex !== undefined) s.zIndex(props.zIndex)
    else s.zIndex._modal
    applySx(s, props.sxMask)
  }),
)

// ─── Modal 专属：dialogClass ─────────────────────────────────────────────────
const dialogClass = computed(() =>
  icss(theme.value, s => {
    s.backgroundColor._bg
    s.color._text
    s.borderRadius._large
    s.boxShadow._huge
    s.display.flex
    s.flexDirection.column
    s.maxHeight(`calc(100vh - ${sizePx(2)}px)`)
    if (props.width !== undefined) s.width.px(sizePx(props.width))
    s.maxWidth(`calc(100vw - ${sizePx(2)}px)`)
    if (!props.centered) s.marginTop._huge
    if (props.zIndex !== undefined) s.zIndex(props.zIndex + 1)
    else s.zIndex._modal

    props.css?.(s)
    applySx(s, props.sxDialog)
  }),
)

// ─── Modal 专属：headClass（含 gap._small，Drawer 无此属性）───────────────────
const headClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.alignItems.center
    s.justifyContent.spaceBetween
    s.gap._small
    s.padding._middle
    s.fontWeight._semibold
    s.fontSize._large
    s.borderBottomWidth._thin
    s.borderBottomStyle.solid
    s.borderBottomColor._border
    applySx(s, props.sxHead)
  }),
)

// ─── Modal 专属：Transition 淡入淡出 classes ─────────────────────────────────
const fadeActiveClass = computed(() =>
  icss(theme.value, s => {
    s.transitionProperty._opacity
    s.transitionDuration._small
    s.transitionTimingFunction._default
  }),
)
const fadeBoundaryClass = computed(() => icss(theme.value, s => s.opacity._none))

/** Modal mask 点击：先检查 e.target（仅 mask 层自身），再委托 overlay 处理。 */
function onMaskClick(e: MouseEvent): void {
  if (e.target !== e.currentTarget) return
  overlayHandleMaskClick()
}

defineExpose({ rootRef })
</script>

<template>
  <Teleport :to="to">
    <Transition
      :enter-from-class="fadeBoundaryClass"
      :enter-active-class="fadeActiveClass"
      :leave-active-class="fadeActiveClass"
      :leave-to-class="fadeBoundaryClass"
    >
      <div
        v-if="visible"
        :ref="bindMask"
        :class="[maskClass, sxMaskAttrs.class]"
        :style="sxMaskAttrs.style"
        v-bind="sxMaskAttrs.attrs"
        @click="onMaskClick"
      >
        <div
          :ref="sxDialogAttrs.ref"
          :class="[dialogClass, sxDialogAttrs.class]"
          :style="sxDialogAttrs.style"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title || $slots.head ? titleId : undefined"
          v-bind="sxDialogAttrs.attrs"
        >
          <div
            v-if="title || $slots.head || closable"
            :ref="sxHeadAttrs.ref"
            :class="[headClass, sxHeadAttrs.class]"
            :style="sxHeadAttrs.style"
            v-bind="sxHeadAttrs.attrs"
          >
            <div :id="title || $slots.head ? titleId : undefined">
              <slot name="head">{{ title }}</slot>
            </div>
            <ZButton
              v-if="closable"
              variant="ghost"
              shape="circle"
              :size="0.875"
              :ripple="false"
              aria-label="关闭"
              @click="onCloseClick"
            >
              <slot name="closeIcon">
                <component :is="closeIconNode" />
              </slot>
            </ZButton>
          </div>

          <div
            :ref="sxBodyAttrs.ref"
            :class="[bodyClass, sxBodyAttrs.class]"
            :style="sxBodyAttrs.style"
            v-bind="sxBodyAttrs.attrs"
            @mouseenter="bodyOverlay.isHovered.value = true"
            @mouseleave="bodyOverlay.isHovered.value = false"
            @focusin="bodyOverlay.isFocused.value = true"
            @focusout="bodyOverlay.isFocused.value = false"
          >
            <div
              :ref="bodyOverlay.scrollEl"
              :class="bodyScrollerClass"
              @scroll="bodyOverlay.onScroll"
            >
              <slot />
            </div>
            <Transition
              enter-active-class="__zs-fade-in"
              leave-active-class="__zs-fade-out"
              enter-from-class="__zs-fade-from"
              leave-to-class="__zs-fade-from"
            >
              <div v-if="bodyOverlay.thumbVisible.value" :class="bodyOverlay.trackClass.value">
                <div :class="bodyOverlay.thumbClass.value" :style="bodyOverlay.thumbStyle.value" />
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
      </div>
    </Transition>
  </Teleport>
</template>
