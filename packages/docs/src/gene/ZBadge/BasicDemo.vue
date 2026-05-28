<script setup lang="ts">
import { ZBadge, ZButton, ZFlex, ZAvatar } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g.iem(2)" :wrap="w => w.wrap" :align="a => a.center">
    <!-- 数字角标 -->
    <ZBadge :value="5">
      <ZButton variant="outlined">消息</ZButton>
    </ZBadge>

    <!-- max 限制 -->
    <ZBadge :value="120" :max="99">
      <ZButton variant="outlined">通知</ZButton>
    </ZBadge>

    <!-- dot 模式 -->
    <ZBadge :dot="true">
      <ZButton variant="outlined">动态</ZButton>
    </ZBadge>

    <!-- 自定义颜色 -->
    <ZBadge :value="3" :color="c => c._primary">
      <ZAvatar text="AB" :size="2.5" />
    </ZBadge>

    <!-- inline（无 slot） -->
    <ZFlex :gap="g => g.iem(0.5)" :align="a => a.center">
      <span>状态</span>
      <ZBadge :dot="true" :color="c => c._success" />
      <span>在线</span>
    </ZFlex>

    <!-- value=0 showZero -->
    <ZBadge :value="0" :showZero="true">
      <ZButton variant="outlined">零值</ZButton>
    </ZBadge>
  </ZFlex>
</template>
