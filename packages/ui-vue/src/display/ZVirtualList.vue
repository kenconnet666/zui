<script lang="ts">
/**
 * `ZVirtualList` —— 通用虚拟滚动列表(`ZList` / `ZDataTable` / `ZSelect` 等大数据
 * 组件的底层渲染单元)。
 *
 * **设计要点**:
 * - 仅渲染可见区(+ overscan 缓冲)的项,数据量线性时 DOM 数量恒定
 * - 尺寸 prop 统一 **iem 倍数**(`number`)或 **CSS 字面字符串**(`string`,
 *   `'100%'` / `'50vh'` / `'10vw'`),跟 zui 全栈 iem 单位规则一致
 * - 内部通过 `useZIem` 拿到当前 iem 实际像素值(响应式),把 iem 倍数转 px 喂给
 *   底层 `useZVirtualScroll`(算法层只认 px)
 * - DOM 布局:`position: absolute; top:<offset>px`(每项)+ `position: relative;
 *   height: totalSize`(wrapper)+ `contain: strict` + `overflow-anchor: none`(容器)
 * - 滚动:`rAF` 节流 + 大跨度(跳过整个视口)同步更新
 * - 可见区:固定行高走除法快路径,函数/测量行高走 prefixSum + 二分
 *
 * **典型用法**:
 * ```vue
 * <ZBox :iem="ZIemPreset.default">
 *   <ZVirtualList :items :item-size="3" :height="20" v-slot="{ item, index }">
 *     <div>{{ index }} - {{ item.name }}</div>
 *   </ZVirtualList>
 * </ZBox>
 * ```
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { ItemSizeArg, ScrollAlign } from '../_hooks/useZVirtualScroll'

export interface ZVirtualListProps<T = unknown> {
  /** 数据数组(必传)。 */
  items: readonly T[]
  /**
   * 每项尺寸 —— **iem 倍数**(`number`)或返回 iem 倍数的函数。
   *
   * @example
   * itemSize: 3           // 3iem,默认 48px @ 16px iem
   * itemSize: (i, item) => item.tall ? 4 : 2
   */
  itemSize: ItemSizeArg<T>
  /** 滚动方向,默认 `'vertical'`。 */
  direction?: 'vertical' | 'horizontal' | undefined
  /** 预渲染缓冲项数(两端各加这么多)。默认 `5`。 */
  overscan?: number | undefined
  /** 是否启用 `ResizeObserver` 自动测真实尺寸。默认 `true`。 */
  autoMeasure?: boolean | undefined
  /** 取项 key 的字段名(取不到回退 index)。默认 `'id'`。 */
  keyField?: string | undefined
  /**
   * 容器尺寸(垂直 → 高度 / 水平 → 宽度)。**iem 倍数**(`number`)或 CSS 字面
   * 字符串(`'100%'` / `'50vh'` 等)。
   */
  height?: number | string | undefined
  /** 同 `height`,水平方向用。 */
  width?: number | string | undefined
  /** 触发 `scroll-end` 的距底阈值(iem 倍数)。默认 `0`。 */
  scrollEndThreshold?: number | undefined
  /** 根容器 css 覆盖(`overflow: auto` / `position: relative` 已内置)。 */
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZVirtualListEmits {
  /** 每次滚动 emit。 */
  (e: 'scroll', offset: number): void
  /** 滚到距底 ≤ `scrollEndThreshold` 时(去重,连续触底只 emit 一次)。 */
  (e: 'scroll-end'): void
  /** 可见区间变化。 */
  (e: 'update', start: number, end: number): void
}

export interface ZVirtualListExpose {
  /** 根滚动容器 DOM(`<div>`)。 */
  rootRef: import('vue').Ref<HTMLElement | null>
  scrollToIndex: (i: number, align?: ScrollAlign) => void
  scrollToOffset: (px: number) => void
  getScroll: () => { offset: number; total: number; viewport: number }
  getItemOffset: (i: number) => number
  getItemSize: (i: number) => number
}
</script>

<script lang="ts" setup generic="T">
import { computed, ref, shallowRef, toRef, useSlots, watch, type Ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { useZIem } from '../_hooks/useZIem'
import { useZVirtualScroll } from '../_hooks/useZVirtualScroll'
import { applyScrollbarStyles } from '../_internal/scrollbarStyles'
import { themeColorScheme } from '../_internal/colorScheme'
import {
  SCROLL_TRACK_MARGIN,
  SCROLL_THUMB_MIN_PX,
  scrollbarThumbColors,
} from '../_internal/scrollbarThumb'

/**
 * 盒子模型(iem,Provider 控制基准):
 *
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │ root container `<div>`                                       │   height: `height` iem (default 100%)
 *   │   position: relative  overflow: auto                         │   或 CSS 字面字符串
 *   │   contain: strict  overflow-anchor: none                     │
 *   │                                                              │
 *   │   ┌────────────────────────────────────────────────────────┐ │
 *   │   │ #header slot(可选,虚拟之外)                          │ │
 *   │   └────────────────────────────────────────────────────────┘ │
 *   │   ┌────────────────────────────────────────────────────────┐ │
 *   │   │ wrapper `<div>`                                        │ │   height: totalSize px
 *   │   │   position: relative                                   │ │
 *   │   │   ┌──────────────────────────────────────────────────┐ │ │   每项:
 *   │   │   │ item slot(v-for visibleItems)                   │ │ │     top: offset px
 *   │   │   │   position: absolute  top: offset px             │ │ │     height: size px
 *   │   │   │   width: 100%(vertical)/ left+width(horiz)    │ │ │     (autoMeasure 时 RO
 *   │   │   │   data-zv-index="<i>"(autoMeasure 钩子)        │ │ │      实测覆盖估值)
 *   │   │   └──────────────────────────────────────────────────┘ │ │
 *   │   └────────────────────────────────────────────────────────┘ │
 *   │   ┌────────────────────────────────────────────────────────┐ │
 *   │   │ #footer slot(可选,虚拟之外)                          │ │
 *   │   └────────────────────────────────────────────────────────┘ │
 *   │   (空 + `#empty` slot → 替换 wrapper)                       │
 *   └──────────────────────────────────────────────────────────────┘
 *
 * iem→px 换算通过 `useZIem`(响应式),vw 模式下 resize → iemPx 变 → 内部 hook
 * watch 触发 rebuildCache → 自动重布局,全自动响应式。
 */
const props = withDefaults(defineProps<ZVirtualListProps<T>>(), {
  direction: 'vertical',
  overscan: 5,
  autoMeasure: true,
  keyField: 'id',
  scrollEndThreshold: 0,
})
const emit = defineEmits<ZVirtualListEmits>()
const slots = useSlots()

const theme = useZTheme()
const iemPx = useZIem()

// ─── iem 倍数 → px 数值(给 hook) ───
const itemSizePx = computed<ItemSizeArg<T>>(() => {
  const v = props.itemSize
  const base = iemPx.value
  if (typeof v === 'function') return (i, item) => v(i, item) * base
  return v * base
})

const scrollEndThresholdPx = computed(() => props.scrollEndThreshold * iemPx.value)

const vs = useZVirtualScroll<T>({
  items: computed(() => props.items) as Ref<readonly T[]>,
  itemSize: itemSizePx as Ref<ItemSizeArg<T>>,
  direction: toRef(props, 'direction') as Ref<'vertical' | 'horizontal'>,
  overscan: toRef(props, 'overscan') as Ref<number>,
  autoMeasure: toRef(props, 'autoMeasure') as Ref<boolean>,
  scrollEndThreshold: scrollEndThresholdPx,
})

const scrollEl = ref<HTMLElement | null>(null)
watch(scrollEl, el => {
  vs.setScrollElement(el)
})

// ─── Overlay scrollbar ──────────────────────────────────────────────────────
const isHovered = ref(false)
const isFocused = ref(false)

const needsScrollbar = computed(
  () => props.direction !== 'horizontal' && vs.totalSize.value > vs.viewportSize.value + 2,
)

const thumbPx = computed(() => {
  if (!needsScrollbar.value) return 0
  const track = vs.viewportSize.value - SCROLL_TRACK_MARGIN
  return Math.max(SCROLL_THUMB_MIN_PX, (vs.viewportSize.value / vs.totalSize.value) * track)
})

const thumbTopPx = computed(() => {
  const maxScroll = vs.totalSize.value - vs.viewportSize.value
  if (maxScroll <= 0) return 0
  const track = vs.viewportSize.value - SCROLL_TRACK_MARGIN
  return (vs.scrollOffset.value / maxScroll) * (track - thumbPx.value)
})

const thumbStyle = computed(() => ({
  height: `${thumbPx.value}px`,
  top: `${thumbTopPx.value}px`,
}))

const thumbVisible = computed(() => needsScrollbar.value && (isHovered.value || isFocused.value))

const dark = computed(() => themeColorScheme(theme.value) === 'dark')
const thumbColors = computed(() => scrollbarThumbColors(dark.value))

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

const sbThumbClass = computed(() =>
  icss(theme.value, s => {
    s.position.absolute
    s._prop('left', '0')
    s._prop('right', '0')
    s.borderRadius.iem(0.1875)
    s._prop('background', thumbColors.value.normal)
    s._prop('transition', 'background 120ms')
    s._selector('&:hover', h => {
      h._prop('background', thumbColors.value.hover)
    })
  }),
)

watch(vs.visibleRange, ([start, end]) => emit('update', start, end))
watch(vs.scrollOffset, offset => emit('scroll', offset))

/** scroll-end 去重:进入触底 emit 一次,离开后才重新可触发。 */
const scrollEndEmitted = shallowRef(false)
watch(vs.isAtEnd, atEnd => {
  if (atEnd && !scrollEndEmitted.value && props.items.length > 0) {
    scrollEndEmitted.value = true
    emit('scroll-end')
  } else if (!atEnd) {
    scrollEndEmitted.value = false
  }
})

function getKey(item: T, index: number): string | number {
  if (item != null && typeof item === 'object') {
    const k = (item as Record<string, unknown>)[props.keyField]
    if (typeof k === 'string' || typeof k === 'number') return k
  }
  return index
}

/** iem 倍数 / CSS 字面字符串 → CSS 长度字符串。 */
function resolveSize(v: number | string | undefined, fallback: string): string {
  if (v === undefined) return fallback
  if (typeof v === 'string') return v
  return `${v * iemPx.value}px`
}

/** 外层包裹：持有尺寸 + position:relative，作为 overlay track 的定位容器。overflow:hidden 防止异常内容撑破。 */
const outerStyle = computed<Record<string, string>>(() => {
  const isV = props.direction === 'vertical'
  return {
    position: 'relative',
    overflow: 'hidden',
    height: resolveSize(props.height, isV ? '100%' : 'auto'),
    width: resolveSize(props.width, !isV ? '100%' : 'auto'),
  }
})

/** 内层滚动容器：100% 填满外层，contain:strict 隔离布局。 */
const containerStyle = computed<Record<string, string>>(() => ({
  height: '100%',
  width: '100%',
  contain: 'strict',
  overflowAnchor: 'none',
}))

const wrapperStyle = computed<Record<string, string>>(() => {
  const isV = props.direction === 'vertical'
  return {
    position: 'relative',
    ...(isV
      ? { height: `${vs.totalSize.value}px`, width: '100%' }
      : { width: `${vs.totalSize.value}px`, height: '100%' }),
  }
})

function itemStyle(offset: number, size: number): Record<string, string> {
  const isV = props.direction === 'vertical'
  return isV
    ? {
        position: 'absolute',
        top: `${offset}px`,
        left: '0',
        width: '100%',
        height: `${size}px`,
      }
    : {
        position: 'absolute',
        left: `${offset}px`,
        top: '0',
        height: '100%',
        width: `${size}px`,
      }
}

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.position.relative
    s.overflow.auto
    s.display.block
    applyScrollbarStyles(s, theme.value)
    props.css?.(s)
  }),
)

const visibleItems = computed(() => {
  const [start, end] = vs.visibleRange.value
  if (end < start) return []
  const result: { item: T; index: number; offset: number; size: number; key: string | number }[] =
    []
  for (let i = start; i <= end; i++) {
    const item = props.items[i]
    if (item === undefined) continue
    result.push({
      item,
      index: i,
      offset: vs.getItemOffset(i),
      size: vs.getItemSize(i),
      key: getKey(item, i),
    })
  }
  return result
})

const isEmpty = computed(() => props.items.length === 0)

function setItemRef(i: number) {
  return (el: unknown): void => {
    vs.measureElement(i, (el as HTMLElement | null) ?? null)
  }
}

// ─── 淡入淡出过渡 class(icss 生成,替代原 SFC style 块)───
const fadeActiveClass = computed(() =>
  icss(theme.value, s => {
    s.transition('opacity 150ms')
  }),
)
const fadeFromClass = computed(() =>
  icss(theme.value, s => {
    s.opacity(0)
  }),
)

defineExpose<ZVirtualListExpose>({
  rootRef: scrollEl,
  scrollToIndex: vs.scrollToIndex,
  scrollToOffset: vs.scrollToOffset,
  getScroll: () => ({
    offset: vs.scrollOffset.value,
    total: vs.totalSize.value,
    viewport: vs.viewportSize.value,
  }),
  getItemOffset: vs.getItemOffset,
  getItemSize: vs.getItemSize,
})
</script>

<template>
  <!-- 外层：持有尺寸 + position:relative，track overlay 定位于此（不随内容滚动） -->
  <div
    :style="outerStyle"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @focusin="isFocused = true"
    @focusout="isFocused = false"
  >
    <!-- 内层：实际滚动容器（native scrollbar 已隐藏） -->
    <div ref="scrollEl" :class="['zui-virtual-list', rootClass]" :style="containerStyle">
      <div v-if="slots.header" data-zv-header><slot name="header" /></div>
      <div v-if="isEmpty && slots.empty" data-zv-empty><slot name="empty" /></div>
      <div v-else :style="wrapperStyle" data-zv-wrapper>
        <div
          v-for="vi in visibleItems"
          :key="vi.key"
          :ref="setItemRef(vi.index)"
          :style="itemStyle(vi.offset, vi.size)"
        >
          <slot :item="vi.item" :index="vi.index" :size="vi.size" />
        </div>
      </div>
      <div v-if="slots.footer" data-zv-footer><slot name="footer" /></div>
    </div>
    <!-- overlay track：position:absolute 定位于外层，不受内层滚动影响 -->
    <Transition
      :enter-active-class="fadeActiveClass"
      :leave-active-class="fadeActiveClass"
      :enter-from-class="fadeFromClass"
      :leave-to-class="fadeFromClass"
    >
      <div v-if="thumbVisible" :class="trackClass">
        <div :class="sbThumbClass" :style="thumbStyle" />
      </div>
    </Transition>
  </div>
</template>
