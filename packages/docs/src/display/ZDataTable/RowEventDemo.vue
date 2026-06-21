<script setup lang="ts">
import { ref } from 'vue'
import { ZDataTable } from '@kenconnet666/zui-vue'

interface Employee {
  id: number
  name: string
  dept: string
  city: string
}

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'dept', title: '部门' },
  { key: 'city', title: '城市' },
]

/** 生成较多数据以演示滚动到底触发 scroll-end */
const rows: Employee[] = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: `员工 ${String(i + 1).padStart(3, '0')}`,
  dept: (['研发部', '产品部', '设计部', '运营部'] as string[])[i % 4] as string,
  city: (['北京', '上海', '广州', '深圳', '杭州'] as string[])[i % 5] as string,
}))

/** row-click：行点击事件，参数 (row, index, MouseEvent) */
const lastClickedName = ref<string | null>(null)

function onRowClick(row: Employee) {
  lastClickedName.value = row.name
}

/** scroll-end：滚动到列表底部时触发，可用于"加载更多" */
const scrollEndCount = ref(0)

function onScrollEnd() {
  scrollEndCount.value++
}
</script>

<template>
  <div>
    <div style="margin-bottom: 12px; font-size: 14px; color: #555; display: flex; gap: 24px;">
      <span>点击行：{{ lastClickedName ?? '—' }}</span>
      <span>scroll-end 触发次数：{{ scrollEndCount }}</span>
    </div>
    <ZDataTable
      :rows="rows"
      :columns="columns"
      :height="16"
      bordered
      stripe
      @row-click="onRowClick"
      @scroll-end="onScrollEnd"
    />
  </div>
</template>
