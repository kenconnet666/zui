<script setup lang="ts">
import { ref } from 'vue'
import { ZInputNumber, ZSpace } from '@kenconnet666/zui-vue'

const a = ref<number | null>(0)
const b = ref<number | null>(50)
</script>

<template>
  <ZSpace :direction="d => d.vertical" :size="g => g.iem(0.75)">
    <ZInputNumber v-model:value="a" :step="5" placeholder="步长 5" />
    <ZInputNumber v-model:value="b" :min="0" :max="100" :step="10" placeholder="0~100,步长 10" />
  </ZSpace>
</template>
