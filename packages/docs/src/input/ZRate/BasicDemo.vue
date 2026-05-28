<script setup lang="ts">
import { ZRate, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const value1 = ref(3)
const value2 = ref(2.5)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZRate v-model:value="value1" />
      <ZText
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
        >评分：{{ value1 }}</ZText
      >
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZRate v-model:value="value2" :allow-half="true" />
      <ZText
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
        >半星：{{ value2 }}</ZText
      >
    </ZFlex>

    <ZFlex :gap="g => g._large" :align="a => a.center">
      <ZRate :value="4" :size="1" />
      <ZRate :value="4" :size="1.5" />
      <ZRate :value="4" :size="2" />
    </ZFlex>

    <ZRate :value="4" :readonly="true" />
    <ZRate :value="3" :disabled="true" />
  </ZFlex>
</template>
