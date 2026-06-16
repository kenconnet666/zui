<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZTooltip/BasicDemo.vue'
import BasicDemoSource from './ZTooltip/BasicDemo.vue?raw'

const propsRows = [
  { name: 'content', type: 'string', default: '—', desc: '提示文字（#content slot 优先级更高）。' },
  {
    name: 'placement',
    type: 'Placement',
    default: "'top'",
    desc: 'floating-ui placement，如 top / bottom / left / right。',
  },
  {
    name: 'trigger',
    type: "'hover'|'click'|'focus'|'manual'",
    default: "'hover'",
    desc: '触发方式。',
  },
  {
    name: 'visible',
    type: 'boolean',
    default: '—',
    desc: '受控显示（manual 模式 / v-model:visible）。',
  },
  { name: 'delay', type: 'number', default: '100', desc: 'hover 模式 enter/leave 延迟 ms。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用 tooltip。' },
  { name: 'maxWidth', type: 'number', default: '16', desc: 'tooltip 最大宽度（px 倍数，1 单位 = 16px）。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const slotsRows = [
  { name: 'default', desc: '触发器内容。' },
  { name: 'content', desc: '自定义 tooltip 内容（覆盖 content prop）。' },
]

const emitsRows = [{ name: 'update:visible', args: 'boolean', desc: '显示状态变更。' }]
</script>

<template>
  <section>
    <ZTitle :level="1">ZTooltip 文字提示</ZTitle>
    <ZParagraph>
      鼠标悬停时显示简短提示，基于 floating-ui 定位，支持 <ZCode code="hover" /> /
      <ZCode code="click" /> / <ZCode code="focus" /> 多种触发方式，<ZCode code="manual" />
      模式可受控显示。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="多方向 / 多触发方式" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '260px' },
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

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '160px' },
        { key: 'args', label: '参数', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
