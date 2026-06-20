<script setup lang="ts">
import { ref } from 'vue'
import { ZList, ZFlex, ZButton, ZText } from '@kenconnet666/zui-vue'

/** 演示空状态：items=[] 时显示 emptyText / #empty slot。 */
const items = ref<{ id: number; label: string }[]>([])

function fill(): void {
  items.value = Array.from({ length: 3 }, (_, i) => ({ id: i + 1, label: `列表项 ${i + 1}` }))
}
function clear(): void {
  items.value = []
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <ZFlex :gap="g => g._small">
      <ZButton @click="fill">填充数据</ZButton>
      <ZButton variant="outlined" @click="clear">清空</ZButton>
    </ZFlex>

    <!-- 默认 emptyText -->
    <ZList :items="items" :item-size="3" :height="10" :bordered="true" header="默认空状态文案">
      <template #default="{ item }">
        <ZText
          :css="
            s => {
              s.padding._small
              s.display.block
            }
          "
          >{{ item.label }}</ZText
        >
      </template>
    </ZList>

    <!-- 自定义 #empty slot -->
    <ZList
      :items="items"
      :item-size="3"
      :height="10"
      :bordered="true"
      header="自定义 #empty slot"
    >
      <template #default="{ item }">
        <ZText
          :css="
            s => {
              s.padding._small
              s.display.block
            }
          "
          >{{ item.label }}</ZText
        >
      </template>
      <template #empty>
        <ZFlex
          :direction="d => d.column"
          :align="a => a.center"
          :gap="g => g._small"
          :css="
            s => {
              s.padding._large
              s.color._textSecondary
            }
          "
        >
          <ZText :css="s => { s.fontSize._small }">暂时没有数据，点击「填充数据」试试</ZText>
        </ZFlex>
      </template>
    </ZList>
  </ZFlex>
</template>
