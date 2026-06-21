<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZCard/BasicDemo.vue'
import BasicDemoSource from './ZCard/BasicDemo.vue?raw'
import HeadFootDemo from './ZCard/HeadFootDemo.vue'
import HeadFootDemoSource from './ZCard/HeadFootDemo.vue?raw'
import HoverableDemo from './ZCard/HoverableDemo.vue'
import HoverableDemoSource from './ZCard/HoverableDemo.vue?raw'
import SxNodesDemo from './ZCard/SxNodesDemo.vue'
import SxNodesDemoSource from './ZCard/SxNodesDemo.vue?raw'
import TagMinimalDemo from './ZCard/TagMinimalDemo.vue'
import TagMinimalDemoSource from './ZCard/TagMinimalDemo.vue?raw'

const propsRows = [
  {
    name: 'title',
    type: 'string',
    default: '—',
    desc: '头部标题文字（#header slot 优先级更高）。',
  },
  { name: 'bordered', type: 'boolean', default: 'true', desc: '是否显示边框。false 时改用阴影。' },
  { name: 'hoverable', type: 'boolean', default: 'false', desc: '鼠标悬停加深阴影。' },
  { name: 'sxHead', type: 'SxObject', default: '—', desc: '头部节点 sx 样式配置。' },
  { name: 'sxBody', type: 'SxObject', default: '—', desc: '主体节点 sx 样式配置。' },
  { name: 'sxFoot', type: 'SxObject', default: '—', desc: '底部节点 sx 样式配置。' },
  { name: 'tag', type: 'string', default: "'div'", desc: '根元素 tag。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const slotsRows = [
  { name: 'default', desc: '卡片主体内容（body）。' },
  { name: 'header', desc: '自定义头部，完全替换 title prop 渲染（推荐）。' },
  { name: 'head', desc: '#header 的旧别名，当前版本兼容，下版本将删除，请迁移到 #header。' },
  { name: 'extra', desc: '头部右侧操作区（与 title 并排）。' },
  { name: 'foot', desc: '卡片底部内容（有内容时自动渲染底部分割线 + 区域）。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZCard 卡片</ZTitle>
    <ZParagraph>
      通用卡片容器，由头部（title / #header + #extra）、主体（default slot）、底部（#foot
      slot）三个区域组成， 按需渲染。<ZCode code="bordered" /> 控制边框 / 阴影模式，<ZCode
        code="hoverable"
      />
      开启悬停阴影。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="基础 / extra 区域 / 底部 / 悬停阴影" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">头部 + 底部完整结构</ZTitle>
    <DemoBlock title="title + #extra + body + #foot" :source="HeadFootDemoSource">
      <template #desc>
        三段式结构最常见的组合:头部标题 + 右侧操作 + 主体内容 + 底部按钮区。
      </template>
      <HeadFootDemo />
    </DemoBlock>

    <ZTitle :level="2">悬停阴影</ZTitle>
    <DemoBlock title="hoverable" :source="HoverableDemoSource">
      <template #desc>
        <code>hoverable</code> 启用 hover 阴影过渡。bordered=false 时基础阴影已经存在,hover
        进一步加深。
      </template>
      <HoverableDemo />
    </DemoBlock>

    <ZTitle :level="2">多节点 sx 配置</ZTitle>
    <DemoBlock title="sxHead / sxBody / sxFoot" :source="SxNodesDemoSource">
      <template #desc>
        通过 <code>sxHead</code> / <code>sxBody</code> /
        <code>sxFoot</code> 分别精细化覆盖三个节点的样式。
      </template>
      <SxNodesDemo />
    </DemoBlock>

    <ZTitle :level="2">tag 属性 / 极简无头部 / #header 与 #head 差异</ZTitle>
    <DemoBlock
      title="tag 多态根元素 / 无 header 纯 body / #header vs #head 别名"
      :source="TagMinimalDemoSource"
    >
      <template #desc>
        <ZCode code="tag" /> 更改根元素标签（默认 <code>div</code>，可改 <code>article</code> / <code>section</code> 等）；
        不传 title / 不用 #header 时只渲染 body，无顶部分割线；
        <ZCode code="#header" /> 是推荐的头部 slot，<ZCode code="#head" /> 是旧别名（下版本将删除）。
      </template>
      <TagMinimalDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="slotsRows"
    />
  </section>
</template>
