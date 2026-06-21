<script setup lang="ts">
import { ref } from 'vue'
import { ZDataTable } from '@kenconnet666/zui-vue'

interface Employee {
  id: number
  name: string
  dept: string
}

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'dept', title: '部门' },
]

/**
 * 空数据态：rows 为空时展示。
 * - 默认文字由 emptyText 控制（默认"暂无数据"）。
 * - 可通过 #empty slot 完全自定义空态内容。
 */
const rows = ref<Employee[]>([])

function addRow() {
  const id = rows.value.length + 1
  rows.value = [...rows.value, { id, name: `员工 ${id}`, dept: '研发部' }]
}

function clearRows() {
  rows.value = []
}
</script>

<template>
  <div>
    <div style="margin-bottom: 12px; display: flex; gap: 8px;">
      <button style="padding: 4px 12px; cursor: pointer;" @click="addRow">添加一行</button>
      <button style="padding: 4px 12px; cursor: pointer;" @click="clearRows">清空数据</button>
    </div>

    <!-- 自定义 emptyText -->
    <ZDataTable
      :rows="rows"
      :columns="columns"
      :height="10"
      empty-text="暂时没有员工数据，请先添加"
      bordered
    />
  </div>
</template>
