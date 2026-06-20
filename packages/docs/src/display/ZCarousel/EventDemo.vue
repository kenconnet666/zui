<script setup lang="ts">
/**
 * ZCarousel — change 事件演示。
 * 监听 @change 回显当前切换到的索引。
 */
import { ZCarousel, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const slides = [
  { label: '幻灯片 A', color: '#7c3aed' },
  { label: '幻灯片 B', color: '#0891b2' },
  { label: '幻灯片 C', color: '#d97706' },
]

const cur = ref(0)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g.px(16)">
    <ZCarousel
      :items="slides"
      :css="s => { s.height.px(160) }"
      @change="i => (cur = i)"
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

    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
    >
      当前索引（change 事件）：{{ cur }}
    </ZText>
  </ZFlex>
</template>
