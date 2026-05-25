<script setup lang="ts">
import { ZCopyButton, ZFlex, ZCode } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="(g) => g.iem(1)" :wrap="(w) => w.wrap" :align="(a) => a.center">
    <!-- 纯图标（默认） -->
    <ZCopyButton text="pnpm add @kenconnet666/zui-vue" />

    <!-- 带文字 -->
    <ZCopyButton text="npm install @kenconnet666/zui-vue" label="复制" />

    <!-- size 缩放 -->
    <ZCopyButton text="hello zui" :size="0.75" label="小" />
    <ZCopyButton text="hello zui" :size="1.25" label="大" />

    <!-- 自定义颜色 -->
    <ZCopyButton
      text="styled copy button"
      label="自定义色"
      :color="(c) => c._primary"
    />

    <!-- 禁用 toast -->
    <ZCopyButton text="no toast" label="不弹 toast" :toast="false" />

    <!-- 与 ZCode 配合 -->
    <ZFlex :align="(a) => a.center" :gap="(g) => g.iem(0.5)">
      <ZCode code="pnpm add shiki" />
      <ZCopyButton text="pnpm add shiki" />
    </ZFlex>
  </ZFlex>
</template>
