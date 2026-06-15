<script setup lang="ts">
import { ZFlex, ZSpacer, ZTag, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small" :css="s => s.width.pct(100)">
    <!-- 工具栏 push-apart -->
    <ZText>工具栏：左边标题，右边操作（ZSpacer 撑开中间）</ZText>
    <ZFlex
      :align="a => a.center"
      :css="
        s => {
          s.padding.px(12)
          s.borderRadius._small
          s.backgroundColor._bgMuted
          s.width.pct(100)
        }
      "
    >
      <ZText>页面标题</ZText>
      <ZSpacer />
      <ZFlex :gap="g => g._small">
        <ZTag>新建</ZTag>
        <ZTag>导出</ZTag>
      </ZFlex>
    </ZFlex>

    <!-- grow 比例 -->
    <ZText>grow 比例：左 grow=2，右 grow=1</ZText>
    <ZFlex :gap="g => g._small" :css="s => s.width.pct(100)">
      <ZSpacer
        :grow="2"
        :css="
          s => {
            s.backgroundColor._bgMuted
            s.borderRadius._small
            s.padding.px(8)
            s.textAlign.center
          }
        "
      />
      <ZSpacer
        :grow="1"
        :css="
          s => {
            s.backgroundColor._bgMuted
            s.borderRadius._small
            s.padding.px(8)
            s.textAlign.center
          }
        "
      />
    </ZFlex>
  </ZFlex>
</template>
