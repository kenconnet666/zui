<script setup lang="ts">
import { ref } from 'vue'
import { ZInputNumber, ZSpace } from '@kenconnet666/zui-vue'

const v0 = ref<number | null>(3.14)
const v2 = ref<number | null>(1.2345)
const v4 = ref<number | null>(1.23456789)
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g.iem(0.75)">
    <ZInputNumber v-model:value="v0" :precision="0" :step="1" placeholder="precision=0(整数)" />
    <ZInputNumber
      v-model:value="v2"
      :precision="2"
      :step="0.01"
      placeholder="precision=2(两位小数)"
    />
    <ZInputNumber v-model:value="v4" :precision="4" :step="0.0001" placeholder="precision=4" />
  </ZSpace>
</template>
