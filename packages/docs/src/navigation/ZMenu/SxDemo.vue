<script setup lang="ts">
import { ZMenu, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

// 演示 sxItem / sxSubmenu / sxLabel 定制
const selected = ref('product-a')

const items = [
  { key: 'home', label: '首页' },
  {
    key: 'product',
    label: '产品',
    children: [
      { key: 'product-a', label: '产品 A' },
      { key: 'product-b', label: '产品 B' },
    ],
  },
  { key: 'about', label: '关于' },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small" :css="s => { s.width.px(220) }">
    <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">
      sxItem 圆角 0 + sxLabel 加粗 + sxSubmenu 左边框
    </ZText>
    <ZMenu
      v-model:value="selected"
      :items="items"
      :inline="true"
      :sx-item="{
        css: s => {
          s.borderRadius.px(0)
        },
      }"
      :sx-label="{
        css: s => {
          s.fontWeight._medium
        },
      }"
      :sx-submenu="{
        css: s => {
          s.borderLeftWidth._thick
          s.borderLeftStyle.solid
          s.borderLeftColor._primary
          s.paddingLeft._small
        },
      }"
    />
  </ZFlex>
</template>
