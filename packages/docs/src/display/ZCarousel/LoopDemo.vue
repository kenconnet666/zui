<script setup lang="ts">
/**
 * ZCarousel — 非循环 + 手动控制演示。
 * :loop="false" 到首尾不再跳转；配合 v-model:current 和 ZButton 手动翻页。
 */
import { ZCarousel, ZFlex, ZButton, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const slides = [
  { label: '第 1 张', color: '#4f8ef7' },
  { label: '第 2 张', color: '#67c23a' },
  { label: '第 3 张', color: '#e6a23c' },
  { label: '第 4 张', color: '#f56c6c' },
]

const current = ref(0)

function prev(): void {
  if (current.value > 0) current.value--
}
function next(): void {
  if (current.value < slides.length - 1) current.value++
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g.px(16)">
    <ZCarousel
      v-model:current="current"
      :items="slides"
      :loop="false"
      :show-arrows="false"
      :css="s => { s.height.px(160) }"
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

    <ZFlex :gap="g => g.px(12)" :align="a => a.center">
      <ZButton variant="outlined" :disabled="current === 0" @click="prev">上一张</ZButton>
      <ZText
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
      >
        {{ current + 1 }} / {{ slides.length }}
      </ZText>
      <ZButton variant="outlined" :disabled="current === slides.length - 1" @click="next">下一张</ZButton>
    </ZFlex>
  </ZFlex>
</template>
