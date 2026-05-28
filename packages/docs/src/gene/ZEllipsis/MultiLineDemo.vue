<script setup lang="ts">
import { ZEllipsis, ZSpace, ZText } from '@kenconnet666/zui-vue'

const long =
  '这是一段很长的文本内容,用于演示 ZEllipsis 在不同 lines 设置下的多行截断效果。超出指定行数后,尾部会以省略号收束,常用于卡片摘要、列表副标题等需要限制高度的场景。'
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g._middle" :css="s => s.width.iem(20)">
    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >lines = 1(单行)</ZText
    >
    <ZEllipsis :lines="1">{{ long }}</ZEllipsis>

    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >lines = 2</ZText
    >
    <ZEllipsis :lines="2">{{ long }}</ZEllipsis>

    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >lines = 3</ZText
    >
    <ZEllipsis :lines="3">{{ long }}</ZEllipsis>
  </ZSpace>
</template>
