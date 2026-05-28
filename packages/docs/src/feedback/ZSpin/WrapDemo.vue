<script setup lang="ts">
import { ZSpin, ZFlex, ZText, ZButton } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <ZFlex :align="a => a.center" :gap="g => g._small">
      <ZButton :size="0.875" @click="loading = !loading">切换 loading ({{ loading }})</ZButton>
    </ZFlex>
    <ZSpin :spinning="loading" tip="加载中...">
      <ZFlex
        :direction="d => d.column"
        :gap="g => g._small"
        :css="
          s => {
            s.padding.iem(1)
            s.borderWidth.px(1)
            s.borderStyle.solid
            s.borderColor._border
            s.borderRadius._small
          }
        "
      >
        <ZText>被包裹的内容行 1</ZText>
        <ZText>被包裹的内容行 2</ZText>
        <ZText>被包裹的内容行 3</ZText>
      </ZFlex>
    </ZSpin>
  </ZFlex>
</template>
