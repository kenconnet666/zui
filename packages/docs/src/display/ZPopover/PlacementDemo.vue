<script setup lang="ts">
import { ZPopover, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._large" :wrap="w => w.wrap" :align="a => a.center">
    <ZPopover placement="top" title="顶部弹出">
      <template #content>
        <ZText>placement="top"，从触发器上方弹出。</ZText>
      </template>
      <ZButton :size="0.875">top</ZButton>
    </ZPopover>

    <ZPopover placement="bottom" title="底部弹出">
      <template #content>
        <ZText>placement="bottom"，从触发器下方弹出（默认方向）。</ZText>
      </template>
      <ZButton :size="0.875" variant="outlined">bottom（默认）</ZButton>
    </ZPopover>

    <ZPopover placement="left" title="左侧弹出">
      <template #content>
        <ZText>placement="left"，从触发器左侧弹出。</ZText>
      </template>
      <ZButton :size="0.875" variant="ghost">left</ZButton>
    </ZPopover>

    <ZPopover placement="right" title="右侧弹出">
      <template #content>
        <ZText>placement="right"，从触发器右侧弹出。</ZText>
      </template>
      <ZButton :size="0.875" variant="ghost">right</ZButton>
    </ZPopover>

    <ZPopover placement="top-start" title="左上对齐">
      <template #content>
        <ZText>placement="top-start"，顶部左对齐。</ZText>
      </template>
      <ZButton :size="0.875" variant="outlined">top-start</ZButton>
    </ZPopover>

    <ZPopover placement="bottom-end" title="右下对齐">
      <template #content>
        <ZText>placement="bottom-end"，底部右对齐。</ZText>
      </template>
      <ZButton :size="0.875" variant="outlined">bottom-end</ZButton>
    </ZPopover>
  </ZFlex>
</template>
