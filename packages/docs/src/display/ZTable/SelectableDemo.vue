<script setup lang="ts">
import { ref } from 'vue'
import { ZTable } from '@kenconnet666/zui-vue'

/** 项目数据行类型 */
interface ProjectRow extends Record<string, unknown> {
  id: number
  name: string
  status: string
  owner: string
}

const columns = [
  { key: 'name', title: '项目名', dataIndex: 'name' },
  { key: 'status', title: '状态', dataIndex: 'status', align: 'center' as const },
  { key: 'owner', title: '负责人', dataIndex: 'owner' },
]

const data: ProjectRow[] = [
  { id: 1, name: 'ZUI 组件库', status: '进行中', owner: '张三' },
  { id: 2, name: '设计规范文档', status: '已完成', owner: '李四' },
  { id: 3, name: '性能优化', status: '待启动', owner: '王五' },
  { id: 4, name: '国际化支持', status: '进行中', owner: '赵六' },
]

/**
 * 选中行的 key 集合，与 v-model:selectedKeys 双向绑定。
 * rowKey 默认读 row.id，所以 selectedKeys 存数字 id。
 */
const selectedKeys = ref<(string | number)[]>([])
</script>

<template>
  <!--
    selectable=true 在首列插入 checkbox；
    表头全选/取消全选，行选后高亮背景。
  -->
  <ZTable
    :columns="columns"
    :data="data"
    row-key="id"
    :bordered="true"
    :selectable="true"
    v-model:selected-keys="selectedKeys"
  />
  <p style="margin-top: 8px; font-size: 13px; color: #888">
    已选 ID：{{ selectedKeys.length ? selectedKeys.join(', ') : '（无）' }}
  </p>
</template>
