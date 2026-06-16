<script setup lang="ts">
import { ZDateRangePicker, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const value = ref<[string, string] | null>(null)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZDateRangePicker v-model:value="value" start-placeholder="开始日期" end-placeholder="结束日期" />
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

    <ZDateRangePicker :disabled="true" :value="['2026-01-01', '2026-12-31']" />
  </ZFlex>
</template>
