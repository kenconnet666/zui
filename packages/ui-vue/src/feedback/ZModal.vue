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
import { computed, h, onScopeDispose, ref, watch } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { useEscapeStack } from '../_hooks'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { lockBodyScroll } from '../_internal/body-scroll-lock'
import { applyScrollbarStyles } from '../_internal/scrollbarStyles'
import { useScrollbarOverlay } from '../_internal/useScrollbarOverlay'
import { BuiltinIcons, ZIcon } from '../gene'
import { sizePx } from '../_internal/sizing'
import { applyUserRef } from '../_internal/merge-ref'

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

const maskClass = computed(() =>
  icss(theme.value, s => {
    s.position.fixed
    s.inset.px(0)
    s.display.flex
    s.justifyContent.center
    s.alignItems(props.centered ? 'center' : 'flex-start')
    s.backgroundColor._overlayBg.alpha(50)
    if (props.zIndex !== undefined) s.zIndex(props.zIndex)
    else s.zIndex._modal
    applySx(s, props.sxMask)
  }),
)
const sxMaskAttrs = computed(() => extractSxAttrs(props.sxMask))

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
const sxDialogAttrs = computed(() => extractSxAttrs(props.sxDialog))

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
const sxHeadAttrs = computed(() => extractSxAttrs(props.sxHead))

// ─── body overlay scrollbar ──────────────────────────────────────────────────
const bodyOverlay = useScrollbarOverlay(theme)

/** 外层 wrapper：承接 sxBody attrs、position:relative 定位 overlay track。 */
const bodyClass = computed(() =>
  icss(theme.value, s => {
    s.position.relative
    s.flexGrow(1)
    s.minHeight.px(0)
    s.overflow.hidden
    applySx(s, props.sxBody)
  }),
)

/** 内层真正滚动的 div：height:100% + overflow-y:auto + native scrollbar 隐藏。 */
const bodyScrollerClass = computed(() =>
  icss(theme.value, s => {
    s.height.pct(100)
    s.overflowY.auto
    s.padding._middle
    applyScrollbarStyles(s, theme.value)
  }),
)

const sxBodyAttrs = computed(() => extractSxAttrs(props.sxBody))

const footClass = computed(() =>
  icss(theme.value, s => {
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
  icss(theme.value, s => {
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
    s._hover(h2 => {
      h2.backgroundColor._textSecondary.alpha(8)
    })
  }),
)

const fadeActiveClass = computed(() =>
  icss(theme.value, s => {
    s.transitionProperty._opacity
    s.transitionDuration._small
    s.transitionTimingFunction._default
  }),
)
const fadeBoundaryClass = computed(() => icss(theme.value, s => s.opacity._none))

function onMaskClick(e: MouseEvent): void {
  if (e.target !== e.currentTarget) return
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

// Body scroll lock —— 多实例共享(2026-05-23 技术债务修复)
let releaseLock: (() => void) | null = null
watch(
  () => props.visible,
  v => {
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

const rootRef = ref<HTMLElement | null>(null)
/**
 * mask 元素 ref 合并器 —— 同时写入内部 `rootRef`(defineExpose 暴露)与
 * 用户传入的 `sxMask.ref`(string / function / Ref 对象,VNodeRef 形式)。
 */
function bindMask(el: unknown): void {
  const node = (el as HTMLElement | null) ?? null
  rootRef.value = node
  applyUserRef(sxMaskAttrs.value.ref, node)
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
          v-bind="sxDialogAttrs.attrs"
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
              <slot name="closeIcon">
                <component :is="closeIconNode" />
              </slot>
            </button>
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
