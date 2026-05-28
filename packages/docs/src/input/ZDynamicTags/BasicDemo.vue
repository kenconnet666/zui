<script setup lang="ts">
import { ZDynamicTags, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const tags1 = ref<string[]>(['Vue', 'React'])
const tags2 = ref<string[]>(['TypeScript'])
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZDynamicTags v-model:value="tags1" placeholder="输入标签回车添加" />
      <ZText
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
        >标签：{{ tags1.join(', ') }}</ZText
      >
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZDynamicTags v-model:value="tags2" :max="5" placeholder="最多 5 个标签" />
      <ZText
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
        >（已 {{ tags2.length }}/5）{{ tags2.join(', ') }}</ZText
      >
    </ZFlex>

    <ZDynamicTags :value="['已禁用']" :disabled="true" />
  </ZFlex>
</template>
