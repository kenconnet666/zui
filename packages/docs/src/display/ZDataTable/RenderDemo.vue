<script setup lang="ts">
import { h } from 'vue'
import { ZDataTable, type ZDataTableColumn } from '@kenconnet666/zui-vue'

interface Employee {
  id: number
  name: string
  dept: string
  salary: number
  status: 'active' | 'leave' | 'probation'
}

/** 状态标签颜色映射 */
const statusMap = {
  active: { label: '在职', color: '#22c55e' },
  leave: { label: '离职', color: '#ef4444' },
  probation: { label: '试用', color: '#f59e0b' },
}

const columns: ZDataTableColumn<Employee>[] = [
  { key: 'name', title: '姓名', width: 5 },
  { key: 'dept', title: '部门', width: 5 },
  {
    key: 'salary',
    title: '薪资',
    align: 'right',
    width: 6,
    /**
     * render 函数优先级高于 accessor；返回 VNode 或字符串。
     * 这里用 h() 渲染带颜色的薪资，高于 20000 标红。
     */
    render: (row) => {
      const isHigh = row.salary >= 20000
      return h(
        'span',
        { style: { color: isHigh ? '#ef4444' : 'inherit', fontWeight: isHigh ? 'bold' : 'normal' } },
        `¥${row.salary.toLocaleString()}`,
      )
    },
  },
  {
    key: 'status',
    title: '状态',
    align: 'center',
    width: 5,
    /** 渲染彩色状态徽标 */
    render: (row) => {
      const s = statusMap[row.status]
      return h(
        'span',
        {
          style: {
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '12px',
            backgroundColor: s.color + '22',
            color: s.color,
            border: `1px solid ${s.color}66`,
          },
        },
        s.label,
      )
    },
  },
]

const rows: Employee[] = [
  { id: 1, name: '张伟', dept: '研发部', salary: 18000, status: 'active' },
  { id: 2, name: '李娜', dept: '产品部', salary: 22000, status: 'active' },
  { id: 3, name: '王芳', dept: '设计部', salary: 14000, status: 'probation' },
  { id: 4, name: '赵敏', dept: '运营部', salary: 16000, status: 'leave' },
  { id: 5, name: '陈静', dept: '研发部', salary: 20000, status: 'active' },
  { id: 6, name: '刘洋', dept: '设计部', salary: 13000, status: 'probation' },
  { id: 7, name: '杨光', dept: '产品部', salary: 19000, status: 'active' },
]
</script>

<template>
  <!-- columns.render 可返回 VNode，支持嵌套样式、交互元素等复杂渲染 -->
  <ZDataTable
    :rows="rows"
    :columns="columns"
    :height="18"
    bordered
    stripe
  />
</template>
