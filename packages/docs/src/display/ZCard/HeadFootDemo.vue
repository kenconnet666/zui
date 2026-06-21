<script setup lang="ts">
import { ZCard, ZSpace, ZButton, ZTag, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZCard
    title="文章标题"
    :css="
      s => {
        s.width.px(384)
      }
    "
  >
    <template #extra>
      <ZTag :color="c => c._info">置顶</ZTag>
    </template>

    <ZText>这里是文章正文,可放置任意内容。Card 头部 + 主体 + 底部三段式结构按需渲染。</ZText>

    <template #foot>
      <ZSpace
        :size="g => g._small"
        :css="
          s => {
            s.justifyContent.flexEnd
          }
        "
      >
        <ZButton variant="ghost" :size="0.875">忽略</ZButton>
        <ZButton :size="0.875">查看详情</ZButton>
      </ZSpace>
    </template>
  </ZCard>
</template>
