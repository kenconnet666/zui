<script setup lang="ts">
import { ZMenu, ZFlex } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const selected = ref('home')

const verticalItems = [
  { key: 'home', label: '首页' },
  {
    key: 'product',
    label: '产品',
    children: [
      { key: 'product-a', label: '产品 A' },
      { key: 'product-b', label: '产品 B' },
    ],
  },
  { key: 'about', label: '关于我们' },
  { key: 'disabled', label: '已禁用', disabled: true },
]

const horizontalItems = [
  { key: 'h-home', label: '首页' },
  { key: 'h-docs', label: '文档' },
  { key: 'h-blog', label: '博客' },
  { key: 'h-about', label: '关于' },
]
</script>

<template>
  <ZFlex :gap="g => g._large" :align="a => a.flexStart">
    <ZFlex
      :direction="d => d.column"
      :gap="g => g._small"
      :css="
        s => {
          s.width.px(192)
        }
      "
    >
      <ZMenu v-model:value="selected" :items="verticalItems" :inline="true" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZMenu v-model:value="selected" :items="horizontalItems" :vertical="false" />
    </ZFlex>
  </ZFlex>
</template>
