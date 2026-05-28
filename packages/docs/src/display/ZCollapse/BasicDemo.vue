<script setup lang="ts">
import { ZCollapse, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const expanded = ref<string[]>(['panel1'])
const accordion = ref<string | null>('a1')

const items = [
  { key: 'panel1', title: '面板一 — 可展开' },
  { key: 'panel2', title: '面板二 — 自定义内容' },
  { key: 'panel3', title: '面板三 — 已禁用', disabled: true },
]

const accordionItems = [
  { key: 'a1', title: '手风琴面板 1' },
  { key: 'a2', title: '手风琴面板 2' },
  { key: 'a3', title: '手风琴面板 3' },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZCollapse v-model:value="expanded" :items="items">
      <template #default="{ item }">
        <ZText
          v-if="item.key === 'panel1'"
          :css="
            s => {
              s.padding._small
            }
          "
        >
          面板一的内容区域，展开后显示详细信息。
        </ZText>
        <ZFlex
          v-else-if="item.key === 'panel2'"
          :direction="d => d.column"
          :gap="g => g._tiny"
          :css="
            s => {
              s.padding._small
            }
          "
        >
          <ZText>自定义内容行 1</ZText>
          <ZText>自定义内容行 2</ZText>
        </ZFlex>
      </template>
    </ZCollapse>

    <ZCollapse v-model:value="accordion" :items="accordionItems" :accordion="true">
      <template #default="{ item }">
        <ZText
          :css="
            s => {
              s.padding._small
            }
          "
          >{{ item.title }} 的详细内容。</ZText
        >
      </template>
    </ZCollapse>
  </ZFlex>
</template>
