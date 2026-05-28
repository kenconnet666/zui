<script setup lang="ts">
import { ref } from 'vue'
import { ZInput, ZSpace } from '@kenconnet666/zui-vue'

const v1 = ref('点 × 一键清空')
const v2 = ref('')
</script>

<template>
  <ZSpace :direction="d => d.vertical" :size="g => g.iem(0.75)">
    <ZInput v-model:value="v1" :clearable="true" placeholder="可清空" />
    <ZInput v-model:value="v2" :show-count="true" :maxlength="20" placeholder="最多 20 字" />
  </ZSpace>
</template>
