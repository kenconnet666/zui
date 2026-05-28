<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZDescriptions/BasicDemo.vue'
import BasicDemoSource from './ZDescriptions/BasicDemo.vue?raw'

const propsRows = [
  { name: 'items', type: 'ZDescriptionsItem[]', default: '—', desc: '描述项数组。' },
  { name: 'title', type: 'string', default: '—', desc: '顶部标题。' },
  { name: 'column', type: 'number', default: '3', desc: '每行显示列数。' },
  { name: 'bordered', type: 'boolean', default: 'false', desc: '边框模式。' },
  { name: 'size', type: 'number', default: '1', desc: '字号 iem 倍数，影响内边距。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const itemRows = [
  { name: 'label', type: 'string', default: '—', desc: '标签文字。' },
  { name: 'value', type: 'string | number', default: '—', desc: '值文字。' },
  { name: 'span', type: 'number', default: '1', desc: '跨列数。' },
]

const slotsRows = [{ name: 'title', desc: '自定义顶部标题（覆盖 title prop）。' }]
</script>

<template>
  <section>
    <ZTitle :level="1">ZDescriptions 描述列表</ZTitle>
    <ZParagraph>
      以 key-value 网格形式展示详情信息。<ZCode code="column" /> 控制每行列数，
      <ZCode code="bordered" /> 开启边框模式，<ZCode code="item.span" /> 支持跨列。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="无边框 / 有边框 / 自定义列数" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">ZDescriptionsItem</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '160px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
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
