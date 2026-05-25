<script setup lang="ts">
import { ZTitle, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex direction="column" :gap="(g) => g.iem(0.5)">
    <!-- size 覆盖 level 默认 fontSize -->
    <ZTitle :level="2" :size="3">size=3 覆盖 h2 默认</ZTitle>
    <!-- color 覆盖默认文字色 -->
    <ZTitle :level="3" :color="(c) => c._primary">primary 色标题</ZTitle>
    <!-- ellipsis 截断 -->
    <ZTitle :level="4" :ellipsis="true" :css="(s) => s.width.px(200)">
      超出 200px 后截断的标题文字
    </ZTitle>
    <!-- tag 改为 div（不影响 HTML outline） -->
    <ZTitle :level="3" tag="div">tag=div（视觉 h3 但非语义标题）</ZTitle>
  </ZFlex>
</template>
