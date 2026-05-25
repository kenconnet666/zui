<script setup lang="ts">
import { ZText, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="(g) => g.iem(0.75)" :wrap="(w) => w.wrap" :align="(a) => a.baseline">
    <ZText>默认（继承父字号）</ZText>
    <ZText :size="0.75">0.75iem 小字</ZText>
    <ZText :size="1">1iem 标准</ZText>
    <ZText :size="1.25">1.25iem 大字</ZText>
    <ZText :size="1.5">1.5iem 更大</ZText>
    <ZText :color="(c) => c._primary">primary 色</ZText>
    <ZText :color="(c) => c._danger">danger 色</ZText>
    <ZText :color="(c) => c._success">success 色</ZText>
    <ZText :weight="(w) => w._semibold">semibold 字重</ZText>
    <ZText :weight="(w) => w._bold">bold 字重</ZText>
  </ZFlex>
</template>
