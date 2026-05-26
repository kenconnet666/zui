<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZTree/BasicDemo.vue'
import BasicDemoSource from './ZTree/BasicDemo.vue?raw'

const propsRows = [
  { name: 'data',         type: 'ZTreeNode[]',           default: '—',    desc: '树形数据（必传）。' },
  { name: 'height',       type: 'number | string',       default: '—',    desc: '容器高度 iem 倍数或 CSS 字面字符串（必传）。' },
  { name: 'expandedKeys', type: 'string[]',              default: '[]',   desc: '展开的节点 key 数组（v-model:expandedKeys）。' },
  { name: 'selectedKey',  type: 'string | null',         default: 'null', desc: '当前选中 key（v-model:selectedKey）。' },
  { name: 'selectable',   type: 'boolean',               default: 'true', desc: '是否允许选中节点。' },
  { name: 'itemSize',     type: 'number',                default: '2',    desc: '单节点行高 iem 倍数。' },
  { name: 'overscan',     type: 'number',                default: '5',    desc: '预渲染缓冲项数。' },
  { name: 'css',          type: '(s: Chain) => void',    default: '—',    desc: '根元素 CSS 兜底。' },
]

const nodeRows = [
  { name: 'key',      type: 'string',       default: '—',     desc: '节点唯一标识。' },
  { name: 'label',    type: 'string',       default: '—',     desc: '节点显示文字。' },
  { name: 'disabled', type: 'boolean',      default: 'false', desc: '禁用节点（不可选中）。' },
  { name: 'children', type: 'ZTreeNode[]',  default: '—',     desc: '子节点数组。' },
]

const emitsRows = [
  { name: 'update:expandedKeys', args: 'string[]',       desc: '展开/折叠变更。' },
  { name: 'update:selectedKey',  args: 'string | null',  desc: '选中节点变更。' },
  { name: 'select',              args: 'key, node',      desc: '节点被选中时触发。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZTree 树形控件</ZTitle>
    <ZParagraph>
      树形数据展示，底层基于 ZVirtualList 渲染，支持大量节点。通过
      <ZCode code="v-model:expandedKeys" /> 控制展开状态，<ZCode code="v-model:selectedKey" />
      控制单选。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="树形展开 / 选中 / 禁用节点" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">ZTreeNode</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '160px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="nodeRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',  mono: true, width: '200px' },
        { key: 'args', label: '参数',  mono: true, width: '140px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
