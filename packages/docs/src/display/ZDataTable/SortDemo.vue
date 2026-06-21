<script setup lang="ts">
import { ref } from 'vue'
import { ZDataTable, type ZDataTableSort } from '@kenconnet666/zui-vue'

/** 员工行类型 */
interface Employee {
  id: number
  name: string
  age: number
  dept: string
  salary: number
}

const columns = [
  { key: 'name', title: '姓名', sortable: true },
  { key: 'age', title: '年龄', align: 'center' as const, sortable: true },
  { key: 'dept', title: '部门', sortable: true },
  {
    key: 'salary',
    title: '薪资（元）',
    align: 'right' as const,
    /** 自定义比较器：按数值降序 */
    sortable: (a: Employee, b: Employee) => a.salary - b.salary,
  },
]

const rows: Employee[] = [
  { id: 1, name: '张伟', age: 28, dept: '研发部', salary: 18000 },
  { id: 2, name: '李娜', age: 32, dept: '产品部', salary: 22000 },
  { id: 3, name: '王芳', age: 25, dept: '设计部', salary: 14000 },
  { id: 4, name: '赵敏', age: 35, dept: '运营部', salary: 16000 },
  { id: 5, name: '陈静', age: 29, dept: '研发部', salary: 20000 },
  { id: 6, name: '刘洋', age: 27, dept: '设计部', salary: 13000 },
  { id: 7, name: '杨光', age: 31, dept: '产品部', salary: 19000 },
  { id: 8, name: '黄磊', age: 26, dept: '运营部', salary: 15000 },
]

/** v-model:sort 双向绑定排序状态；点击列头切换 asc → desc → 无排序 */
const sort = ref<ZDataTableSort | null>(null)
</script>

<template>
  <ZDataTable
    :rows="rows"
    :columns="columns"
    :height="16"
    bordered
    v-model:sort="sort"
  />
</template>
