/**
 * `useZVirtualScroll` —— 通用虚拟滚动算法层。
 *
 * **职责**:可见区间计算、前缀和、scroll 节流、scrollToIndex / scrollToOffset、
 * ResizeObserver 自动测量。**仅算 px**,不感知 iem;调用方负责把 iem 倍数 × `useZIem`
 * 转换为 px 后传进来。
 *
 * **算法要点**:
 * - 固定行高走除法快路径(`floor(scrollTop / itemSize)`)
 * - 函数/测量行高走 prefixSum + 二分(`Math.floor((lo+hi)/2)`)
 * - 大跨度跳跃(`distance > viewportSize`)同步更新,小步用 rAF 节流
 * - autoMeasure:`ResizeObserver` 监测每项实际像素,差值 > 0.5px 时写入 cache 修正
 *
 * **状态模型**:closure store + `shallowRef`。大数据 `items` 不走 deep reactive,
 * 仅暴露 `visibleRange` / `totalSize` / `scrollOffset` / `viewportSize` 给模板。
 *
 * **参考**:virtua(store/cache 设计)/ TanStack(API)。
 */
import {
  computed,
  onBeforeUnmount,
  shallowRef,
  watch,
  type ComputedRef,
  type Ref,
  type ShallowRef,
} from 'vue'

/** 滚动对齐策略,语义与 TanStack 一致。 */
export type ScrollAlign = 'start' | 'center' | 'end' | 'auto'

/** 行高接收两种形式:固定数字(快路径)或函数(每项独立)。**单位 px**。 */
export type ItemSizeArg<T> = number | ((index: number, item: T) => number)

export interface UseZVirtualScrollOptions<T> {
  /** 数据数组(reactive)。 */
  items: Ref<readonly T[]>
  /** 行高 px(数字)或返回 px 的函数。 */
  itemSize: Ref<ItemSizeArg<T>>
  /** 滚动方向,默认 `'vertical'`。 */
  direction?: Ref<'vertical' | 'horizontal'>
  /** 预渲染缓冲项数,默认 `5`。 */
  overscan?: Ref<number>
  /** 是否启用 `ResizeObserver` 自动测量真实尺寸,默认 `true`。 */
  autoMeasure?: Ref<boolean>
  /** 触底阈值 px,默认 `0`。 */
  scrollEndThreshold?: Ref<number>
}

export interface UseZVirtualScrollReturn {
  /** 可见区间 `[start, end]`(end 含,空列表 `[0, -1]`)。 */
  visibleRange: ShallowRef<readonly [number, number]>
  /** 全部项总尺寸 px。 */
  totalSize: ShallowRef<number>
  /** 当前滚动偏移 px。 */
  scrollOffset: ShallowRef<number>
  /** 容器可见尺寸 px。 */
  viewportSize: ShallowRef<number>
  /** 取第 i 项的起始偏移 px。 */
  getItemOffset: (i: number) => number
  /** 取第 i 项的尺寸 px。 */
  getItemSize: (i: number) => number
  /** 滚动到指定项。 */
  scrollToIndex: (i: number, align?: ScrollAlign) => void
  /** 滚动到指定 px 偏移。 */
  scrollToOffset: (px: number) => void
  /** 注册滚动容器(addEventListener + observe viewport)。 */
  setScrollElement: (el: HTMLElement | null) => void
  /** 注册每项 DOM(供 autoMeasure 用)。 */
  measureElement: (i: number, el: HTMLElement | null) => void
  /** 是否触底(根据 scrollEndThreshold)。 */
  isAtEnd: ComputedRef<boolean>
}

export function useZVirtualScroll<T>(
  opts: UseZVirtualScrollOptions<T>,
): UseZVirtualScrollReturn {
  const direction = opts.direction ?? shallowRef('vertical' as const)
  const overscan = opts.overscan ?? shallowRef(5)
  const autoMeasure = opts.autoMeasure ?? shallowRef(true)
  const scrollEndThreshold = opts.scrollEndThreshold ?? shallowRef(0)

  const scrollOffset = shallowRef(0)
  const viewportSize = shallowRef(0)
  const visibleRange = shallowRef<readonly [number, number]>([0, -1])
  const totalSize = shallowRef(0)

  let measuredSizes: number[] = []
  let prefixSum: number[] = []
  let scrollEl: HTMLElement | null = null
  let lastScrollOffset = 0
  let rafPending = false
  let resizeObserver: ResizeObserver | null = null
  const measuredEls = new Map<number, HTMLElement>()

  function getDeclaredSize(i: number): number {
    const size = opts.itemSize.value
    const item = opts.items.value[i]
    if (typeof size === 'function') return size(i, item as T)
    return size
  }

  function getEffectiveSize(i: number): number {
    return measuredSizes[i] ?? getDeclaredSize(i)
  }

  function rebuildCache(): void {
    const N = opts.items.value.length
    prefixSum = new Array(N + 1)
    prefixSum[0] = 0
    for (let i = 0; i < N; i++) {
      prefixSum[i + 1] = prefixSum[i]! + getEffectiveSize(i)
    }
    totalSize.value = prefixSum[N] ?? 0
  }

  function findStartIndex(offset: number): number {
    const N = opts.items.value.length
    if (N === 0) return 0
    const size = opts.itemSize.value
    if (typeof size === 'number' && measuredSizes.length === 0) {
      return Math.min(N - 1, Math.max(0, Math.floor(offset / size)))
    }
    // 二分:找最大的 i 使 prefixSum[i] ≤ offset(prefixSum 长 N+1)
    let lo = 0
    let hi = N
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1
      if ((prefixSum[mid] ?? 0) <= offset) lo = mid + 1
      else hi = mid - 1
    }
    return Math.max(0, Math.min(N - 1, hi))
  }

  function getItemEnd(i: number): number {
    return prefixSum[i + 1] ?? (prefixSum[i] ?? 0) + getEffectiveSize(i)
  }

  function calculateRange(): void {
    const N = opts.items.value.length
    if (N === 0) {
      if (visibleRange.value[1] !== -1) visibleRange.value = [0, -1]
      return
    }
    const offset = scrollOffset.value
    const viewport = viewportSize.value
    const ov = overscan.value
    const start = findStartIndex(offset)
    let end = start
    const limit = offset + viewport
    while (end < N - 1 && getItemEnd(end) < limit) end++
    const newStart = Math.max(0, start - ov)
    const newEnd = Math.min(N - 1, end + ov)
    const [oldStart, oldEnd] = visibleRange.value
    if (newStart !== oldStart || newEnd !== oldEnd) {
      visibleRange.value = [newStart, newEnd]
    }
  }

  function getItemOffset(i: number): number {
    return prefixSum[i] ?? 0
  }

  function getItemSize(i: number): number {
    return getEffectiveSize(i)
  }

  function onScroll(): void {
    if (!scrollEl) return
    // 同步刷新 viewport size(防御 ResizeObserver 失效 / 初始 layout 时延)。
    viewportSize.value =
      direction.value === 'horizontal' ? scrollEl.clientWidth : scrollEl.clientHeight
    const offset = direction.value === 'horizontal' ? scrollEl.scrollLeft : scrollEl.scrollTop
    const distance = Math.abs(offset - lastScrollOffset)
    lastScrollOffset = offset
    scrollOffset.value = offset
    if (distance > viewportSize.value) {
      calculateRange()
      return
    }
    if (rafPending) return
    rafPending = true
    requestAnimationFrame(() => {
      rafPending = false
      calculateRange()
    })
  }

  let viewportObserver: ResizeObserver | null = null
  function observeViewport(el: HTMLElement): void {
    if (viewportObserver) viewportObserver.disconnect()
    if (typeof ResizeObserver === 'undefined') {
      viewportSize.value =
        direction.value === 'horizontal' ? el.clientWidth : el.clientHeight
      return
    }
    viewportObserver = new ResizeObserver(() => {
      viewportSize.value =
        direction.value === 'horizontal' ? el.clientWidth : el.clientHeight
      calculateRange()
    })
    viewportObserver.observe(el)
    viewportSize.value =
      direction.value === 'horizontal' ? el.clientWidth : el.clientHeight
  }

  function setupItemObserver(): void {
    if (!autoMeasure.value || typeof ResizeObserver === 'undefined') return
    if (resizeObserver) return
    resizeObserver = new ResizeObserver((entries) => {
      let changed = false
      for (const entry of entries) {
        const el = entry.target as HTMLElement
        const indexAttr = el.dataset['zvIndex']
        if (indexAttr === undefined) continue
        const i = Number(indexAttr)
        const newSize =
          direction.value === 'horizontal'
            ? entry.contentRect.width
            : entry.contentRect.height
        if (Math.abs((measuredSizes[i] ?? getDeclaredSize(i)) - newSize) > 0.5) {
          measuredSizes[i] = newSize
          changed = true
        }
      }
      if (changed) {
        rebuildCache()
        calculateRange()
      }
    })
  }

  function measureElement(i: number, el: HTMLElement | null): void {
    if (!autoMeasure.value) return
    setupItemObserver()
    if (!resizeObserver) return
    const prev = measuredEls.get(i)
    if (prev && prev !== el) {
      resizeObserver.unobserve(prev)
      measuredEls.delete(i)
    }
    if (el) {
      el.dataset['zvIndex'] = String(i)
      resizeObserver.observe(el)
      measuredEls.set(i, el)
    }
  }

  function scrollToOffset(px: number): void {
    if (!scrollEl) return
    const max = totalSize.value - viewportSize.value
    const clamped = Math.max(0, Math.min(max, px))
    if (direction.value === 'horizontal') scrollEl.scrollLeft = clamped
    else scrollEl.scrollTop = clamped
  }

  function scrollToIndex(i: number, align: ScrollAlign = 'auto'): void {
    const N = opts.items.value.length
    if (N === 0) return
    const idx = Math.max(0, Math.min(N - 1, i))
    const start = getItemOffset(idx)
    const size = getItemSize(idx)
    const viewport = viewportSize.value
    let target = start
    switch (align) {
      case 'start':
        target = start
        break
      case 'center':
        target = start - (viewport - size) / 2
        break
      case 'end':
        target = start + size - viewport
        break
      case 'auto': {
        const currentEnd = scrollOffset.value + viewport
        if (start < scrollOffset.value) target = start
        else if (start + size > currentEnd) target = start + size - viewport
        else return
        break
      }
    }
    scrollToOffset(target)
  }

  function setScrollElement(el: HTMLElement | null): void {
    if (scrollEl) {
      scrollEl.removeEventListener('scroll', onScroll)
      if (viewportObserver) viewportObserver.disconnect()
    }
    scrollEl = el
    if (el) {
      el.addEventListener('scroll', onScroll, { passive: true })
      observeViewport(el)
      rebuildCache()
      calculateRange()
    }
  }

  watch(
    [() => opts.items.value.length, () => opts.itemSize.value, direction],
    () => {
      measuredSizes = []
      measuredEls.clear()
      if (resizeObserver) {
        resizeObserver.disconnect()
        resizeObserver = null
      }
      rebuildCache()
      if (scrollEl) {
        viewportSize.value =
          direction.value === 'horizontal' ? scrollEl.clientWidth : scrollEl.clientHeight
      }
      calculateRange()
    },
    { flush: 'post' },
  )

  const isAtEnd = computed(() => {
    const remaining = totalSize.value - viewportSize.value - scrollOffset.value
    return remaining <= scrollEndThreshold.value
  })

  onBeforeUnmount(() => {
    if (scrollEl) scrollEl.removeEventListener('scroll', onScroll)
    if (viewportObserver) viewportObserver.disconnect()
    if (resizeObserver) resizeObserver.disconnect()
    measuredEls.clear()
  })

  return {
    visibleRange,
    totalSize,
    scrollOffset,
    viewportSize,
    getItemOffset,
    getItemSize,
    scrollToIndex,
    scrollToOffset,
    setScrollElement,
    measureElement,
    isAtEnd,
  }
}
