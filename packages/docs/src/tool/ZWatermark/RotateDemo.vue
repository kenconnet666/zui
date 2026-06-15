<script setup lang="ts">
import { ZWatermark, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZWatermark
    content="机密 · CONFIDENTIAL"
    :font-size="14"
    color="rgba(0,0,0,0.12)"
    :gap="40"
    :rotate="-30"
    :css="
      s => {
        s.height.px(224)
        s.borderRadius._small
        s.borderWidth.px(1)
        s.borderStyle.solid
        s.borderColor._border
        s.padding.px(16)
      }
    "
  >
    <ZText>受保护的内容区域,水印以 -30° 旋转平铺覆盖整个容器。</ZText>
    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.marginTop.px(8)
        }
      "
    >
      调整 gap 控制水印密度,rotate 控制角度,color 控制透明度。
    </ZText>
  </ZWatermark>
</template>
