<script setup lang="ts">
import { ZQRCode, ZSpace, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZSpace :size="g => g._large" :align="a => a.flexStart" :wrap="w => w.wrap">
    <ZSpace :direction="d => d.column" :size="g => g._small" :align="a => a.center">
      <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">大尺寸</ZText>
      <ZQRCode value="https://github.com/kenconnet666/zui" :pixel-size="160" />
    </ZSpace>

    <ZSpace :direction="d => d.column" :size="g => g._small" :align="a => a.center">
      <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">自定义前景/背景色</ZText>
      <ZQRCode
        value="https://github.com/kenconnet666/zui"
        :pixel-size="120"
        color="#1976d2"
        bg-color="#e3f2fd"
        :margin="2"
      />
    </ZSpace>
  </ZSpace>
</template>
