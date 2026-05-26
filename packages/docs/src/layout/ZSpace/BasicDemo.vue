<script setup lang="ts">
import { ZSpace, ZTag, ZText, ZDivider } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g._small">
    <!-- 默认行内间距 -->
    <ZText>默认（row + _small gap + center align）</ZText>
    <ZSpace>
      <ZTag>Button A</ZTag>
      <ZTag>Button B</ZTag>
      <ZTag>Button C</ZTag>
    </ZSpace>

    <ZDivider />

    <!-- 自定义 gap -->
    <ZText>size = _middle</ZText>
    <ZSpace :size="g => g._middle">
      <ZTag>Item 1</ZTag>
      <ZTag>Item 2</ZTag>
      <ZTag>Item 3</ZTag>
    </ZSpace>

    <ZDivider />

    <!-- 垂直方向 -->
    <ZText>direction = column + size = _small</ZText>
    <ZSpace :direction="d => d.column" :size="g => g._small">
      <ZTag>行 A</ZTag>
      <ZTag>行 B</ZTag>
      <ZTag>行 C</ZTag>
    </ZSpace>

    <ZDivider />

    <!-- wrap -->
    <ZText>wrap（超出自动换行）</ZText>
    <ZSpace :wrap="w => w.wrap" :size="g => g._small">
      <ZTag v-for="n in 10" :key="n">Tag {{ n }}</ZTag>
    </ZSpace>
  </ZSpace>
</template>
