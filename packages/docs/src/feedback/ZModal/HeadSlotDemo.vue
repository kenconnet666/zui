<script setup lang="ts">
import { ZModal, ZButton, ZFlex, ZText, ZTag } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/** #head slot 示例 */
const headVisible = ref(false)
/** #closeIcon slot 示例 */
const closeIconVisible = ref(false)
</script>

<template>
  <ZFlex :gap="g => g._small" :wrap="w => w.wrap">
    <ZButton :size="0.875" @click="headVisible = true">#head slot 自定义标题</ZButton>
    <ZButton :size="0.875" variant="ghost" @click="closeIconVisible = true">#closeIcon slot 自定义图标</ZButton>
  </ZFlex>

  <!-- #head slot：完全替换标题文字，closable 关闭按钮仍生效 -->
  <ZModal v-model:visible="headVisible" :closable="true">
    <template #head>
      <ZFlex :align="a => a.center" :gap="g => g._small">
        <span>订单详情</span>
        <ZTag :size="0.75">处理中</ZTag>
      </ZFlex>
    </template>
    <ZText><strong>#head</strong> slot 完全替换默认标题，可放徽标、状态标签、子标题等。</ZText>
    <ZText>关闭按钮由 <strong>closable</strong> prop 控制，两者不冲突。</ZText>
    <template #foot>
      <ZFlex :justify="j => j.flexEnd">
        <ZButton :size="0.875" @click="headVisible = false">关闭</ZButton>
      </ZFlex>
    </template>
  </ZModal>

  <!-- #closeIcon slot：替换默认 × 图标，头部标题保留 title prop -->
  <ZModal v-model:visible="closeIconVisible" title="自定义关闭图标" :closable="true">
    <template #closeIcon>
      <!-- 用文字"✕"替代默认 SVG 图标 -->
      <span style="font-size: 14px; line-height: 1; font-weight: bold;">✕</span>
    </template>
    <ZText><strong>#closeIcon</strong> slot 只替换关闭按钮内部的图标，按钮外壳不变。</ZText>
    <template #foot>
      <ZFlex :justify="j => j.flexEnd">
        <ZButton :size="0.875" @click="closeIconVisible = false">关闭</ZButton>
      </ZFlex>
    </template>
  </ZModal>
</template>
