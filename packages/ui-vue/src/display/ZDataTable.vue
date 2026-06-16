<script lang="ts">
/**
 * `ZDataTable` —— 数据表格(虚拟滚动)。
 *
 * `ZTable` 的"大数据虚拟版" —— 行虚拟、sticky header、列定义、单/多选、排序、
 * loading、空态。**不**支持复杂筛选 / 列拖拽 / 固定列 / 行展开嵌套(留 v1.1)。
 * 简单展示场景(< 50 行)请用 `ZTable`,虚拟开销不值。
 *
 * **设计要点**:
 * - 内部用 `ZVirtualList` 渲染行,sticky header 在 ZVirtualList 容器外
 * - 列宽:总和 < 容器宽时 flex 填充剩余空间;固定列宽用 `width: <number>` / CSS 字面
 * - 选中:`v-model:selected` 双向绑定 keys 数组
 * - 排序:`v-model:sort` 单列排序状态,业务方可在 watch 内换数据/请求
 * - 行点击 emit:不内置触发 selection,业务方按需在 handler 内 emit `update:selected`
 *
 * **典型用法**:
 * ```vue
 * <ZDataTable
 *     :rows
 *     :columns
 *     :row-size="3"
 *     :height="30"
 *     v-model:selected="picked"
 *     selection="multiple"
 *     bordered
 *     stripe
 *     @row-click="onRowClick"
 *   />
 * ```
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { ScrollAlign } from '../_hooks/useZVirtualScroll'
import type { VNode } from 'vue'

/** 排序状态:列 key + 升降序。 */
export interface ZDataTableSort {
  key: string
  order: 'asc' | 'desc'
}

export interface ZDataTableColumn<T = unknown> {
  /** 列定位 key(必填,也作为 sort key + cell slot 名)。 */
  key: string
  /** 表头文字(可用 `#header-${key}` slot 覆盖)。 */
  title: string
  /**
   * 列宽 —— px 倍数(1 单位 = 16px)(`number`)或 CSS 字面字符串(`'12vw'` / `'100px'` / `'10%'`)。
   * 不传则 flex 均分剩余空间(`flex: 1`)。
   */
  width?: number | string
  /** 最小列宽(flex 均分时的下限,1 单位 = 16px)。默认 `5`(= 80px)。 */
  minWidth?: number
  /** 对齐。默认 `'left'`。 */
  align?: 'left' | 'center' | 'right'
  /** 取单元格值(默认 `row[key]`)。 */
  accessor?: (row: T) => unknown
  /** 自定义渲染(优先级高于 `accessor`;也可用 `#cell-${key}` slot 覆盖)。 */
  render?: (row: T, index: number) => VNode | string
  /**
   * 排序:`true` 用 `accessor`/`row[key]` 默认比较,函数走自定义比较器。
   * 默认 `false`(不排序)。
   */
  sortable?: boolean | ((a: T, b: T) => number)
}

/** 行选中模式:'none' 不可选 / 'single' 单选 / 'multiple' 多选(含 checkbox 列)。 */
export type ZDataTableSelection = 'none' | 'single' | 'multiple'

export interface ZDataTableProps<T = unknown> {
  /** 数据数组(必传)。 */
  rows: readonly T[]
  /** 列定义(必传)。 */
  columns: ZDataTableColumn<T>[]
  /** 行高 —— px 倍数(1 单位 = 16px)。默认 `3`(= 48px)。 */
  rowSize?: number
  /** 容器高度(必传,虚拟要求 viewport 固定)。px 倍数(1 单位 = 16px)或 CSS 字面字符串。 */
  height: number | string
  /** 选中模式。默认 `'none'`。 */
  selection?: ZDataTableSelection
  /** 选中行 key 数组(`v-model:selected`,即使 single 也用数组,统一 API)。 */
  selected?: (string | number)[]
  /** 取行 key 字段名。默认 `'id'`。 */
  rowKey?: string
  /** 排序状态(`v-model:sort`)。默认 `null`。 */
  sort?: ZDataTableSort | null
  /** loading 遮罩。默认 `false`。 */
  loading?: boolean
  /** 外框 border + 圆角。默认 `false`。 */
  bordered?: boolean
  /** 斑马纹(偶数行背景)。默认 `false`。 */
  stripe?: boolean
  /** 字号 —— px 倍数(1 单位 = 16px)。默认 `1`(= 16px)。 */
  size?: number
  /** 预渲染缓冲行数。默认 `5`。 */
  overscan?: number
  /** 空状态文字(`#empty` slot 优先)。默认 `'暂无数据'`。 */
  emptyText?: string
  /** 根容器 css 覆盖。 */
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZDataTableEmits<T = unknown> {
  /** 行点击。 */
  (e: 'row-click', row: T, index: number, event: MouseEvent): void
  /** 选中状态变更(支持 `v-model:selected`)。 */
  (e: 'update:selected', keys: (string | number)[]): void
  /** 排序状态变更(支持 `v-model:sort`)。 */
  (e: 'update:sort', sort: ZDataTableSort | null): void
  /** 滚动到底(可用于加载更多)。 */
  (e: 'scroll-end'): void
}

export interface ZDataTableExpose {
  /** 根 `<div role="table">` DOM。 */
  rootRef: import('vue').Ref<HTMLElement | null>
  scrollToIndex: (i: number, align?: ScrollAlign) => void
  scrollToOffset: (px: number) => void
  getScroll: () => { offset: number; total: number; viewport: number }
}
</script>

<script lang="ts" setup generic="T">
import { computed, h, ref, useSlots, type Slots } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { sizePx } from '../_internal/sizing'
import ZVirtualList, { type ZVirtualListExpose } from './ZVirtualList.vue'

/**
 * 盒子模型(纯 px,1 单位 = 16px):
 *
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │ root `<div role="table">`                                    │   font-size: sizePx(`size`)
 *   │   bordered → border _thin _border + radius _small +          │   overflow hidden
 *   │              overflow hidden                                 │
 *   │                                                              │
 *   │   ┌────────────────────────────────────────────────────────┐ │
 *   │   │ header `<div role="rowgroup">`(sticky)                │ │   height: sizePx(`rowSize`)
 *   │   │   bg _bgMuted  border-bottom _thin _border             │ │   sticky:top 0  z-index 1
 *   │   │   ┌────────────────────────────────────────────────┐  │ │   单元格:
 *   │   │   │ [⇕ Col1] [Col2] [⇕ Col3] ...                   │  │ │     pad-x size*0.75 × 16px
 *   │   │   │ sortable: 加 ⇕ 图标 + cursor pointer            │  │ │     ellipsis,fontWeight _semibold
 *   │   │   └────────────────────────────────────────────────┘  │ │
 *   │   └────────────────────────────────────────────────────────┘ │
 *   │                                                              │
 *   │   ┌────────────────────────────────────────────────────────┐ │
 *   │   │ <ZVirtualList>(rows,height=`height`-headerSize)        │ │   每行 sizePx(`rowSize`) px
 *   │   │   每行:`<div role="row">`                              │ │   stripe:偶行 bg _bgMuted.alpha(40)
 *   │   │     border-bottom _thin _border                        │ │   selected:bg _primary.alpha(8)
 *   │   │     stripe / selected 状态背景                          │ │   hover:bg _textSecondary.alpha(4)
 *   │   │     单元格 flex 排列,各列 width 见 columns           │ │
 *   │   └────────────────────────────────────────────────────────┘ │
 *   │                                                              │
 *   │   ┌────────────────────────────────────────────────────────┐ │
 *   │   │ loading 遮罩(absolute fill,bg _bg.alpha(60))         │ │   z-index _modal
 *   │   │ #loading slot 或默认 ZSpin                              │ │
 *   │   └────────────────────────────────────────────────────────┘ │
 *   └──────────────────────────────────────────────────────────────┘
 *
 * selection='multiple' 时第一列前自动插入 checkbox 列(width = 40px);'single'
 * 走点击行选中(无 checkbox);'none' 完全不显示选中态。
 */
const props = withDefaults(defineProps<ZDataTableProps<T>>(), {
  rowSize: 3,
  selection: 'none',
  selected: () => [],
  rowKey: 'id',
  sort: null,
  loading: false,
  bordered: false,
  stripe: false,
  size: 1,
  overscan: 5,
  emptyText: '暂无数据',
})
const emit = defineEmits<ZDataTableEmits<T>>()
// 强类型 `Slots`(含 index signature)允许 `slots[`cell-${key}`]` 动态键访问;
// Vue 在无注解时只把模板字面用到的 `empty` / `loading` 作为已知 slot 推断,
// 编译期 strict mode 会拒绝 `cell-${string}` 这类动态 key 索引。
const slots: Slots = useSlots()

const theme = useZTheme()

// ─── 选中集合 ───
const selectedSet = computed(() => new Set(props.selected))

function getRowKey(row: T, index: number): string | number {
  if (row != null && typeof row === 'object') {
    const k = (row as Record<string, unknown>)[props.rowKey]
    if (typeof k === 'string' || typeof k === 'number') return k
  }
  return index
}

function isSelected(row: T, index: number): boolean {
  return selectedSet.value.has(getRowKey(row, index))
}

function toggleSelection(row: T, index: number): void {
  if (props.selection === 'none') return
  const key = getRowKey(row, index)
  if (props.selection === 'single') {
    emit('update:selected', selectedSet.value.has(key) ? [] : [key])
    return
  }
  // multiple:toggle
  const next = new Set(selectedSet.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  emit('update:selected', [...next])
}

function toggleAll(): void {
  if (props.selection !== 'multiple') return
  const allKeys = props.rows.map((r, i) => getRowKey(r, i))
  const allSelected = allKeys.every(k => selectedSet.value.has(k))
  emit('update:selected', allSelected ? [] : allKeys)
}

const isAllSelected = computed(() => {
  if (props.rows.length === 0) return false
  return props.rows.every((r, i) => selectedSet.value.has(getRowKey(r, i)))
})

const isIndeterminate = computed(() => {
  const len = props.rows.length
  if (len === 0) return false
  const selectedCount = props.rows.filter((r, i) => selectedSet.value.has(getRowKey(r, i))).length
  return selectedCount > 0 && selectedCount < len
})

// ─── 排序 ───
function toggleSort(col: ZDataTableColumn<T>): void {
  if (!col.sortable) return
  const cur = props.sort
  let next: ZDataTableSort | null
  if (!cur || cur.key !== col.key) {
    next = { key: col.key, order: 'asc' }
  } else if (cur.order === 'asc') {
    next = { key: col.key, order: 'desc' }
  } else {
    next = null
  }
  emit('update:sort', next)
}

const sortedRows = computed<readonly T[]>(() => {
  if (!props.sort) return props.rows
  const col = props.columns.find(c => c.key === props.sort?.key)
  if (!col || !col.sortable) return props.rows
  const comparator =
    typeof col.sortable === 'function'
      ? col.sortable
      : (a: T, b: T) => {
          const va = col.accessor ? col.accessor(a) : (a as Record<string, unknown>)[col.key]
          const vb = col.accessor ? col.accessor(b) : (b as Record<string, unknown>)[col.key]
          if (va == null && vb == null) return 0
          if (va == null) return -1
          if (vb == null) return 1
          if (typeof va === 'number' && typeof vb === 'number') return va - vb
          return String(va).localeCompare(String(vb))
        }
  const sorted = [...props.rows].sort(comparator)
  return props.sort.order === 'desc' ? sorted.reverse() : sorted
})

// ─── 列宽计算 ───
/** 选择列宽 px(只有 multiple 模式才有)。 */
const SELECT_COL_UNITS = 2.5
const selectColPx = computed(() => sizePx(SELECT_COL_UNITS))

function resolveColumnWidth(col: ZDataTableColumn<T>): string {
  if (col.width === undefined) return '' // flex 填充
  if (typeof col.width === 'string') return col.width
  return `${sizePx(col.width)}px`
}

function columnStyle(col: ZDataTableColumn<T>): Record<string, string> {
  const w = resolveColumnWidth(col)
  const style: Record<string, string> = {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: `${sizePx((props.size ?? 1) * 0.75)}px`,
    paddingRight: `${sizePx((props.size ?? 1) * 0.75)}px`,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }
  if (w) {
    style.width = w
    style.flexShrink = '0'
  } else {
    style.flex = '1'
    style.minWidth = `${sizePx(col.minWidth ?? 5)}px`
  }
  if (col.align === 'center') style.justifyContent = 'center'
  if (col.align === 'right') style.justifyContent = 'flex-end'
  return style
}

const selectColStyle = computed<Record<string, string>>(() => ({
  width: `${selectColPx.value}px`,
  flexShrink: '0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

// ─── 样式 ───
const rootClass = computed(() =>
  icss(theme.value, s => {
    s.position.relative
    s.display.flex
    s.flexDirection.column
    s.color._text
    s.fontSize.px(sizePx(props.size ?? 1))
    s.overflow.hidden
    if (props.bordered) {
      s.borderWidth._thin
      s.borderStyle.solid
      s.borderColor._border
      s.borderRadius._small
    }
    props.css?.(s)
  }),
)

const headerClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.alignItems.center
    s.flexShrink(0)
    s.backgroundColor._bgMuted
    s.borderBottomWidth._thin
    s.borderBottomStyle.solid
    s.borderBottomColor._border
    s.height.px(sizePx(props.rowSize ?? 3))
    s.fontWeight._semibold
    s.color._text
    s.position.sticky
    s.top.px(0)
    s.zIndex(1)
  }),
)

const headerCellClass = (col: ZDataTableColumn<T>) =>
  icss(theme.value, s => {
    if (col.sortable) {
      s.cursor.pointer
      s.userSelect.none
      s._hover(h2 => {
        h2.backgroundColor._textSecondary.alpha(8)
      })
    }
  })

const sortIconClass = computed(() =>
  icss(theme.value, s => {
    s.marginLeft.px(sizePx(0.25))
    s.opacity._dim
    s.fontSize._small
  }),
)

const rowClass = (row: T, index: number) =>
  icss(theme.value, s => {
    s.display.flex
    s.alignItems.center
    s.height.pct(100)
    s.borderBottomWidth._thin
    s.borderBottomStyle.solid
    s.borderBottomColor._border
    if (props.stripe && index % 2 === 1) {
      s.backgroundColor._bgMuted.alpha(40)
    }
    if (isSelected(row, index)) {
      s.backgroundColor._primary.alpha(8)
    }
    if (props.selection !== 'none') {
      s.cursor.pointer
    }
    s._hover(h2 => {
      h2.backgroundColor._textSecondary.alpha(6)
    })
  })

const cellClass = computed(() =>
  icss(theme.value, s => {
    s.color._text
  }),
)

const loadingMaskClass = computed(() =>
  icss(theme.value, s => {
    s.position.absolute
    s.top.px(0)
    s.left.px(0)
    s.right.px(0)
    s.bottom.px(0)
    s.display.flex
    s.alignItems.center
    s.justifyContent.center
    s.backgroundColor._bg.alpha(60)
    s.zIndex._modal
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

// ─── 渲染 cell 内容 ───
function renderCellContent(row: T, col: ZDataTableColumn<T>, index: number): VNode | string {
  // 优先级:#cell-${key} slot > col.render > col.accessor > row[key]
  const cellSlot = slots[`cell-${col.key}`]
  if (cellSlot) {
    const node = cellSlot({ row, column: col, index })
    return Array.isArray(node) ? h('span', node) : (node as VNode)
  }
  if (col.render) {
    const result = col.render(row, index)
    if (typeof result === 'string') return result
    return result
  }
  const val = col.accessor ? col.accessor(row) : (row as Record<string, unknown>)[col.key]
  return val == null ? '' : String(val)
}

function renderHeaderContent(col: ZDataTableColumn<T>): VNode | string {
  const headerSlot = slots[`header-${col.key}`]
  if (headerSlot) {
    const node = headerSlot({ column: col })
    return Array.isArray(node) ? h('span', node) : (node as VNode)
  }
  return col.title
}

// ─── 计算虚拟列表高度(总高度 - header)───
const headerSizePx = computed(() => sizePx(props.rowSize ?? 3))
const vlHeight = computed<string>(() => {
  const totalIsStr = typeof props.height === 'string'
  if (totalIsStr) return `calc(${props.height} - ${headerSizePx.value}px)`
  const totalPx = sizePx(props.height as number)
  return `${Math.max(0, totalPx - headerSizePx.value)}px`
})

// ─── ZVirtualList ref ───
const vlRef = ref<ZVirtualListExpose | null>(null)
const rootRef = ref<HTMLElement | null>(null)

defineExpose<ZDataTableExpose>({
  rootRef,
  scrollToIndex: (i, align) => vlRef.value?.scrollToIndex(i, align),
  scrollToOffset: px => vlRef.value?.scrollToOffset(px),
  getScroll: () => vlRef.value?.getScroll() ?? { offset: 0, total: 0, viewport: 0 },
})

function onRowClick(row: T, index: number, e: MouseEvent): void {
  emit('row-click', row, index, e)
  if (props.selection !== 'none') {
    toggleSelection(row, index)
  }
}

function onScrollEnd(): void {
  emit('scroll-end')
}

const isEmpty = computed(() => sortedRows.value.length === 0)
</script>

<template>
  <div ref="rootRef" :class="rootClass" role="table">
    <!-- header -->
    <div :class="headerClass" role="rowgroup">
      <!-- 多选 checkbox 列 -->
      <div
        v-if="selection === 'multiple'"
        :style="selectColStyle"
        role="columnheader"
        aria-label="select all"
      >
        <input
          type="checkbox"
          :checked="isAllSelected"
          :indeterminate.prop="isIndeterminate"
          @change="toggleAll"
        />
      </div>
      <div
        v-for="col in columns"
        :key="col.key"
        :class="headerCellClass(col)"
        :style="columnStyle(col)"
        role="columnheader"
        :aria-sort="
          sort?.key === col.key ? (sort.order === 'asc' ? 'ascending' : 'descending') : 'none'
        "
        @click="toggleSort(col)"
      >
        <span>
          <component
            :is="renderHeaderContent(col)"
            v-if="typeof renderHeaderContent(col) !== 'string'"
          />
          <template v-else>{{ renderHeaderContent(col) }}</template>
        </span>
        <span v-if="col.sortable" :class="sortIconClass">
          {{ sort?.key === col.key ? (sort.order === 'asc' ? '↑' : '↓') : '⇕' }}
        </span>
      </div>
    </div>

    <!-- body -->
    <div v-if="isEmpty" :class="emptyClass">
      <slot name="empty">{{ emptyText }}</slot>
    </div>
    <ZVirtualList
      v-else
      ref="vlRef"
      :items="sortedRows"
      :item-size="rowSize ?? 3"
      :height="vlHeight"
      :overscan="overscan ?? 5"
      :key-field="rowKey"
      @scroll-end="onScrollEnd"
    >
      <template #default="{ item: row, index }">
        <div
          :class="rowClass(row, index)"
          role="row"
          :aria-selected="isSelected(row, index)"
          @click="e => onRowClick(row, index, e)"
        >
          <div v-if="selection === 'multiple'" :style="selectColStyle" role="cell" @click.stop>
            <input
              type="checkbox"
              :checked="isSelected(row, index)"
              @change="toggleSelection(row, index)"
            />
          </div>
          <div
            v-for="col in columns"
            :key="col.key"
            :class="cellClass"
            :style="columnStyle(col)"
            role="cell"
          >
            <component
              :is="renderCellContent(row, col, index)"
              v-if="typeof renderCellContent(row, col, index) !== 'string'"
            />
            <template v-else>{{ renderCellContent(row, col, index) }}</template>
          </div>
        </div>
      </template>
    </ZVirtualList>

    <!-- loading 遮罩 -->
    <div v-if="loading" :class="loadingMaskClass" role="status" aria-busy="true">
      <slot name="loading">加载中...</slot>
    </div>
  </div>
</template>
