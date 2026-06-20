<script setup lang="ts">
import { ZMarquee, ZSpace, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g._middle" :css="s => s.width.pct(100)">
    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >向右滚动 + 慢速</ZText
    >
    <ZMarquee
      direction="right"
      :duration="20000"
      :css="
        s => {
          s.borderRadius._small
          s.backgroundColor._bgMuted
          s.padding.px(8)
        }
      "
    >
      <ZText>← 这是一段向右滚动的跑马灯文本,常用于公告、通知、滚动播报 →</ZText>
    </ZMarquee>

    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >悬停暂停(pauseOnHover)</ZText
    >
    <ZMarquee
      :duration="10000"
      :pause-on-hover="true"
      :css="
        s => {
          s.borderRadius._small
          s.backgroundColor._bgMuted
          s.padding.px(8)
        }
      "
    >
      <ZText>鼠标悬停在此可暂停滚动,移开继续</ZText>
    </ZMarquee>
  </ZSpace>
</template>
