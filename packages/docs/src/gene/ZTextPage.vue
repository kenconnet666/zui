<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZText/BasicDemo.vue'
import BasicDemoSource from './ZText/BasicDemo.vue?raw'

import StateDemo from './ZText/StateDemo.vue'
import StateDemoSource from './ZText/StateDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZText 文本</ZTitle>
    <ZParagraph>
      行内文本基础元，提供 <strong>6 维度 carrier factory</strong>（size / weight / color / depth /
      leading / tracking）+ <strong>5 状态布尔</strong>（italic / underline / underlineOnHover /
      strikethrough / mono / ellipsis）+ css 兜底。 默认渲染 <ZCode code="<span>" />，通过
      <ZCode code="tag" /> prop 切换语义元素。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="尺寸 / 颜色 / 字重" :source="BasicDemoSource">
      <template #desc>
        <ZCode code="size" /> 是 iem 倍数（<ZCode code="number" />）； <ZCode code="color" /> /
        <ZCode code="weight" /> 接 chain carrier factory， 支持全部 schema token + modifier 链。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">文字状态</ZTitle>
    <DemoBlock
      title="italic / underline / strikethrough / mono / ellipsis"
      :source="StateDemoSource"
    >
      <template #desc>
        布尔 prop 零参数驱动；<ZCode code="ellipsis" /> 传 <ZCode code="true" /> = 单行截断， 传
        <ZCode code="number" /> = 多行截断（<ZCode code="-webkit-line-clamp" />）。
      </template>
      <StateDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '160px' },
        { key: 'type', label: '类型', mono: true, width: '280px' },
        { key: 'default', label: '默认值', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'size', type: 'number', default: '—', desc: 'iem 倍数字号。不传则继承父字号。' },
        {
          name: 'weight',
          type: '(w: FontWeightCarrier) => void',
          default: '—',
          desc: '字重 factory。',
        },
        {
          name: 'color',
          type: '(c: ColorCarrier) => void',
          default: 'currentColor',
          desc: '文字颜色 factory。',
        },
        {
          name: 'depth',
          type: '(o: OpacityCarrier) => void',
          default: '—',
          desc: '透明度 factory。',
        },
        {
          name: 'leading',
          type: '(l: LineHeightCarrier) => void',
          default: '—',
          desc: '行高 factory。',
        },
        {
          name: 'tracking',
          type: '(t: LetterSpacingCarrier) => void',
          default: '—',
          desc: '字距 factory。',
        },
        { name: 'italic', type: 'boolean', default: 'false', desc: '斜体。' },
        { name: 'underline', type: 'boolean', default: 'false', desc: '始终下划线。' },
        { name: 'underlineOnHover', type: 'boolean', default: 'false', desc: 'hover 时下划线。' },
        { name: 'strikethrough', type: 'boolean', default: 'false', desc: '删除线。' },
        { name: 'mono', type: 'boolean', default: 'false', desc: '等宽字体栈。' },
        {
          name: 'ellipsis',
          type: 'boolean | number',
          default: 'false',
          desc: 'true = 单行截断；number = 多行截断（-webkit-line-clamp）。',
        },
        {
          name: 'tag',
          type: 'string',
          default: `'span'`,
          desc: '根元素 tag，如 em / strong / code / del / ins / mark。',
        },
        {
          name: 'css',
          type: '(s: Chain) => void',
          default: '—',
          desc: '兜底 CSS factory，在所有内置样式之后应用。',
        },
      ]"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[{ name: 'default', desc: '行内文本内容。' }]"
    />

    <ZTitle :level="2">语义 tag 示例</ZTitle>
    <ZParagraph>
      通过 <ZCode code="tag" /> 切换 HTML 语义元素，同时保留 chain factory 全量能力：
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<ZText tag=&quot;em&quot; :color=&quot;(c) => c._primary&quot;>强调文本</ZText>
<ZText tag=&quot;strong&quot; :weight=&quot;(w) => w._bold&quot;>加重文本</ZText>
<ZText tag=&quot;code&quot; :mono=&quot;true&quot;>行内代码</ZText>
<ZText tag=&quot;del&quot; :strikethrough=&quot;true&quot;>已删除内容</ZText>
<ZText tag=&quot;mark&quot; :css=&quot;(s) => s.backgroundColor.px(2)&quot;>高亮文字</ZText>`"
    />
  </section>
</template>
