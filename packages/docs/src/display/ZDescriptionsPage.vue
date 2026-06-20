<script setup lang="ts">
/**
 * ZDescriptions 文档页。
 */
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZDescriptions/BasicDemo.vue'
import BasicDemoSource from './ZDescriptions/BasicDemo.vue?raw'

import TitleDemo from './ZDescriptions/TitleDemo.vue'
import TitleDemoSource from './ZDescriptions/TitleDemo.vue?raw'

import SpanDemo from './ZDescriptions/SpanDemo.vue'
import SpanDemoSource from './ZDescriptions/SpanDemo.vue?raw'

import SizeDemo from './ZDescriptions/SizeDemo.vue'
import SizeDemoSource from './ZDescriptions/SizeDemo.vue?raw'

const propsRows = [
  {
    name: 'items',
    type: 'ZDescriptionsItem[]',
    default: '—（必传）',
    desc: '描述项数组，每项含 label / value，可选 span。',
  },
  { name: 'title', type: 'string', default: '—', desc: '顶部标题（也可用 #title slot）。' },
  { name: 'column', type: 'number', default: '3', desc: '每行显示的列数。' },
  { name: 'bordered', type: 'boolean', default: 'false', desc: '边框模式，开启后 label 列带背景色区分。' },
  {
    name: 'size',
    type: 'number',
    default: '1',
    desc: '字号 px 倍数（1 单位 = 16px），同时影响内边距（padding = size × 0.5）。',
  },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底 factory。' },
]

const itemRows = [
  { name: 'label', type: 'string', default: '—（必传）', desc: '标签文字。' },
  { name: 'value', type: 'string | number', default: '—（必传）', desc: '值文字或数字。' },
  {
    name: 'span',
    type: 'number',
    default: '1',
    desc: '该 item value 单元格跨列数（label 始终占 1 列）。设为 2 时 value 跨 3 格。',
  },
]

const slotsRows = [
  { name: 'title', desc: '自定义顶部标题内容（覆盖 title prop），支持富文本。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZDescriptions 描述列表</ZTitle>
    <ZParagraph>
      以 key-value 网格形式展示详情信息，常用于用户资料、订单详情等场景。
      <ZCode code="column" /> 控制每行列数，<ZCode code="bordered" /> 开启边框模式，
      <ZCode code="item.span" /> 支持 value 单元格跨列，<ZCode code="size" /> 调整整体字号与内边距。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="无边框 / 有边框 / 自定义列数" :source="BasicDemoSource">
      <template #desc>
        默认 3 列无边框；<ZCode code=":bordered='true'" /> 开启边框并给 label 列添加背景色；
        <ZCode code=":column='2'" /> 改为 2 列布局。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">标题（prop 与 slot）</ZTitle>
    <DemoBlock title="title prop 与 #title slot 两种用法" :source="TitleDemoSource">
      <template #desc>
        <ZCode code="title" /> prop 直接传字符串；<ZCode code="#title" /> slot 可插入富文本、徽标等自定义内容。
      </template>
      <TitleDemo />
    </DemoBlock>

    <ZTitle :level="2">跨列 (span)</ZTitle>
    <DemoBlock title="item.span 让 value 跨多列" :source="SpanDemoSource">
      <template #desc>
        <ZCode code="span: 2" /> 时 value 单元格额外跨 1 列（实现 label + value 共占 2 组格），适合长文本字段。
      </template>
      <SpanDemo />
    </DemoBlock>

    <ZTitle :level="2">尺寸 (size)</ZTitle>
    <DemoBlock title="size 控制字号与内边距密度" :source="SizeDemoSource">
      <template #desc>
        <ZCode code="size" /> 是 px 倍数（1 = 16px）。<ZCode code="0.875" /> 紧凑、默认 <ZCode code="1" />、
        <ZCode code="1.25" /> 宽松，内边距同步缩放。
      </template>
      <SizeDemo />
    </DemoBlock>

    <!-- ─── API ─── -->
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

    <ZTitle :level="2">ZDescriptionsItem 字段</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '字段', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '180px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="itemRows"
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
