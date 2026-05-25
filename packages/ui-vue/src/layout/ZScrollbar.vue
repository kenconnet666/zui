<script lang="ts">
/**
 * `ZScrollbar` —— 浮层滚动条容器。
 *
 * **行为**：
 * - 原生滚动条完全隐藏（`scrollbar-width: none` + webkit），**不占任何布局宽度**
 * - 自定义 6px 半透明 thumb，`position: absolute` 浮在内容上方，z-index 隔离
 * - 默认透明隐藏，鼠标进入或容器内有焦点时淡入显示
 * - 暗/亮色主题自动适配
 *
 * **使用要求**：父级或 `:css` prop 必须给根元素提供明确高度
 * （`height: 100%` / `flex-grow: 1; min-height: 0` 等），否则内容区为 0 高。
 *
 * **API**：
 * - `maxHeight?: number` —— 容器最大高度（iem 倍数），优先于外部 height
 * - `css?: factory` —— 根元素覆盖（在 height/overflow 之后应用）
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZScrollbarProps {
  maxHeight?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { themeColorScheme } from '../_internal/colorScheme'
import { SCROLL_TRACK_MARGIN, SCROLL_THUMB_MIN_PX, scrollbarThumbColors } from '../_internal/scrollbarThumb'

/**
 * 盒子模型（iem，Provider 控制基准）：
 *
 *   ┌── root div ──────────────────────────────────────────────┐
 *   │   position: relative                                      │
 *   │   [user height via :css or maxHeight]                     │
 *   │                                                           │
 *   │  ┌── scroller div ───────────────────────────────────┐   │   height: 100% (或 max-height: N iem)
 *   │  │  height: 100%   overflow-y: auto                  │   │   scrollbar-width: none（原生滚动条隐藏）
 *   │  │  scrollbar-width: none / ::-webkit-scrollbar:none │   │
 *   │  │    slot 内容（自然撑高，超出则滚动）               │   │
 *   │  └───────────────────────────────────────────────────┘   │
 *   │                                                           │
 *   │  ┌── track div ──┐  position: absolute; right: 2px      │   不占布局空间
 *   │  │  ┌── thumb ─┐ │  z-index: 10; pointer-events: none   │
 *   │  │  └──────────┘ │  hover/focus-within 时淡入            │
 *   │  └───────────────┘                                        │
 *   └───────────────────────────────────────────────────────────┘
 */
const props = defineProps<ZScrollbarProps>()
const theme = useZTheme()

// ─── 滚动测量 ───────────────────────────────────────────────────────────────
const scrollerRef = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const scrollHeight = ref(0)
const clientHeight = ref(0)

function updateMeasurements(): void {
  const el = scrollerRef.value
  if (!el) return
  scrollTop.value = el.scrollTop
  scrollHeight.value = el.scrollHeight
  clientHeight.value = el.clientHeight
}

function onScroll(): void {
  updateMeasurements()
}

let ro: ResizeObserver | null = null
onMounted(() => {
  updateMeasurements()
  if (typeof ResizeObserver !== 'undefined' && scrollerRef.value) {
    ro = new ResizeObserver(updateMeasurements)
    ro.observe(scrollerRef.value)
    // 监听 slot 内容高度变化
    const firstChild = scrollerRef.value.firstElementChild
    if (firstChild) ro.observe(firstChild)
  }
})
onBeforeUnmount(() => ro?.disconnect())

// ─── Thumb 位置/尺寸计算 ────────────────────────────────────────────────────
const needsScrollbar = computed(() => scrollHeight.value > clientHeight.value + 2)

const thumbPx = computed(() => {
  if (!needsScrollbar.value) return 0
  const track = clientHeight.value - SCROLL_TRACK_MARGIN
  return Math.max(SCROLL_THUMB_MIN_PX, (clientHeight.value / scrollHeight.value) * track)
})

const thumbTopPx = computed(() => {
  const maxScroll = scrollHeight.value - clientHeight.value
  if (maxScroll <= 0) return 0
  const track = clientHeight.value - SCROLL_TRACK_MARGIN
  const scrollRatio = scrollTop.value / maxScroll
  return scrollRatio * (track - thumbPx.value)
})

const thumbStyle = computed(() => ({
  height: `${thumbPx.value}px`,
  top: `${thumbTopPx.value}px`,
}))

// ─── 显示状态 ───────────────────────────────────────────────────────────────
const isHovered = ref(false)
const isFocused = ref(false)
const thumbVisible = computed(() => needsScrollbar.value && (isHovered.value || isFocused.value))

// ─── 样式 ───────────────────────────────────────────────────────────────────
const dark = computed(() => themeColorScheme(theme.value) === 'dark')
const thumbColors = computed(() => scrollbarThumbColors(dark.value))

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.relative
    if (props.maxHeight !== undefined) {
      s.maxHeight.iem(props.maxHeight)
      s.overflow.hidden
    }
    props.css?.(s)
  }),
)

const scrollerClass = computed(() =>
  icss(theme.value, (s) => {
    s.height.pct(100)
    s.overflow.auto
    // 隐藏原生滚动条（不占布局空间）
    s._prop('scrollbarWidth', 'none')
    s._prop('msOverflowStyle', 'none')
    s._selector('&::-webkit-scrollbar', (sb) => {
      sb._prop('display', 'none')
    })
  }),
)

const trackClass = computed(() =>
  icss(theme.value, (s) => {
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

const thumbClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.absolute
    s._prop('left', '0')
    s._prop('right', '0')
    s.borderRadius.iem(0.1875)
    s._prop('background', thumbColors.value.normal)
    s._prop('transition', 'background 120ms')
    s._selector('&:hover', (h) => {
      h._prop('background', thumbColors.value.hover)
    })
  }),
)

// scrollerRef 是内层滚动容器；$el 保留作向后兼容别名（DocLayout 等处使用）
defineExpose({ scrollerRef, $el: scrollerRef })
</script>

<template>
  <div
    :class="rootClass"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @focusin="isFocused = true"
    @focusout="isFocused = false"
  >
    <div ref="scrollerRef" :class="scrollerClass" @scroll="onScroll">
      <slot />
    </div>
    <Transition
      enter-active-class="__zs-fade-in"
      leave-active-class="__zs-fade-out"
      enter-from-class="__zs-fade-from"
      leave-to-class="__zs-fade-from"
    >
      <div v-if="thumbVisible" :class="trackClass">
        <div :class="thumbClass" :style="thumbStyle" />
      </div>
    </Transition>
  </div>
</template>

<style>
.__zs-fade-in  { transition: opacity 150ms; }
.__zs-fade-out { transition: opacity 150ms; }
.__zs-fade-from { opacity: 0; }
</style>
