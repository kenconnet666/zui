<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import ApiTable from '../components/ApiTable.vue'
</script>

<template>
  <section>
    <ZTitle :level="1">ZCodeCard 代码卡片</ZTitle>
    <ZParagraph>
      文档站「示例 + 源码」卡片，供 docs 站 demo 展示使用。 核心模式：单个
      <ZCode code=".vue" /> 文件同时被作为<strong>运行组件</strong>（进 default slot）
      和<strong>源代码文本</strong>（<ZCode code="?raw" /> import 传
      <ZCode code="source" /> prop）， 源码与演示零漂移。
    </ZParagraph>

    <ZTitle :level="2">使用方式</ZTitle>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`import Demo from './demos/MyDemo.vue'
import DemoSource from './demos/MyDemo.vue?raw'`"
    />
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<ZCodeCard title=&quot;演示标题&quot; :source=&quot;DemoSource&quot;>
  <Demo />
</ZCodeCard>`"
    />

    <ZTitle :level="2">代码主题</ZTitle>
    <ZParagraph>
      所有 <ZCode code="ZCodeCard" /> 实例共享 <ZCode code="globalCodeTheme" />（模块级 ref），
      任意实例切换主题后全站同步，并持久化到 <ZCode code="localStorage('zui-code-theme')" />。 支持
      22 种 shiki 主题（亮色 / 暗色各 11 种）。
    </ZParagraph>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '200px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'source',
          type: 'string',
          default: '—（必传）',
          desc: '源代码文本（通常来自 import ?raw）。',
        },
        {
          name: 'title',
          type: 'string',
          default: '—',
          desc: '卡片标题（#header slot 优先级更高）。',
        },
        { name: 'lang', type: 'string', default: `'vue'`, desc: 'shiki 语言。' },
        { name: 'defaultExpanded', type: 'boolean', default: 'false', desc: '默认是否展开代码。' },
        {
          name: 'expanded',
          type: 'boolean',
          default: '—',
          desc: '受控展开态（配合 v-model:expanded）。',
        },
        {
          name: 'showImports',
          type: 'boolean',
          default: 'false',
          desc: '是否显示源码中的 import 行。',
        },
        {
          name: 'copyToastDuration',
          type: 'number',
          default: '1500',
          desc: '复制成功 toast 持续毫秒，0 关闭 toast。',
        },
        { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
      ]"
    />

    <ZTitle :level="2">Events</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '180px' },
        { key: 'payload', label: '参数', mono: true, width: '320px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'copy',
          payload: '(success: boolean, code: string) => void',
          desc: '复制按钮触发时透传，包含成功/失败状态与实际复制的源码。',
        },
        {
          name: 'update:expanded',
          payload: '(expanded: boolean) => void',
          desc: '展开状态变更，配合 v-model:expanded 受控使用。',
        },
      ]"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'default', desc: '演示组件内容，在预览区渲染。' },
        { name: 'header', desc: '自定义 header bar 内容（覆盖 title prop）。' },
        { name: 'desc', desc: '描述区，位于 header 下方、预览区上方。支持行内 ZCode 等富文本。' },
      ]"
    />
  </section>
</template>
