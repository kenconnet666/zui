<script setup lang="ts">
import { ZModal, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <ZButton :size="0.875" @click="visible = true">打开 (不可点击遮罩关闭)</ZButton>

  <ZModal
    v-model:visible="visible"
    title="重要确认"
    :mask-closable="false"
    :closable="true"
  >
    <ZText>点击遮罩不会关闭,只能点击右上 × 或底部按钮 / 按 ESC 关闭。</ZText>
    <template #foot>
      <ZFlex :justify="j => j.flexEnd" :gap="g => g._small">
        <ZButton :size="0.875" @click="visible = false">我知道了</ZButton>
      </ZFlex>
    </template>
  </ZModal>
</template>
