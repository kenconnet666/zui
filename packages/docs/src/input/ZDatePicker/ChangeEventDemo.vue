<script setup lang="ts">
import { ZDatePicker, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/**
 * 演示 change 事件：确认选择日期后触发，payload 为 YYYY-MM-DD 字符串。
 * 区别：update:value 在每次 input 时触发（实时），change 在确认后触发。
 */
const value = ref('')
const log = ref<string[]>([])

function handleChange(newDate: string): void {
  log.value.unshift(`change → ${newDate}`)
  if (log.value.length > 5) log.value.pop()
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZDatePicker v-model:value="value" @change="handleChange" />

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
        >（选择日期后触发 change 事件）</ZText
      >
    </ZFlex>
  </ZFlex>
</template>
