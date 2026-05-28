<script setup lang="ts">
import { ZProgress, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="(d) => d.column" :gap="(g) => g._small">
    <ZText>默认细线 (size=0.5)</ZText>
    <ZProgress :value="30" />

    <ZText>显示百分比文字</ZText>
    <ZProgress :value="65" :show-text="true" />

    <ZText>加粗 (size=1)</ZText>
    <ZProgress :value="80" :size="1" :show-text="true" />

    <ZText>超粗 (size=1.5)</ZText>
    <ZProgress :value="50" :size="1.5" :show-text="true" />
  </ZFlex>
</template>
