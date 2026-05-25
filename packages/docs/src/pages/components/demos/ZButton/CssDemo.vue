<script setup lang="ts">
import { ZButton, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="(g) => g.iem(0.75)" :wrap="(w) => w.wrap" :align="(a) => a.center">
    <!-- 圆形按钮 -->
    <ZButton
      :css="(s) => {
        s.width.iem(2.5)
        s.height.iem(2.5)
        s.borderRadius.pct(50)
        s.paddingLeft.px(0)
        s.paddingRight.px(0)
      }"
    >
      ⌘
    </ZButton>

    <!-- 渐变背景 -->
    <ZButton
      :css="(s) => {
        s.background('linear-gradient(135deg, #f43f5e, #f97316)')
        s.color.white
        s.borderColor.transparent
      }"
    >
      渐变背景
    </ZButton>

    <!-- 自定义 hover -->
    <ZButton
      variant="outlined"
      :css="(s) => {
        s._hover((h) => {
          h.transform('translateY(-2px)')
          h.boxShadow._middle
        })
      }"
    >
      hover 上浮
    </ZButton>
  </ZFlex>
</template>
