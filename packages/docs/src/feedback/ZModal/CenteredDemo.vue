<script setup lang="ts">
import { ZModal, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/** 垂直居中弹窗 */
const centeredVisible = ref(false)
/** 顶部对齐弹窗（centered=false） */
const topVisible = ref(false)
</script>

<template>
  <ZFlex :gap="g => g._small" :wrap="w => w.wrap">
    <ZButton :size="0.875" @click="centeredVisible = true">垂直居中（默认）</ZButton>
    <ZButton :size="0.875" variant="ghost" @click="topVisible = true">顶部对齐（centered=false）</ZButton>
  </ZFlex>

  <!-- centered=true（默认）：dialog 垂直居中于视口 -->
  <ZModal v-model:visible="centeredVisible" title="垂直居中" :centered="true">
    <ZText>默认 <strong>centered=true</strong>，对话框垂直居中于视口。</ZText>
    <template #foot>
      <ZFlex :justify="j => j.flexEnd">
        <ZButton :size="0.875" @click="centeredVisible = false">关闭</ZButton>
      </ZFlex>
    </template>
  </ZModal>

  <!-- centered=false：dialog 顶部对齐，marginTop 走 _huge token -->
  <ZModal v-model:visible="topVisible" title="顶部对齐" :centered="false">
    <ZText>设置 <strong>centered=false</strong> 后，对话框顶部对齐（marginTop 走 _huge spacing token）。</ZText>
    <template #foot>
      <ZFlex :justify="j => j.flexEnd">
        <ZButton :size="0.875" @click="topVisible = false">关闭</ZButton>
      </ZFlex>
    </template>
  </ZModal>
</template>
