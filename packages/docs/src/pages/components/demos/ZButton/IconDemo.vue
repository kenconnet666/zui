<script setup lang="ts">
import { ZButton, ZFlex, ZIcon } from '@kenconnet666/zui-vue'
import {
  ArrowForwardOutlined as ArrowRight,
  CloudUploadOutlined as Upload,
  DeleteOutlined as Trash,
  DownloadOutlined as Download,
} from '@vicons/material'
</script>

<template>
  <ZFlex :gap="(g) => g.iem(0.75)" :wrap="(w) => w.wrap" :align="(a) => a.center">
    <ZButton>
      <template #prefixIcon><ZIcon :component="Download" /></template>
      下载
    </ZButton>
    <ZButton variant="outlined">
      <template #prefixIcon><ZIcon :component="Upload" /></template>
      上传
    </ZButton>
    <ZButton variant="text" :color="(c) => c._danger">
      <template #prefixIcon><ZIcon :component="Trash" /></template>
      删除
    </ZButton>
    <ZButton>
      继续
      <template #suffixIcon><ZIcon :component="ArrowRight" /></template>
    </ZButton>
  </ZFlex>
</template>
