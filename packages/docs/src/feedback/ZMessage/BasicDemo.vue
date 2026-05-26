<script setup lang="ts">
import { ZButton, ZFlex } from '@kenconnet666/zui-vue'
import { createMessageApi } from '@kenconnet666/zui-vue'

const msg = createMessageApi()

function showInfo()    { msg.info('这是一条普通消息') }
function showSuccess() { msg.success('操作成功！数据已保存。') }
function showWarning() { msg.warning('注意：当前操作不可撤销。') }
function showError()   { msg.error('请求失败，请检查网络连接。') }
function showLoading() {
  const id = msg.loading('正在处理中...')
  setTimeout(() => {
    msg.close(id)
    msg.success('处理完成！')
  }, 2000)
}
</script>

<template>
  <ZFlex :gap="g => g._small" :wrap="w => w.wrap">
    <ZButton :size="0.875" @click="showInfo">Info</ZButton>
    <ZButton :size="0.875" :color="c => c._success" @click="showSuccess">Success</ZButton>
    <ZButton :size="0.875" :color="c => c._warning" @click="showWarning">Warning</ZButton>
    <ZButton :size="0.875" :color="c => c._danger" @click="showError">Error</ZButton>
    <ZButton :size="0.875" :color="c => c._primary" @click="showLoading">Loading → Success</ZButton>
  </ZFlex>
</template>
