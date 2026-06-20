<script setup lang="ts">
import { ZTooltip, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._large" :wrap="w => w.wrap" :align="a => a.center">
    <ZFlex :direction="d => d.column" :gap="g => g._small" :align="a => a.center">
      <ZTooltip content="立即显示 / 隐藏（delay=0）" :delay="0">
        <ZButton :size="0.875">无延迟（delay=0）</ZButton>
      </ZTooltip>
      <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">悬停立刻出现</ZText>
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small" :align="a => a.center">
      <ZTooltip content="延迟 500ms 后显示 / 隐藏" :delay="500">
        <ZButton :size="0.875" variant="outlined">慢速延迟（delay=500）</ZButton>
      </ZTooltip>
      <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">悬停 500ms 才出现</ZText>
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small" :align="a => a.center">
      <ZTooltip content="默认 100ms 延迟" :delay="100">
        <ZButton :size="0.875" variant="ghost">默认延迟（delay=100）</ZButton>
      </ZTooltip>
      <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">默认值</ZText>
    </ZFlex>
  </ZFlex>
</template>
