<script setup lang="ts">
import { ZModal, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const visible1 = ref(false)
const visible2 = ref(false)
</script>

<template>
  <ZFlex :gap="g => g._small" :wrap="w => w.wrap">
    <ZButton :size="0.875" @click="visible1 = true">打开对话框</ZButton>
    <ZButton :size="0.875" variant="ghost" @click="visible2 = true">宽度 / 自定义底部</ZButton>
  </ZFlex>

  <ZModal v-model:visible="visible1" title="基础对话框">
    <ZText>这是对话框的内容区域，可以放置任意内容。</ZText>
    <template #foot>
      <ZFlex :justify="j => j.flexEnd" :gap="g => g._small">
        <ZButton :size="0.875" variant="ghost" @click="visible1 = false">取消</ZButton>
        <ZButton :size="0.875" @click="visible1 = false">确定</ZButton>
      </ZFlex>
    </template>
  </ZModal>

  <ZModal v-model:visible="visible2" title="自定义宽度" :width="40">
    <ZText>这个对话框宽度为 40iem（约 640px）。</ZText>
    <template #foot>
      <ZFlex :justify="j => j.flexEnd" :gap="g => g._small">
        <ZButton :size="0.875" :color="c => c._danger" @click="visible2 = false">删除</ZButton>
        <ZButton :size="0.875" variant="ghost" @click="visible2 = false">取消</ZButton>
      </ZFlex>
    </template>
  </ZModal>
</template>
