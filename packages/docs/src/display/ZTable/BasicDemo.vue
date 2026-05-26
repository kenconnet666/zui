<script setup lang="ts">
import { ZTable } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

interface User {
  id: number
  name: string
  age: number
  role: string
  status: string
  [key: string]: unknown
}

const columns = [
  { key: 'name',   title: '姓名',   dataIndex: 'name',   sortable: true },
  { key: 'age',    title: '年龄',   dataIndex: 'age',    align: 'center' as const, sortable: true },
  { key: 'role',   title: '角色',   dataIndex: 'role' },
  { key: 'status', title: '状态',   dataIndex: 'status', align: 'center' as const },
]

const data: User[] = [
  { id: 1, name: '张三', age: 28, role: '管理员', status: '正常' },
  { id: 2, name: '李四', age: 32, role: '编辑',   status: '正常' },
  { id: 3, name: '王五', age: 25, role: '访客',   status: '禁用' },
  { id: 4, name: '赵六', age: 40, role: '管理员', status: '正常' },
  { id: 5, name: '孙七', age: 29, role: '编辑',   status: '正常' },
]

const selectedKeys = ref<(string | number)[]>([])
</script>

<template>
  <ZTable
    :columns="columns"
    :data="data"
    row-key="id"
    :bordered="true"
    :striped="true"
    :selectable="true"
    v-model:selected-keys="selectedKeys"
  />
</template>
