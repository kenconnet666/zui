<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZTable/BasicDemo.vue'
import BasicDemoSource from './ZTable/BasicDemo.vue?raw'

const propsRows = [
  { name: 'columns',      type: 'ZTableColumn[]',        default: '—',      desc: '列定义数组（必传）。' },
  { name: 'data',         type: 'T[]',                   default: '—',      desc: '数据数组（必传）。' },
  { name: 'rowKey',       type: 'string | (row) => key', default: "'id'",   desc: '行 key。' },
  { name: 'bordered',     type: 'boolean',               default: 'false',  desc: '边框。' },
  { name: 'striped',      type: 'boolean',               default: 'false',  desc: '斑马纹。' },
  { name: 'size',         type: 'number',                default: '1',      desc: '字号 iem 倍数，影响 cell 内边距。' },
  { name: 'emptyText',    type: 'string',                default: "'暂无数据'", desc: '空数据文案。' },
  { name: 'selectable',   type: 'boolean',               default: 'false',  desc: '行选择（首列 checkbox）。' },
  { name: 'selectedKeys', type: '(string|number)[]',     default: '[]',     desc: '选中行 key 数组（v-model:selectedKeys）。' },
  { name: 'sortState',    type: 'ZTableSortState',       default: '—',      desc: '当前排序状态（v-model:sortState）。' },
  { name: 'css',          type: '(s: Chain) => void',    default: '—',      desc: '根元素 CSS 兜底。' },
]

const columnRows = [
  { name: 'key',       type: 'string',            default: '—',      desc: '列唯一 key。' },
  { name: 'title',     type: 'string',            default: '—',      desc: '表头文字。' },
  { name: 'dataIndex', type: 'string',            default: '—',      desc: '取值字段名（默认同 key）。' },
  { name: 'width',     type: 'string | number',   default: '—',      desc: '列宽。' },
  { name: 'align',     type: "'left'|'center'|'right'", default: "'left'", desc: '对齐方式。' },
  { name: 'sortable',  type: 'boolean',           default: 'false',  desc: '可排序。' },
  { name: 'sorter',    type: '(a, b) => number',  default: '—',      desc: '自定义排序函数。' },
  { name: 'render',    type: '(row, col, idx) => VNodeChild', default: '—', desc: '自定义渲染。' },
]

const emitsRows = [
  { name: 'update:selectedKeys', args: '(string|number)[]',  desc: '选中行变更。' },
  { name: 'update:sortState',    args: 'ZTableSortState',    desc: '排序状态变更。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZTable 表格</ZTitle>
    <ZParagraph>
      配置式基础表格，适合 50 行以内的普通场景。支持行选择（首列 checkbox）、
      列排序（点击列头 toggle）、斑马纹。大数据量请用 <ZCode code="ZDataTable" />（虚拟滚动）。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="边框 / 斑马纹 / 行选择" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '240px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">ZTableColumn</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '240px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="columnRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',  mono: true, width: '200px' },
        { key: 'args', label: '参数',  mono: true, width: '180px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
