<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZPopover/BasicDemo.vue'
import BasicDemoSource from './ZPopover/BasicDemo.vue?raw'

const propsRows = [
  { name: 'title', type: 'string', default: '—', desc: '弹出层标题。' },
  { name: 'placement', type: 'Placement', default: "'bottom'", desc: 'floating-ui placement。' },
  { name: 'trigger', type: "'click'|'hover'|'manual'", default: "'click'", desc: '触发方式。' },
  { name: 'visible', type: 'boolean', default: '—', desc: '受控显示（v-model:visible）。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用。' },
  { name: 'minWidth', type: 'number', default: '8', desc: 'popper 最小宽度（px 倍数，1 单位 = 16px）。' },
  { name: 'maxWidth', type: 'number', default: '30', desc: 'popper 最大宽度（px 倍数，1 单位 = 16px）。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const slotsRows = [
  { name: 'default', desc: '触发器内容。' },
  { name: 'title', desc: '自定义标题（覆盖 title prop）。' },
  { name: 'content', desc: '弹出层内容区域。' },
]

const emitsRows = [{ name: 'update:visible', args: 'boolean', desc: '显示状态变更。' }]
</script>

<template>
  <section>
    <ZTitle :level="1">ZPopover 气泡卡片</ZTitle>
    <ZParagraph>
      点击或悬停触发的弹出层，内容比 Tooltip 更丰富，可放置任意内容。默认
      <ZCode code="click" /> 触发， 支持点击外部或 ESC 关闭。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="基础 / 多触发方式" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '240px' },
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
