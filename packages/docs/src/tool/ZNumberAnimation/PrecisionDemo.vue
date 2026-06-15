<script setup lang="ts">
import { ref } from 'vue'
import { ZNumberAnimation, ZSpace, ZText, ZButton } from '@kenconnet666/zui-vue'

const to = ref(12345.67)

function reroll() {
  to.value = Math.round(Math.random() * 1_000_000) / 100
}
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g._middle">
    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >precision = 2 + 千分位分隔符</ZText
    >
    <ZNumberAnimation
      :to="to"
      :precision="2"
      separator=","
      :duration="1200"
      :css="
        s => {
          s.fontSize.px(32)
          s.fontWeight._bold
          s.color._primary
        }
      "
    />
    <ZButton :size="0.875" variant="ghost" @click="reroll">随机一个新数值</ZButton>
  </ZSpace>
</template>
