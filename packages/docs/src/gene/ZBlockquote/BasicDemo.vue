<script setup lang="ts">
import { ZBlockquote, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="(g) => g.iem(1)">
    <ZBlockquote>
      默认引用块：左侧 primary 色边条 + 中性背景 + 斜体文字。
      适合引用名言、重要提示或说明文字。
    </ZBlockquote>
    <ZBlockquote :color="(c) => c._success">
      success 色边条，不影响文字颜色（文字始终用 _text token）。
    </ZBlockquote>
    <ZBlockquote :color="(c) => c._danger" :size="0.875">
      danger 色边条，size=0.875 紧凑版本（padding/border 等比缩小）。
    </ZBlockquote>
    <ZBlockquote :size="1.25">
      size=1.25 放大版本，padding 和 border-left 均等比放大。
    </ZBlockquote>
  </ZFlex>
</template>
