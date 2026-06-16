<script setup lang="ts">
import { ZFlex, ZSpacer, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small" :css="s => s.width.pct(100)">
    <ZText>basis 固定起始宽度：中间占位固定 128px，两侧自适应</ZText>
    <ZFlex :gap="g => g._small" :align="a => a.center" :css="s => s.width.pct(100)">
      <ZText
        :css="
          s => {
            s.padding.px(8)
            s.backgroundColor._bgMuted
            s.borderRadius._small
          }
        "
        >左</ZText
      >
      <ZSpacer
        :grow="0"
        :basis="b => b.px(128)"
        :css="
          s => {
            s.backgroundColor._primary.alpha(12)
            s.borderRadius._small
            s.padding.px(8)
            s.textAlign.center
          }
        "
      />
      <ZText
        :css="
          s => {
            s.padding.px(8)
            s.backgroundColor._bgMuted
            s.borderRadius._small
          }
        "
        >右</ZText
      >
    </ZFlex>
  </ZFlex>
</template>
