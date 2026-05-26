<script setup lang="ts">
import { ZTour, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const open = ref(false)
const current = ref(0)

const steps = [
  {
    target: '#tour-step-1',
    title: '第一步：按钮',
    description: '这是一个普通按钮，点击可以触发操作。',
    placement: 'bottom' as const,
  },
  {
    target: '#tour-step-2',
    title: '第二步：文字',
    description: '这里显示了一段描述文字。',
    placement: 'right' as const,
  },
  {
    target: '#tour-step-3',
    title: '第三步：完成',
    description: '引导完成，欢迎使用 ZUI！',
    placement: 'top' as const,
  },
]

function startTour(): void {
  current.value = 0
  open.value = true
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :gap="g => g._large" :align="a => a.center">
      <ZButton id="tour-step-1" :size="0.875" @click="startTour">开始引导</ZButton>
      <ZText id="tour-step-2">描述文字示例</ZText>
      <ZButton id="tour-step-3" :size="0.875" :variant="v => v._ghost">第三个目标</ZButton>
    </ZFlex>
  </ZFlex>

  <ZTour
    v-model:current="current"
    v-model:open="open"
    :steps="steps"
    @finish="open = false"
    @close="open = false"
  />
</template>
