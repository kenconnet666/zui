<script setup lang="ts">
import { h } from 'vue'
import { ZTable } from '@kenconnet666/zui-vue'
import type { ZTableColumn } from '@kenconnet666/zui-vue'

/** 用户数据行类型 */
interface UserRow extends Record<string, unknown> {
  id: number
  name: string
  role: string
  /** 账户状态：1 正常，0 禁用 */
  active: number
}

type UserColumn = ZTableColumn<UserRow>

/** 状态徽章颜色映射 */
const STATUS_COLOR: Record<number, string> = {
  1: '#22c55e',
  0: '#ef4444',
}
const STATUS_LABEL: Record<number, string> = {
  1: '正常',
  0: '禁用',
}

const columns: UserColumn[] = [
  { key: 'name', title: '姓名', dataIndex: 'name' },
  { key: 'role', title: '角色', dataIndex: 'role' },
  {
    key: 'active',
    title: '状态',
    dataIndex: 'active',
    align: 'center',
    /**
     * render(row, col, idx) 返回 VNodeChild，
     * 可以用 h() 渲染任意标签或组件。
     */
    render: (row: UserRow) =>
      h(
        'span',
        {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: '12px',
            background: STATUS_COLOR[row.active] + '1a',
            color: STATUS_COLOR[row.active],
          },
        },
        [
          h('span', {
            style: {
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: STATUS_COLOR[row.active],
              flexShrink: '0',
            },
          }),
          STATUS_LABEL[row.active] ?? '未知',
        ],
      ),
  },
]

const data: UserRow[] = [
  { id: 1, name: '张三', role: '管理员', active: 1 },
  { id: 2, name: '李四', role: '编辑', active: 1 },
  { id: 3, name: '王五', role: '访客', active: 0 },
  { id: 4, name: '赵六', role: '编辑', active: 1 },
  { id: 5, name: '孙七', role: '访客', active: 0 },
]
</script>

<template>
  <!-- 状态列通过 column.render 渲染彩色徽章，其余列走默认文本渲染 -->
  <ZTable :columns="columns" :data="data" row-key="id" :bordered="true" />
</template>
