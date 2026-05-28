<script setup lang="ts">
import { ZFlex, ZText } from '@kenconnet666/zui-vue'

const aligns = [
  { label: 'flex-start', fn: (a: any) => a.flexStart },
  { label: 'center', fn: (a: any) => a.center },
  { label: 'flex-end', fn: (a: any) => a.flexEnd },
  { label: 'stretch', fn: (a: any) => a.stretch },
] as const
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle" :css="s => s.width.pct(100)">
    <ZFlex
      v-for="item in aligns"
      :key="item.label"
      :align="item.fn"
      :gap="g => g._small"
      :css="
        s => {
          s.height.iem(5)
          s.padding.iem(0.5)
          s.borderRadius._small
          s.backgroundColor._bgMuted
        }
      "
    >
      <ZText
        :css="
          s => {
            s.width.iem(6)
            s.color._textSecondary
            s.fontSize._small
          }
        "
        >{{ item.label }}</ZText
      >
      <ZText
        :css="
          s => {
            s.padding.iem(0.5)
            s.backgroundColor._bg
            s.borderRadius._small
          }
        "
        >矮</ZText
      >
      <ZText
        :css="
          s => {
            s.padding.iem(1.25)
            s.backgroundColor._bg
            s.borderRadius._small
          }
        "
        >高</ZText
      >
    </ZFlex>
  </ZFlex>
</template>
