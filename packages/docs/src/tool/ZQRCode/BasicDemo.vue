<script setup lang="ts">
import { ZQRCode, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._large" :wrap="w => w.wrap">
    <ZFlex :direction="d => d.column" :gap="g => g._small" :align="a => a.center">
      <ZQRCode value="https://github.com/kenconnet666/zui" />
      <ZText>默认（160px）</ZText>
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small" :align="a => a.center">
      <ZQRCode value="https://github.com/kenconnet666/zui" :pixelSize="100" />
      <ZText>pixelSize=100</ZText>
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small" :align="a => a.center">
      <ZQRCode value="https://github.com/kenconnet666/zui" color="#1677ff" bgColor="#e6f4ff" />
      <ZText>自定义颜色</ZText>
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small" :align="a => a.center">
      <ZQRCode value="Hello ZUI" :margin="0" />
      <ZText>无边距 (margin=0)</ZText>
    </ZFlex>
  </ZFlex>
</template>
