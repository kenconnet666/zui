<script setup lang="ts">
import { ZTabs, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

// 演示 sxList / sxTab / sxPanel 定制
const activeTab = ref('tab1')

const tabs = [
  { name: 'tab1', label: '概览' },
  { name: 'tab2', label: '详情' },
  { name: 'tab3', label: '日志' },
]
</script>

<template>
  <!-- sxList 背景色 + sxTab 自定义 + sxPanel 无 padding -->
  <ZTabs
    v-model:value="activeTab"
    :tabs="tabs"
    type="segment"
    :sx-list="{
      css: s => {
        s.padding._small
        s.backgroundColor._primary.alpha(8)
        s.borderRadius._middle
      },
    }"
    :sx-tab="{
      css: s => {
        s.borderRadius._small
        s.fontWeight._medium
      },
    }"
    :sx-panel="{
      css: s => {
        s.padding._large
        s.backgroundColor._bgMuted
        s.borderRadius._small
        s.marginTop._small
      },
    }"
  >
    <template #default="{ activeName }">
      <ZText>当前面板：{{ activeName }}</ZText>
    </template>
  </ZTabs>
</template>
