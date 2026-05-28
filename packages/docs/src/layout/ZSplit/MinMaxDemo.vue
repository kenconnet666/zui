<script setup lang="ts">
import { ref } from 'vue'
import { ZSplit, ZFlex, ZText } from '@kenconnet666/zui-vue'

const ratio = ref(0.5)
const lockedRatio = ref(0.5)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small">
    <ZText>min/max 限制拖拽范围(0.3 ~ 0.7),ratio = {{ ratio.toFixed(2) }}</ZText>
    <ZSplit
      v-model:ratio="ratio"
      direction="horizontal"
      :min="0.3"
      :max="0.7"
      :css="
        s => {
          s.height.iem(10)
          s.borderRadius._small
          s.overflow.hidden
          s.borderWidth.px(1)
          s.borderStyle.solid
          s.borderColor._border
        }
      "
    >
      <template #first>
        <ZFlex
          :justify="j => j.center"
          :align="a => a.center"
          :css="
            s => {
              s.height.pct(100)
              s.backgroundColor._bgMuted
            }
          "
        >
          <ZText>30% ~ 70%</ZText>
        </ZFlex>
      </template>
      <template #second>
        <ZFlex :justify="j => j.center" :align="a => a.center" :css="s => s.height.pct(100)">
          <ZText>剩余</ZText>
        </ZFlex>
      </template>
    </ZSplit>

    <ZText>disabled 锁定:不可拖拽</ZText>
    <ZSplit
      v-model:ratio="lockedRatio"
      direction="horizontal"
      :disabled="true"
      :css="
        s => {
          s.height.iem(7)
          s.borderRadius._small
          s.overflow.hidden
          s.borderWidth.px(1)
          s.borderStyle.solid
          s.borderColor._border
        }
      "
    >
      <template #first>
        <ZFlex
          :justify="j => j.center"
          :align="a => a.center"
          :css="
            s => {
              s.height.pct(100)
              s.backgroundColor._bgMuted
            }
          "
        >
          <ZText>固定</ZText>
        </ZFlex>
      </template>
      <template #second>
        <ZFlex :justify="j => j.center" :align="a => a.center" :css="s => s.height.pct(100)">
          <ZText>固定</ZText>
        </ZFlex>
      </template>
    </ZSplit>
  </ZFlex>
</template>
