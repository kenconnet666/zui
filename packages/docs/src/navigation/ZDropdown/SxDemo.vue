<script setup lang="ts">
import { ZDropdown, ZButton, ZFlex } from '@kenconnet666/zui-vue'

// 演示 sxMenu / sxItem / css 自定义样式
const items = [
  { key: 'star', label: '收藏' },
  { key: 'share', label: '分享' },
  { key: 'remove', label: '移除', danger: true },
]
</script>

<template>
  <ZFlex :gap="g => g._large" :align="a => a.center">
    <!-- sxMenu 自定义菜单容器 + sxItem 自定义选项行 -->
    <ZDropdown
      :items="items"
      :sx-menu="{
        css: s => {
          s.minWidth.px(160)
          s.borderRadius._middle
          s.boxShadow._large
        },
      }"
      :sx-item="{
        css: s => {
          s.padding._small
          s.borderRadius._small
          s.fontSize._small
        },
      }"
    >
      <ZButton :size="0.875" variant="outlined">sxMenu + sxItem</ZButton>
    </ZDropdown>

    <!-- css 兜底定制浮层整体 -->
    <ZDropdown
      :items="items"
      :css="s => {
        s.backgroundColor._primary
        s.color._bg
        s.borderColor._primary
        s.borderRadius._middle
      }"
    >
      <ZButton :size="0.875" variant="filled">css 主题色浮层</ZButton>
    </ZDropdown>
  </ZFlex>
</template>
