<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZTransfer/BasicDemo.vue'
import BasicDemoSource from './ZTransfer/BasicDemo.vue?raw'

const propsRows = [
  { name: 'dataSource',  type: 'ZTransferItem[]',    default: '—',           desc: '全量数据（必传）。' },
  { name: 'targetKeys',  type: 'string[]',           default: '[]',          desc: '右侧已选 key 数组（v-model:targetKeys）。' },
  { name: 'titles',      type: '[string, string]',   default: "['源','目标']", desc: '左右面板标题。' },
  { name: 'itemSize',    type: 'number',             default: '2',           desc: '每项行高 iem 倍数。' },
  { name: 'listHeight',  type: 'number',             default: '15',          desc: '列表容器高度 iem 倍数。' },
  { name: 'css',         type: '(s: Chain) => void', default: '—',           desc: '根元素 CSS 兜底。' },
]

const itemRows = [
  { name: 'key',      type: 'string',  default: '—',     desc: '数据项唯一标识。' },
  { name: 'label',    type: 'string',  default: '—',     desc: '显示文字。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用（不可转移）。' },
]

const emitsRows = [
  { name: 'update:targetKeys', args: 'string[]', desc: '右侧 keys 变更。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZTransfer 穿梭框</ZTitle>
    <ZParagraph>
      左右两个列表，通过中间按钮互相转移数据。<ZCode code="dataSource" /> 提供全量数据，
      <ZCode code="targetKeys" /> 控制右侧已选项。左侧虚拟渲染支持大量数据。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="穿梭 / 禁用项" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">ZTransferItem</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '120px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="itemRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',  mono: true, width: '200px' },
        { key: 'args', label: '参数',  mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
