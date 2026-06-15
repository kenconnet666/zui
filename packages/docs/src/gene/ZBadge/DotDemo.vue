<script setup lang="ts">
import { ZBadge, ZButton, ZAvatar, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g.px(32)" :wrap="w => w.wrap" :align="a => a.center">
    <!-- 红点（默认 _danger 色） -->
    <ZBadge :dot="true">
      <ZButton variant="outlined">新消息</ZButton>
    </ZBadge>

    <!-- 红点 + 头像 -->
    <ZBadge :dot="true" :color="c => c._success">
      <ZAvatar text="ON" :color="c => c._textSecondary" />
    </ZBadge>

    <!-- inline 红点（无 slot） -->
    <ZFlex :gap="g => g.px(8)" :align="a => a.center">
      <ZBadge :dot="true" :color="c => c._success" />
      <span>在线</span>
    </ZFlex>
    <ZFlex :gap="g => g.px(8)" :align="a => a.center">
      <ZBadge :dot="true" :color="c => c._warning" />
      <span>忙碌</span>
    </ZFlex>
    <ZFlex :gap="g => g.px(8)" :align="a => a.center">
      <ZBadge :dot="true" :color="c => c._textSecondary" />
      <span>离线</span>
    </ZFlex>
  </ZFlex>
</template>
