<script setup lang="ts">
import { ZCode, ZParagraph, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g.px(12)">
    <!-- inline（默认） -->
    <ZParagraph>
      行内代码：<ZCode code="icss(theme, factory)" /> 返回 emotion class；
      <ZCode code="calc(1 * var(--zui-iem, 16px))" /> 是 1iem 展开值。
    </ZParagraph>

    <!-- block fallback（无 shiki） -->
    <ZCode
      :inline="false"
      lang="ts"
      :code="`import { icss } from '@kenconnet666/zui-core'

const cls = icss(theme, (s) => {
  s.display.flex
  s.color._primary
})`"
    />

    <!-- block vue -->
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<ZButton :size=&quot;1.25&quot; :color=&quot;(c) => c._primary&quot;>
  点击我
</ZButton>`"
    />
  </ZFlex>
</template>
