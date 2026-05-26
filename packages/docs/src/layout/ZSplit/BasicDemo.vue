<script setup lang="ts">
import { ref } from 'vue'
import { ZSplit, ZFlex, ZText } from '@kenconnet666/zui-vue'

const hRatio = ref(0.4)
const vRatio = ref(0.35)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small">
    <!-- 水平分割 -->
    <ZText>水平分割（ratio = {{ hRatio.toFixed(2) }}）</ZText>
    <ZSplit
      v-model:ratio="hRatio"
      direction="horizontal"
      :css="s => { s.height.iem(12); s.borderRadius._small; s.overflow.hidden; s.borderWidth.px(1); s.borderStyle.solid; s.borderColor._border }"
    >
      <template #first>
        <ZFlex
          :justify="j => j.center"
          :align="a => a.center"
          :css="s => { s.height.pct(100); s.backgroundColor._bgMuted }"
        >
          <ZText>Left Panel</ZText>
        </ZFlex>
      </template>
      <template #second>
        <ZFlex
          :justify="j => j.center"
          :align="a => a.center"
          :css="s => s.height.pct(100)"
        >
          <ZText>Right Panel</ZText>
        </ZFlex>
      </template>
    </ZSplit>

    <!-- 垂直分割 -->
    <ZText>垂直分割（ratio = {{ vRatio.toFixed(2) }}）</ZText>
    <ZSplit
      v-model:ratio="vRatio"
      direction="vertical"
      :css="s => { s.height.iem(14); s.borderRadius._small; s.overflow.hidden; s.borderWidth.px(1); s.borderStyle.solid; s.borderColor._border }"
    >
      <template #first>
        <ZFlex
          :justify="j => j.center"
          :align="a => a.center"
          :css="s => { s.height.pct(100); s.backgroundColor._bgMuted }"
        >
          <ZText>Top Panel</ZText>
        </ZFlex>
      </template>
      <template #second>
        <ZFlex
          :justify="j => j.center"
          :align="a => a.center"
          :css="s => s.height.pct(100)"
        >
          <ZText>Bottom Panel</ZText>
        </ZFlex>
      </template>
    </ZSplit>
  </ZFlex>
</template>
