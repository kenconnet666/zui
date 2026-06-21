<script setup lang="ts">
import { ZPagination, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/**
 * 演示 change 事件：页码切换时触发，payload 为新页码。
 * 区别：update:page 用于 v-model 双向绑定，change 用于副作用（请求数据等）。
 */
const page = ref(1)
const log = ref<string[]>([])

function handleChange(newPage: number): void {
  log.value.unshift(`change → 第 ${newPage} 页`)
  if (log.value.length > 5) log.value.pop()
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZPagination v-model:page="page" :total="100" :show-total="true" @change="handleChange" />

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
        >事件日志（最近 5 条）：</ZText
      >
      <ZText
        v-for="(item, i) in log"
        :key="i"
        :css="
          s => {
            s.color._text
            s.fontSize._small
          }
        "
        >{{ item }}</ZText
      >
      <ZText
        v-if="log.length === 0"
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
        >（点击翻页触发 change 事件）</ZText
      >
    </ZFlex>
  </ZFlex>
</template>
