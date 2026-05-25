<script setup lang="ts">
import { ZLink, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="(g) => g.iem(1)" :wrap="(w) => w.wrap" :align="(a) => a.baseline">
    <ZLink href="https://github.com" target="_blank">外部链接（_blank 自动补 rel）</ZLink>
    <ZLink href="#" :underline="true">始终下划线</ZLink>
    <ZLink href="#" :underlineOnHover="false">无下划线</ZLink>
    <ZLink href="#" :color="(c) => c._success">success 色链接</ZLink>
    <ZLink href="#" :color="(c) => c._danger">danger 色链接</ZLink>
    <ZLink href="#" :disabled="true">禁用链接（不可点击）</ZLink>
  </ZFlex>
</template>
