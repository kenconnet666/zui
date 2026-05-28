<script setup lang="ts">
import { ZSpin, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <ZFlex :align="a => a.center" :gap="g => g._small">
      <ZSpin :size="1" />
      <ZText>纯 indicator,inline-flex,适合按钮 / 行内场景</ZText>
    </ZFlex>
    <ZFlex :align="a => a.center" :gap="g => g._small">
      <ZSpin :size="1" tip="加载中" />
    </ZFlex>
  </ZFlex>
</template>
