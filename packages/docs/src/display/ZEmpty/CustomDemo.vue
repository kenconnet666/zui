<script setup lang="ts">
import { ZEmpty, ZButton, ZSpace } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZEmpty :size="6" description="">
    <template #image>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        width="100%"
        height="100%"
      >
        <circle cx="28" cy="28" r="16" />
        <path d="M40 40 L54 54" />
      </svg>
    </template>

    <template #description>
      <span>未找到匹配的搜索结果</span><br />
      <span style="font-size: 0.85em; opacity: 0.7">试试调整关键词或筛选条件</span>
    </template>

    <ZSpace :size="(g) => g._small">
      <ZButton variant="ghost" :size="0.875">重置筛选</ZButton>
      <ZButton :size="0.875">重新搜索</ZButton>
    </ZSpace>
  </ZEmpty>
</template>
