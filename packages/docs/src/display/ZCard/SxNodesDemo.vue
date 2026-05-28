<script setup lang="ts">
import { ZCard, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZCard
    title="多节点 sx 配置"
    :css="
      s => {
        s.width.iem(28)
      }
    "
    :sx-head="{
      css: s => {
        s.backgroundColor._bgMuted
        s.fontSize._middle
      },
    }"
    :sx-body="{
      css: s => {
        s.padding._large
        s.lineHeight._relaxed
      },
    }"
    :sx-foot="{
      css: s => {
        s.backgroundColor._bgMuted
        s.textAlign.right
      },
    }"
  >
    <ZText>
      通过 sxHead / sxBody / sxFoot 精细化覆盖三个节点的样式。 头部底色变浅、主体加大
      padding、底部右对齐 + 灰底。
    </ZText>

    <template #foot>
      <ZText>底部说明文字</ZText>
    </template>
  </ZCard>
</template>
