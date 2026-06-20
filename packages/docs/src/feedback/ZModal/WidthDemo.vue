<script setup lang="ts">
import { ZModal, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const visible20 = ref(false)
const visible30 = ref(false)
const visible40 = ref(false)
const visible50 = ref(false)
</script>

<!--
  WidthDemo：展示 ZModal width prop（px 倍数，1 单位 = 16px）差异。
  - 20 = 320px（小窗）
  - 30 = 480px（默认）
  - 40 = 640px（中大）
  - 50 = 800px（大窗）
-->
<template>
  <ZFlex :gap="g => g._small" :wrap="w => w.wrap">
    <ZButton :size="0.875" variant="outlined" @click="visible20 = true">
      width=20 (320px)
    </ZButton>
    <ZButton :size="0.875" variant="outlined" @click="visible30 = true">
      width=30 (480px，默认)
    </ZButton>
    <ZButton :size="0.875" variant="outlined" @click="visible40 = true">
      width=40 (640px)
    </ZButton>
    <ZButton :size="0.875" variant="outlined" @click="visible50 = true">
      width=50 (800px)
    </ZButton>
  </ZFlex>

  <ZModal v-model:visible="visible20" title="小窗 (width=20, 320px)" :width="20">
    <ZText>宽度 20 × 16 = 320px，适合简单确认对话框。</ZText>
    <template #foot>
      <ZFlex :justify="j => j.flexEnd">
        <ZButton :size="0.875" @click="visible20 = false">确定</ZButton>
      </ZFlex>
    </template>
  </ZModal>

  <ZModal v-model:visible="visible30" title="默认 (width=30, 480px)" :width="30">
    <ZText>默认宽度 30 × 16 = 480px。</ZText>
    <template #foot>
      <ZFlex :justify="j => j.flexEnd">
        <ZButton :size="0.875" @click="visible30 = false">确定</ZButton>
      </ZFlex>
    </template>
  </ZModal>

  <ZModal v-model:visible="visible40" title="中大 (width=40, 640px)" :width="40">
    <ZText>宽度 40 × 16 = 640px，适合表单或较多内容的对话框。</ZText>
    <template #foot>
      <ZFlex :justify="j => j.flexEnd">
        <ZButton :size="0.875" @click="visible40 = false">确定</ZButton>
      </ZFlex>
    </template>
  </ZModal>

  <ZModal v-model:visible="visible50" title="大窗 (width=50, 800px)" :width="50">
    <ZText>宽度 50 × 16 = 800px，适合复杂内容或详情展示。</ZText>
    <template #foot>
      <ZFlex :justify="j => j.flexEnd">
        <ZButton :size="0.875" @click="visible50 = false">确定</ZButton>
      </ZFlex>
    </template>
  </ZModal>
</template>
