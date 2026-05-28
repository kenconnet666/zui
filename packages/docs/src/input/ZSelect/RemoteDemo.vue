<script setup lang="ts">
import { ref, watch } from 'vue'
import { ZSelect } from '@kenconnet666/zui-vue'

interface User {
  value: string
  label: string
}

const value = ref<string | null>(null)
const search = ref('')
const options = ref<User[]>([])

// 模拟远程:监听 filterable 输入(这里用 trigger 自身的 selectedLabel placeholder 伪模拟)
function mockFetch(q: string): User[] {
  const all = ['张三', '李四', '王五', '赵六', '孙七', '周八']
  return all.filter(n => n.includes(q)).map(n => ({ value: n, label: n }))
}

watch(
  search,
  q => {
    options.value = mockFetch(q)
  },
  { immediate: true },
)

// 用 sxTrigger 透传 input 事件不可取;这里直接用 filterable + onUpdate hack:
// 简单起见,先填入完整列表,filterable 自带前端过滤。
options.value = mockFetch('')
</script>

<template>
  <ZSelect
    v-model:value="value"
    :options="options"
    :filterable="true"
    :clearable="true"
    placeholder="搜索用户(前端过滤模拟远程)"
  />
</template>
