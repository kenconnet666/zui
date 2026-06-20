<script setup lang="ts">
import { ZDescriptions, ZFlex, ZText } from '@kenconnet666/zui-vue'

const items = [
  { label: '项目名称', value: 'ZUI 组件库' },
  { label: '版本', value: '0.5.0' },
  { label: '协议', value: 'MIT' },
  { label: '作者', value: 'kenconnet666' },
  { label: '状态', value: '开发中' },
  { label: '语言', value: 'TypeScript' },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">紧凑（size=0.875）</ZText>
    <ZDescriptions :items="items" :bordered="true" :size="0.875" />

    <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">默认（size=1）</ZText>
    <ZDescriptions :items="items" :bordered="true" />

    <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">宽松（size=1.25）</ZText>
    <ZDescriptions :items="items" :bordered="true" :size="1.25" />
  </ZFlex>
</template>
