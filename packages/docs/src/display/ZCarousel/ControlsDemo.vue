<script setup lang="ts">
/**
 * ZCarousel — 控件开关演示。
 * 对比 showDots / showArrows 两个 boolean prop 的效果。
 */
import { ZCarousel, ZFlex, ZText } from '@kenconnet666/zui-vue'

const slides = [
  { label: '幻灯片 1', color: '#4f8ef7' },
  { label: '幻灯片 2', color: '#67c23a' },
  { label: '幻灯片 3', color: '#e6a23c' },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g.px(24)">
    <ZFlex :direction="d => d.column" :gap="g => g.px(8)">
      <ZText
        :css="
          s => {
            s.fontWeight._medium
          }
        "
      >
        隐藏指示点（:show-dots="false"）
      </ZText>
      <ZCarousel
        :items="slides"
        :show-dots="false"
        :css="s => { s.height.px(140) }"
      >
        <template #default="{ item }">
          <ZFlex
            :align="a => a.center"
            :justify="j => j.center"
            :css="
              s => {
                s.height.pct(100)
                s.backgroundColor(item.color)
                s.color.white
                s.fontSize._large
              }
            "
          >
            {{ item.label }}
          </ZFlex>
        </template>
      </ZCarousel>
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g.px(8)">
      <ZText
        :css="
          s => {
            s.fontWeight._medium
          }
        "
      >
        隐藏箭头（:show-arrows="false"）
      </ZText>
      <ZCarousel
        :items="slides"
        :show-arrows="false"
        :css="s => { s.height.px(140) }"
      >
        <template #default="{ item }">
          <ZFlex
            :align="a => a.center"
            :justify="j => j.center"
            :css="
              s => {
                s.height.pct(100)
                s.backgroundColor(item.color)
                s.color.white
                s.fontSize._large
              }
            "
          >
            {{ item.label }}
          </ZFlex>
        </template>
      </ZCarousel>
    </ZFlex>
  </ZFlex>
</template>
