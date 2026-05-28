<script setup lang="ts">
import { ZSpin, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :align="a => a.center" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._small">
      <ZSpin :size="0.875" />
      <ZText>size=0.875</ZText>
    </ZFlex>
    <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._small">
      <ZSpin :size="1.5" />
      <ZText>默认 size=1.5</ZText>
    </ZFlex>
    <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._small">
      <ZSpin :size="3" />
      <ZText>size=3</ZText>
    </ZFlex>
  </ZFlex>
</template>
