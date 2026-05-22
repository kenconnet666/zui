<script lang="ts">
/**
 * `ZTable` —— 基础表格(配置式,Phase α v1)。
 *
 * **API**:
 * - `columns: ZTableColumn<T>[]` —— 列定义
 * - `data: T[]` —— 数据数组
 * - `rowKey: string | ((row: T) => string | number)` —— 行 key,默认 `'id'`
 * - `bordered?: boolean` —— 边框,默认 `false`
 * - `striped?: boolean` —— 斑马纹,默认 `false`
 * - `size?: 'small' | 'middle' | 'large'` —— 内边距档位
 * - `emptyText?: string` —— 空数据文案,默认 "暂无数据"
 *
 * **列定义**(`ZTableColumn`):
 * - `key: string`(列 key)
 * - `title: string`(表头文字)
 * - `dataIndex?: string`(取值字段,默认同 key)
 * - `width?: string | number`
 * - `align?: 'left' | 'center' | 'right'`
 * - `render?: (row, col, idx) => string | VNode` —— 自定义渲染
 *
 * **sx**:sxHead / sxRow / sxCell / sxBody
 *
 * **未实现(Phase β)**:排序 / 选择(checkbox) / 分页接入 / 列冻结 / expandable rows。
 *
 * **a11y**:原生 `<table>` + `<thead>` / `<tbody>`,屏读器友好。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'
import type { VNodeChild } from 'vue'

export type ZTableSize = 'small' | 'middle' | 'large'
export type ZTableAlign = 'left' | 'center' | 'right'

export interface ZTableColumn<T = Record<string, unknown>> {
  key: string
  title: string
  dataIndex?: string
  width?: string | number
  align?: ZTableAlign
  render?: (row: T, col: ZTableColumn<T>, idx: number) => VNodeChild
}

export interface ZTableProps<T = Record<string, unknown>> {
  columns: ZTableColumn<T>[]
  data: T[]
  rowKey?: string | ((row: T) => string | number)
  bordered?: boolean
  striped?: boolean
  size?: ZTableSize
  emptyText?: string
  sxHead?: SxObject
  sxBody?: SxObject
  sxRow?: SxObject
  sxCell?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup generic="T extends Record<string, unknown>">
import { computed, h } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'

const props = withDefaults(defineProps<ZTableProps<T>>(), {
  rowKey: 'id',
  bordered: false,
  striped: false,
  size: 'middle',
  emptyText: '暂无数据',
})

const theme = useZTheme()

const SIZE_PADDING: Record<ZTableSize, number> = {
  small: 0.375,
  middle: 0.625,
  large: 0.875,
}

const tableClass = computed(() =>
  icss(theme.value, (s) => {
    s.width.pct(100)
    s._prop('borderCollapse', 'collapse')
    s.fontSize._middle
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
  icss(theme.value, (s) => {
    s.backgroundColor._bgMuted
    s.color._text
    s.fontWeight._semibold
    applySx(s, props.sxHead)
  }),
)
const sxHeadAttrs = computed(() => extractSxAttrs(props.sxHead))

const tbodyClass = computed(() =>
  icss(theme.value, (s) => {
    applySx(s, props.sxBody)
  }),
)
const sxBodyAttrs = computed(() => extractSxAttrs(props.sxBody))

const rowClass = (idx: number): string =>
  icss(theme.value, (s) => {
    s.borderTopWidth._thin
    s.borderTopStyle.solid
    s.borderTopColor._border
    if (props.striped && idx % 2 === 1) s.backgroundColor._bgMuted.alpha(50)
    s._hover((h2) => {
      h2.backgroundColor._primary.alpha(4)
    })
    applySx(s, props.sxRow)
  })
const sxRowAttrs = computed(() => extractSxAttrs(props.sxRow))

const cellClass = (col: ZTableColumn<T>): string =>
  icss(theme.value, (s) => {
    s.padding.iem(SIZE_PADDING[props.size])
    s.paddingLeft._middle
    s.paddingRight._middle
    s._prop('textAlign', col.align ?? 'left')
    if (props.bordered) {
      s.borderRightWidth._thin
      s.borderRightStyle.solid
      s.borderRightColor._border
    }
    applySx(s, props.sxCell)
  })
const sxCellAttrs = computed(() => extractSxAttrs(props.sxCell))

const emptyClass = computed(() =>
  icss(theme.value, (s) => {
    s.padding._large
    s.color._textSecondary
    s.fontSize._small
    s._prop('textAlign', 'center')
  }),
)

function getRowKey(row: T, idx: number): string | number {
  if (typeof props.rowKey === 'function') return props.rowKey(row)
  const v = (row as Record<string, unknown>)[props.rowKey]
  return v !== undefined ? (v as string | number) : idx
}

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

// 让 unused warning 不报
void h
</script>

<template>
  <table :class="tableClass">
    <thead
      :class="[theadClass, sxHeadAttrs.class]"
      :style="sxHeadAttrs.style"
      v-bind="sxHeadAttrs.attrs"
    >
      <tr>
        <th
          v-for="col in columns"
          :key="col.key"
          :class="[cellClass(col), sxCellAttrs.class]"
          :style="[sxCellAttrs.style, colWidth(col) ? { width: colWidth(col) } : {}]"
          v-bind="sxCellAttrs.attrs"
        >
          {{ col.title }}
        </th>
      </tr>
    </thead>
    <tbody
      :class="[tbodyClass, sxBodyAttrs.class]"
      :style="sxBodyAttrs.style"
      v-bind="sxBodyAttrs.attrs"
    >
      <tr v-if="data.length === 0">
        <td :colspan="columns.length" :class="emptyClass">{{ emptyText }}</td>
      </tr>
      <tr
        v-for="(row, idx) in data"
        :key="getRowKey(row, idx)"
        :class="[rowClass(idx), sxRowAttrs.class]"
        :style="sxRowAttrs.style"
        v-bind="sxRowAttrs.attrs"
      >
        <td
          v-for="col in columns"
          :key="col.key"
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
