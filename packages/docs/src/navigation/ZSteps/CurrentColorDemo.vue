<script setup lang="ts">
import { ZSteps, ZFlex, ZText } from '@kenconnet666/zui-vue'

// 演示 currentColor factory：将当前步颜色改为 _success / _warning
const steps = [
  { title: '准备', description: '配置环境' },
  { title: '构建', description: '编译代码' },
  { title: '部署', description: '发布上线' },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._tiny">
      <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">
        currentColor → _primary（默认）
      </ZText>
      <ZSteps :current="1" :items="steps" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._tiny">
      <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">
        currentColor → _warning
      </ZText>
      <ZSteps
        :current="1"
        :items="steps"
        :current-color="c => c._warning"
      />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._tiny">
      <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">
        currentColor → _success
      </ZText>
      <ZSteps
        :current="1"
        :items="steps"
        :current-color="c => c._success"
      />
    </ZFlex>
  </ZFlex>
</template>
