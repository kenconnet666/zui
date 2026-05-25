<script setup lang="ts">
import { ZAffix, ZFlex, ZText, ZTag } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small">
    <ZText>ZAffix 在可滚动容器内：向下滚动后工具栏吸顶</ZText>

    <!-- 用有限高度容器模拟页面滚动 -->
    <div
      ref="containerRef"
      :style="{ position: 'relative', height: '240px', overflow: 'auto', border: '1px solid var(--zui-color-border)', borderRadius: '4px' }"
    >
      <ZAffix :offsetTop="0" :target="() => containerRef!">
        <ZFlex
          :align="a => a.center"
          :gap="g => g._small"
          :css="s => { s.padding.iem(0.5); s.backgroundColor._bg; s.borderBottomWidth.px(1); s.borderBottomStyle.solid; s.borderBottomColor._border }"
        >
          <ZTag>吸顶工具栏</ZTag>
          <ZTag>向下滚动查看效果</ZTag>
        </ZFlex>
      </ZAffix>

      <ZFlex
        :direction="d => d.column"
        :gap="g => g._small"
        :css="s => s.padding.iem(0.75)"
      >
        <ZText v-for="n in 20" :key="n">内容行 {{ n }} —— 工具栏固定在容器顶部</ZText>
      </ZFlex>
    </div>
  </ZFlex>
</template>
