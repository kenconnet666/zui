<script setup lang="ts">
/**
 * ZSkeleton — 行数与动画控制演示。
 * 对比 :rows="5" 多行 和 :animated="false" 静态骨架。
 */
import { ZSkeleton, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g.px(24)">
    <ZFlex :direction="d => d.column" :gap="g => g.px(8)">
      <ZText
        :css="
          s => {
            s.color._textTertiary
            s.fontSize._small
          }
        "
      >
        5 行文本骨架（:rows="5"）
      </ZText>
      <ZSkeleton :rows="5" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g.px(8)">
      <ZText
        :css="
          s => {
            s.color._textTertiary
            s.fontSize._small
          }
        "
      >
        静态骨架，无动画（:animated="false"）
      </ZText>
      <ZSkeleton :rows="3" :animated="false" />
    </ZFlex>
  </ZFlex>
</template>
