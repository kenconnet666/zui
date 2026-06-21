<script setup lang="ts">
import { ZTransfer, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/** 所有数据都在右侧 — 左侧呈空态 */
const dataSource = [
  { key: 'a', label: '选项 A' },
  { key: 'b', label: '选项 B' },
  { key: 'c', label: '选项 C' },
]

const allRight = ref<string[]>(['a', 'b', 'c'])

/** 无任何数据 — 两侧均呈空态 */
const emptySource: never[] = []
const noKeys = ref<string[]>([])
</script>

<template>
  <!--
    当某侧无数据时，ZTransfer 内部渲染 ZEmpty（compact 模式）展示空态。
    左侧移空 = 所有 keys 进入右侧；右侧移空 = targetKeys 为 []。
  -->
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">
        全部已移到右侧 — 左侧空态
      </ZText>
      <ZTransfer :data-source="dataSource" v-model:target-keys="allRight" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">
        无任何数据 — 两侧均为空态
      </ZText>
      <ZTransfer :data-source="emptySource" v-model:target-keys="noKeys" />
    </ZFlex>
  </ZFlex>
</template>
