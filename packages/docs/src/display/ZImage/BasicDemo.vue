<script setup lang="ts">
import { ZImage, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._large" :wrap="w => w.wrap" :align="a => a.flexStart">
    <ZFlex :direction="d => d.column" :gap="g => g._tiny" :align="a => a.center">
      <ZImage
        src="https://picsum.photos/seed/zui1/160/120"
        alt="示例图片"
        :width="w => w.px(160)"
        :height="h => h.px(120)"
      />
      <ZText>默认（cover）</ZText>
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._tiny" :align="a => a.center">
      <ZImage
        src="https://picsum.photos/seed/zui2/160/120"
        alt="contain 模式"
        :width="w => w.px(160)"
        :height="h => h.px(120)"
        :fit="f => f.contain"
      />
      <ZText>contain</ZText>
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._tiny" :align="a => a.center">
      <ZImage
        src="/invalid-image.png"
        alt="加载失败"
        :width="w => w.px(160)"
        :height="h => h.px(120)"
        fallback="https://picsum.photos/seed/fallback/160/120"
      />
      <ZText>fallback 图片</ZText>
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._tiny" :align="a => a.center">
      <ZImage
        src="/also-invalid.png"
        alt="错误状态"
        :width="w => w.px(160)"
        :height="h => h.px(120)"
      />
      <ZText>默认错误状态</ZText>
    </ZFlex>
  </ZFlex>
</template>
