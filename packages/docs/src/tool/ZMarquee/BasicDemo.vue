<script setup lang="ts">
import { ZMarquee, ZFlex, ZTag, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <ZText>向左滚动（默认，hover 暂停）：</ZText>
    <ZMarquee
      :css="
        s => {
          s.borderWidth.px(1)
          s.borderStyle.solid
          s.borderColor._border
          s.borderRadius._small
          s.padding.px(8)
        }
      "
    >
      <ZFlex :gap="g => g._large" :inline="true">
        <ZTag
          v-for="item in [
            'Vue 3',
            'TypeScript',
            'CSS-in-JS',
            'CSS-in-JS 样式',
            'Chain API',
            'ZBox Provider',
            'Material 风格',
            '响应式主题',
          ]"
          :key="item"
          >{{ item }}</ZTag
        >
      </ZFlex>
    </ZMarquee>

    <ZText>向右滚动：</ZText>
    <ZMarquee
      direction="right"
      :css="
        s => {
          s.borderWidth.px(1)
          s.borderStyle.solid
          s.borderColor._border
          s.borderRadius._small
          s.padding.px(8)
        }
      "
    >
      <ZFlex :gap="g => g._large" :inline="true">
        <ZTag
          v-for="item in ['组件库', '设计系统', '无障碍', '暗色主题', '按需加载']"
          :key="item"
          :color="c => c._primary"
          >{{ item }}</ZTag
        >
      </ZFlex>
    </ZMarquee>

    <ZText>自定义速度（duration=5000ms）：</ZText>
    <ZMarquee
      :duration="5000"
      :css="
        s => {
          s.borderWidth.px(1)
          s.borderStyle.solid
          s.borderColor._border
          s.borderRadius._small
          s.padding.px(8)
        }
      "
    >
      <ZFlex :gap="g => g._large" :inline="true">
        <ZText v-for="n in 6" :key="n" :css="s => s.color._primary">⭐ 快速滚动示例 {{ n }}</ZText>
      </ZFlex>
    </ZMarquee>
  </ZFlex>
</template>
