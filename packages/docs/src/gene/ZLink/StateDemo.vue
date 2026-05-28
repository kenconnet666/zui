<script setup lang="ts">
import { ZLink, ZSpace } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZSpace :size="g => g._large" :align="a => a.center" :wrap="w => w.wrap">
    <ZLink href="#/gene/link">默认(hover 下划线)</ZLink>
    <ZLink href="#/gene/link" :underline="true">始终下划线</ZLink>
    <ZLink href="#/gene/link" :underline-on-hover="false">无下划线</ZLink>
    <ZLink href="https://github.com" target="_blank">外链 _blank(自动补 rel)</ZLink>
    <ZLink href="#/gene/link" :color="c => c._danger">危险色链接</ZLink>
    <ZLink href="#/gene/link" :disabled="true">禁用链接</ZLink>
  </ZSpace>
</template>
