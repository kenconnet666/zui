<script setup lang="ts">
import { ZEllipsis, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex direction="column" :gap="(g) => g.iem(0.75)">
    <ZEllipsis :css="(s) => s.width.px(200)">
      单行截断（lines=1，默认），这段文字超过 200px 后显示省略号
    </ZEllipsis>
    <ZEllipsis :lines="2" :css="(s) => s.width.px(200)">
      多行截断 lines=2，这段话故意写得很长，确保能超过两行来验证多行省略的效果是否符合预期
    </ZEllipsis>
    <ZEllipsis :lines="3" :css="(s) => s.width.px(220)">
      多行截断 lines=3，段落可以有更多行，当文字内容超出设定的最大行数时，末尾会被省略号替代，整体布局保持稳定不溢出
    </ZEllipsis>
  </ZFlex>
</template>
