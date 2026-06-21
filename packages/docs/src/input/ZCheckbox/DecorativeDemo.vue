<script setup lang="ts">
import { ref } from 'vue'
import { ZCheckbox, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <!-- decorative=true：仅视觉呈现，aria-hidden，不可聚焦 -->
    <ZFlex :gap="g => g._middle" :align="a => a.center">
      <ZCheckbox :checked="true" :decorative="true" />
      <ZText>已勾选（decorative，不可键盘操作）</ZText>
    </ZFlex>

    <ZFlex :gap="g => g._middle" :align="a => a.center">
      <ZCheckbox :checked="false" :decorative="true" />
      <ZText>未勾选（decorative）</ZText>
    </ZFlex>

    <ZFlex :gap="g => g._middle" :align="a => a.center">
      <ZCheckbox :indeterminate="true" :decorative="true" />
      <ZText>半选（decorative）</ZText>
    </ZFlex>

    <ZText
      :css="s => {
        s.color._textSecondary
        s.fontSize._small
      }"
    >
      decorative 模式：根元素加 aria-hidden="true"，隐藏 input tabindex=-1，
      适用于 ZSelect 等"选中语义由外层 role=option 承载"的场景。
    </ZText>
  </ZFlex>
</template>
