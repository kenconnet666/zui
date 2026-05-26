<script setup lang="ts">
import { ZAnchor, ZFlex, ZTitle, ZText } from '@kenconnet666/zui-vue'

const anchors = [
  { href: '#section-1', title: '第一章' },
  { href: '#section-2', title: '第二章' },
  { href: '#section-2-1', title: '第二章第一节', level: 2 },
  { href: '#section-2-2', title: '第二章第二节', level: 2 },
  { href: '#section-3', title: '第三章' },
]
</script>

<template>
  <ZFlex :gap="g => g._large" :align="a => a.flexStart">
    <ZFlex
      :direction="d => d.column"
      :gap="g => g._large"
      :css="s => { s.flex(1); s.height.iem(15); s.overflowY.auto; s.padding._middle }"
    >
      <div id="section-1">
        <ZTitle :level="3">第一章</ZTitle>
        <ZText>这是第一章的内容。这里有一些示例文字，用来撑开容器高度以便测试锚点滚动效果。</ZText>
      </div>
      <div id="section-2">
        <ZTitle :level="3">第二章</ZTitle>
        <ZText>这是第二章的内容，包含子章节。</ZText>
        <div id="section-2-1" :style="{ marginTop: '1em' }">
          <ZTitle :level="4">第二章第一节</ZTitle>
          <ZText>子章节内容示例文字。</ZText>
        </div>
        <div id="section-2-2" :style="{ marginTop: '1em' }">
          <ZTitle :level="4">第二章第二节</ZTitle>
          <ZText>另一个子章节内容示例文字。</ZText>
        </div>
      </div>
      <div id="section-3">
        <ZTitle :level="3">第三章</ZTitle>
        <ZText>这是第三章的内容。这里有一些示例文字，用来撑开容器高度以便测试锚点滚动效果。</ZText>
      </div>
    </ZFlex>

    <ZAnchor :items="anchors" />
  </ZFlex>
</template>
