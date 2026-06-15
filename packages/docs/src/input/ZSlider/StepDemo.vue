<script setup lang="ts">
import { ref } from 'vue'
import { ZSlider, ZSpace, ZText } from '@kenconnet666/zui-vue'

const v1 = ref(20)
const v2 = ref(50)
const v3 = ref(60)
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g._large" :css="s => s.width.px(320)">
    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >step = 10(吸附到 10 的倍数)= {{ v1 }}</ZText
    >
    <ZSlider v-model:value="v1" :step="10" :show-value="true" />

    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >min/max = -50 ~ 50 = {{ v2 - 50 }}</ZText
    >
    <ZSlider v-model:value="v2" :min="0" :max="100" />

    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >disabled 禁用</ZText
    >
    <ZSlider :value="v3" :disabled="true" :show-value="true" />
  </ZSpace>
</template>
