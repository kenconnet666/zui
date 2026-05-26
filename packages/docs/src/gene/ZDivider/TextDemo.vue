<script setup lang="ts">
import { ZDivider, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="(g) => g.iem(0.75)">
    <ZDivider>居中文字</ZDivider>
    <ZDivider align="left">左对齐文字</ZDivider>
    <ZDivider align="right">右对齐文字</ZDivider>
    <ZDivider :color="(c) => c._primary">primary 色边框 + 文字</ZDivider>
    <ZDivider :dashed="true">虚线 + 文字</ZDivider>
  </ZFlex>
</template>
