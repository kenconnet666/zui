<script setup lang="ts">
import { ZSpin, ZFlex, ZText, ZButton, ZCard } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :align="a => a.center" :gap="g => g._large">
      <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._small">
        <ZSpin />
        <ZText>默认（size=1.5）</ZText>
      </ZFlex>
      <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._small">
        <ZSpin :size="1" />
        <ZText>size=1</ZText>
      </ZFlex>
      <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._small">
        <ZSpin :size="3" />
        <ZText>size=3</ZText>
      </ZFlex>
    </ZFlex>

    <ZFlex :align="a => a.center" :gap="g => g._small">
      <ZSpin tip="加载中..." />
      <ZText>带 tip 文字</ZText>
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZFlex :align="a => a.center" :gap="g => g._small">
        <ZButton :size="0.875" @click="loading = !loading">切换 loading</ZButton>
        <ZText>包裹模式（loading={{ loading }}）</ZText>
      </ZFlex>
      <ZSpin :spinning="loading">
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
  </ZFlex>
</template>
