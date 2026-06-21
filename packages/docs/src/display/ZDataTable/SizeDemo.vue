<script setup lang="ts">
import { ref } from 'vue'
import { ZDataTable } from '@kenconnet666/zui-vue'

interface Employee {
  id: number
  name: string
  age: number
  city: string
}

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄', align: 'center' as const },
  { key: 'city', title: '城市' },
]

const rows: Employee[] = [
  { id: 1, name: '张伟', age: 28, city: '北京' },
  { id: 2, name: '李娜', age: 32, city: '上海' },
  { id: 3, name: '王芳', age: 25, city: '广州' },
  { id: 4, name: '赵敏', age: 35, city: '深圳' },
]

/** size 是字号 px 倍数（1 单位 = 16px），默认 1（= 16px）。配合 rowSize 调整行高 */
const sizeOptions = [
  { label: '小（0.75）', size: 0.75, rowSize: 2.5 },
  { label: '中（1）', size: 1, rowSize: 3 },
  { label: '大（1.25）', size: 1.25, rowSize: 3.5 },
]

const current = ref(sizeOptions[1]!)
</script>

<template>
  <div>
    <div style="margin-bottom: 12px; display: flex; gap: 8px;">
      <button
        v-for="opt in sizeOptions"
        :key="opt.label"
        :style="{
          padding: '4px 12px',
          cursor: 'pointer',
          fontWeight: current === opt ? 'bold' : 'normal',
        }"
        @click="current = opt"
      >
        {{ opt.label }}
      </button>
    </div>
    <ZDataTable
      :rows="rows"
      :columns="columns"
      :height="12"
      :size="current.size"
      :row-size="current.rowSize"
      bordered
    />
  </div>
</template>
