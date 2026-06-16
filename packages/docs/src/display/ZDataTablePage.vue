<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZDataTable/BasicDemo.vue'
import BasicDemoSource from './ZDataTable/BasicDemo.vue?raw'

const propsRows = [
  { name: 'rows', type: 'T[]', default: '—', desc: '数据数组（必传）。' },
  { name: 'columns', type: 'ZDataTableColumn[]', default: '—', desc: '列定义数组（必传）。' },
  {
    name: 'height',
    type: 'number | string',
    default: '—',
    desc: '容器高度，px 倍数（1 单位 = 16px）或 CSS 字面字符串（必传）。',
  },
  { name: 'rowSize', type: 'number', default: '3', desc: '行高 px 倍数（1 单位 = 16px，虚拟滚动需要）。' },
  { name: 'rowKey', type: 'string', default: "'id'", desc: '取行 key 字段名。' },
  { name: 'selection', type: "'none'|'single'|'multiple'", default: "'none'", desc: '选中模式。' },
  {
    name: 'selected',
    type: '(string|number)[]',
    default: '[]',
    desc: '选中行 key 数组（v-model:selected）。',
  },
  {
    name: 'sort',
    type: 'ZDataTableSort | null',
    default: 'null',
    desc: '排序状态（v-model:sort）。',
  },
  { name: 'loading', type: 'boolean', default: 'false', desc: 'loading 遮罩。' },
  { name: 'bordered', type: 'boolean', default: 'false', desc: '外框 border + 圆角。' },
  { name: 'stripe', type: 'boolean', default: 'false', desc: '斑马纹。' },
  { name: 'size', type: 'number', default: '1', desc: '字号 px 倍数（1 单位 = 16px）。' },
  { name: 'emptyText', type: 'string', default: "'暂无数据'", desc: '空状态文字。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根容器 CSS 兜底。' },
]

const columnRows = [
  { name: 'key', type: 'string', default: '—', desc: '列唯一 key，也作为 sort key。' },
  { name: 'title', type: 'string', default: '—', desc: '表头文字。' },
  {
    name: 'width',
    type: 'number | string',
    default: '—',
    desc: '列宽（px 倍数或 CSS 字面字符串）；不传则 flex 均分。',
  },
  { name: 'minWidth', type: 'number', default: '5', desc: 'flex 均分时的最小列宽（px 倍数，5 = 80px）。' },
  { name: 'align', type: "'left'|'center'|'right'", default: "'left'", desc: '对齐方式。' },
  {
    name: 'accessor',
    type: '(row) => unknown',
    default: '—',
    desc: '取单元格值（默认 row[key]）。',
  },
  {
    name: 'render',
    type: '(row, idx) => VNode | string',
    default: '—',
    desc: '自定义渲染，优先级高于 accessor。',
  },
  {
    name: 'sortable',
    type: 'boolean | (a, b) => number',
    default: 'false',
    desc: 'true 用默认比较；函数走自定义。',
  },
]

const emitsRows = [
  { name: 'row-click', args: 'row, index, event', desc: '行点击。' },
  { name: 'update:selected', args: '(string|number)[]', desc: '选中状态变更。' },
  { name: 'update:sort', args: 'ZDataTableSort | null', desc: '排序变更。' },
  { name: 'scroll-end', args: '—', desc: '滚动到底（可用于加载更多）。' },
]

const slotsRows = [
  { name: 'empty', desc: '空数据展示（覆盖 emptyText）。' },
  { name: 'loading', desc: '自定义 loading 遮罩内容（默认渲染 "加载中..."）。' },
]

const exposeRows = [
  { name: 'rootRef', type: 'Ref<HTMLElement | null>', desc: '根 <div role="table"> DOM 引用。' },
  { name: 'scrollToIndex', type: '(i, align?) => void', desc: '滚动到指定行索引。' },
  { name: 'scrollToOffset', type: '(px: number) => void', desc: '滚动到指定像素偏移。' },
  { name: 'getScroll', type: '() => { offset, total, viewport }', desc: '获取当前滚动状态。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZDataTable 数据表格（虚拟滚动）</ZTitle>
    <ZParagraph>
      基于 ZVirtualList 的大数据表格，支持行虚拟滚动 + sticky 表头。适合 50 行以上数据。
      支持多选、排序、loading 遮罩。简单场景（&lt; 50 行）请用 <ZCode code="ZTable" />。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="虚拟滚动 / 多选 / 斑马纹（100 行）" :source="BasicDemoSource">
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

    <ZTitle :level="2">ZDataTableColumn</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '280px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="columnRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '180px' },
        { key: 'args', label: '参数', mono: true, width: '200px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="slotsRows"
    />

    <ZTitle :level="2">Expose</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '方法', mono: true, width: '160px' },
        { key: 'type', label: '类型', mono: true, width: '280px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="exposeRows"
    />
  </section>
</template>
