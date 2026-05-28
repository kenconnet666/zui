<script setup lang="ts">
import { ZFlex, ZIcon } from '@kenconnet666/zui-vue'
import {
  FavoriteBorderOutlined as HeartOutline,
  HomeOutlined as HomeOutline,
} from '@vicons/material'
</script>

<template>
  <ZFlex :gap="g => g.iem(2)" :align="a => a.center" :wrap="w => w.wrap">
    <!-- slot 模式 -->
    <ZFlex :direction="d => d.column" :gap="g => g.iem(0.5)" :align="a => a.center">
      <ZIcon :size="1.5"><HomeOutline /></ZIcon>
      <code style="font-size: 12px">slot 模式</code>
    </ZFlex>
    <!-- component prop 模式 -->
    <ZFlex :direction="d => d.column" :gap="g => g.iem(0.5)" :align="a => a.center">
      <ZIcon :component="HeartOutline" :size="1.5" />
      <code style="font-size: 12px">:component prop 模式</code>
    </ZFlex>
  </ZFlex>
</template>
