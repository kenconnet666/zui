<script setup lang="ts">
import { ZDropdown, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const lastSelected = ref('')

const items = [
  { key: 'edit',   label: '编辑' },
  { key: 'copy',   label: '复制' },
  { key: 'delete', label: '删除', danger: true },
  { key: 'disabled-item', label: '禁用项', disabled: true },
]

const hoverItems = [
  { key: 'profile', label: '个人中心' },
  { key: 'settings', label: '设置' },
  { key: 'logout',  label: '退出登录', danger: true },
]
</script>

<template>
  <ZFlex :gap="g => g._large" :align="a => a.center" :wrap="w => w.wrap">
    <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._small">
      <ZDropdown :items="items" @select="lastSelected = $event">
        <ZButton :size="0.875">点击触发</ZButton>
      </ZDropdown>
      <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">
        已选：{{ lastSelected || '—' }}
      </ZText>
    </ZFlex>

    <ZDropdown :items="hoverItems" trigger="hover">
      <ZButton :size="0.875" :variant="v => v._ghost">悬停触发</ZButton>
    </ZDropdown>
  </ZFlex>
</template>
