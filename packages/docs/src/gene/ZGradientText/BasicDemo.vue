<script setup lang="ts">
import { ZGradientText, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex direction="column" :gap="(g) => g.iem(0.75)">
    <ZGradientText :css="(s) => s.fontSize.iem(2)">
      默认渐变（primary → info，135°）
    </ZGradientText>
    <ZGradientText
      gradient="linear-gradient(90deg, #f97316, #ec4899)"
      :css="(s) => s.fontSize.iem(2)"
    >
      自定义渐变 orange → pink
    </ZGradientText>
    <ZGradientText
      gradient="linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)"
      :css="(s) => { s.fontSize.iem(2); s.fontWeight._bold }"
    >
      三色渐变 green → blue → purple
    </ZGradientText>
    <ZGradientText
      gradient="linear-gradient(90deg, #f59e0b, #ef4444)"
      :css="(s) => s.fontSize.iem(1.5)"
      tag="h2"
    >
      tag=h2 语义标题 + 渐变
    </ZGradientText>
  </ZFlex>
</template>
