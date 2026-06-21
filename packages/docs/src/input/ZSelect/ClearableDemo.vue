<script setup lang="ts">
import { ref } from 'vue'
import { ZSelect, ZFlex, ZText } from '@kenconnet666/zui-vue'

const single = ref<string | null>(null)
const multi = ref<string[]>([])

const options = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳' },
]

/** change 事件日志 */
const changeLog = ref<string>('（尚未触发 change）')

function onSingleChange(v: unknown): void {
  changeLog.value = `change: ${v === null ? 'null（已清空）' : String(v)}`
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <!-- 单选可清空 + change 事件 -->
    <ZFlex :direction="d => d.column" :gap="g => g._tiny">
      <ZSelect
        v-model:value="single"
        :options="options"
        placeholder="单选（可清空，监听 change）"
        :clearable="true"
        @change="onSingleChange"
      />
      <ZText
        :css="s => {
          s.color._textSecondary
          s.fontSize._small
          s.fontFamily('monospace')
        }"
      >{{ changeLog }}</ZText>
    </ZFlex>

    <!-- 多选可清空 -->
    <ZSelect
      v-model:value="multi"
      :options="options"
      placeholder="多选（可清空）"
      :multiple="true"
      :clearable="true"
    />
  </ZFlex>
</template>
