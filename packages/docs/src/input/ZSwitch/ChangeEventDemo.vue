<script setup lang="ts">
import { ZSwitch, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/**
 * 演示 change 事件：状态切换时触发，payload 为新的 boolean 值。
 * change 与 update:value 同步触发，适合执行副作用（如请求接口）。
 */
const value = ref(false)
const log = ref<string[]>([])

function handleChange(newVal: boolean): void {
  log.value.unshift(`change → ${newVal ? '开' : '关'} (${new Date().toLocaleTimeString()})`)
  if (log.value.length > 5) log.value.pop()
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZSwitch v-model:value="value" checked-label="开" unchecked-label="关" @change="handleChange" />

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
        >（切换开关触发 change 事件）</ZText
      >
    </ZFlex>
  </ZFlex>
</template>
