<script setup lang="ts">
import { ZTree, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const treeData = [
  {
    key: 'frontend',
    label: '前端',
    children: [
      { key: 'vue',     label: 'Vue 3' },
      { key: 'react',   label: 'React' },
      { key: 'svelte',  label: 'Svelte', disabled: true },
    ],
  },
  {
    key: 'backend',
    label: '后端',
    children: [
      { key: 'java',   label: 'Java' },
      { key: 'golang', label: 'Go' },
      {
        key: 'node',
        label: 'Node.js',
        children: [
          { key: 'express', label: 'Express' },
          { key: 'nest',    label: 'NestJS' },
        ],
      },
    ],
  },
  { key: 'devops', label: 'DevOps' },
]

const expandedKeys = ref<string[]>(['frontend', 'backend'])
const selectedKey = ref<string | null>(null)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small">
    <ZTree
      :data="treeData"
      v-model:expanded-keys="expandedKeys"
      v-model:selected-key="selectedKey"
      :height="16"
    />
    <ZText v-if="selectedKey" :css="s => { s.color._textSecondary; s.fontSize._small }">
      已选：{{ selectedKey }}
    </ZText>
  </ZFlex>
</template>
