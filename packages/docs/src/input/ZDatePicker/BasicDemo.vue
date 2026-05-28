<script setup lang="ts">
import { ZDatePicker, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZDatePicker v-model:value="value" />
      <ZText
        v-if="value"
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
        >已选日期：{{ value }}</ZText
      >
    </ZFlex>

    <ZDatePicker :min="'2020-01-01'" :max="'2030-12-31'" placeholder="限制范围" />

    <ZDatePicker :disabled="true" value="2026-01-01" />
  </ZFlex>
</template>
