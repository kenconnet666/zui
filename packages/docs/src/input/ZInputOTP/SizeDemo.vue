<script setup lang="ts">
import { ZInputOTP, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
        >size=0.75（框体 30px）</ZText
      >
      <ZInputOTP v-model:value="v1" :length="6" :size="0.75" placeholder="·" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
        >size=1（框体 40px，默认）</ZText
      >
      <ZInputOTP v-model:value="v2" :length="6" placeholder="·" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
        >size=1.5（框体 60px）</ZText
      >
      <ZInputOTP v-model:value="v3" :length="6" :size="1.5" placeholder="·" />
    </ZFlex>
  </ZFlex>
</template>
