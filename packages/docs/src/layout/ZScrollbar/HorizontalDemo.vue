<script setup lang="ts">
import { ZScrollbar, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small">
    <ZText>横向滚动:内容超出宽度,悬停显示自定义滚动条</ZText>
    <ZScrollbar
      :css="s => { s.borderRadius._small; s.borderWidth.px(1); s.borderStyle.solid; s.borderColor._border }"
    >
      <ZFlex
        :gap="g => g._small"
        :wrap="w => w.nowrap"
        :css="s => s.padding.iem(0.75)"
      >
        <ZText
          v-for="n in 20"
          :key="n"
          :css="s => { s.flexShrink(0); s.padding.iem(0.75); s.backgroundColor._bgMuted; s.borderRadius._small; s.whiteSpace.nowrap }"
        >
          列 {{ n }}
        </ZText>
      </ZFlex>
    </ZScrollbar>
  </ZFlex>
</template>
