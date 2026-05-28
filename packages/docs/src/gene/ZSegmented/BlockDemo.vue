<script setup lang="ts">
import { ref } from 'vue'
import { ZSegmented, ZSpace, ZText } from '@kenconnet666/zui-vue'

const v1 = ref('list')
const v2 = ref('day')
const v3 = ref('a')

const viewOptions = [
  { label: '列表', value: 'list' },
  { label: '看板', value: 'kanban' },
  { label: '日历', value: 'calendar' },
]
const rangeOptions = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
]
const sizeOptions = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
  { label: 'C', value: 'c' },
]
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g._middle" :css="s => s.width.pct(100)">
    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >block 撑满父宽</ZText
    >
    <ZSegmented v-model:value="v1" :options="viewOptions" :block="true" />

    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >size = 1.125(大号)</ZText
    >
    <ZSegmented v-model:value="v2" :options="rangeOptions" :size="1.125" />

    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >disabled 整体禁用</ZText
    >
    <ZSegmented v-model:value="v3" :options="sizeOptions" :disabled="true" />
  </ZSpace>
</template>
