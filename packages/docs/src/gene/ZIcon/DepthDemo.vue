<script setup lang="ts">
import { ZIcon, ZFlex, BuiltinIcons } from '@kenconnet666/zui-vue'
</script>

<!--
  depth 演示：同一图标的不同 opacity 档位对比。
  depth 接 opacity carrier，可用 schema token（_faint/_dim/_half/_strong/_solid/_full）
  或字面量 o => o(0.3)。
-->
<template>
  <ZFlex :gap="g => g._large" :align="a => a.center" :wrap="w => w.wrap">
    <!-- faint = 0.05 -->
    <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._tiny">
      <ZIcon
        :component="BuiltinIcons.success"
        :size="2"
        :color="c => c._primary"
        :depth="o => o._faint"
      />
      <span>_faint (5%)</span>
    </ZFlex>

    <!-- dim = 0.25 -->
    <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._tiny">
      <ZIcon
        :component="BuiltinIcons.success"
        :size="2"
        :color="c => c._primary"
        :depth="o => o._dim"
      />
      <span>_dim (25%)</span>
    </ZFlex>

    <!-- half = 0.5 -->
    <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._tiny">
      <ZIcon
        :component="BuiltinIcons.success"
        :size="2"
        :color="c => c._primary"
        :depth="o => o._half"
      />
      <span>_half (50%)</span>
    </ZFlex>

    <!-- strong = 0.75 -->
    <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._tiny">
      <ZIcon
        :component="BuiltinIcons.success"
        :size="2"
        :color="c => c._primary"
        :depth="o => o._strong"
      />
      <span>_strong (75%)</span>
    </ZFlex>

    <!-- solid = 0.95 -->
    <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._tiny">
      <ZIcon
        :component="BuiltinIcons.success"
        :size="2"
        :color="c => c._primary"
        :depth="o => o._solid"
      />
      <span>_solid (95%)</span>
    </ZFlex>

    <!-- full = 1 (默认，不传 depth 等同) -->
    <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._tiny">
      <ZIcon
        :component="BuiltinIcons.success"
        :size="2"
        :color="c => c._primary"
        :depth="o => o._full"
      />
      <span>_full (100%)</span>
    </ZFlex>
  </ZFlex>
</template>
