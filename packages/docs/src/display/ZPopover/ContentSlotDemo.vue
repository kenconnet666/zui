<script setup lang="ts">
import { ZPopover, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._large" :wrap="w => w.wrap" :align="a => a.center">
    <!-- #title slot 自定义标题 -->
    <ZPopover>
      <template #title>
        <ZFlex :gap="g => g._tiny" :align="a => a.center">
          <span>📋</span>
          <ZText :css="s => { s.fontWeight._semibold }">自定义标题 slot</ZText>
        </ZFlex>
      </template>
      <template #content>
        <ZFlex :direction="d => d.column" :gap="g => g._small">
          <ZText>使用 #title slot 可以放置任意标题内容。</ZText>
          <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">
            例如带图标的标题、彩色标题等。
          </ZText>
        </ZFlex>
      </template>
      <ZButton :size="0.875">自定义标题</ZButton>
    </ZPopover>

    <!-- 丰富内容的 #content slot -->
    <ZPopover title="用户信息">
      <template #content>
        <ZFlex :direction="d => d.column" :gap="g => g._small">
          <ZFlex :gap="g => g._small" :align="a => a.center">
            <ZText :css="s => { s.color._textSecondary; s.fontSize._small; s.width.px(48) }">账号</ZText>
            <ZText>kenconnet666</ZText>
          </ZFlex>
          <ZFlex :gap="g => g._small" :align="a => a.center">
            <ZText :css="s => { s.color._textSecondary; s.fontSize._small; s.width.px(48) }">角色</ZText>
            <ZText>管理员</ZText>
          </ZFlex>
          <ZFlex :gap="g => g._small" :align="a => a.center">
            <ZText :css="s => { s.color._textSecondary; s.fontSize._small; s.width.px(48) }">状态</ZText>
            <ZText :css="s => { s.color._success }">在线</ZText>
          </ZFlex>
        </ZFlex>
      </template>
      <ZButton :size="0.875" variant="outlined">用户卡片</ZButton>
    </ZPopover>
  </ZFlex>
</template>
