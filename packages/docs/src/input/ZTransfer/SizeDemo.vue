<script setup lang="ts">
import { ZTransfer, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/* 生成 20 条数据用于演示 listHeight 截断效果 */
const dataSource = Array.from({ length: 20 }, (_, i) => ({
  key: `item-${i + 1}`,
  label: `选项 ${i + 1}`,
}))

/** 默认尺寸 */
const keys1 = ref<string[]>(['item-1', 'item-2'])
/** 自定义尺寸 */
const keys2 = ref<string[]>(['item-1', 'item-2'])
</script>

<template>
  <!--
    itemSize   — 每项行高 px 倍数（默认 2 = 32px）
    listHeight — 列表容器高度 px 倍数（默认 15 = 240px）
  -->
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">
        默认：itemSize=2（32px/行）/ listHeight=15（240px）
      </ZText>
      <ZTransfer :data-source="dataSource" v-model:target-keys="keys1" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">
        itemSize=1.75（28px/行）/ listHeight=10（160px）—— 更紧凑
      </ZText>
      <ZTransfer
        :data-source="dataSource"
        v-model:target-keys="keys2"
        :item-size="1.75"
        :list-height="10"
      />
    </ZFlex>
  </ZFlex>
</template>
