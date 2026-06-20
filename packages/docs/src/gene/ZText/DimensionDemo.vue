<script setup lang="ts">
import { ZText, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g.px(16)">
    <!-- 字重 weight -->
    <ZFlex :direction="d => d.column" :gap="g => g.px(4)">
      <ZText :weight="w => w._thin">字重 thin (100)</ZText>
      <ZText :weight="w => w._light">字重 light (300)</ZText>
      <ZText :weight="w => w._normal">字重 normal (400)</ZText>
      <ZText :weight="w => w._medium">字重 medium (500)</ZText>
      <ZText :weight="w => w._semibold">字重 semibold (600)</ZText>
      <ZText :weight="w => w._bold">字重 bold (700)</ZText>
      <ZText :weight="w => w._extrabold">字重 extrabold (800)</ZText>
      <ZText :weight="w => w._black">字重 black (900)</ZText>
    </ZFlex>

    <!-- 透明度 depth -->
    <ZFlex :gap="g => g.px(16)" :align="a => a.baseline">
      <ZText :depth="o => o._full">depth full (1.0)</ZText>
      <ZText :depth="o => o._strong">depth strong (0.75)</ZText>
      <ZText :depth="o => o._half">depth half (0.5)</ZText>
      <ZText :depth="o => o._dim">depth dim (0.25)</ZText>
      <ZText :depth="o => o._faint">depth faint (0.05)</ZText>
    </ZFlex>

    <!-- 斜体 / 下划线 / 删除线 / 等宽 -->
    <ZFlex :gap="g => g.px(16)" :align="a => a.baseline">
      <ZText italic>斜体 italic</ZText>
      <ZText :underline="true">下划线 underline</ZText>
      <ZText :strikethrough="true">删除线 strikethrough</ZText>
      <ZText :mono="true">等宽 mono: const x = 1</ZText>
    </ZFlex>
  </ZFlex>
</template>
