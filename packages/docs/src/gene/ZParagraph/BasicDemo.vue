<script setup lang="ts">
import { ZParagraph, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <div>
    <ZParagraph>
      第一段落：默认行高 1.5，段间距由 <ZText mono>spacing._middle</ZText> token 控制，
      随 ZBox iem 基准同步缩放。段落文字可以很长，行高让阅读更舒适。
    </ZParagraph>
    <ZParagraph>
      第二段落：段间距自动插入，无需手动写 margin。
      使用 <ZText :color="(c) => c._primary" :underlineOnHover="true">ZText 行内元素</ZText>
      与段落组合，不影响段间距节奏。
    </ZParagraph>
    <ZParagraph :css="(s) => s.marginBottom.px(0)">
      最后一段落（css 移除段底间距）。
    </ZParagraph>
  </div>
</template>
