<script setup lang="ts">
import { ZSpace, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g._middle">
    <ZText>align = center(默认,不同高度子项垂直居中)</ZText>
    <ZSpace :align="a => a.center" :size="g => g._small">
      <ZText
        :css="
          s => {
            s.padding.iem(0.5)
            s.backgroundColor._bgMuted
            s.borderRadius._small
          }
        "
        >矮</ZText
      >
      <ZText
        :css="
          s => {
            s.padding.iem(1.25)
            s.backgroundColor._bgMuted
            s.borderRadius._small
          }
        "
        >高一些</ZText
      >
      <ZText
        :css="
          s => {
            s.padding.iem(0.75)
            s.backgroundColor._bgMuted
            s.borderRadius._small
          }
        "
        >中</ZText
      >
    </ZSpace>

    <ZText>align = flex-start(顶部对齐)</ZText>
    <ZSpace :align="a => a.flexStart" :size="g => g._small">
      <ZText
        :css="
          s => {
            s.padding.iem(0.5)
            s.backgroundColor._bgMuted
            s.borderRadius._small
          }
        "
        >矮</ZText
      >
      <ZText
        :css="
          s => {
            s.padding.iem(1.25)
            s.backgroundColor._bgMuted
            s.borderRadius._small
          }
        "
        >高一些</ZText
      >
      <ZText
        :css="
          s => {
            s.padding.iem(0.75)
            s.backgroundColor._bgMuted
            s.borderRadius._small
          }
        "
        >中</ZText
      >
    </ZSpace>
  </ZSpace>
</template>
