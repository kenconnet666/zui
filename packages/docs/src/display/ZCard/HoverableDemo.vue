<script setup lang="ts">
import { ZCard, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._large" :wrap="w => w.wrap">
    <ZCard
      title="默认 hoverable"
      :hoverable="true"
      :css="
        s => {
          s.width.iem(16)
        }
      "
    >
      <ZText>鼠标悬停加深阴影,常用于可点击的卡片。</ZText>
    </ZCard>

    <ZCard
      title="无边框 + hoverable"
      :bordered="false"
      :hoverable="true"
      :css="
        s => {
          s.width.iem(16)
        }
      "
    >
      <ZText>bordered=false 走 boxShadow,hover 阴影更深。</ZText>
    </ZCard>
  </ZFlex>
</template>
