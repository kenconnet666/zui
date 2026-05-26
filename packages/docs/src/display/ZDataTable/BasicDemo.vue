<script setup lang="ts">
import { ZDataTable } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

interface Row {
  id: number
  name: string
  dept: string
  salary: number
}

const columns = [
  { key: 'name',   title: '姓名',   sortable: true },
  { key: 'dept',   title: '部门',   sortable: true },
  { key: 'salary', title: '薪资',   align: 'right' as const, sortable: true },
]

const rows: Row[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `员工 ${String(i + 1).padStart(3, '0')}`,
  dept: (['研发部', '产品部', '设计部', '运营部'] as string[])[i % 4] as string,
  salary: 8000 + (i % 10) * 1000,
}))

const selected = ref<(string | number)[]>([])
</script>

<template>
  <ZDataTable
    :rows="rows"
    :columns="columns"
    :height="20"
    :row-size="3"
    selection="multiple"
    v-model:selected="selected"
    :bordered="true"
    :stripe="true"
  />
</template>
