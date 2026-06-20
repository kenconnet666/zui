<script setup lang="ts">
/**
 * SizeDemo —— ZTabs 禁用态演示。
 *
 * 注：ZTabs 没有 size prop；本 demo 演示「disabled 整体禁用」与「单 tab disabled」
 * 两种禁用场景，属于 BasicDemo 未覆盖的高价值特性。
 */
import { ZTabs, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const active = ref('a')

const tabs = [
  { name: 'a', label: 'Tab A' },
  { name: 'b', label: 'Tab B（禁用）', disabled: true },
  { name: 'c', label: 'Tab C' },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <!-- 单 tab 禁用 -->
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :weight="w => w._semibold">单项禁用（tab B 禁用）</ZText>
      <ZTabs v-model:value="active" :tabs="tabs" />
    </ZFlex>

    <!-- 整体禁用 -->
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :weight="w => w._semibold">整体禁用（disabled）</ZText>
      <ZTabs v-model:value="active" :tabs="tabs" :disabled="true" />
    </ZFlex>

    <!-- card 整体禁用 -->
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :weight="w => w._semibold">card 整体禁用</ZText>
      <ZTabs v-model:value="active" :tabs="tabs" type="card" :disabled="true" />
    </ZFlex>

    <!-- segment 整体禁用 -->
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :weight="w => w._semibold">segment 整体禁用</ZText>
      <ZTabs v-model:value="active" :tabs="tabs" type="segment" :disabled="true" />
    </ZFlex>
  </ZFlex>
</template>
