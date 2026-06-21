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

const rows: Employee[] = [
  { id: 1, name: '张伟', dept: '研发部', city: '北京' },
  { id: 2, name: '李娜', dept: '产品部', city: '上海' },
  { id: 3, name: '王芳', dept: '设计部', city: '广州' },
  { id: 4, name: '赵敏', dept: '运营部', city: '深圳' },
  { id: 5, name: '陈静', dept: '研发部', city: '杭州' },
]

/** loading 状态由外部控制，例如接口请求中时设为 true */
const loading = ref(false)

function toggleLoading() {
  loading.value = true
  /** 模拟 1.5s 后请求完成 */
  setTimeout(() => {
    loading.value = false
  }, 1500)
}
</script>

<template>
  <div>
    <button
      style="margin-bottom: 12px; padding: 6px 16px; cursor: pointer;"
      @click="toggleLoading"
    >
      模拟加载
    </button>
    <ZDataTable
      :rows="rows"
      :columns="columns"
      :height="14"
      :loading="loading"
      bordered
    />
  </div>
</template>
