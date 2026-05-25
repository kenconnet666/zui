<script setup lang="ts">
import { ZButton, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="(g) => g.iem(0.75)" :wrap="(w) => w.wrap" :align="(a) => a.center">
    <ZButton variant="filled">Filled</ZButton>
    <ZButton variant="outlined">Outlined</ZButton>
    <ZButton variant="text">Text</ZButton>
    <ZButton variant="ghost">Ghost</ZButton>
    <ZButton variant="link">Link</ZButton>
  </ZFlex>
</template>
