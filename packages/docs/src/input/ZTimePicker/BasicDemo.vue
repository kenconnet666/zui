<script setup lang="ts">
import { ZTimePicker, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const value = ref('')
const valueWithSeconds = ref('')
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZTimePicker v-model:value="value" />
      <ZText v-if="value" :css="s => { s.color._textSecondary; s.fontSize._small }">已选时间：{{ value }}</ZText>
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZTimePicker v-model:value="valueWithSeconds" :step="1" />
      <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">精确到秒（step=1）：{{ valueWithSeconds }}</ZText>
    </ZFlex>

    <ZTimePicker :disabled="true" value="09:30" />
  </ZFlex>
</template>
