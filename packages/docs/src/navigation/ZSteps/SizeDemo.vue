<script setup lang="ts">
import { ZSteps, ZFlex, ZText } from '@kenconnet666/zui-vue'

const steps = [
  { title: '注册', description: '创建账号' },
  { title: '验证', description: '邮件激活' },
  { title: '完成' },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <!-- size 1 = 16px（小号） -->
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :weight="w => w._semibold">size 1 —— 指示器 16px</ZText>
      <ZSteps :current="1" :items="steps" :size="1" />
    </ZFlex>

    <!-- size 2 = 32px（默认） -->
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :weight="w => w._semibold">size 2（默认）—— 指示器 32px</ZText>
      <ZSteps :current="1" :items="steps" :size="2" />
    </ZFlex>

    <!-- size 3 = 48px（大号） -->
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :weight="w => w._semibold">size 3 —— 指示器 48px</ZText>
      <ZSteps :current="1" :items="steps" :size="3" />
    </ZFlex>

    <!-- 垂直 + size 1.5 = 24px -->
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :weight="w => w._semibold">vertical + size 1.5 —— 指示器 24px</ZText>
      <ZSteps :current="1" :items="steps" :vertical="true" :size="1.5" />
    </ZFlex>
  </ZFlex>
</template>
