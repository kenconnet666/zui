<script setup lang="ts">
import { ZDateRangePicker, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const value = ref<[string, string] | null>(null)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small">
    <ZDateRangePicker
      v-model:value="value"
      min="2020-01-01"
      max="2030-12-31"
      start-placeholder="最早 2020-01-01"
      end-placeholder="最晚 2030-12-31"
    />
    <ZText
      v-if="value"
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >已选范围：{{ value[0] }} ~ {{ value[1] }}</ZText
    >
  </ZFlex>
</template>
