<script setup lang="ts">
import { ref } from 'vue'
import { ZInput, ZSpace } from '@kenconnet666/zui-vue'

const small = ref('')
const middle = ref('')
const large = ref('')
</script>

<template>
  <ZSpace :direction="d => d.vertical" :size="g => g.iem(0.75)">
    <ZInput v-model:value="small" :size="0.875" placeholder="小号 size=0.875" />
    <ZInput v-model:value="middle" placeholder="默认 size=1" />
    <ZInput v-model:value="large" :size="1.25" placeholder="大号 size=1.25" />
  </ZSpace>
</template>
