<script setup lang="ts">
import { ZAffix, ZFlex, ZText, ZTag } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small">
    <ZText>offsetTop = 12:吸顶时与容器顶部保留 12px 间距</ZText>
    <div
      ref="containerRef"
      :style="{ position: 'relative', height: '220px', overflow: 'auto', border: '1px solid var(--zui-color-border)', borderRadius: '4px' }"
    >
      <ZAffix :offset-top="12" :target="() => containerRef!">
        <ZFlex
          :align="a => a.center"
          :gap="g => g._small"
          :css="s => { s.padding.iem(0.5); s.backgroundColor._primary.alpha(12); s.borderRadius._small }"
        >
          <ZTag>带间距吸顶</ZTag>
        </ZFlex>
      </ZAffix>
      <ZFlex :direction="d => d.column" :gap="g => g._small" :css="s => s.padding.iem(0.75)">
        <ZText v-for="n in 18" :key="n">内容行 {{ n }}</ZText>
      </ZFlex>
    </div>
  </ZFlex>
</template>
