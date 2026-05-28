<script setup lang="ts">
import { ZTag, ZSpace } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g._middle">
    <ZSpace :size="g => g._small" :align="a => a.center">
      <ZTag variant="filled">filled</ZTag>
      <ZTag variant="outlined">outlined</ZTag>
      <ZTag variant="soft">soft</ZTag>
    </ZSpace>

    <ZSpace :size="g => g._small" :align="a => a.center">
      <ZTag variant="filled" :color="c => c._success">成功</ZTag>
      <ZTag variant="soft" :color="c => c._warning">警告</ZTag>
      <ZTag variant="outlined" :color="c => c._danger">危险</ZTag>
      <ZTag variant="soft" :color="c => c._info">信息</ZTag>
    </ZSpace>
  </ZSpace>
</template>
