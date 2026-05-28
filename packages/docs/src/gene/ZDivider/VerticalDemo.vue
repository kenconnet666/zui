<script setup lang="ts">
import { ZDivider, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :align="a => a.center" :gap="g => g.iem(0.75)">
    <ZText>首页</ZText>
    <ZDivider :vertical="true" :css="s => s.height.iem(1)" />
    <ZText>关于</ZText>
    <ZDivider :vertical="true" :css="s => s.height.iem(1)" />
    <ZText>文档</ZText>
    <ZDivider :vertical="true" :css="s => s.height.iem(1)" />
    <ZText>博客</ZText>
  </ZFlex>
</template>
