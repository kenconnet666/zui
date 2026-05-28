<script setup lang="ts">
import { ref } from 'vue'
import { ZSelect, ZText, ZFlex } from '@kenconnet666/zui-vue'

const value = ref<string[]>(['vue', 'svelte'])

const options = [
  { value: 'vue', label: 'Vue 3' },
  { value: 'react', label: 'React' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'angular', label: 'Angular' },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small">
    <ZSelect
      v-model:value="value"
      :options="options"
      :multiple="true"
      :clearable="true"
      placeholder="多选框架"
    />
    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >已选 {{ value.length }} 项</ZText
    >
  </ZFlex>
</template>
