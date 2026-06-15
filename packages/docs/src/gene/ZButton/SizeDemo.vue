<script setup lang="ts">
import { ZButton, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g.px(12)" :wrap="w => w.wrap" :align="a => a.center">
    <ZButton :size="0.75">极小 0.75</ZButton>
    <ZButton :size="0.875">小 0.875</ZButton>
    <ZButton>默认 1</ZButton>
    <ZButton :size="1.25">大 1.25</ZButton>
    <ZButton :size="1.5">特大 1.5</ZButton>
    <ZButton :size="2">巨大 2</ZButton>
  </ZFlex>
</template>
