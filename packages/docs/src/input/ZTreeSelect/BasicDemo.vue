<script setup lang="ts">
import { ZTreeSelect, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const value = ref<string | null>(null)

const treeData = [
  {
    key: 'frontend',
    label: '前端',
    children: [
      { key: 'vue', label: 'Vue 3' },
      { key: 'react', label: 'React' },
      { key: 'svelte', label: 'Svelte' },
    ],
  },
  {
    key: 'backend',
    label: '后端',
    children: [
      { key: 'java', label: 'Java' },
      { key: 'golang', label: 'Go' },
      { key: 'node', label: 'Node.js', disabled: true },
    ],
  },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZTreeSelect
        v-model:value="value"
        :data="treeData"
        placeholder="请选择技术栈"
        :clearable="true"
      />
      <ZText
        v-if="value"
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
        >已选：{{ value }}</ZText
      >
    </ZFlex>

    <ZTreeSelect :data="treeData" placeholder="已禁用" :disabled="true" />
  </ZFlex>
</template>
