<script setup lang="ts">
import { ZTransfer, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const targetKeys = ref<string[]>(['vue', 'react'])

const dataSource = [
  { key: 'vue', label: 'Vue 3' },
  { key: 'react', label: 'React' },
  { key: 'svelte', label: 'Svelte' },
  { key: 'solid', label: 'Solid' },
  { key: 'angular', label: 'Angular', disabled: true },
  { key: 'qwik', label: 'Qwik' },
  { key: 'astro', label: 'Astro' },
  { key: 'nuxt', label: 'Nuxt' },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small">
    <ZTransfer
      :data-source="dataSource"
      v-model:target-keys="targetKeys"
      :titles="['可选框架', '已选框架']"
    />
    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
    >
      已选：{{ targetKeys.join(', ') || '（无）' }}
    </ZText>
  </ZFlex>
</template>
