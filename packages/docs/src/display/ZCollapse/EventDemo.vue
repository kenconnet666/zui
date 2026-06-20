<script setup lang="ts">
/**
 * ZCollapse — v-model:value + 事件回显演示。
 * 展示当前已展开的 key 列表，方便理解受控模式。
 */
import { ZCollapse, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref, computed } from 'vue'

const expanded = ref<string[]>([])

const items = [
  { key: 'item1', title: '可折叠面板 1' },
  { key: 'item2', title: '可折叠面板 2' },
  { key: 'item3', title: '可折叠面板 3（支持多选展开）' },
]

const expandedDisplay = computed(() =>
  expanded.value.length > 0 ? expanded.value.join('、') : '无',
)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g.px(16)">
    <ZCollapse v-model:value="expanded" :items="items">
      <template #default="{ item }">
        <ZText
          :css="
            s => {
              s.padding._small
            }
          "
        >
          {{ item.title }} 的内容区域。
        </ZText>
      </template>
    </ZCollapse>

    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
    >
      当前展开 key：{{ expandedDisplay }}
    </ZText>
  </ZFlex>
</template>
