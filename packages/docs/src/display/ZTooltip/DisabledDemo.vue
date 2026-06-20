<script setup lang="ts">
import { ZTooltip, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._large" :wrap="w => w.wrap" :align="a => a.center">
    <ZFlex :direction="d => d.column" :gap="g => g._small" :align="a => a.center">
      <ZTooltip content="这条 Tooltip 已被禁用，悬停不会出现" :disabled="true">
        <ZButton :size="0.875" variant="outlined">已禁用（不弹出）</ZButton>
      </ZTooltip>
      <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">disabled=true</ZText>
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small" :align="a => a.center">
      <ZTooltip content="宽度限制为 8 倍数（128px），内容超出自动折行" :max-width="8">
        <ZButton :size="0.875" variant="ghost">maxWidth=8（128px）</ZButton>
      </ZTooltip>
      <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">max-width=8</ZText>
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small" :align="a => a.center">
      <ZTooltip content="默认宽度 16 倍数（256px），正常悬停查看" :max-width="16">
        <ZButton :size="0.875">默认 maxWidth（256px）</ZButton>
      </ZTooltip>
      <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">max-width=16（默认）</ZText>
    </ZFlex>
  </ZFlex>
</template>
