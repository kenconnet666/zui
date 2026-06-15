<script setup lang="ts">
import { ZCarousel, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const slides = [
  { label: '幻灯片 1', color: '#4f8ef7' },
  { label: '幻灯片 2', color: '#67c23a' },
  { label: '幻灯片 3', color: '#e6a23c' },
  { label: '幻灯片 4', color: '#f56c6c' },
]
const current = ref(0)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZCarousel
      v-model:current="current"
      :items="slides"
      :css="
        s => {
          s.height.px(192)
        }
      "
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

    <ZCarousel
      v-model:current="current"
      :items="slides"
      :autoplay="true"
      :interval="2000"
      :show-arrows="false"
      :css="
        s => {
          s.height.px(128)
        }
      "
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
            }
          "
        >
          {{ item.label }}（自动播放，无箭头）
        </ZFlex>
      </template>
    </ZCarousel>
  </ZFlex>
</template>
