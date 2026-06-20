<script setup lang="ts">
/**
 * ZSkeleton — 组合形态演示。
 * 4 种配置并排：纯文本行 / 加标题 / 加头像 / 头像+标题。
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
        纯 3 行文本
      </ZText>
      <ZSkeleton :rows="3" />
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
        带标题条（:title="true"）
      </ZText>
      <ZSkeleton :title="true" :rows="3" />
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
        带头像圆（:avatar="true"）
      </ZText>
      <ZSkeleton :avatar="true" :rows="3" />
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
        头像 + 标题（:avatar="true" :title="true"）
      </ZText>
      <ZSkeleton :avatar="true" :title="true" :rows="3" />
    </ZFlex>
  </ZFlex>
</template>
