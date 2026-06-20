<script setup lang="ts">
import { ZTitle, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g.px(12)">
    <!-- weight 覆盖 level 默认字重 -->
    <ZTitle :level="3" :weight="w => w._thin">weight thin —— h3 本默认 semibold，覆盖为 thin</ZTitle>
    <ZTitle :level="3" :weight="w => w._black">weight black —— 超粗标题</ZTitle>

    <!-- italic -->
    <ZTitle :level="4" italic>italic 斜体标题，level 4</ZTitle>

    <!-- underline -->
    <ZTitle :level="4" :underline="true">underline 下划线标题，level 4</ZTitle>

    <!-- ellipsis 单行截断 -->
    <ZTitle
      :level="5"
      :ellipsis="true"
      :css="s => s.width.px(240)"
    >
      ellipsis 单行截断：这段标题文字足够长以触发省略号效果
    </ZTitle>
  </ZFlex>
</template>
