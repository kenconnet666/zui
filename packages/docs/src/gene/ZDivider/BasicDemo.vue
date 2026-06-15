<script setup lang="ts">
import { ZDivider, ZParagraph } from '@kenconnet666/zui-vue'
</script>

<template>
  <div>
    <ZParagraph :css="s => s.marginBottom.px(0)">上方段落</ZParagraph>
    <ZDivider
      :css="
        s => {
          s.marginTop.px(12)
          s.marginBottom.px(12)
        }
      "
    />
    <ZParagraph :css="s => s.marginBottom.px(0)">下方段落</ZParagraph>
    <ZDivider
      :dashed="true"
      :css="
        s => {
          s.marginTop.px(12)
          s.marginBottom.px(12)
        }
      "
    />
    <ZParagraph :css="s => s.marginBottom.px(0)">虚线分隔</ZParagraph>
    <ZDivider
      :color="c => c._primary"
      thickness="2px"
      :css="
        s => {
          s.marginTop.px(12)
          s.marginBottom.px(12)
        }
      "
    />
    <ZParagraph :css="s => s.marginBottom.px(0)"
      >primary 色 thickness=0.125iem（≈2px）实线</ZParagraph
    >
  </div>
</template>
