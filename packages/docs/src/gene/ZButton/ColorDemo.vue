<script setup lang="ts">
import { ZButton, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g.px(12)">
    <ZFlex :gap="g => g.px(8)" :wrap="w => w.wrap">
      <ZButton :color="c => c._primary">Primary</ZButton>
      <ZButton :color="c => c._success">Success</ZButton>
      <ZButton :color="c => c._warning">Warning</ZButton>
      <ZButton :color="c => c._danger">Danger</ZButton>
      <ZButton :color="c => c._info">Info</ZButton>
    </ZFlex>
    <ZFlex :gap="g => g.px(8)" :wrap="w => w.wrap">
      <ZButton variant="outlined" :color="c => c._primary">Primary</ZButton>
      <ZButton variant="outlined" :color="c => c._success">Success</ZButton>
      <ZButton variant="outlined" :color="c => c._danger">Danger</ZButton>
      <ZButton variant="ghost" :color="c => c._primary">Text Primary</ZButton>
      <ZButton variant="link" :color="c => c._danger">Link Danger</ZButton>
    </ZFlex>
    <ZFlex :gap="g => g.px(8)" :wrap="w => w.wrap">
      <ZButton :color="c => c('#7c3aed')">字面量紫</ZButton>
      <ZButton :color="c => c._primary.darken(15)">primary.darken(15)</ZButton>
      <ZButton variant="ghost" :color="c => c._brandRoyal">brand royal</ZButton>
    </ZFlex>
  </ZFlex>
</template>
