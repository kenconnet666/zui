<script setup lang="ts">
import { ZSteps, ZFlex, ZButton, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const current = ref(1)

const steps = [
  { title: '填写信息', description: '输入基本信息' },
  { title: '确认订单', description: '核对订单详情' },
  { title: '支付',     description: '选择支付方式' },
  { title: '完成',     description: '等待处理结果' },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZSteps :current="current" :items="steps" />

    <ZFlex :gap="g => g._small">
      <ZButton :size="0.875" :disabled="current <= 0" @click="current--">上一步</ZButton>
      <ZButton :size="0.875" :disabled="current >= steps.length - 1" @click="current++">下一步</ZButton>
      <ZText :css="s => { s.color._textSecondary }">当前步骤：{{ current + 1 }} / {{ steps.length }}</ZText>
    </ZFlex>

    <ZSteps :current="1" :items="steps" :vertical="true" />

    <ZSteps :current="1" :items="steps" :errored="true" />
  </ZFlex>
</template>
