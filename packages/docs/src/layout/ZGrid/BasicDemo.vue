<script setup lang="ts">
import { ZGrid, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small" :css="s => s.width.pct(100)">
    <!-- 固定列数 -->
    <ZText>固定 3 列</ZText>
    <ZGrid :cols="3" :gap="g => g._small">
      <ZFlex
        v-for="n in 6"
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
        Cell {{ n }}
      </ZFlex>
    </ZGrid>

    <!-- 自定义模板 -->
    <ZText>自定义模板：200px 1fr 1fr</ZText>
    <ZGrid cols="200px 1fr 1fr" :gap="g => g._small">
      <ZFlex
        v-for="n in 3"
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
        Col {{ n }}
      </ZFlex>
    </ZGrid>

    <!-- 响应式列数 -->
    <ZText>响应式列：tiny=1 / middle=2 / large=3</ZText>
    <ZGrid :cols="{ tiny: 1, middle: 2, large: 3 }" :gap="g => g._small">
      <ZFlex
        v-for="n in 6"
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
        Item {{ n }}
      </ZFlex>
    </ZGrid>
  </ZFlex>
</template>
