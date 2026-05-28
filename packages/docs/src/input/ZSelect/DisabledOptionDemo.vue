<script setup lang="ts">
import { ref } from 'vue'
import { ZSelect } from '@kenconnet666/zui-vue'

const value = ref<string | null>('beijing')

const options = [
  { value: 'beijing',   label: '北京' },
  { value: 'shanghai',  label: '上海' },
  { value: 'guangzhou', label: '广州', disabled: true },
  { value: 'shenzhen',  label: '深圳', disabled: true },
  { value: 'hangzhou',  label: '杭州' },
]
</script>

<template>
  <ZSelect v-model:value="value" :options="options" placeholder="部分禁用" />
</template>
