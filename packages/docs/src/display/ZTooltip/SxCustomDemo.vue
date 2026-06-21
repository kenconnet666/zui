<script setup lang="ts">
import { ZTooltip, ZButton, ZSpace } from '@kenconnet666/zui-vue'
</script>

<template>
  <!-- 演示 sxTrigger / sxContent / css / maxWidth 定制 -->
  <ZSpace :direction="d => d.column" :size="g => g._middle">
    <!-- sxContent.css 定制弹层背景 -->
    <ZTooltip
      content="绿色弹层（sxContent 定制背景）"
      :sxContent="{
        css: s => {
          s.backgroundColor._success
          s.color._bg
        },
      }"
    >
      <ZButton variant="outlined">悬停 → 绿色 tooltip（sxContent）</ZButton>
    </ZTooltip>

    <!-- sxTrigger.css 定制触发器包裹层 -->
    <ZTooltip
      content="触发器包裹层背景高亮"
      :sxTrigger="{
        css: s => {
          s.borderRadius._small
          s.backgroundColor._primary.alpha(8)
          s.padding._tiny
        },
      }"
    >
      <ZButton>sxTrigger 定制包裹层</ZButton>
    </ZTooltip>

    <!-- maxWidth + css 兜底：窄 tooltip 折行 -->
    <ZTooltip
      content="这是一段非常长的提示文字，通过 maxWidth 控制最大宽度，超出后自动换行显示。"
      :maxWidth="10"
      :css="s => { s.letterSpacing.px(0.5) }"
    >
      <ZButton variant="secondary">maxWidth=10（160px）—— 窄 tooltip 折行</ZButton>
    </ZTooltip>
  </ZSpace>
</template>
