/**
 * `useOverlay` —— Modal / Drawer 共享的覆层生命周期 + 样式 composable。
 *
 * 萃取自 ZModal 与 ZDrawer 中完全相同的 ~75 行逻辑：
 * - body-scroll-lock 生命周期（watch visible → lock/unlock + onScopeDispose 释放）
 * - useEscapeStack 注册（visible 时生效，调 onClose）
 * - 共享 class helpers：bodyClass / bodyScrollerClass / footClass / closeBtnClass
 * - useScrollbarOverlay（内层滚动 overlay thumb）
 * - closeIconNode computed
 * - onCloseClick / handleMaskClick 事件回调
 * - rootRef + bindMask ref 合并器
 *
 * **不在此处的内容**（各组件保留）：
 * - maskClass —— Modal 与 Drawer 结构不同（居中布局 vs 纯遮罩）
 * - dialogClass / drawerClass —— 完全不同
 * - headClass —— Modal 多 `gap._small`，Drawer 无；保留各自组件
 * - fadeActiveClass / fadeBoundaryClass —— 仅 Modal 有 Transition
 * - sxXxx attrs 提取（各组件自己持有各自 sx prop）
 */
import { computed, h, onScopeDispose, ref, watch, type Ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import type { ResolvedTheme } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import { useEscapeStack } from './useEscapeStack'
import { lockBodyScroll } from '../_internal/body-scroll-lock'
import { applyScrollbarStyles } from '../_internal/scrollbarStyles'
import { useScrollbarOverlay } from '../_internal/useScrollbarOverlay'
import { BuiltinIcons, ZIcon } from '../gene'
import { applyUserRef } from '../_internal/merge-ref'
import type { SxObject } from '../_internal/sx'
import { applySx } from '../_internal/sx'

export interface UseOverlayOptions {
  /** 当前是否可见。 */
  visible: () => boolean
  /** 点击 mask 时是否允许关闭。 */
  maskClosable: () => boolean
  /** 请求关闭（emit update:visible + close）。 */
  onClose: () => void
  /**
   * 点击 mask 时额外动作（emit mask-click）。
   * 若未传则只走 onClose 逻辑。
   */
  onMaskClick?: () => void
  /** sxBody SxObject，用于 bodyClass 样式 + attrs 取 ref。 */
  sxBody?: () => SxObject | undefined
  /** sxFoot SxObject，用于 footClass 样式 + attrs 取 ref。 */
  sxFoot?: () => SxObject | undefined
  /** sxMask attrs（供 bindMask 写入用户 ref），外部传入以避免重复计算。 */
  sxMaskRef?: () => unknown
}

export interface UseOverlayReturn {
  /** 外层 body wrapper class（position:relative + overflow:hidden + sxBody）。 */
  bodyClass: Ref<string>
  /** 内层真正滚动的 div class（height:100% + overflowY:auto + 隐藏滚动条）。 */
  bodyScrollerClass: Ref<string>
  /** foot class（flex-end + gap + padding + border-top + sxFoot）。 */
  footClass: Ref<string>
  /** 关闭按钮 class（inline-flex 居中 + hover 背景）。 */
  closeBtnClass: Ref<string>
  /** scrollbar overlay 实例（scrollEl / isHovered / isFocused / onScroll / trackClass …）。 */
  bodyOverlay: ReturnType<typeof useScrollbarOverlay>
  /** `<ZIcon component="close">` 节点（computed）。 */
  closeIconNode: Ref<ReturnType<typeof h>>
  /** mask 根节点 ref（供 defineExpose 暴露）。 */
  rootRef: Ref<HTMLElement | null>
  /** mask 元素的 ref 合并函数（写 rootRef + 用户 sxMask.ref）。 */
  bindMask: (el: unknown) => void
  /** 关闭按钮点击处理：调 onClose。 */
  onCloseClick: () => void
  /** mask 点击处理：触发 onMaskClick 回调，maskClosable 时再调 onClose。 */
  handleMaskClick: () => void
}

/**
 * 覆层共享 composable。
 *
 * @param theme  来自 `useZTheme()` 的主题 Ref。
 * @param options 各回调与 sx 取值函数。
 */
export function useOverlay(
  theme: Ref<ResolvedTheme<ZuiSchema>>,
  options: UseOverlayOptions,
): UseOverlayReturn {
  const { visible, maskClosable, onClose, onMaskClick, sxBody, sxFoot, sxMaskRef } = options

  // ─── ESC 栈 ──────────────────────────────────────────────────────────────────
  const visibleRef = computed(() => visible())
  useEscapeStack(
    () => {
      if (visible()) {
        onClose()
      }
    },
    { enabled: visibleRef },
  )

  // ─── body scroll lock ────────────────────────────────────────────────────────
  let releaseLock: (() => void) | null = null
  watch(
    visibleRef,
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

  // ─── 共享 class helpers ───────────────────────────────────────────────────────

  /** 外层 body wrapper：position:relative，overflow:hidden，定位 overlay track。 */
  const bodyClass = computed(() =>
    icss(theme.value, s => {
      s.position.relative
      s.flexGrow(1)
      s.minHeight.px(0)
      s.overflow.hidden
      applySx(s, sxBody?.())
    }),
  )

  /** 内层滚动 div：height:100% + overflowY:auto + 隐藏原生滚动条。 */
  const bodyScrollerClass = computed(() =>
    icss(theme.value, s => {
      s.height.pct(100)
      s.overflowY.auto
      s.padding._middle
      applyScrollbarStyles(s, theme.value)
    }),
  )

  const footClass = computed(() =>
    icss(theme.value, s => {
      s.display.flex
      s.justifyContent.flexEnd
      s.gap._small
      s.padding._middle
      s.borderTopWidth._thin
      s.borderTopStyle.solid
      s.borderTopColor._border
      applySx(s, sxFoot?.())
    }),
  )

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

  // ─── scrollbar overlay ───────────────────────────────────────────────────────
  const bodyOverlay = useScrollbarOverlay(theme)

  // ─── 关闭 icon 节点 ──────────────────────────────────────────────────────────
  const closeIconNode = computed(() => h(ZIcon, { component: BuiltinIcons.close }))

  // ─── mask ref 合并 ───────────────────────────────────────────────────────────
  const rootRef = ref<HTMLElement | null>(null)
  function bindMask(el: unknown): void {
    const node = (el as HTMLElement | null) ?? null
    rootRef.value = node
    applyUserRef(sxMaskRef?.(), node)
  }

  // ─── 事件处理 ────────────────────────────────────────────────────────────────
  function onCloseClick(): void {
    onClose()
  }

  function handleMaskClick(): void {
    onMaskClick?.()
    if (maskClosable()) {
      onClose()
    }
  }

  return {
    bodyClass,
    bodyScrollerClass,
    footClass,
    closeBtnClass,
    bodyOverlay,
    closeIconNode,
    rootRef,
    bindMask,
    onCloseClick,
    handleMaskClick,
  }
}
