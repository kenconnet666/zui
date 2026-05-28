<script setup lang="ts">
import { ref } from 'vue'
import { ZSelect } from '@kenconnet666/zui-vue'

const value = ref<string | null>(null)

const options = Array.from({ length: 12 }, (_, i) => ({
  value: `item-${i}`,
  label: `选项 ${i + 1}`,
}))
</script>

<template>
  <ZSelect
    v-model:value="value"
    :options="options"
    :filterable="true"
    :clearable="true"
    placeholder="输入关键词过滤"
  />
</template>
