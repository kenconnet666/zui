<script setup lang="ts">
import { ZTransfer } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/* 部门人员示例数据 */
const dataSource = [
  { key: 'alice', label: 'Alice（产品）' },
  { key: 'bob', label: 'Bob（开发）' },
  { key: 'carol', label: 'Carol（设计）' },
  { key: 'david', label: 'David（测试）' },
  { key: 'eve', label: 'Eve（运营）' },
  { key: 'frank', label: 'Frank（销售）' },
]

/** 已加入项目的成员 */
const targetKeys = ref<string[]>(['alice', 'bob'])
</script>

<template>
  <!--
    titles 接受 [string, string] 元组，分别作为左右面板标题。
    默认值为 ['源', '目标']。
  -->
  <ZTransfer
    :data-source="dataSource"
    v-model:target-keys="targetKeys"
    :titles="['待加入成员', '项目成员']"
  />
</template>
