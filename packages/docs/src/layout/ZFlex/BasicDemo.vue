<script setup lang="ts">
import { ZFlex, ZTag, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small" :css="s => s.width.pct(100)">
    <!-- Row wrap -->
    <ZFlex :wrap="w => w.wrap" :gap="g => g._small">
      <ZTag v-for="n in 8" :key="n">Item {{ n }}</ZTag>
    </ZFlex>

    <!-- justify space-between + align center -->
    <ZFlex
      :justify="j => j.spaceBetween"
      :align="a => a.center"
      :css="s => { s.padding.iem(0.75); s.borderRadius._small; s.backgroundColor._bgMuted }"
    >
      <ZText>左侧内容</ZText>
      <ZFlex :gap="g => g._small">
        <ZTag>操作A</ZTag>
        <ZTag>操作B</ZTag>
      </ZFlex>
    </ZFlex>

    <!-- Column direction -->
    <ZFlex
      :direction="d => d.column"
      :gap="g => g._small"
      :css="s => { s.padding.iem(0.75); s.borderRadius._small; s.backgroundColor._bgMuted }"
    >
      <ZText>纵向排列 A</ZText>
      <ZText>纵向排列 B</ZText>
      <ZText>纵向排列 C</ZText>
    </ZFlex>

    <!-- inline-flex + gap -->
    <div>
      <ZFlex :inline="true" :gap="g => g._middle" :align="a => a.center">
        <ZTag>inline-flex</ZTag>
        <ZText>与文字混排</ZText>
        <ZTag>item</ZTag>
      </ZFlex>
      <ZText> ← 行内 flex，不撑满整行</ZText>
    </div>
  </ZFlex>
</template>
