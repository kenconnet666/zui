<script setup lang="ts">
import { ZModal, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/** 是否显示对话框 */
const visible = ref(false)
</script>

<template>
  <ZFlex :gap="g => g._small" :wrap="w => w.wrap">
    <ZButton :size="0.875" @click="visible = true">sx 深度定制对话框</ZButton>
  </ZFlex>

  <!--
    sxMask:   遮罩背景加深
    sxDialog: 对话框容器加圆角 + 边框
    sxHead:   头部背景色区分
    sxBody:   正文内边距加大
    sxFoot:   底栏背景色区分
  -->
  <ZModal
    v-model:visible="visible"
    title="sx 定制样式"
    :sx-mask="{ style: { backgroundColor: 'rgba(0,0,0,0.65)' } }"
    :sx-dialog="{ style: { borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)' } }"
    :sx-head="{ style: { background: 'linear-gradient(90deg,#4e6ef2,#7b5ea7)', color: '#fff' } }"
    :sx-body="{ style: { padding: '32px' } }"
    :sx-foot="{ style: { background: 'rgba(0,0,0,0.03)' } }"
  >
    <ZFlex :direction="d => d.column" :gap="g => g._middle">
      <ZText>sxMask — 遮罩透明度加深到 65%</ZText>
      <ZText>sxDialog — 圆角增大到 16px + 外边框</ZText>
      <ZText>sxHead — 头部替换为渐变背景 + 白字</ZText>
      <ZText>sxBody — 正文内边距扩大至 32px</ZText>
      <ZText>sxFoot — 底栏添加浅灰底色</ZText>
    </ZFlex>
    <template #foot>
      <ZFlex :justify="j => j.flexEnd" :gap="g => g._small">
        <ZButton :size="0.875" variant="ghost" @click="visible = false">取消</ZButton>
        <ZButton :size="0.875" @click="visible = false">确定</ZButton>
      </ZFlex>
    </template>
  </ZModal>
</template>
