<script setup lang="ts">
import { ZText, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="(g) => g.iem(0.5)">
    <ZText italic>斜体文本 italic</ZText>
    <ZText :underline="true">始终下划线 underline</ZText>
    <ZText :underlineOnHover="true">悬停下划线 underlineOnHover（试试 hover）</ZText>
    <ZText :strikethrough="true">删除线 strikethrough</ZText>
    <ZText :mono="true">等宽字体 mono: console.log('hello')</ZText>
    <ZText :ellipsis="true" :css="(s) => s.width.px(160)">
      单行省略 ellipsis，这段文字超出 160px 后截断
    </ZText>
    <ZText :ellipsis="2" :css="(s) => s.width.px(200)">
      多行省略 ellipsis=2，超出两行后截断，这段话足够长可以验证效果是否正确
    </ZText>
  </ZFlex>
</template>
