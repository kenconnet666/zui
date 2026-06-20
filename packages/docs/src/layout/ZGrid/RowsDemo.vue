<script setup lang="ts">
import { ZGrid, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small" :css="s => s.width.pct(100)">
    <ZText>显式行高 + 列:2 列 × 2 行,alignItems 居中</ZText>
    <ZGrid :cols="2" rows="60px 100px" :gap="g => g._small" :align-items="a => a.center">
      <ZFlex
        v-for="n in 4"
        :key="n"
        :justify="j => j.center"
        :css="
          s => {
            s.backgroundColor._bgMuted
            s.borderRadius._small
            s.padding._small
          }
        "
      >
        R{{ Math.ceil(n / 2) }} · C{{ ((n - 1) % 2) + 1 }}
      </ZFlex>
    </ZGrid>
  </ZFlex>
</template>
