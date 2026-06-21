<script setup lang="ts">
import { ref } from 'vue'
import { ZCheckbox, ZFlex, ZText } from '@kenconnet666/zui-vue'

const selectAll = ref(false)
const row1 = ref(false)
const row2 = ref(false)
const row3 = ref(false)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small">
    <!-- 仅 checkbox、无可见文字标签 —— 用 ariaLabel 提供屏幕阅读器语义 -->
    <ZFlex :gap="g => g._middle" :align="a => a.center">
      <ZCheckbox v-model:checked="selectAll" aria-label="全选" />
      <ZText :css="s => { s.color._textSecondary }">全选（无可见 label，靠 ariaLabel）</ZText>
    </ZFlex>

    <ZFlex :gap="g => g._middle" :align="a => a.center">
      <ZCheckbox v-model:checked="row1" aria-label="选择第 1 行" />
      <ZText>行 1：Vue 3</ZText>
    </ZFlex>

    <ZFlex :gap="g => g._middle" :align="a => a.center">
      <ZCheckbox v-model:checked="row2" aria-label="选择第 2 行" />
      <ZText>行 2：React</ZText>
    </ZFlex>

    <ZFlex :gap="g => g._middle" :align="a => a.center">
      <ZCheckbox v-model:checked="row3" aria-label="选择第 3 行" />
      <ZText>行 3：Svelte</ZText>
    </ZFlex>

    <ZText
      :css="s => {
        s.color._textSecondary
        s.fontSize._small
      }"
    >
      ariaLabel 透传到隐藏 &lt;input&gt; 的 aria-label，无可见 label 时（如表格行）给屏幕阅读器提供语义。
    </ZText>
  </ZFlex>
</template>
