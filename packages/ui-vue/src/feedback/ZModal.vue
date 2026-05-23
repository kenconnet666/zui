<script lang="ts">
/**
 * `ZModal` —— 居中对话框(基于 `usePortal` + `useEscapeStack`,a11y `role="dialog"`)。
 *
 * **API**:
 * - `v-model:visible` —— 双向绑定开关
 * - `title?: string` —— 头部标题(`#head` slot 优先)
 * - `width?: string | number` —— 默认 `'480px'`(数字按 px)
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
  width?: string | number
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
import { computed, h, onScopeDispose, watch } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { useEscapeStack } from '../_hooks'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { lockBodyScroll } from '../_internal/body-scroll-lock'
import { BuiltinIcons, ZIcon } from '../gene'

const props = withDefaults(defineProps<ZModalProps>(), {
  visible: false,
  width: '480px',
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

const widthValue = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width,
)

const maskClass = computed(() =>
  icss(theme.value, (s) => {
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
  icss(theme.value, (s) => {
    s.backgroundColor._bg
    s.color._text
    s.borderRadius._large
    s.boxShadow._huge
    s.display.flex
    s.flexDirection.column
    s.maxHeight('calc(100vh - calc(2 * var(--zui-iem, 16px)))')
    s.width(widthValue.value)
    s.maxWidth('calc(100vw - calc(2 * var(--zui-iem, 16px)))')
    if (!props.centered) s.marginTop._huge
    if (props.zIndex !== undefined) s.zIndex(props.zIndex + 1)
    else s.zIndex._modal

    props.css?.(s)
    applySx(s, props.sxDialog)
  }),
)
const sxDialogAttrs = computed(() => extractSxAttrs(props.sxDialog))

const headClass = computed(() =>
  icss(theme.value, (s) => {
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
  <Teleport :to="to">
    <Transition name="zui-modal-fade">
      <div
        v-if="visible"
        :class="[maskClass, sxMaskAttrs.class]"
        :style="sxMaskAttrs.style"
        v-bind="sxMaskAttrs.attrs"
        @click="onMaskClick"
      >
        <div
          :class="[dialogClass, sxDialogAttrs.class]"
          :style="sxDialogAttrs.style"
          role="dialog"
          aria-modal="true"
          v-bind="sxDialogAttrs.attrs"
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
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.zui-modal-fade-enter-active,
.zui-modal-fade-leave-active {
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.zui-modal-fade-enter-from,
.zui-modal-fade-leave-to {
  opacity: 0;
}
</style>
