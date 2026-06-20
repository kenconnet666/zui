<script setup lang="ts">
import { ZTree, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'
import type { ZTreeNode } from '@kenconnet666/zui-vue'

const treeData: ZTreeNode[] = [
  {
    key: 'fruits',
    label: '水果',
    children: [
      { key: 'apple', label: '苹果' },
      { key: 'banana', label: '香蕉' },
      { key: 'grape', label: '葡萄' },
    ],
  },
  {
    key: 'vegs',
    label: '蔬菜',
    children: [
      { key: 'tomato', label: '番茄' },
      { key: 'carrot', label: '胡萝卜' },
    ],
  },
]

const expandedKeys = ref<string[]>(['fruits', 'vegs'])
const selectedKey = ref<string | null>(null)
const lastSelectedLabel = ref<string>('')

function onSelect(key: string, node: ZTreeNode) {
  lastSelectedLabel.value = `key=${key}，label=${node.label}`
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small">
    <ZTree
      :data="treeData"
      v-model:expanded-keys="expandedKeys"
      v-model:selected-key="selectedKey"
      :height="10"
      @select="onSelect"
    />
    <ZText
      :css="s => { s.color._textSecondary; s.fontSize._small }"
    >
      {{ lastSelectedLabel ? `最近选中：${lastSelectedLabel}` : '点击叶子节点触发 select 事件' }}
    </ZText>
  </ZFlex>
</template>
