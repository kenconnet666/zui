<script lang="ts">
/**
 * `ZTable` —— 基础表格(配置式)。Phase α v1 + Phase β 升级。
 *
 * **API**:
 * - `columns: ZTableColumn<T>[]` —— 列定义
 * - `data: T[]` —— 数据数组
 * - `rowKey: string | ((row: T) => string | number)` —— 行 key,默认 `'id'`
 * - `bordered?: boolean` —— 边框,默认 `false`
 * - `striped?: boolean` —— 斑马纹,默认 `false`
 * - `size?: SizePropMulti` —— 内边距 factory(默认等价 `TABLE_SIZE_MAP.middle`)
 * - `emptyText?: string` —— 空数据文案,默认 "暂无数据"
 *
 * **Phase β 升级**:
 * - `selectable?: boolean` + `v-model:selectedKeys` —— 行选择(首列 checkbox)
 * - column `sortable?: boolean` + `v-model:sortState` —— 排序(点击列头 toggle asc/desc/none)
 * - `pagination?: { page, pageSize, total }` —— 分页 *显示*(实际 data 由业务方按 page 切片传入)
 *
 * **未实现**:列冻结 / expandable rows / 远端排序 callback。
 *
 * **a11y**:`<table>` + `aria-sort` 在排序列 + `<input type=checkbox>` 全选/单选。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'
import type { VNodeChild } from 'vue'

export type ZTableAlign = 'left' | 'center' | 'right'
export type ZTableSortOrder = 'asc' | 'desc' | null

export interface ZTableColumn<T = Record<string, unknown>> {
  key: string
  title: string
  dataIndex?: string
  width?: string | number
  align?: ZTableAlign
  render?: (row: T, col: ZTableColumn<T>, idx: number) => VNodeChild
  /** 是否可排序;true 时点击列头 toggle asc → desc → none。 */
  sortable?: boolean
  /** 自定义排序 compare(若不提供则用默认字符串/数字比较)。 */
  sorter?: (a: T, b: T) => number
}

/** 当前排序状态。 */
export interface ZTableSortState {
  column: string | null
  order: ZTableSortOrder
}

export interface ZTableProps<T = Record<string, unknown>> {
  columns: ZTableColumn<T>[]
  data: T[]
  rowKey?: string | ((row: T) => string | number)
  bordered?: boolean
  striped?: boolean
  /**
   * 字号尺寸 —— `number`(px 倍数,1 单位 = 16px,默认 1)。2026-05-24 B7。
   *
   * 内部按比例算 cell padding-y(`size * 0.625`)。
   */
  size?: number
  emptyText?: string
  /** 行选择 ── `v-model:selectedKeys` 配合用。 */
  selectable?: boolean
  selectedKeys?: (string | number)[]
  /** 排序状态 ── `v-model:sortState`。 */
  sortState?: ZTableSortState
  sxHead?: SxObject
  sxBody?: SxObject
  sxRow?: SxObject
  sxCell?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZTableEmits {
  (e: 'update:selectedKeys', keys: (string | number)[]): void
  (e: 'update:sortState', state: ZTableSortState): void
}
</script>

<script lang="ts" setup generic="T extends Record<string, unknown>">
import { computed, h } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { BuiltinIcons, ZIcon } from '../gene'
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(纯 px,1 单位 = 16px):
 *
 *   ┌──────────────────────────────────────────────────────────┐
 *   │ <table>                                                  │   width: 100%
 *   │   borderCollapse: collapse                               │   fontSize: _middle
 *   │   bordered=true → border _thin solid _border             │   bg: _bg
 *   │                                                          │
 *   │  ┌────────────────────────────────────────────────────┐  │
 *   │  │ <thead>  bg: _bgMuted  fontWeight: _semibold       │  │
 *   │  │  ┌──────────────────────────────────────────────┐  │  │
 *   │  │  │ <th> cell                                    │  │  │
 *   │  │  │   pad-y: 6px / 10px / 14px(size 档 × 16px)  │  │  │
 *   │  │  │   pad-x: _middle                             │  │  │
 *   │  │  │   sortable → cursor pointer + 排序图标       │  │  │
 *   │  │  └──────────────────────────────────────────────┘  │  │
 *   │  │  selectable 首列 <th>: width 32px(= 2 × 16px),pad-x _small   │  │
 *   │  └────────────────────────────────────────────────────┘  │
 *   │  ┌────────────────────────────────────────────────────┐  │
 *   │  │ <tbody>                                            │  │
 *   │  │  ┌──────────────────────────────────────────────┐  │  │
 *   │  │  │ <tr> row  border-t: _thin solid _border      │  │  │
 *   │  │  │   selected → bg _primary.alpha(8)            │  │  │
 *   │  │  │   striped 偶 → bg _bgMuted.alpha(50)         │  │  │
 *   │  │  │   hover → bg _primary.alpha(4)               │  │  │
 *   │  │  │  ┌────────────────────────────────────────┐  │  │  │
 *   │  │  │  │ <td> cell  (同 thead cell padding)     │  │  │  │
 *   │  │  │  └────────────────────────────────────────┘  │  │  │
 *   │  │  └──────────────────────────────────────────────┘  │  │
 *   │  │  empty row: pad _large,fontSize _small,centered  │  │
 *   │  └────────────────────────────────────────────────────┘  │
 *   └──────────────────────────────────────────────────────────┘
 */
const props = withDefaults(defineProps<ZTableProps<T>>(), {
  rowKey: 'id',
  bordered: false,
  striped: false,
  size: 1,
  emptyText: '暂无数据',
  selectable: false,
  selectedKeys: () => [],
  sortState: () => ({ column: null, order: null }),
})

const sortStateRef = computed<ZTableSortState>(
  () => props.sortState ?? { column: null, order: null },
)

const emit = defineEmits<ZTableEmits>()

const theme = useZTheme()

// ─── 排序 ───
const sortedData = computed<T[]>(() => {
  const { column, order } = props.sortState
  if (!column || !order) return props.data
  const col = props.columns.find(c => c.key === column)
  if (!col) return props.data
  const dataIndex = col.dataIndex ?? col.key
  const sorter =
    col.sorter ??
    ((a: T, b: T) => {
      const av = (a as Record<string, unknown>)[dataIndex]
      const bv = (b as Record<string, unknown>)[dataIndex]
      if (av == null) return -1
      if (bv == null) return 1
      if (typeof av === 'number' && typeof bv === 'number') return av - bv
      return String(av).localeCompare(String(bv))
    })
  const result = [...props.data].sort(sorter)
  return order === 'desc' ? result.reverse() : result
})

function toggleSort(col: ZTableColumn<T>): void {
  if (!col.sortable) return
  const cur = props.sortState
  let nextOrder: ZTableSortOrder
  if (cur.column !== col.key) nextOrder = 'asc'
  else if (cur.order === 'asc') nextOrder = 'desc'
  else if (cur.order === 'desc') nextOrder = null
  else nextOrder = 'asc'
  emit('update:sortState', {
    column: nextOrder ? col.key : null,
    order: nextOrder,
  })
}

// ─── 行选择 ───
function getRowKey(row: T, idx: number): string | number {
  if (typeof props.rowKey === 'function') return props.rowKey(row)
  const v = (row as Record<string, unknown>)[props.rowKey]
  return v !== undefined ? (v as string | number) : idx
}

const allKeys = computed(() => sortedData.value.map((row, i) => getRowKey(row, i)))

const isAllSelected = computed(
  () =>
    props.selectable &&
    allKeys.value.length > 0 &&
    allKeys.value.every(k => props.selectedKeys.includes(k)),
)
const isIndeterminate = computed(() => {
  if (!props.selectable) return false
  const selected = allKeys.value.filter(k => props.selectedKeys.includes(k)).length
  return selected > 0 && selected < allKeys.value.length
})

function toggleAll(checked: boolean): void {
  emit('update:selectedKeys', checked ? [...allKeys.value] : [])
}

function toggleRow(key: string | number): void {
  const next = props.selectedKeys.includes(key)
    ? props.selectedKeys.filter(k => k !== key)
    : [...props.selectedKeys, key]
  emit('update:selectedKeys', next)
}

function isRowSelected(key: string | number): boolean {
  return props.selectedKeys.includes(key)
}

// ─── 渲染 helpers ───
function getCellValue(row: T, col: ZTableColumn<T>): unknown {
  const key = col.dataIndex ?? col.key
  return (row as Record<string, unknown>)[key]
}

function renderCellVNode(row: T, col: ZTableColumn<T>, idx: number): VNodeChild {
  return col.render ? col.render(row, col, idx) : null
}

function renderCellText(row: T, col: ZTableColumn<T>): string {
  const v = getCellValue(row, col)
  return v == null ? '' : String(v)
}

function colWidth(col: ZTableColumn<T>): string | undefined {
  if (col.width === undefined) return undefined
  return typeof col.width === 'number' ? `${col.width}px` : col.width
}

// ─── 样式 ───
const tableClass = computed(() =>
  icss(theme.value, s => {
    s.width.pct(100)
    s.borderCollapse.collapse
    s.fontSize.px(sizePx(props.size ?? 1))
    s.color._text
    s.backgroundColor._bg
    if (props.bordered) {
      s.borderWidth._thin
      s.borderStyle.solid
      s.borderColor._border
    }
    props.css?.(s)
  }),
)

const theadClass = computed(() =>
  icss(theme.value, s => {
    s.backgroundColor._bgMuted
    s.color._text
    s.fontWeight._semibold
    applySx(s, props.sxHead)
  }),
)
const sxHeadAttrs = computed(() => extractSxAttrs(props.sxHead))

const tbodyClass = computed(() =>
  icss(theme.value, s => {
    applySx(s, props.sxBody)
  }),
)
const sxBodyAttrs = computed(() => extractSxAttrs(props.sxBody))

const rowClass = (idx: number, selected: boolean): string =>
  icss(theme.value, s => {
    s.borderTopWidth._thin
    s.borderTopStyle.solid
    s.borderTopColor._border
    if (selected) s.backgroundColor._primary.alpha(8)
    else if (props.striped && idx % 2 === 1) s.backgroundColor._bgMuted.alpha(50)
    s._hover(h2 => {
      if (!selected) h2.backgroundColor._primary.alpha(4)
    })
    applySx(s, props.sxRow)
  })
const sxRowAttrs = computed(() => extractSxAttrs(props.sxRow))

const cellClass = (col: ZTableColumn<T>): string =>
  icss(theme.value, s => {
    const size = props.size ?? 1
    s.paddingTop.px(sizePx(size * 0.625))
    s.paddingBottom.px(sizePx(size * 0.625))
    s.paddingLeft._middle
    s.paddingRight._middle
    s.textAlign(col.align ?? 'left')
    if (props.bordered) {
      s.borderRightWidth._thin
      s.borderRightStyle.solid
      s.borderRightColor._border
    }
    applySx(s, props.sxCell)
  })
const sxCellAttrs = computed(() => extractSxAttrs(props.sxCell))

const selectCellClass = computed(() =>
  icss(theme.value, s => {
    const size = props.size ?? 1
    s.paddingTop.px(sizePx(size * 0.625))
    s.paddingBottom.px(sizePx(size * 0.625))
    s.paddingLeft._small
    s.paddingRight._small
    s.textAlign.center
    s.width.px(sizePx(2))
  }),
)

const sortableHeadClass = computed(() =>
  icss(theme.value, s => {
    s.cursor.pointer
    s.userSelect.none
    s._hover(h2 => {
      h2.color._primary
    })
  }),
)

const sortIconClass = (active: boolean): string =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.marginLeft._tiny
    if (active) s.color._primary
    else s.color._textSecondary
    s.opacity(active ? 1 : 0.6)
  })

const emptyClass = computed(() =>
  icss(theme.value, s => {
    s.padding._large
    s.color._textSecondary
    s.fontSize._small
    s.textAlign.center
  }),
)

function ariaSort(col: ZTableColumn<T>): 'ascending' | 'descending' | 'none' | undefined {
  if (!col.sortable) return undefined
  if (props.sortState.column !== col.key) return 'none'
  if (props.sortState.order === 'asc') return 'ascending'
  if (props.sortState.order === 'desc') return 'descending'
  return 'none'
}

function sortIconFor(col: ZTableColumn<T>) {
  const isActive = props.sortState.column === col.key
  if (isActive && props.sortState.order === 'asc') {
    return h(ZIcon, { component: BuiltinIcons.chevronUp })
  }
  if (isActive && props.sortState.order === 'desc') {
    return h(ZIcon, { component: BuiltinIcons.chevronDown })
  }
  // 未激活:显示双向箭头(用 chevronDown 占位)
  return h(ZIcon, { component: BuiltinIcons.chevronDown })
}

const totalColspan = computed(() => props.columns.length + (props.selectable ? 1 : 0))
</script>

<template>
  <table :class="tableClass">
    <thead
      :ref="sxHeadAttrs.ref"
      :class="[theadClass, sxHeadAttrs.class]"
      :style="sxHeadAttrs.style"
      v-bind="sxHeadAttrs.attrs"
    >
      <tr>
        <th v-if="selectable" :class="selectCellClass" scope="col">
          <input
            type="checkbox"
            :checked="isAllSelected"
            :indeterminate="isIndeterminate"
            :aria-label="isAllSelected ? '取消全选' : '全选'"
            @change="toggleAll(($event.target as HTMLInputElement).checked)"
          />
        </th>
        <th
          v-for="col in columns"
          :key="col.key"
          :ref="sxCellAttrs.ref"
          :class="[cellClass(col), col.sortable ? sortableHeadClass : '', sxCellAttrs.class]"
          :style="[sxCellAttrs.style, colWidth(col) ? { width: colWidth(col) } : {}]"
          :aria-sort="ariaSort(col)"
          scope="col"
          v-bind="sxCellAttrs.attrs"
          @click="toggleSort(col)"
        >
          {{ col.title }}
          <span v-if="col.sortable" :class="sortIconClass(sortStateRef.column === col.key)">
            <component :is="sortIconFor(col)" />
          </span>
        </th>
      </tr>
    </thead>
    <tbody
      :ref="sxBodyAttrs.ref"
      :class="[tbodyClass, sxBodyAttrs.class]"
      :style="sxBodyAttrs.style"
      v-bind="sxBodyAttrs.attrs"
    >
      <tr v-if="sortedData.length === 0">
        <td :colspan="totalColspan" :class="emptyClass">{{ emptyText }}</td>
      </tr>
      <tr
        v-for="(row, idx) in sortedData"
        :key="getRowKey(row, idx)"
        :ref="sxRowAttrs.ref"
        :class="[rowClass(idx, isRowSelected(getRowKey(row, idx))), sxRowAttrs.class]"
        :style="sxRowAttrs.style"
        v-bind="sxRowAttrs.attrs"
      >
        <td v-if="selectable" :class="selectCellClass">
          <input
            type="checkbox"
            :checked="isRowSelected(getRowKey(row, idx))"
            :aria-label="`选择第 ${idx + 1} 行`"
            @change="toggleRow(getRowKey(row, idx))"
          />
        </td>
        <td
          v-for="col in columns"
          :key="col.key"
          :ref="sxCellAttrs.ref"
          :class="[cellClass(col), sxCellAttrs.class]"
          :style="sxCellAttrs.style"
          v-bind="sxCellAttrs.attrs"
        >
          <component v-if="col.render" :is="renderCellVNode(row, col, idx) as never" />
          <template v-else>{{ renderCellText(row, col) }}</template>
        </td>
      </tr>
    </tbody>
  </table>
</template>
