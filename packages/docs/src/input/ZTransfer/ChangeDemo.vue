<script setup lang="ts">
import { ZTransfer, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const dataSource = [
  { key: 'vue', label: 'Vue 3' },
  { key: 'react', label: 'React' },
  { key: 'svelte', label: 'Svelte' },
  { key: 'solid', label: 'Solid' },
  { key: 'qwik', label: 'Qwik' },
]

const targetKeys = ref<string[]>(['vue'])

/** change 事件日志（最新在前，最多展示 5 条） */
const logs = ref<string[]>([])

function onTransferChange(keys: string[]): void {
  logs.value = [`[${new Date().toLocaleTimeString()}] keys → [${keys.join(', ') || '（空）'}]`, ...logs.value].slice(0, 5)
}
</script>

<template>
  <!--
    change 事件在每次穿梭动作后触发，payload 为当前右侧所有 key（string[]）。
    与 update:targetKeys 值相同，适合不使用 v-model 的受控场景。
  -->
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <ZTransfer
      :data-source="dataSource"
      v-model:target-keys="targetKeys"
      :titles="['可选', '已选']"
      @change="onTransferChange"
    />

    <ZFlex :direction="d => d.column" :gap="g => g._tiny">
      <ZText :css="s => { s.fontSize._small; s.fontWeight._semibold }">
        change 事件日志：
      </ZText>
      <ZText
        v-for="(log, i) in logs"
        :key="i"
        :css="s => { s.fontSize._small; s.color._textSecondary; s.fontFamily._mono }"
      >
        {{ log }}
      </ZText>
      <ZText
        v-if="!logs.length"
        :css="s => { s.fontSize._small; s.color._textSecondary }"
      >
        操作穿梭按钮后此处显示事件日志…
      </ZText>
    </ZFlex>
  </ZFlex>
</template>
