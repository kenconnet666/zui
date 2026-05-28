/**
 * `useScrollbarOverlay` —— 为任意 DOM 滚动容器提供浮层自定义 thumb 能力。
 *
 * **使用方法**：
 * ```ts
 * const overlay = useScrollbarOverlay(theme)
 * ```
 * 在模板中：
 * - 外层 wrapper（`position:relative; overflow:hidden`）绑定：
 *   `@mouseenter="overlay.isHovered.value = true"` 等四个事件
 * - 内层滚动 div 绑定：`:ref="overlay.scrollEl"` + `@scroll="overlay.onScroll"`
 * - 在 wrapper 内（与内层 div 并列）渲染：
 *   `<div v-if="overlay.thumbVisible" :class="overlay.trackClass"> ...`
 */
import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import type { ResolvedTheme } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import { themeColorScheme } from './colorScheme'
import { SCROLL_TRACK_MARGIN, SCROLL_THUMB_MIN_PX, scrollbarThumbColors } from './scrollbarThumb'

export function useScrollbarOverlay(theme: Ref<ResolvedTheme<ZuiSchema>>) {
  const scrollEl = ref<HTMLElement | null>(null)
  const isHovered = ref(false)
  const isFocused = ref(false)
  const scrollTop = ref(0)
  const scrollHeight = ref(0)
  const clientHeight = ref(0)

  function updateMeasurements(): void {
    const el = scrollEl.value
    if (!el) return
    scrollTop.value = el.scrollTop
    scrollHeight.value = el.scrollHeight
    clientHeight.value = el.clientHeight
  }

  function onScroll(): void {
    updateMeasurements()
  }

  let ro: ResizeObserver | null = null

  function attachObserver(el: HTMLElement | null): void {
    ro?.disconnect()
    ro = null
    if (!el) return
    updateMeasurements()
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(updateMeasurements)
      ro.observe(el)
      const firstChild = el.firstElementChild
      if (firstChild) ro.observe(firstChild)
    }
  }

  watch(scrollEl, attachObserver)
  onMounted(() => attachObserver(scrollEl.value))
  onBeforeUnmount(() => ro?.disconnect())

  // ─── Thumb 计算 ──────────────────────────────────────────────────────────────
  const needsScrollbar = computed(() => scrollHeight.value > clientHeight.value + 2)

  const thumbPx = computed(() => {
    if (!needsScrollbar.value) return 0
    return Math.max(
      SCROLL_THUMB_MIN_PX,
      (clientHeight.value / scrollHeight.value) * (clientHeight.value - SCROLL_TRACK_MARGIN),
    )
  })

  const thumbTopPx = computed(() => {
    const maxScroll = scrollHeight.value - clientHeight.value
    if (maxScroll <= 0) return 0
    const track = clientHeight.value - SCROLL_TRACK_MARGIN
    return (scrollTop.value / maxScroll) * (track - thumbPx.value)
  })

  const thumbStyle = computed(() => ({
    height: `${thumbPx.value}px`,
    top: `${thumbTopPx.value}px`,
  }))

  const thumbVisible = computed(() => needsScrollbar.value && (isHovered.value || isFocused.value))

  // ─── 样式 ────────────────────────────────────────────────────────────────────
  const dark = computed(() => themeColorScheme(theme.value) === 'dark')

  const trackClass = computed(() =>
    icss(theme.value, s => {
      s.position.absolute
      s._prop('right', '2px')
      s._prop('top', '2px')
      s._prop('bottom', '2px')
      s._prop('width', '6px')
      s._prop('zIndex', '10')
      s.pointerEvents.none
      s.borderRadius.iem(0.1875)
    }),
  )

  const thumbClass = computed(() => {
    const colors = scrollbarThumbColors(dark.value)
    return icss(theme.value, s => {
      s.position.absolute
      s._prop('left', '0')
      s._prop('right', '0')
      s.borderRadius.iem(0.1875)
      s._prop('background', colors.normal)
      s._prop('transition', 'background 120ms')
      s._selector('&:hover', h => {
        h._prop('background', colors.hover)
      })
    })
  })

  return {
    scrollEl,
    isHovered,
    isFocused,
    onScroll,
    thumbVisible,
    thumbStyle,
    trackClass,
    thumbClass,
  }
}
