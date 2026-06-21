<script setup lang="ts">
import { ZTable } from '@kenconnet666/zui-vue'

/** 销售数据行类型 */
interface SalesRow extends Record<string, unknown> {
  id: number
  region: string
  q1: number
  q2: number
  q3: number
}

const columns = [
  { key: 'region', title: '大区', dataIndex: 'region' },
  { key: 'q1', title: 'Q1', dataIndex: 'q1', align: 'right' as const },
  { key: 'q2', title: 'Q2', dataIndex: 'q2', align: 'right' as const },
  { key: 'q3', title: 'Q3', dataIndex: 'q3', align: 'right' as const },
]

const data: SalesRow[] = [
  { id: 1, region: '华北', q1: 1200, q2: 1450, q3: 1680 },
  { id: 2, region: '华东', q1: 2300, q2: 2100, q3: 2580 },
  { id: 3, region: '华南', q1: 980, q2: 1120, q3: 1350 },
  { id: 4, region: '西部', q1: 650, q2: 720, q3: 810 },
]

/**
 * sxHead：覆盖 <thead> 区域——深色背景示例。
 * SxObject 为内部类型，直接用对象字面量传入即可。
 */
const sxHead = {
  style: {
    background: 'linear-gradient(90deg, #1e3a5f 0%, #2563eb 100%)',
    color: '#fff',
  },
}

/**
 * sxRow：覆盖每一 <tr>——此处演示过渡动画追加。
 * 注意：选中/斑马纹由内部逻辑优先，sxRow 追加在后。
 */
const sxRow = {
  style: { transition: 'background 0.15s' },
}

/**
 * sxCell：覆盖 <th>/<td>——加大字符间距示例。
 */
const sxCell = {
  style: { letterSpacing: '0.03em' },
}
</script>

<template>
  <!--
    sxHead / sxRow / sxCell 均为 SxObject，
    可传 style / class / HTML 属性，追加到对应元素。
  -->
  <ZTable
    :columns="columns"
    :data="data"
    row-key="id"
    :sx-head="sxHead"
    :sx-row="sxRow"
    :sx-cell="sxCell"
  />
</template>
