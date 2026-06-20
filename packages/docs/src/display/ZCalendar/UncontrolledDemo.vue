<script setup lang="ts">
/**
 * ZCalendar — 非受控（只读展示）演示。
 * 不绑定 value，仅展示今日高亮效果。
 */
import { ZCalendar, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g.px(16)">
    <ZText
      :css="
        s => {
          s.color._textTertiary
          s.fontSize._small
        }
      "
    >
      未绑定 value，今日日期自动以描边高亮显示。
    </ZText>
    <ZCalendar />
  </ZFlex>
</template>
