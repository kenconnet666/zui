<script setup lang="ts">
import { ZAlert, ZFlex, ZButton } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const visible = ref(true)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <ZAlert
      v-if="visible"
      :color="c => c._primary"
      title="可关闭的提示"
      description="点击右侧关闭按钮关闭此提示。"
      :closable="true"
      @close="visible = false"
    />
    <ZButton v-if="!visible" :size="0.875" variant="ghost" @click="visible = true"
      >重新显示</ZButton
    >
  </ZFlex>
</template>
