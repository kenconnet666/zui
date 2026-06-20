<script setup lang="ts">
import { ZTree, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/** selectable=false：节点仍可展开/折叠，但点击不会触发选中高亮。 */
const treeData = [
  {
    key: 'docs',
    label: '文档',
    children: [
      { key: 'guide', label: '快速上手' },
      { key: 'install', label: '安装指南' },
    ],
  },
  {
    key: 'api',
    label: 'API 参考',
    children: [
      { key: 'components', label: '组件' },
      { key: 'hooks', label: 'Composables' },
    ],
  },
  { key: 'changelog', label: '更新日志' },
]

const expandedKeys = ref<string[]>(['docs', 'api'])
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small">
    <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">
      selectable=false：点击节点只展开/折叠，不会选中高亮
    </ZText>
    <ZTree
      :data="treeData"
      v-model:expanded-keys="expandedKeys"
      :selectable="false"
      :height="12"
    />
  </ZFlex>
</template>
