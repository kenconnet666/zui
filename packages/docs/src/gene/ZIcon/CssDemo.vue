<script setup lang="ts">
import { ZFlex, ZIcon } from '@kenconnet666/zui-vue'
import { StarBorderOutlined as StarOutline } from '@vicons/material'
</script>

<template>
  <ZFlex :gap="g => g.iem(1.5)" :wrap="w => w.wrap" :align="a => a.center">
    <!-- 圆形边框 -->
    <ZFlex :direction="d => d.column" :gap="g => g.iem(0.5)" :align="a => a.center">
      <ZIcon
        :component="StarOutline"
        :size="1.5"
        :css="
          s => {
            s.padding.iem(0.25)
            s.border('2px solid currentColor')
            s.borderRadius.pct(50)
            s.color._primary
          }
        "
      />
      <code style="font-size: 11px">圆形边框</code>
    </ZFlex>
    <!-- hover 高亮 -->
    <ZFlex :direction="d => d.column" :gap="g => g.iem(0.5)" :align="a => a.center">
      <ZIcon
        :component="StarOutline"
        :size="1.5"
        :css="
          s => {
            s.cursor('pointer')
            s._hover(h => {
              h.color._primary
            })
          }
        "
      />
      <code style="font-size: 11px">hover 高亮</code>
    </ZFlex>
    <!-- 非正方形 -->
    <ZFlex :direction="d => d.column" :gap="g => g.iem(0.5)" :align="a => a.center">
      <ZIcon
        :component="StarOutline"
        :css="
          s => {
            s.width.px(24)
            s.height.px(40)
          }
        "
      />
      <code style="font-size: 11px">24×40 非正方形</code>
    </ZFlex>
  </ZFlex>
</template>
