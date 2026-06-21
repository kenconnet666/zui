<script setup lang="ts">
import { ZTable } from '@kenconnet666/zui-vue'

const columns = [
  { key: 'name', title: '姓名', dataIndex: 'name' },
  { key: 'dept', title: '部门', dataIndex: 'dept' },
  { key: 'email', title: '邮箱', dataIndex: 'email' },
]

/** 空数据数组触发空态 */
const data: never[] = []
</script>

<template>
  <!--
    data 为空时渲染 emptyText；
    不传则显示默认文案"暂无数据"，
    传入自定义字符串可覆盖。
  -->
  <ZTable
    :columns="columns"
    :data="data"
    :bordered="true"
    empty-text="当前筛选条件下暂无员工数据"
  />
</template>
