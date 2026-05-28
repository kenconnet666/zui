<script setup lang="ts">
import { ZGradientText, ZSpace } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g._middle">
    <ZGradientText
      gradient="linear-gradient(90deg, #1976d2, #9c27b0)"
      :css="
        s => {
          s.fontSize.iem(2)
          s.fontWeight._bold
        }
      "
    >
      蓝紫渐变标题
    </ZGradientText>

    <ZGradientText
      gradient="linear-gradient(90deg, #ff9800, #f44336, #e91e63)"
      :css="
        s => {
          s.fontSize.iem(2)
          s.fontWeight._bold
        }
      "
    >
      暖色三段渐变
    </ZGradientText>

    <ZGradientText
      gradient="linear-gradient(135deg, #00bcd4, #4caf50)"
      :css="
        s => {
          s.fontSize.iem(1.5)
          s.fontWeight._semibold
        }
      "
    >
      青绿斜向渐变
    </ZGradientText>
  </ZSpace>
</template>
