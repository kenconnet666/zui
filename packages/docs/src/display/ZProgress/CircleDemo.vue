<script setup lang="ts">
import { ZProgress, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._large" :align="a => a.center" :wrap="w => w.wrap">
    <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._tiny">
      <ZProgress type="circle" :value="25" :show-text="true" :size="5" />
      <ZText>小 size=5</ZText>
    </ZFlex>
    <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._tiny">
      <ZProgress type="circle" :value="60" :show-text="true" />
      <ZText>默认 size=7.5</ZText>
    </ZFlex>
    <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._tiny">
      <ZProgress type="circle" :value="100" :show-text="true" :size="10" :color="c => c._success" />
      <ZText>大 size=10 完成</ZText>
    </ZFlex>
  </ZFlex>
</template>
