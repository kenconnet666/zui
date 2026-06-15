<script setup lang="ts">
import { ZCard, ZFlex, ZText, ZButton, ZTag } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._large" :wrap="w => w.wrap" :align="a => a.flexStart">
    <ZCard
      title="基础卡片"
      :css="
        s => {
          s.width.px(256)
        }
      "
    >
      <ZText>卡片内容区域，可以放置任意内容。</ZText>
    </ZCard>

    <ZCard
      title="带操作的卡片"
      :css="
        s => {
          s.width.px(256)
        }
      "
    >
      <template #extra>
        <ZTag :color="c => c._primary">更多</ZTag>
      </template>
      <ZText>头部右侧可以放置操作按钮或标签。</ZText>
    </ZCard>

    <ZCard
      title="带底部"
      :css="
        s => {
          s.width.px(256)
        }
      "
    >
      <ZText>卡片正文内容。</ZText>
      <template #foot>
        <ZFlex :gap="g => g._small" :justify="j => j.flexEnd">
          <ZButton :size="0.875" variant="ghost">取消</ZButton>
          <ZButton :size="0.875">确认</ZButton>
        </ZFlex>
      </template>
    </ZCard>

    <ZCard
      title="悬停阴影"
      :bordered="false"
      :hoverable="true"
      :css="
        s => {
          s.width.px(256)
        }
      "
    >
      <ZText>无边框 + 悬停加深阴影效果。</ZText>
    </ZCard>
  </ZFlex>
</template>
