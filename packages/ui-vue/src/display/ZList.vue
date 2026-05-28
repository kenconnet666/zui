<script lang="ts">
/**
 * `ZList` —— 数据列表(虚拟滚动)。
 *
 * **v2 破坏性重构**(2026-05-24):100% 基于 `ZVirtualList`,所有 `ZList` 都自带
 * 虚拟滚动。短列表(< 数十项)建议直接 `v-for + <div>`,本组件价值在「带头尾
 * + 边框 + 空态 + 虚拟」的标准列表场景。
 *
 * 尺寸 prop 统一走 **iem 倍数**:`itemSize=3` = 3iem = 48px @ 16px iem,
 * `height=20` = 20iem = 320px @ 16px iem。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { ItemSizeArg, ScrollAlign } from '../_hooks/useZVirtualScroll'

export interface ZListProps<T = unknown> {
  /** 数据数组(必传)。 */
  items: readonly T[]
  /**
   * 每项高度 —— **iem 倍数** 或返回 iem 倍数的函数。
   *
   * @example
   * itemSize: 3                          // 3iem(48px @ 16px iem)
   * itemSize: (i) => i % 2 ? 4 : 3       // 函数式
   */
  itemSize: ItemSizeArg<T>
  /**
   * 容器高度 —— iem 倍数(`number`)或 CSS 字面字符串(`'100%'` / `'50vh'`)。
   * 虚拟滚动要求 viewport 固定,必传。
   */
  height: number | string
  /** 取项 key 的字段名。默认 `'id'`,缺失回退 index。 */
  keyField?: string
  /** 外框 border + 圆角。默认 `false`。 */
  bordered?: boolean
  /** 头部文字(`#header` slot 优先)。 */
  header?: string
  /** 尾部文字(`#footer` slot 优先)。 */
  footer?: string
  /** 空状态文字(`#empty` slot 优先)。默认 `'暂无数据'`。 */
  emptyText?: string
  /** 预渲染缓冲项数。默认 `5`。 */
  overscan?: number
  /** ResizeObserver 自动测真实尺寸。默认 `true`。 */
  autoMeasure?: boolean
  /** 字号 —— iem 倍数。默认 `1`(1iem)。 */
  size?: number
  /** 根容器 css 覆盖。 */
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZListEmits {
  /** 滚动事件(透传 ZVirtualList)。 */
  (e: 'scroll', offset: number): void
  /** 触底事件(透传 ZVirtualList)。 */
  (e: 'scroll-end'): void
  /** 可见区间变化(透传 ZVirtualList)。 */
  (e: 'update', start: number, end: number): void
}

export interface ZListExpose {
  /** 根 `<div role="list">` DOM(虚拟容器在内层,取 rootRef 拿外壳)。 */
  rootRef: import('vue').Ref<HTMLElement | null>
  scrollToIndex: (i: number, align?: ScrollAlign) => void
  scrollToOffset: (px: number) => void
  getScroll: () => { offset: number; total: number; viewport: number }
  getItemOffset: (i: number) => number
  getItemSize: (i: number) => number
}
</script>

<script lang="ts" setup generic="T">
import { computed, ref, useSlots, type Slots } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import ZVirtualList, { type ZVirtualListExpose } from './ZVirtualList.vue'

/**
 * 盒子模型(iem,Provider 控制基准):
 *
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │ root `<div role="list">`                                     │   font-size: `size` iem
 *   │   bordered=true → border _thin _border + radius _small +     │   bordered:
 *   │                   overflow hidden                            │     border _thin _border +
 *   │                                                              │     radius _small + overflow hidden
 *   │   ┌────────────────────────────────────────────────────────┐ │
 *   │   │ #header(可选):pad `size*0.625` iem                   │ │   头部:_semibold +
 *   │   │   font-weight _semibold  border-bottom _thin _border   │ │   border-bottom _thin
 *   │   └────────────────────────────────────────────────────────┘ │
 *   │                                                              │
 *   │   ┌────────────────────────────────────────────────────────┐ │
 *   │   │ <ZVirtualList>(渲染 items,height=`height` iem)        │ │   每项 height=`itemSize` iem
 *   │   │   default slot 给每项 scope { item, index, size }       │ │   empty slot 包 emptyText
 *   │   └────────────────────────────────────────────────────────┘ │
 *   │                                                              │
 *   │   ┌────────────────────────────────────────────────────────┐ │
 *   │   │ #footer(可选):pad `size*0.625` iem                   │ │   尾部:textSecondary +
 *   │   │   color _textSecondary  border-top _thin _border       │ │   _small + border-top
 *   │   └────────────────────────────────────────────────────────┘ │
 *   └──────────────────────────────────────────────────────────────┘
 */
const props = withDefaults(defineProps<ZListProps<T>>(), {
  bordered: false,
  size: 1,
  emptyText: '暂无数据',
  overscan: 5,
  autoMeasure: true,
  keyField: 'id',
})
const emit = defineEmits<ZListEmits>()
const slots: Slots = useSlots()

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.block
    s.color._text
    s.fontSize.iem(props.size ?? 1)
    if (props.bordered) {
      s.borderWidth._thin
      s.borderStyle.solid
      s.borderColor._border
      s.borderRadius._small
      s.overflow.hidden
    }
    props.css?.(s)
  }),
)

const headerClass = computed(() =>
  icss(theme.value, s => {
    s.padding.iem((props.size ?? 1) * 0.625)
    s.fontWeight._semibold
    s.borderBottomWidth._thin
    s.borderBottomStyle.solid
    s.borderBottomColor._border
  }),
)

const footerClass = computed(() =>
  icss(theme.value, s => {
    s.padding.iem((props.size ?? 1) * 0.625)
    s.color._textSecondary
    s.fontSize._small
    s.borderTopWidth._thin
    s.borderTopStyle.solid
    s.borderTopColor._border
  }),
)

const emptyClass = computed(() =>
  icss(theme.value, s => {
    s.padding._large
    s.color._textSecondary
    s.fontSize._small
    s.textAlign.center
  }),
)

const vlRef = ref<ZVirtualListExpose | null>(null)
const rootRef = ref<HTMLElement | null>(null)

defineExpose<ZListExpose>({
  rootRef,
  scrollToIndex: (i, align) => vlRef.value?.scrollToIndex(i, align),
  scrollToOffset: px => vlRef.value?.scrollToOffset(px),
  getScroll: () => vlRef.value?.getScroll() ?? { offset: 0, total: 0, viewport: 0 },
  getItemOffset: i => vlRef.value?.getItemOffset(i) ?? 0,
  getItemSize: i => vlRef.value?.getItemSize(i) ?? 0,
})

function onScroll(offset: number): void {
  emit('scroll', offset)
}
function onScrollEnd(): void {
  emit('scroll-end')
}
function onUpdate(start: number, end: number): void {
  emit('update', start, end)
}
</script>

<template>
  <div ref="rootRef" :class="rootClass" role="list">
    <div v-if="header || slots.header" :class="headerClass">
      <slot name="header">{{ header }}</slot>
    </div>

    <ZVirtualList
      ref="vlRef"
      :items="items"
      :item-size="itemSize"
      :height="height"
      :overscan="overscan ?? 5"
      :auto-measure="autoMeasure"
      :key-field="keyField"
      @scroll="onScroll"
      @scroll-end="onScrollEnd"
      @update="onUpdate"
    >
      <template #default="{ item, index, size: itemPx }">
        <slot :item="item" :index="index" :size="itemPx" />
      </template>
      <template #empty>
        <div :class="emptyClass">
          <slot name="empty">{{ emptyText }}</slot>
        </div>
      </template>
    </ZVirtualList>

    <div v-if="footer || slots.footer" :class="footerClass">
      <slot name="footer">{{ footer }}</slot>
    </div>
  </div>
</template>
