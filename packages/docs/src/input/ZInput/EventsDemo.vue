<script setup lang="ts">
import { ref } from 'vue'
import { ZInput, ZFlex, ZText } from '@kenconnet666/zui-vue'

const value = ref('')
const log = ref<string[]>([])

/** 追加一条事件日志，最多保留 6 条 */
function addLog(msg: string): void {
  log.value.unshift(msg)
  if (log.value.length > 6) log.value.length = 6
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <ZInput
      v-model:value="value"
      placeholder="试试输入、清空、回车、聚焦/失焦"
      :clearable="true"
      @focus="addLog('focus')"
      @blur="addLog('blur')"
      @change="(v) => addLog(`change: ${v}`)"
      @clear="addLog('clear')"
      @press-enter="addLog('pressEnter')"
    />

    <ZFlex :direction="d => d.column" :gap="g => g._tiny">
      <ZText
        v-for="(item, i) in log"
        :key="i"
        :css="s => {
          s.color._textSecondary
          s.fontSize._small
          s.fontFamily('monospace')
        }"
      >{{ item }}</ZText>
      <ZText
        v-if="log.length === 0"
        :css="s => {
          s.color._textSecondary
          s.fontSize._small
        }"
      >（事件日志将在此显示）</ZText>
    </ZFlex>
  </ZFlex>
</template>
