<script setup lang="ts">
import { ref } from 'vue'
import { ZCountdown, ZSpace, ZText } from '@kenconnet666/zui-vue'

// 1 小时后到期，展示 {d}/{h}/{m}/{s} 占位符
const target = new Date(Date.now() + 1000 * 60 * 60)
// 30 秒后到期，展示毫秒 {ms} 占位符
const msTarget = new Date(Date.now() + 1000 * 30)
const done = ref(false)
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g._middle">
    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >自定义 format：{h} 时 {m} 分 {s} 秒</ZText
    >
    <ZCountdown :value="target" format="{h} 时 {m} 分 {s} 秒" />

    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >precision = ms（毫秒精度）+ {ms} 占位 + finish 回调</ZText
    >
    <ZCountdown :value="msTarget" precision="ms" format="{s}.{ms}" @finish="done = true" />
    <ZText v-if="done" :css="s => s.color._success">倒计时结束!</ZText>
  </ZSpace>
</template>
