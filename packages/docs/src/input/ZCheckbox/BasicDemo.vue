<script setup lang="ts">
import { ZCheckbox, ZCheckboxGroup, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const checked = ref(false)
const groupValue = ref<(string | number | boolean)[]>(['vue'])

const options = [
  { value: 'vue',    label: 'Vue 3' },
  { value: 'react',  label: 'React' },
  { value: 'svelte', label: 'Svelte', disabled: true },
  { value: 'solid',  label: 'Solid' },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :gap="g => g._middle" :align="a => a.center">
      <ZCheckbox v-model:checked="checked" label="单独复选框" />
      <ZCheckbox :indeterminate="true" label="半选状态" />
      <ZCheckbox label="已禁用" :disabled="true" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZCheckboxGroup v-model:value="groupValue" :options="options" />
      <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">已选：{{ groupValue.join(', ') || '（无）' }}</ZText>
    </ZFlex>

    <ZCheckboxGroup v-model:value="groupValue" :options="options" :direction="d => d.column" />
  </ZFlex>
</template>
