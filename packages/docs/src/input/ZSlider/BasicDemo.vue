<script setup lang="ts">
import { ZSlider, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const value1 = ref(30)
const value2 = ref(0.5)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZSlider v-model:value="value1" :show-value="true" />
      <ZText
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
        >值：{{ value1 }}</ZText
      >
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZSlider v-model:value="value2" :min="0" :max="1" :step="0.01" :show-value="true" />
      <ZText
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
        >透明度：{{ value2 }}</ZText
      >
    </ZFlex>

    <ZSlider :value="50" :disabled="true" />
  </ZFlex>
</template>
