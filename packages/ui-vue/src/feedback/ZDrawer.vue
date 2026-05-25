<script lang="ts">
/**
 * `ZDrawer` —— 抽屉(类 Modal 但从 left/right/top/bottom 滑入)。
 *
 * **API**(跟 ZModal 类似):
 * - `v-model:visible`
 * - `placement?: 'left' | 'right' | 'top' | 'bottom'` —— 默认 `'right'`
 * - `size?: SizePropMulti` —— 尺寸 factory,用户自己写 `s.width.iem(...)` 或 `s.height.iem(...)`(placement 决定哪条轴)。默认等价 20iem(left/right=width,top/bottom=height)。
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

export interface ZDrawerProps {
  visible?: boolean
  placement?: 'left' | 'right' | 'top' | 'bottom'
  /**
   * 抽屉宽度(left/right placement)或高度(top/bottom placement)—— `number`(iem 倍数,默认 24 = 384px,对齐 antd Drawer 378px)。
   *
   * 2026-05-24 B7:数值尺寸 prop 改 `number`。
   *
   * `placement` 决定 size 应用到哪条轴:left/right → width;top/bottom → height。
   * 非 iem 单位(如 vh / pct)走 `css` 兜底。
   *
   * @example
   * <ZDrawer :size="25" />                 <!-- 25iem 宽抽屉 -->
   * <ZDrawer placement="top" :size="20" /> <!-- 20iem 高顶部抽屉 -->
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
import { computed, h, onScopeDispose, ref, watch } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { useEscapeStack } from '../_hooks'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { lockBodyScroll } from '../_internal/body-scroll-lock'
import { applyScrollbarStyles } from '../_internal/scrollbarStyles'
import { BuiltinIcons, ZIcon } from '../gene'

/**
 * 盒子模型(iem,Provider 控制基准;number 是 iem 倍数,默认 1iem=16px @ 1080p):
 *
 *   ┌─────────────────────────────────────────────────────┐
 *   │ mask  position fixed inset 0  z-index _modal        │   bg _overlayBg.alpha(50)
 *   │                                                     │
 *   │   ┌──────────────────────────────────────┐ (right) │   drawer:
 *   │   │ drawer                               │         │     position fixed
 *   │   │   left/right → width: `size` iem    │         │     bg _bg / color _text
 *   │   │   top/bottom → height: `size` iem   │         │     boxShadow _huge
 *   │   │     默认 size=24(384px @ 1080p)    │         │     flex column
 *   │   │     传 size=20 → 20iem(320px)      │         │
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
 * 非 iem 单位(vh / pct)走 `:css` 兜底:`s.height.vh(50)`。
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

    const size = props.size ?? 20
    switch (props.placement) {
      case 'left':
        s.top.px(0)
        s.left.px(0)
        s.bottom.px(0)
        s.width.iem(size)
        break
      case 'right':
        s.top.px(0)
        s.right.px(0)
        s.bottom.px(0)
        s.width.iem(size)
        break
      case 'top':
        s.top.px(0)
        s.left.px(0)
        s.right.px(0)
        s.height.iem(size)
        break
      case 'bottom':
        s.bottom.px(0)
        s.left.px(0)
        s.right.px(0)
        s.height.iem(size)
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
    applyScrollbarStyles(s, theme.value)
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

const rootRef = ref<HTMLElement | null>(null)
/**
 * mask 元素 ref 合并器 —— 同时写入内部 `rootRef`(defineExpose 暴露)与
 * 用户传入的 `sxMask.ref`(string / function / Ref 对象,VNodeRef 形式)。
 */
function bindMask(el: unknown): void {
  const node = (el as HTMLElement | null) ?? null
  rootRef.value = node
  const userRef = sxMaskAttrs.value.ref
  if (typeof userRef === 'function') userRef(node, {})
  else if (userRef && typeof userRef === 'object' && 'value' in userRef) {
    ;(userRef as { value: unknown }).value = node
  }
}
defineExpose({ rootRef })
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" :ref="bindMask" :class="[maskClass, sxMaskAttrs.class]" :style="sxMaskAttrs.style" v-bind="sxMaskAttrs.attrs" @click.self="onMaskClick" />
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
        <button v-if="closable" type="button" :class="closeBtnClass" aria-label="关闭" @click="onCloseClick">
          <component :is="closeIconNode" />
        </button>
      </div>
      <div
        :ref="sxBodyAttrs.ref"
        :class="[bodyClass, sxBodyAttrs.class]"
        :style="sxBodyAttrs.style"
        v-bind="sxBodyAttrs.attrs"
      >
        <slot />
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
