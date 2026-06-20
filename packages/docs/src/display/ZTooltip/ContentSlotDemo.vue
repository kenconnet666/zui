<script setup lang="ts">
import { ZTooltip, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._large" :wrap="w => w.wrap" :align="a => a.center">
    <ZTooltip placement="top">
      <template #content>
        <ZFlex :direction="d => d.column" :gap="g => g._tiny">
          <ZText :css="s => { s.fontWeight._semibold }">自定义标题</ZText>
          <ZText>这是第一行说明内容。</ZText>
          <ZText>这是第二行说明内容，支持换行。</ZText>
        </ZFlex>
      </template>
      <ZButton :size="0.875">富文本内容</ZButton>
    </ZTooltip>

    <ZTooltip placement="right">
      <template #content>
        <ZFlex :gap="g => g._tiny" :align="a => a.center">
          <span>🎉</span>
          <ZText>内容 slot 可放任意元素</ZText>
        </ZFlex>
      </template>
      <ZButton :size="0.875" variant="ghost">带 emoji</ZButton>
    </ZTooltip>

    <ZTooltip placement="bottom" :max-width="12">
      <template #content>
        <ZText>maxWidth=12（192px），长文本自动折行，word-break 生效。这是一段很长的说明文字用来测试折行效果。</ZText>
      </template>
      <ZButton :size="0.875" variant="outlined">窄宽度折行</ZButton>
    </ZTooltip>
  </ZFlex>
</template>
