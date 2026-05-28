<script setup lang="ts">
import { ZParagraph, ZSpace, ZText } from '@kenconnet666/zui-vue'

const text =
  'zui 的排版组件继承统一的 carrier factory:字号、字重、颜色、行高、字间距都用链式 API 调度主题 token,保持与 icss 一致的书写体验。'
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g._middle" :css="s => s.width.iem(26)">
    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >默认</ZText
    >
    <ZParagraph>{{ text }}</ZParagraph>

    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >size=1.125 + leading 放松 + 次要色</ZText
    >
    <ZParagraph :size="1.125" :leading="l => l._relaxed" :color="c => c._textSecondary">
      {{ text }}
    </ZParagraph>

    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >字间距加宽 + 斜体</ZText
    >
    <ZParagraph :tracking="t => t._wide" :italic="true">{{ text }}</ZParagraph>
  </ZSpace>
</template>
