<script setup lang="ts">
import { ZDrawer, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/** 是否显示抽屉 */
const visible = ref(false)
</script>

<template>
  <ZButton :size="0.875" @click="visible = true">sx 定制抽屉样式</ZButton>

  <!--
    sxMask:   遮罩背景加深
    sxDrawer: 抽屉容器增加圆角（左侧两角）
    sxHead:   头部背景色区分
    sxBody:   正文内边距加大
    sxFoot:   底栏背景色区分
  -->
  <ZDrawer
    v-model:visible="visible"
    title="sx 深度定制"
    :size="22"
    :sx-mask="{ style: { backgroundColor: 'rgba(0,0,0,0.6)' } }"
    :sx-drawer="{ style: { borderRadius: '12px 0 0 12px' } }"
    :sx-head="{ style: { background: 'var(--zui-color-primary, #4e6ef2)', color: '#fff' } }"
    :sx-body="{ style: { padding: '32px' } }"
    :sx-foot="{ style: { background: 'rgba(0,0,0,0.04)' } }"
  >
    <ZFlex :direction="d => d.column" :gap="g => g._middle">
      <ZText>sxMask — 遮罩透明度加深到 60%</ZText>
      <ZText>sxDrawer — 抽屉左侧两个角变为圆角</ZText>
      <ZText>sxHead — 头部改为主题色背景+白字</ZText>
      <ZText>sxBody — 正文内边距扩大至 32px</ZText>
      <ZText>sxFoot — 底栏添加浅灰底色</ZText>
    </ZFlex>

    <template #foot>
      <ZFlex :justify="j => j.flexEnd" :gap="g => g._small">
        <ZButton :size="0.875" variant="ghost" @click="visible = false">取消</ZButton>
        <ZButton :size="0.875" @click="visible = false">确定</ZButton>
      </ZFlex>
    </template>
  </ZDrawer>
</template>
