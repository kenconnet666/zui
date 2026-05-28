<script setup lang="ts">
import { ZResult, ZButton, ZSpace } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZResult
    title="提交成功"
    description="您的订单 #2026-0528-001 已提交,我们会在 3 个工作日内处理完成。"
    :color="c => c._success"
  >
    <ZSpace :size="g => g._small">
      <ZButton variant="ghost" :size="0.875">返回列表</ZButton>
      <ZButton :size="0.875">查看订单</ZButton>
    </ZSpace>
  </ZResult>
</template>
