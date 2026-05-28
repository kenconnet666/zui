<script setup lang="ts">
import { ZBadge, ZButton, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="(g) => g.iem(2)" :wrap="(w) => w.wrap" :align="(a) => a.center">
    <!-- value &lt; max 直接显示 -->
    <ZBadge :value="8" :max="99">
      <ZButton variant="outlined">消息</ZButton>
    </ZBadge>

    <!-- value &gt; max 显示 99+ -->
    <ZBadge :value="150" :max="99">
      <ZButton variant="outlined">通知</ZButton>
    </ZBadge>

    <!-- 自定义 max=9 -->
    <ZBadge :value="15" :max="9">
      <ZButton variant="outlined">待办</ZButton>
    </ZBadge>

    <!-- value=0 默认隐藏 -->
    <ZBadge :value="0">
      <ZButton variant="outlined">0 隐藏</ZButton>
    </ZBadge>

    <!-- value=0 + showZero=true 显示 -->
    <ZBadge :value="0" :showZero="true">
      <ZButton variant="outlined">0 显示</ZButton>
    </ZBadge>
  </ZFlex>
</template>
