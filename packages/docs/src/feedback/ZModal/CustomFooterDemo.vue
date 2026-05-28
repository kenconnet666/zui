<script setup lang="ts">
import { ZModal, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const visible = ref(false)
const loading = ref(false)

async function submit() {
  loading.value = true
  await new Promise(r => setTimeout(r, 1200))
  loading.value = false
  visible.value = false
}
</script>

<template>
  <ZButton :size="0.875" :color="c => c._primary" @click="visible = true">提交订单</ZButton>

  <ZModal v-model:visible="visible" title="自定义底部" :width="32">
    <ZText>底部按钮带 loading 态,异步操作完成后自动关闭。</ZText>
    <template #foot>
      <ZFlex :justify="j => j.spaceBetween" :align="a => a.center">
        <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">需要管理员审核</ZText>
        <ZFlex :gap="g => g._small">
          <ZButton :size="0.875" variant="ghost" @click="visible = false">取消</ZButton>
          <ZButton :size="0.875" :loading="loading" @click="submit">提交</ZButton>
        </ZFlex>
      </ZFlex>
    </template>
  </ZModal>
</template>
