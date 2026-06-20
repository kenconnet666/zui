<script setup lang="ts">
import { ZPopconfirm, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const result = ref('')
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :gap="g => g._small" :wrap="w => w.wrap">
      <!-- 只有 title -->
      <ZPopconfirm
        title="确认此操作？"
        @confirm="result = '已确认（仅标题）'"
        @cancel="result = '已取消'"
      >
        <ZButton :size="0.875" variant="outlined">仅 title</ZButton>
      </ZPopconfirm>

      <!-- title + description -->
      <ZPopconfirm
        title="确认删除账号？"
        description="删除后所有数据将被永久清除，且无法恢复。请确认此操作。"
        @confirm="result = '已确认（title + description）'"
        @cancel="result = '已取消'"
      >
        <ZButton :size="0.875" :color="c => c._danger">title + description</ZButton>
      </ZPopconfirm>

      <!-- 长描述折行 -->
      <ZPopconfirm
        title="清空购物车"
        description="将清除购物车内全部 12 件商品，清空后无法通过撤销恢复，确认继续？"
        :max-width="18"
        @confirm="result = '已清空购物车'"
        @cancel="result = '已取消'"
      >
        <ZButton :size="0.875">长描述折行</ZButton>
      </ZPopconfirm>
    </ZFlex>

    <ZText
      v-if="result"
      :css="s => { s.color._textSecondary; s.fontSize._small }"
    >操作结果：{{ result }}</ZText>
  </ZFlex>
</template>
