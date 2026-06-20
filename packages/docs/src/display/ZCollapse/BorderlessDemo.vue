<script setup lang="ts">
/**
 * ZCollapse — 无边框模式演示。
 * :bordered="false" 去掉外框和分割线，适合嵌入卡片等场景。
 */
import { ZCollapse, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const expanded = ref<string[]>(['q1'])

const items = [
  { key: 'q1', title: '常见问题 1 — 无边框折叠' },
  { key: 'q2', title: '常见问题 2 — 更多细节' },
  { key: 'q3', title: '常见问题 3 — 附加说明' },
]
</script>

<template>
  <ZCollapse v-model:value="expanded" :items="items" :bordered="false">
    <template #default="{ item }">
      <ZText
        :css="
          s => {
            s.padding._small
            s.color._textSecondary
          }
        "
      >
        {{ item.title }} 的详细解答内容，无边框样式让内容区域更简洁。
      </ZText>
    </template>
  </ZCollapse>
</template>
