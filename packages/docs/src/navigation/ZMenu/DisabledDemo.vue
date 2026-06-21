<script setup lang="ts">
import { ZMenu, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

// 演示 disabled 整体禁用 + 单项 disabled
const selected = ref('home')
const lastEvent = ref('')

const items = [
  { key: 'home', label: '首页' },
  { key: 'docs', label: '文档' },
  { key: 'blog', label: '博客', disabled: true },
  { key: 'about', label: '关于我们' },
]
</script>

<template>
  <ZFlex :gap="g => g._large" :align="a => a.flexStart">
    <!-- 单项 disabled（item.disabled=true） -->
    <ZFlex
      :direction="d => d.column"
      :gap="g => g._small"
      :css="s => { s.width.px(180) }"
    >
      <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">单项禁用</ZText>
      <ZMenu
        v-model:value="selected"
        :items="items"
        :vertical="true"
        @select="lastEvent = $event"
      />
    </ZFlex>

    <!-- disabled 整体禁用 -->
    <ZFlex
      :direction="d => d.column"
      :gap="g => g._small"
      :css="s => { s.width.px(180) }"
    >
      <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">整体禁用</ZText>
      <ZMenu
        v-model:value="selected"
        :items="items"
        :vertical="true"
        :disabled="true"
      />
    </ZFlex>
  </ZFlex>

  <ZText :css="s => { s.fontSize._small; s.color._textSecondary; s.marginTop._small }">
    select 事件：{{ lastEvent || '—' }}
  </ZText>
</template>
