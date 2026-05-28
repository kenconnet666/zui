<script setup lang="ts">
import { ref } from 'vue'
import { ZRate, ZSpace, ZText } from '@kenconnet666/zui-vue'

const v1 = ref(2.5)
const v2 = ref(3)
const v3 = ref(4)
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g._middle">
    <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">allowHalf 半星 = {{ v1 }}</ZText>
    <ZRate v-model:value="v1" :allow-half="true" />

    <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">count = 7 + 自定义颜色</ZText>
    <ZRate v-model:value="v2" :count="7" :color="c => c._warning" />

    <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">readonly 只读展示</ZText>
    <ZRate :value="v3" :readonly="true" />
  </ZSpace>
</template>
