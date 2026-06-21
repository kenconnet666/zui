<script setup lang="ts">
import { ref } from 'vue'
import { ZTable } from '@kenconnet666/zui-vue'
import type { ZTableSortState } from '@kenconnet666/zui-vue'

/** 成绩数据行类型 */
interface ScoreRow extends Record<string, unknown> {
  id: number
  name: string
  score: number
  subject: string
}

const columns = [
  { key: 'name', title: '姓名', dataIndex: 'name' },
  {
    key: 'subject',
    title: '科目',
    dataIndex: 'subject',
  },
  {
    key: 'score',
    title: '分数',
    dataIndex: 'score',
    align: 'right' as const,
    /** 启用排序：点击列头 toggle asc → desc → none */
    sortable: true,
  },
]

const data: ScoreRow[] = [
  { id: 1, name: '张三', subject: '数学', score: 92 },
  { id: 2, name: '李四', subject: '语文', score: 78 },
  { id: 3, name: '王五', subject: '英语', score: 85 },
  { id: 4, name: '赵六', subject: '数学', score: 67 },
  { id: 5, name: '孙七', subject: '语文', score: 95 },
]

/** 受控排序状态，绑定 v-model:sortState */
const sortState = ref<ZTableSortState>({ column: null, order: null })
</script>

<template>
  <!-- 点击「分数」列头可切换升序 / 降序 / 无排序 -->
  <ZTable
    :columns="columns"
    :data="data"
    row-key="id"
    :bordered="true"
    v-model:sort-state="sortState"
  />
</template>
