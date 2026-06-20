<script setup lang="ts">
import { ZPopconfirm, ZButton, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._large" :wrap="w => w.wrap" :align="a => a.center">
    <ZPopconfirm title="顶部确认框" placement="top" @confirm="() => {}" @cancel="() => {}">
      <ZButton :size="0.875">top（默认）</ZButton>
    </ZPopconfirm>

    <ZPopconfirm title="底部确认框" placement="bottom" @confirm="() => {}" @cancel="() => {}">
      <ZButton :size="0.875" variant="outlined">bottom</ZButton>
    </ZPopconfirm>

    <ZPopconfirm title="左侧确认框" placement="left" @confirm="() => {}" @cancel="() => {}">
      <ZButton :size="0.875" variant="ghost">left</ZButton>
    </ZPopconfirm>

    <ZPopconfirm title="右侧确认框" placement="right" @confirm="() => {}" @cancel="() => {}">
      <ZButton :size="0.875" variant="ghost">right</ZButton>
    </ZPopconfirm>

    <ZPopconfirm title="左上对齐" placement="top-start" @confirm="() => {}" @cancel="() => {}">
      <ZButton :size="0.875" variant="outlined">top-start</ZButton>
    </ZPopconfirm>

    <ZPopconfirm title="右下对齐" placement="bottom-end" @confirm="() => {}" @cancel="() => {}">
      <ZButton :size="0.875" variant="outlined">bottom-end</ZButton>
    </ZPopconfirm>
  </ZFlex>
</template>
