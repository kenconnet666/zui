<script setup lang="ts">
import { ZProgress, ZFlex, ZText, ZButton } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const value = ref(30)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>线性进度条</ZText>
      <ZProgress :value="30" />
      <ZProgress :value="60" :show-text="true" />
      <ZProgress :value="80" :color="c => c._success" :show-text="true" />
      <ZProgress :value="50" :color="c => c._warning" :size="1" :show-text="true" />
      <ZProgress :value="40" :color="c => c._danger" />
    </ZFlex>

    <ZFlex :gap="g => g._large" :align="a => a.center" :wrap="w => w.wrap">
      <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._small">
        <ZProgress type="circle" :value="75" :show-text="true" />
        <ZText>75%</ZText>
      </ZFlex>
      <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._small">
        <ZProgress type="circle" :value="100" :color="c => c._success" :show-text="true" />
        <ZText>成功</ZText>
      </ZFlex>
      <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._small">
        <ZProgress type="circle" :value="value" :show-text="true" :size="5" />
        <ZText>size=5（动态）</ZText>
      </ZFlex>
    </ZFlex>

    <ZFlex :gap="g => g._small">
      <ZButton :size="0.875" @click="value = Math.max(0, value - 10)">-10</ZButton>
      <ZButton :size="0.875" @click="value = Math.min(100, value + 10)">+10</ZButton>
    </ZFlex>
  </ZFlex>
</template>
