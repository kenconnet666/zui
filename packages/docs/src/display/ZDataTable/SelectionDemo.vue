<script setup lang="ts">
import { ref } from 'vue'
import { ZDataTable } from '@kenconnet666/zui-vue'

interface Employee {
  id: number
  name: string
  dept: string
  salary: number
}

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'dept', title: '部门' },
  { key: 'salary', title: '薪资（元）', align: 'right' as const },
]

const rows: Employee[] = [
  { id: 1, name: '张伟', dept: '研发部', salary: 18000 },
  { id: 2, name: '李娜', dept: '产品部', salary: 22000 },
  { id: 3, name: '王芳', dept: '设计部', salary: 14000 },
  { id: 4, name: '赵敏', dept: '运营部', salary: 16000 },
  { id: 5, name: '陈静', dept: '研发部', salary: 20000 },
  { id: 6, name: '刘洋', dept: '设计部', salary: 13000 },
]

/**
 * selection="multiple"：第一列自动插入 checkbox，支持全选；
 * selection="single"：点击行选中，无 checkbox。
 * 两者均通过 v-model:selected 双向绑定 key 数组。
 */
const mode = ref<'single' | 'multiple'>('multiple')
const selectedKeys = ref<(string | number)[]>([])

function toggleMode() {
  mode.value = mode.value === 'multiple' ? 'single' : 'multiple'
  selectedKeys.value = []
}
</script>

<template>
  <div>
    <div style="margin-bottom: 12px; display: flex; gap: 12px; align-items: center;">
      <button style="padding: 4px 12px; cursor: pointer;" @click="toggleMode">
        切换模式（当前：{{ mode }}）
      </button>
      <span style="color: #666; font-size: 14px;">
        已选中：{{ selectedKeys.length > 0 ? selectedKeys.join(', ') : '无' }}
      </span>
    </div>
    <ZDataTable
      :rows="rows"
      :columns="columns"
      :height="16"
      :selection="mode"
      v-model:selected="selectedKeys"
      bordered
      stripe
    />
  </div>
</template>
