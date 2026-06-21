<script setup lang="ts">
import { ZButton, ZSpace } from '@kenconnet666/zui-vue'
</script>

<template>
  <!-- 演示 height 独立高度 / sxRipple 波纹层定制 -->
  <ZSpace :direction="d => d.column" :size="g => g._middle">
    <!-- height 独立覆盖，size 保持不变 -->
    <ZSpace :size="g => g._small" :align="a => a.center">
      <ZButton :size="1" :height="1.5">height=1.5（24px）</ZButton>
      <ZButton :size="1" :height="2">height=2（32px，默认）</ZButton>
      <ZButton :size="1" :height="3">height=3（48px）</ZButton>
    </ZSpace>

    <!-- sxRipple 定制波纹层颜色（点击可见效果） -->
    <ZSpace :size="g => g._small" :align="a => a.center">
      <ZButton
        variant="outlined"
        :color="c => { c._warning }"
        :sxRipple="{
          css: s => {
            s.color._warning
          },
        }"
      >
        sxRipple 橙色波纹
      </ZButton>
      <ZButton
        variant="outlined"
        :color="c => { c._danger }"
        :sxRipple="{
          css: s => {
            s.color._danger
          },
        }"
      >
        sxRipple 红色波纹
      </ZButton>
    </ZSpace>
  </ZSpace>
</template>
