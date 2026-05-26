<script setup lang="ts">
import { ZRadio, ZRadioGroup, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const size = ref<string | null>('medium')
const framework = ref<string | null>('vue')

const sizeOptions = [
  { value: 'small',  label: '小' },
  { value: 'medium', label: '中' },
  { value: 'large',  label: '大' },
]

const frameworkOptions = [
  { value: 'vue',    label: 'Vue 3' },
  { value: 'react',  label: 'React' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid',  label: 'Solid', disabled: true },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZRadioGroup v-model:value="size" :options="sizeOptions" />
      <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">当前尺寸：{{ size }}</ZText>
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZRadioGroup v-model:value="framework" :options="frameworkOptions" :button-style="true" />
      <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">已选框架：{{ framework }}</ZText>
    </ZFlex>

    <ZFlex :gap="g => g._middle" :align="a => a.center">
      <ZRadio value="a" label="选项 A" :disabled="false" />
      <ZRadio value="b" label="选项 B" :disabled="true" />
    </ZFlex>
  </ZFlex>
</template>
