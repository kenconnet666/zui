<script setup lang="ts">
import { ZPopover, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._large" :wrap="w => w.wrap" :align="a => a.center">
    <ZPopover title="简单气泡">
      <template #content>
        <ZText>这里是气泡内容，可以放任意元素。</ZText>
      </template>
      <ZButton :size="0.875">点击气泡</ZButton>
    </ZPopover>

    <ZPopover placement="right" title="右侧气泡">
      <template #content>
        <ZFlex :direction="d => d.column" :gap="g => g._tiny">
          <ZText>第一行内容</ZText>
          <ZText>第二行内容</ZText>
        </ZFlex>
      </template>
      <ZButton :size="0.875" variant="ghost">right</ZButton>
    </ZPopover>

    <ZPopover title="悬停触发" trigger="hover">
      <template #content>
        <ZText>悬停 50ms 后显示。</ZText>
      </template>
      <ZButton :size="0.875" variant="ghost">hover 触发</ZButton>
    </ZPopover>
  </ZFlex>
</template>
