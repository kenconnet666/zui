<script setup lang="ts">
import { ZCopyButton, ZSpace } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZSpace :size="g => g._large" :align="a => a.center">
    <ZCopyButton text="纯图标复制" />
    <ZCopyButton text="带文字的内容" label="复制" copied-label="已复制!" />
    <ZCopyButton text="大号按钮" label="复制链接" :size="1.25" />
    <ZCopyButton text="不弹 toast" label="静默复制" :toast="false" />
  </ZSpace>
</template>
