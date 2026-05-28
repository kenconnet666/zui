<script setup lang="ts">
import { ref } from 'vue'
import { ZRadioGroup, ZSpace, ZText } from '@kenconnet666/zui-vue'

const v1 = ref('b')
const v2 = ref('m')

const sizeOptions = [
  { label: '小', value: 's' },
  { label: '中', value: 'm' },
  { label: '大', value: 'l' },
]
const planOptions = [
  { label: '免费版', value: 'free' },
  { label: '专业版', value: 'pro' },
  { label: '企业版', value: 'ent' },
]
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g._middle">
    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >buttonStyle 按钮组样式</ZText
    >
    <ZRadioGroup v-model:value="v1" :options="sizeOptions" :button-style="true" />

    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >默认样式 + 纵向排列</ZText
    >
    <ZRadioGroup v-model:value="v2" :options="planOptions" :direction="d => d.column" />
  </ZSpace>
</template>
