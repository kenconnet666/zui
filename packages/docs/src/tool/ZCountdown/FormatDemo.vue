<script setup lang="ts">
import { ref } from 'vue'
import { ZCountdown, ZSpace, ZText } from '@kenconnet666/zui-vue'

const target = new Date(Date.now() + 1000 * 60 * 60)
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
      >自定义 format</ZText
    >
    <ZCountdown :value="target" format="HH 时 mm 分 ss 秒" />

    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >precision = ms(毫秒精度)+ finish 回调</ZText
    >
    <ZCountdown :value="msTarget" precision="ms" format="ss.SSS" @finish="done = true" />
    <ZText v-if="done" :css="s => s.color._success">倒计时结束!</ZText>
  </ZSpace>
</template>
