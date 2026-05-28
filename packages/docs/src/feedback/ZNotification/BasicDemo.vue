<script setup lang="ts">
import { ZButton, ZFlex } from '@kenconnet666/zui-vue'
import { createNotificationApi } from '@kenconnet666/zui-vue'

const notify = createNotificationApi()

function showInfo() {
  notify.info('普通通知', '这是详细描述信息，可以多行显示。')
}
function showSuccess() {
  notify.success('操作成功', '数据已成功保存到服务器。')
}
function showWarning() {
  notify.warning('注意', '当前操作不可撤销，请确认后继续。')
}
function showError() {
  notify.error('请求失败', '网络连接超时，请检查网络后重试。')
}
function showLoading() {
  const id = notify.loading('处理中', '正在上传文件，请稍候...')
  setTimeout(() => {
    notify.close(id)
    notify.success('上传完成', '文件已成功上传。')
  }, 2000)
}
function showNoDesc() {
  notify.info('无描述通知')
}
</script>

<template>
  <ZFlex :gap="g => g._small" :wrap="w => w.wrap">
    <ZButton :size="0.875" @click="showInfo">Info</ZButton>
    <ZButton :size="0.875" :color="c => c._success" @click="showSuccess">Success</ZButton>
    <ZButton :size="0.875" :color="c => c._warning" @click="showWarning">Warning</ZButton>
    <ZButton :size="0.875" :color="c => c._danger" @click="showError">Error</ZButton>
    <ZButton :size="0.875" :color="c => c._primary" @click="showLoading">Loading → Success</ZButton>
    <ZButton :size="0.875" variant="ghost" @click="showNoDesc">无描述</ZButton>
  </ZFlex>
</template>
