<script setup lang="ts">
import { ZDrawer, ZButton, ZFlex, ZText, ZTag } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/** 是否显示抽屉 */
const visible = ref(false)
</script>

<template>
  <ZButton :size="0.875" @click="visible = true">自定义头部 (#head slot)</ZButton>

  <!-- #head slot 完全替换默认标题区域，closable 仍保留关闭按钮 -->
  <ZDrawer v-model:visible="visible" :closable="true">
    <template #head>
      <ZFlex :align="a => a.center" :gap="g => g._small">
        <span>用户详情</span>
        <ZTag :size="0.75">管理员</ZTag>
      </ZFlex>
    </template>

    <ZText>在 <strong>#head</strong> slot 中可以放置任意内容：带状态标签、图标、操作按钮等。</ZText>
    <ZText>右上角关闭按钮由 <strong>closable</strong> prop 控制，与 #head slot 共存。</ZText>
  </ZDrawer>
</template>
