<script setup lang="ts">
import { ZAutoComplete, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const value = ref('')
const selected = ref('')

const options = [
  'admin@example.com',
  'editor@example.com',
  'viewer@example.com',
  'test@example.com',
  'support@example.com',
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZAutoComplete
        v-model:value="value"
        :options="options"
        placeholder="输入邮箱..."
        @select="v => selected = v"
      />
      <ZText v-if="selected" :css="s => { s.color._textSecondary; s.fontSize._small }">已选：{{ selected }}</ZText>
    </ZFlex>

    <ZAutoComplete :options="options" placeholder="已禁用" :disabled="true" />
  </ZFlex>
</template>
