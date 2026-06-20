<script setup lang="ts">
import { ZDrawer, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <ZButton @click="visible = true">打开带底部操作栏的抽屉</ZButton>

  <!-- size=28 → 28 × 16 = 448px 宽，演示自定义宽度 -->
  <ZDrawer v-model:visible="visible" title="编辑信息" :size="28">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>抽屉主体内容区域（body slot）。</ZText>
      <ZText>
        自定义宽度：<strong>:size="28"</strong>（28 × 16 = 448 px）。
      </ZText>
      <ZText>底部 <strong>#foot</strong> slot 提供取消 / 确定操作按钮。</ZText>
    </ZFlex>

    <template #foot>
      <ZFlex :justify="j => j.flexEnd" :gap="g => g._small">
        <ZButton :size="0.875" variant="ghost" @click="visible = false">取消</ZButton>
        <ZButton :size="0.875" @click="visible = false">确定</ZButton>
      </ZFlex>
    </template>
  </ZDrawer>
</template>
