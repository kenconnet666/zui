<script setup lang="ts">
import { ZVirtualList, ZFlex, ZText } from '@kenconnet666/zui-vue'

interface Item {
  id: number
  label: string
}

const items: Item[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  label: `虚拟项 ${i + 1}`,
}))
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZVirtualList :items="items" :item-size="3" :height="16" key-field="id">
      <template #default="{ item, index }">
        <ZFlex
          :justify="j => j.spaceBetween"
          :align="a => a.center"
          :css="
            s => {
              s.paddingLeft._small
              s.paddingRight._small
              s.height.px(48)
              s.borderBottomWidth.px(1)
              s.borderBottomStyle.solid
              s.borderBottomColor._border
            }
          "
        >
          <ZText>{{ item.label }}</ZText>
          <ZText
            :css="
              s => {
                s.color._textSecondary
                s.fontSize._small
              }
            "
            >#{{ index + 1 }}</ZText
          >
        </ZFlex>
      </template>
    </ZVirtualList>

    <ZVirtualList
      :items="items"
      :item-size="i => (i % 3 === 0 ? 4 : 2.5)"
      :height="16"
      key-field="id"
    >
      <template #default="{ item, index }">
        <ZFlex
          :align="a => a.center"
          :css="
            s => {
              s.paddingLeft._small
              s.paddingRight._small
              s.height._full
              s.backgroundColor._bgMuted
            }
          "
        >
          <ZText
            :css="
              s => {
                s.fontSize._small
              }
            "
            >{{ item.label }}（高度 {{ index % 3 === 0 ? '4iem' : '2.5iem' }}）</ZText
          >
        </ZFlex>
      </template>
    </ZVirtualList>
  </ZFlex>
</template>
