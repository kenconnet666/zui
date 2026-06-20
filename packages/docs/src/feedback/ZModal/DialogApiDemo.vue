<script setup lang="ts">
import { ref } from 'vue'
import { ZButton, ZFlex, ZText, createDialogApi } from '@kenconnet666/zui-vue'

// 通常在 app 入口创建一次,这里就近演示
const dialog = createDialogApi()
const result = ref('')

async function onConfirm(): Promise<void> {
  const ok = await dialog.confirm({
    title: '删除确认',
    content: '确定要删除这条记录吗?此操作不可恢复。',
    okText: '删除',
  })
  result.value = ok ? '已确认删除' : '已取消'
}
async function onInfo(): Promise<void> {
  await dialog.info({ title: '提示', content: '这是一条信息提示,只有"确定"按钮。' })
  result.value = 'info 已关闭'
}
async function onSuccess(): Promise<void> {
  await dialog.success({ title: '操作成功', content: '数据已成功保存。' })
  result.value = 'success 已关闭'
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g.px(12)">
    <ZFlex :gap="g => g.px(8)" :wrap="w => w.wrap">
      <ZButton :color="c => c._danger" @click="onConfirm">confirm 删除</ZButton>
      <ZButton variant="outlined" @click="onInfo">info 提示</ZButton>
      <ZButton variant="outlined" :color="c => c._success" @click="onSuccess">success</ZButton>
    </ZFlex>
    <ZText :color="c => c._textTertiary">结果:{{ result || '(等待操作)' }}</ZText>
  </ZFlex>
</template>
