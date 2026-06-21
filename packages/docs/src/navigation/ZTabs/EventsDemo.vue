<script setup lang="ts">
import { ZTabs, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

// 演示 change / add / close 事件
const tabs = ref([
  { name: 'a', label: '文档 A', closable: true },
  { name: 'b', label: '文档 B', closable: true },
  { name: 'c', label: '文档 C', closable: true },
])
const activeTab = ref('a')
const log = ref<string[]>([])

let counter = tabs.value.length

function onChange(name: string) {
  log.value.unshift(`change → ${name}`)
  if (log.value.length > 5) log.value.pop()
}

function onAdd() {
  counter++
  const name = `tab${counter}`
  tabs.value.push({ name, label: `文档 ${counter}`, closable: true })
  activeTab.value = name
  log.value.unshift(`add → ${name}`)
  if (log.value.length > 5) log.value.pop()
}

function onClose(name: string) {
  const idx = tabs.value.findIndex(t => t.name === name)
  if (idx >= 0) tabs.value.splice(idx, 1)
  if (activeTab.value === name && tabs.value.length > 0) {
    const prev = tabs.value[Math.max(0, idx - 1)]
    if (prev) activeTab.value = prev.name
  }
  log.value.unshift(`close → ${name}`)
  if (log.value.length > 5) log.value.pop()
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <ZTabs
      v-model:value="activeTab"
      :tabs="tabs"
      type="card"
      :addable="true"
      @change="onChange"
      @add="onAdd"
      @close="onClose"
    >
      <template #default="{ activeName }">
        <ZText>当前面板：{{ activeName }}</ZText>
      </template>
    </ZTabs>

    <ZFlex :direction="d => d.column" :gap="g => g._tiny">
      <ZText :css="s => { s.fontSize._small; s.fontWeight._medium }">事件记录（最近 5 条）</ZText>
      <ZText
        v-for="(entry, i) in log"
        :key="i"
        :css="s => { s.fontSize._small; s.color._textSecondary }"
      >
        {{ entry }}
      </ZText>
      <ZText v-if="log.length === 0" :css="s => { s.fontSize._small; s.color._textSecondary }">
        暂无事件
      </ZText>
    </ZFlex>
  </ZFlex>
</template>
