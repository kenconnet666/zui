<script setup lang="ts">
/**
 * ZStatistic 文档页。
 */
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZStatistic/BasicDemo.vue'
import BasicDemoSource from './ZStatistic/BasicDemo.vue?raw'

import SlotDemo from './ZStatistic/SlotDemo.vue'
import SlotDemoSource from './ZStatistic/SlotDemo.vue?raw'

import ColorDemo from './ZStatistic/ColorDemo.vue'
import ColorDemoSource from './ZStatistic/ColorDemo.vue?raw'

const propsRows = [
  {
    name: 'value',
    type: 'number | string',
    default: '—（必传）',
    desc: '主数值。字符串直接渲染，数字走格式化（千分位 + 精度）。',
  },
  { name: 'title', type: 'string', default: '—', desc: '标题文字（也可用 #title slot）。' },
  { name: 'prefix', type: 'string', default: '—', desc: '数值前缀文字（也可用 #prefix slot）。' },
  { name: 'suffix', type: 'string', default: '—', desc: '数值后缀文字（也可用 #suffix slot）。' },
  {
    name: 'precision',
    type: 'number',
    default: '—',
    desc: '小数位数（toFixed 精度）。不传则保留原始小数位。',
  },
  {
    name: 'separator',
    type: 'string',
    default: "','",
    desc: '千分位分隔符。设为空字符串 "" 可关闭千分位。',
  },
  {
    name: 'color',
    type: '(c: Chain[\'color\']) => void',
    default: '_text',
    desc: '数值颜色 chain factory。支持所有 schema token + modifier 链。',
  },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底 factory。' },
]

const slotsRows = [
  { name: 'title', desc: '自定义标题内容，优先级高于 title prop，支持富文本。' },
  { name: 'prefix', desc: '数值前缀，优先级高于 prefix prop（如货币符号 ¥）。' },
  { name: 'suffix', desc: '数值后缀，优先级高于 suffix prop（如单位 % / USD）。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZStatistic 统计数字</ZTitle>
    <ZParagraph>
      数字统计展示组件，常用于仪表板数据卡片。支持千分位格式化、小数精度控制（<ZCode
        code="precision"
      />）、前后缀文字或 slot、以及颜色 factory 自定义。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="基础 / 小数精度 / 颜色 / 无分隔符" :source="BasicDemoSource">
      <template #desc>
        <ZCode code="value" /> 为数字时自动添加千分位（默认 <ZCode code="separator=','" />），
        <ZCode code="precision" /> 控制小数位，<ZCode code="color" /> 接受 chain factory 染色。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">插槽 (prefix / suffix / title)</ZTitle>
    <DemoBlock title="slot 自定义前缀、后缀与标题" :source="SlotDemoSource">
      <template #desc>
        <ZCode code="#prefix" />、<ZCode code="#suffix" /> 优先级高于同名 prop，适合插入图标或富文本；
        <ZCode code="#title" /> slot 可自定义标题样式。
      </template>
      <SlotDemo />
    </DemoBlock>

    <ZTitle :level="2">语义颜色</ZTitle>
    <DemoBlock title="chain color factory —— primary / success / warning / danger" :source="ColorDemoSource">
      <template #desc>
        通过 <ZCode code=":color='c => c._success'" /> 等 factory 传入语义色，与设计系统 token 完全绑定，深色模式自动切换。
      </template>
      <ColorDemo />
    </DemoBlock>

    <!-- ─── API ─── -->
    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '220px' },
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
