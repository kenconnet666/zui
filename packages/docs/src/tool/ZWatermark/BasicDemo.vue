<script setup lang="ts">
import { ZWatermark, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>基础水印：</ZText>
      <ZWatermark
        content="ZUI 内部文档"
        :css="
          s => {
            s.height.iem(10)
            s.borderWidth.px(1)
            s.borderStyle.solid
            s.borderColor._border
            s.borderRadius._small
          }
        "
      >
        <ZFlex
          :css="
            s => {
              s.padding.iem(1)
              s.height.pct(100)
            }
          "
        >
          <ZText>正文内容区域，背景覆盖半透明水印。</ZText>
        </ZFlex>
      </ZWatermark>
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>自定义字号 / 颜色 / 旋转：</ZText>
      <ZWatermark
        content="CONFIDENTIAL"
        :fontSize="18"
        color="rgba(255, 0, 0, 0.08)"
        :rotate="-30"
        :gap="80"
        :css="
          s => {
            s.height.iem(10)
            s.borderWidth.px(1)
            s.borderStyle.solid
            s.borderColor._border
            s.borderRadius._small
          }
        "
      >
        <ZFlex
          :css="
            s => {
              s.padding.iem(1)
              s.height.pct(100)
            }
          "
        >
          <ZText>红色水印，旋转 -30°，间距 80px。</ZText>
        </ZFlex>
      </ZWatermark>
    </ZFlex>
  </ZFlex>
</template>
