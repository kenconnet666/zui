<script setup lang="ts">
import { ZModal, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const outer = ref(false)
const inner = ref(false)
</script>

<template>
  <ZButton :size="0.875" @click="outer = true">打开外层</ZButton>

  <ZModal v-model:visible="outer" title="外层 Modal">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>ESC 栈:连按两次 ESC,先关内层再关外层。</ZText>
      <ZButton :size="0.875" :color="c => c._primary" @click="inner = true">打开内层</ZButton>
    </ZFlex>
    <template #foot>
      <ZFlex :justify="j => j.flexEnd">
        <ZButton :size="0.875" @click="outer = false">关闭外层</ZButton>
      </ZFlex>
    </template>
  </ZModal>

  <ZModal v-model:visible="inner" title="内层 Modal" :width="24">
    <ZText>这是嵌套的内层弹窗,zIndex 自动叠加在外层之上。</ZText>
    <template #foot>
      <ZFlex :justify="j => j.flexEnd">
        <ZButton :size="0.875" @click="inner = false">关闭内层</ZButton>
      </ZFlex>
    </template>
  </ZModal>
</template>
