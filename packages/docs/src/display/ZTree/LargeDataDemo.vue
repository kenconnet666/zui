<script setup lang="ts">
import { ZTree } from '@kenconnet666/zui-vue'
import { ref } from 'vue'
import type { ZTreeNode } from '@kenconnet666/zui-vue'

/** 生成 ~300 个节点（10 个父 + 每个父 30 个子 = 310 个），演示虚拟滚动。 */
function generateLargeData(): ZTreeNode[] {
  return Array.from({ length: 10 }, (_, pi) => ({
    key: `group-${pi}`,
    label: `分组 ${pi + 1}`,
    children: Array.from({ length: 30 }, (__, ci) => ({
      key: `item-${pi}-${ci}`,
      label: `节点 ${pi + 1}-${ci + 1}`,
    })),
  }))
}

const treeData = generateLargeData()
const expandedKeys = ref<string[]>(['group-0'])
const selectedKey = ref<string | null>(null)
</script>

<template>
  <ZTree
    :data="treeData"
    v-model:expanded-keys="expandedKeys"
    v-model:selected-key="selectedKey"
    :height="20"
    :overscan="10"
  />
</template>
