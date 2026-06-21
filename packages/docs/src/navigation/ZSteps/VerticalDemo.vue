<script setup lang="ts">
import { ZSteps, ZFlex, ZButton } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

// 演示 vertical 垂直模式 + errored 错误态
const current = ref(1)
const errored = ref(false)

const steps = [
  { title: '上传文件', description: '选择本地文件' },
  { title: '数据校验', description: '检查格式与内容' },
  { title: '导入处理', description: '写入数据库' },
  { title: '完成', description: '查看结果' },
]
</script>

<template>
  <ZFlex :gap="g => g._large" :align="a => a.flexStart">
    <!-- vertical 垂直布局 -->
    <ZSteps
      :current="current"
      :items="steps"
      :vertical="true"
      :errored="errored"
    />

    <!-- 操作面板 -->
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZButton
        :size="0.875"
        :disabled="current <= 0"
        @click="() => { errored = false; current-- }"
      >
        上一步
      </ZButton>
      <ZButton
        :size="0.875"
        :disabled="current >= steps.length - 1 || errored"
        @click="current++"
      >
        下一步
      </ZButton>
      <ZButton
        :size="0.875"
        variant="ghost"
        @click="errored = !errored"
      >
        {{ errored ? '清除错误' : '标记错误' }}
      </ZButton>
    </ZFlex>
  </ZFlex>
</template>
