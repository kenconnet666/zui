<script setup lang="ts">
import { ZDateRangePicker, ZFlex } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const value = ref<[string, string] | null>(null)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZDateRangePicker
      v-model:value="value"
      :size="0.875"
      start-placeholder="小 (size=0.875)"
      end-placeholder="小"
    />
    <ZDateRangePicker
      v-model:value="value"
      :size="1"
      start-placeholder="默认 (size=1)"
      end-placeholder="默认"
    />
    <ZDateRangePicker
      v-model:value="value"
      :size="1.25"
      start-placeholder="大 (size=1.25)"
      end-placeholder="大"
    />
  </ZFlex>
</template>
