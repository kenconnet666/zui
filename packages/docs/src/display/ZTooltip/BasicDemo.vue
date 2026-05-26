<script setup lang="ts">
import { ZTooltip, ZButton, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._large" :wrap="w => w.wrap" :align="a => a.center">
    <ZTooltip content="这是一个 Tooltip 提示">
      <ZButton :size="0.875">悬停提示（top）</ZButton>
    </ZTooltip>

    <ZTooltip content="底部提示" placement="bottom">
      <ZButton :size="0.875" variant="ghost">bottom</ZButton>
    </ZTooltip>

    <ZTooltip content="右侧提示" placement="right">
      <ZButton :size="0.875" variant="ghost">right</ZButton>
    </ZTooltip>

    <ZTooltip placement="top" trigger="click">
      <template #content>
        <span>点击触发 Tooltip<br />支持多行内容</span>
      </template>
      <ZButton :size="0.875" variant="ghost">点击触发</ZButton>
    </ZTooltip>

    <ZTooltip content="该按钮已禁用" :disabled="true">
      <ZButton :size="0.875" :disabled="true">禁用状态</ZButton>
    </ZTooltip>
  </ZFlex>
</template>
