<script setup lang="ts">
import { ZList, ZText, ZFlex } from '@kenconnet666/zui-vue'

interface ListItem {
  id: number
  title: string
  desc: string
}

const items: ListItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `列表项 ${i + 1}`,
  desc: `这是第 ${i + 1} 项的描述内容。`,
}))

const shortItems: ListItem[] = items.slice(0, 5)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZList
      :items="shortItems"
      :item-size="3"
      :height="16"
      header="简单列表"
      :bordered="true"
    >
      <template #default="{ item }">
        <ZFlex :direction="d => d.column" :gap="g => g._tiny" :css="s => { s.padding._small }">
          <ZText :css="s => { s.fontWeight._semibold }">{{ item.title }}</ZText>
          <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">{{ item.desc }}</ZText>
        </ZFlex>
      </template>
    </ZList>

    <ZList
      :items="items"
      :item-size="3.5"
      :height="20"
      header="虚拟滚动（50 项）"
      footer="共 50 条数据"
      :bordered="true"
    >
      <template #default="{ item, index }">
        <ZFlex :justify="j => j.spaceBetween" :align="a => a.center" :css="s => { s.padding._small }">
          <ZText>{{ item.title }}</ZText>
          <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">#{{ index + 1 }}</ZText>
        </ZFlex>
      </template>
    </ZList>
  </ZFlex>
</template>
