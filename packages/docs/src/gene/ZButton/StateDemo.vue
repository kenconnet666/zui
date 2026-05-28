<script setup lang="ts">
import { ZButton, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g.iem(0.75)">
    <ZFlex :gap="g => g.iem(0.5)" :wrap="w => w.wrap">
      <ZButton disabled>Disabled</ZButton>
      <ZButton variant="outlined" disabled>Disabled</ZButton>
      <ZButton variant="text" disabled>Disabled</ZButton>
    </ZFlex>
    <ZFlex :gap="g => g.iem(0.5)" :wrap="w => w.wrap">
      <ZButton loading>Loading</ZButton>
      <ZButton variant="outlined" loading>Loading</ZButton>
      <ZButton :color="c => c._danger" loading>Saving...</ZButton>
    </ZFlex>
    <ZButton block>Block(满宽)</ZButton>
  </ZFlex>
</template>
