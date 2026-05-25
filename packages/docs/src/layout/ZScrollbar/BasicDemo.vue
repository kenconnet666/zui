<script setup lang="ts">
import { ZScrollbar, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._base">
    <!-- maxHeight 模式 -->
    <ZText>maxHeight = 10（iem 倍数，超出滚动，悬停显示自定义滚动条）</ZText>
    <ZScrollbar
      :maxHeight="10"
      :css="s => { s.borderRadius._small; s.borderWidth.px(1); s.borderStyle.solid; s.borderColor._border }"
    >
      <ZFlex
        :direction="d => d.column"
        :gap="g => g._small"
        :css="s => s.padding.iem(0.75)"
      >
        <ZText v-for="n in 20" :key="n">第 {{ n }} 行内容 —— 超出容器后可滚动查看</ZText>
      </ZFlex>
    </ZScrollbar>

    <!-- 外部高度模式 -->
    <ZText>外部 :css 设定高度（height: 8iem）</ZText>
    <ZScrollbar
      :css="s => { s.height.iem(8); s.borderRadius._small; s.borderWidth.px(1); s.borderStyle.solid; s.borderColor._border }"
    >
      <ZFlex
        :direction="d => d.column"
        :gap="g => g._small"
        :css="s => s.padding.iem(0.75)"
      >
        <ZText v-for="n in 15" :key="n">条目 {{ n }}</ZText>
      </ZFlex>
    </ZScrollbar>
  </ZFlex>
</template>
