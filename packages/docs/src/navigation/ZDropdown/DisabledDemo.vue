<script setup lang="ts">
import { ZDropdown, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

// 演示 disabled 整体禁用 + select 事件
const lastSelected = ref('')

const items = [
  { key: 'edit', label: '编辑' },
  { key: 'copy', label: '复制' },
  { key: 'delete', label: '删除', danger: true },
]
</script>

<template>
  <ZFlex :gap="g => g._large" :align="a => a.center" :wrap="w => w.wrap">
    <!-- 正常状态，展示 select 事件 -->
    <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._small">
      <ZDropdown :items="items" @select="lastSelected = $event">
        <ZButton :size="0.875">正常菜单</ZButton>
      </ZDropdown>
      <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">
        已选：{{ lastSelected || '—' }}
      </ZText>
    </ZFlex>

    <!-- disabled 整体禁用，点击不展开 -->
    <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._small">
      <ZDropdown :items="items" :disabled="true">
        <ZButton :size="0.875" :disabled="true">禁用菜单</ZButton>
      </ZDropdown>
      <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">
        整体禁用，不可展开
      </ZText>
    </ZFlex>
  </ZFlex>
</template>
