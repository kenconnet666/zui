<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZDivider/BasicDemo.vue'
import BasicDemoSource from './ZDivider/BasicDemo.vue?raw'

import TextDemo from './ZDivider/TextDemo.vue'
import TextDemoSource from './ZDivider/TextDemo.vue?raw'

import VerticalDemo from './ZDivider/VerticalDemo.vue'
import VerticalDemoSource from './ZDivider/VerticalDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZDivider 分割线</ZTitle>
    <ZParagraph>
      分割线组件，支持<strong>水平 / 垂直</strong>两种方向，水平模式可在中间插入文字。 支持
      <ZCode code="dashed" />（虚线）、<ZCode code="thickness" />（粗细，支持 string 或 px 倍数
      number）、 <ZCode code="color" /> carrier factory 自定义颜色。
    </ZParagraph>

    <ZTitle :level="2">水平分割线</ZTitle>
    <DemoBlock title="默认 / 虚线 / 自定义颜色与粗细" :source="BasicDemoSource">
      <template #desc>
        <ZCode code="thickness" /> 支持 <ZCode code="string" />（如 <ZCode code="'2px'" />）或
        <ZCode code="number" />（px 倍数，1 单位 = 16px）。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">带文字分割线</ZTitle>
    <DemoBlock title="default slot + align" :source="TextDemoSource">
      <template #desc>
        传入 default slot 内容时自动切换为 flex 布局；<ZCode code="align" />
        控制文字偏左/居中/偏右。 线条与文字同色，通过 <ZCode code="color" /> factory 统一控制。
      </template>
      <TextDemo />
    </DemoBlock>

    <ZTitle :level="2">垂直分割线</ZTitle>
    <DemoBlock title="vertical — inline 竖线" :source="VerticalDemoSource">
      <template #desc>
        <ZCode code="vertical=true" /> 渲染为
        <ZCode code="inline-block" /> 竖线，需父容器指定高度或用 align-stretch 拉伸。
      </template>
      <VerticalDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '140px' },
        { key: 'type', label: '类型', mono: true, width: '260px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'vertical',
          type: 'boolean',
          default: 'false',
          desc: '垂直方向（竖线），需父容器有高度。',
        },
        { name: 'dashed', type: 'boolean', default: 'false', desc: '虚线。' },
        {
          name: 'align',
          type: `'left' | 'center' | 'right'`,
          default: `'center'`,
          desc: '文字对齐（仅横向 + 有 slot 时生效）。',
        },
        {
          name: 'color',
          type: '(c: ColorCarrier) => void',
          default: '_border',
          desc: '线条与中间文字同色 factory。',
        },
        {
          name: 'thickness',
          type: 'string | number',
          default: `'1px'`,
          desc: `string → CSS 长度（如 '2px'）；number → px 倍数（如 0.125 = 2px）。`,
        },
        { name: 'tag', type: 'string', default: `'div'`, desc: '根元素 tag。' },
        { name: 'css', type: '(s: Chain) => void', default: '—', desc: '兜底 CSS factory。' },
      ]"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[{ name: 'default', desc: '中间文字内容。有内容时自动切换为 flex + 两侧线段布局。' }]"
    />
  </section>
</template>
