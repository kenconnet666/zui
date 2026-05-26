<script setup lang="ts">
import { ZInputNumber, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const value1 = ref<number | null>(5)
const value2 = ref<number | null>(3.14)
const value3 = ref<number | null>(null)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZInputNumber v-model:value="value1" :min="0" :max="100" placeholder="0~100" />
      <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">整数，范围 0~100：{{ value1 }}</ZText>
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZInputNumber v-model:value="value2" :step="0.01" :precision="2" placeholder="两位小数" />
      <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">两位小数：{{ value2 }}</ZText>
    </ZFlex>

    <ZInputNumber v-model:value="value3" placeholder="已禁用" :disabled="true" />
  </ZFlex>
</template>
