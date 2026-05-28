<script setup lang="ts">
import { ZGrid, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small" :css="s => s.width.pct(100)">
    <ZText>显式行高 + 列:2 列 × 2 行,alignItems 居中</ZText>
    <ZGrid :cols="2" rows="60px 100px" :gap="g => g._small" :align-items="a => a.center">
      <div
        v-for="n in 4"
        :key="n"
        :style="{
          padding: '8px',
          borderRadius: '4px',
          background: 'var(--zui-bg-secondary)',
          textAlign: 'center',
        }"
      >
        R{{ Math.ceil(n / 2) }} · C{{ ((n - 1) % 2) + 1 }}
      </div>
    </ZGrid>
  </ZFlex>
</template>
