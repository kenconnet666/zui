<script setup lang="ts">
import { ZPageHeader, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const backLog = ref<string[]>([])
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZPageHeader
      title="订单详情"
      subtitle="订单 #20260526-001"
      @back="backLog.push('clicked back')"
    >
      <template #extra>
        <ZButton :size="0.875">打印</ZButton>
        <ZButton :size="0.875" :color="c => c._primary">操作</ZButton>
      </template>
    </ZPageHeader>

    <ZPageHeader
      title="无返回按钮"
      subtitle="副标题文字"
      :show-back="false"
    >
      <template #extra>
        <ZButton :size="0.875" variant="ghost">操作</ZButton>
      </template>
    </ZPageHeader>

    <ZText v-if="backLog.length" :css="s => { s.color._textSecondary; s.fontSize._small }">
      返回按钮被点击 {{ backLog.length }} 次
    </ZText>
  </ZFlex>
</template>
