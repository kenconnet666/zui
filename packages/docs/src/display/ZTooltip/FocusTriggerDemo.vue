<script setup lang="ts">
import { ZTooltip, ZInput, ZSpace } from '@kenconnet666/zui-vue'
</script>

<template>
  <!-- 演示 trigger="focus"：聚焦输入框时弹出 tooltip -->
  <ZSpace :direction="d => d.column" :size="g => g._small">
    <ZTooltip trigger="focus" content="聚焦时显示提示">
      <ZInput placeholder="聚焦我，会弹出 tooltip（上方）" />
    </ZTooltip>
    <ZTooltip trigger="focus" placement="bottom" content="底部弹出">
      <ZInput placeholder="bottom placement 聚焦触发" />
    </ZTooltip>
  </ZSpace>
</template>
