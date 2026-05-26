<script setup lang="ts">
import { ZTabs, ZText, ZFlex } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const activeTab = ref('tab1')

const tabs = [
  { name: 'tab1', label: '基础' },
  { name: 'tab2', label: '设置' },
  { name: 'tab3', label: '关于', disabled: true },
]

const closableTabs = ref([
  { name: 'c1', label: '文档一', closable: true },
  { name: 'c2', label: '文档二', closable: true },
  { name: 'c3', label: '文档三', closable: true },
])
const activeClosable = ref('c1')

function onClose(name: string) {
  const idx = closableTabs.value.findIndex(t => t.name === name)
  if (idx >= 0) closableTabs.value.splice(idx, 1)
  if (activeClosable.value === name && closableTabs.value.length) {
    const prev = closableTabs.value[Math.max(0, idx - 1)]
    if (prev) activeClosable.value = prev.name
  }
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZTabs v-model:value="activeTab" :tabs="tabs">
      <template #default="{ activeName }">
        <ZText :css="s => { s.padding._middle }">当前 tab：{{ activeName }}</ZText>
      </template>
    </ZTabs>

    <ZTabs v-model:value="activeTab" :tabs="tabs" type="card" />

    <ZTabs v-model:value="activeTab" :tabs="tabs" type="segment" />

    <ZTabs
      v-model:value="activeClosable"
      :tabs="closableTabs"
      type="card"
      :addable="true"
      @close="onClose"
      @add="closableTabs.push({ name: `c${Date.now()}`, label: '新标签', closable: true })"
    />
  </ZFlex>
</template>
