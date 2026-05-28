<script setup lang="ts">
import { ZLoadingBar, ZFlex, ZText, ZButton } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const progress = ref<number | null>(null)
const isError = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

function start() {
  isError.value = false
  progress.value = 0
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (progress.value === null) return
    progress.value = Math.min(progress.value + Math.random() * 15, 90)
  }, 300)
}

function finish() {
  if (timer) clearInterval(timer)
  progress.value = 100
  setTimeout(() => {
    progress.value = null
  }, 500)
}

function error() {
  if (timer) clearInterval(timer)
  isError.value = true
  progress.value = 60
  setTimeout(() => {
    progress.value = null
    isError.value = false
  }, 1500)
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZText>顶部固定进度条（Teleport 到 body）：</ZText>
    <ZLoadingBar :value="progress" :error="isError" />

    <ZFlex :gap="g => g._small">
      <ZButton :size="0.875" @click="start">开始</ZButton>
      <ZButton :size="0.875" @click="finish">完成</ZButton>
      <ZButton :size="0.875" :color="c => c._danger" @click="error">错误</ZButton>
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>静态展示（value=0~100，error 模式）：</ZText>
      <ZLoadingBar
        :value="30"
        :css="
          s => {
            s.position.relative
            s.borderRadius._small
          }
        "
      />
      <ZLoadingBar
        :value="70"
        :css="
          s => {
            s.position.relative
            s.borderRadius._small
          }
        "
      />
      <ZLoadingBar
        :value="50"
        :error="true"
        :css="
          s => {
            s.position.relative
            s.borderRadius._small
          }
        "
      />
    </ZFlex>
  </ZFlex>
</template>
