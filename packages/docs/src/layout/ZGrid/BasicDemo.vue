<script setup lang="ts">
import { ZGrid, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small" :css="s => s.width.pct(100)">
    <!-- 固定列数 -->
    <ZText>固定 3 列</ZText>
    <ZGrid :cols="3" :gap="g => g._small">
      <div v-for="n in 6" :key="n" :style="{ padding: '12px', borderRadius: '4px', background: 'var(--zui-bg-secondary)', textAlign: 'center' }">
        Cell {{ n }}
      </div>
    </ZGrid>

    <!-- 自定义模板 -->
    <ZText>自定义模板：200px 1fr 1fr</ZText>
    <ZGrid cols="200px 1fr 1fr" :gap="g => g._small">
      <div v-for="n in 3" :key="n" :style="{ padding: '12px', borderRadius: '4px', background: 'var(--zui-bg-secondary)', textAlign: 'center' }">
        Col {{ n }}
      </div>
    </ZGrid>

    <!-- 响应式列数 -->
    <ZText>响应式列：tiny=1 / middle=2 / large=3</ZText>
    <ZGrid :cols="{ tiny: 1, middle: 2, large: 3 }" :gap="g => g._small">
      <div
        v-for="n in 6"
        :key="n"
        :style="{ padding: '12px', borderRadius: '4px', background: 'var(--zui-bg-secondary)', textAlign: 'center' }"
      >
        Item {{ n }}
      </div>
    </ZGrid>
  </ZFlex>
</template>
