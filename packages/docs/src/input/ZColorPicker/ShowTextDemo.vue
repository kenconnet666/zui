<script setup lang="ts">
import { ref } from 'vue'
import { ZColorPicker, ZSpace, ZText } from '@kenconnet666/zui-vue'

const c1 = ref('#1976d2')
const c2 = ref('#2e7d32')
const c3 = ref('#d32f2f')
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g._middle">
    <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">showText 显示色值 = {{ c1 }}</ZText>
    <ZColorPicker v-model:value="c1" :show-text="true" />

    <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">纯色块(不显示文字)</ZText>
    <ZColorPicker v-model:value="c2" />

    <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">disabled 禁用</ZText>
    <ZColorPicker :value="c3" :disabled="true" :show-text="true" />
  </ZSpace>
</template>
