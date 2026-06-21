<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZDataTable/BasicDemo.vue'
import BasicDemoSource from './ZDataTable/BasicDemo.vue?raw'

import SortDemo from './ZDataTable/SortDemo.vue'
import SortDemoSource from './ZDataTable/SortDemo.vue?raw'

import LoadingDemo from './ZDataTable/LoadingDemo.vue'
import LoadingDemoSource from './ZDataTable/LoadingDemo.vue?raw'

import SizeDemo from './ZDataTable/SizeDemo.vue'
import SizeDemoSource from './ZDataTable/SizeDemo.vue?raw'

import SelectionDemo from './ZDataTable/SelectionDemo.vue'
import SelectionDemoSource from './ZDataTable/SelectionDemo.vue?raw'

import RenderDemo from './ZDataTable/RenderDemo.vue'
import RenderDemoSource from './ZDataTable/RenderDemo.vue?raw'

import EmptyDemo from './ZDataTable/EmptyDemo.vue'
import EmptyDemoSource from './ZDataTable/EmptyDemo.vue?raw'

import RowEventDemo from './ZDataTable/RowEventDemo.vue'
import RowEventDemoSource from './ZDataTable/RowEventDemo.vue?raw'

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
  { name: 'overscan', type: 'number', default: '5', desc: '预渲染缓冲行数（调大可减少白屏）。' },
  { name: 'emptyText', type: 'string', default: "'暂无数据'", desc: '空状态文字（#empty slot 优先）。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根容器 CSS 兜底覆盖。' },
]

const columnRows = [
  { name: 'key', type: 'string', default: '—', desc: '列唯一 key，也作为 sort key 和 cell slot 名。' },
  { name: 'title', type: 'string', default: '—', desc: '表头文字（可用 #header-${key} slot 覆盖）。' },
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
    type: '(row: T) => unknown',
    default: '—',
    desc: '取单元格值函数（默认 row[key]）。',
  },
  {
    name: 'render',
    type: '(row: T, index: number) => VNode | string',
    default: '—',
    desc: '自定义渲染函数，优先级高于 accessor；也可用 #cell-${key} slot 覆盖。',
  },
  {
    name: 'sortable',
    type: 'boolean | (a: T, b: T) => number',
    default: 'false',
    desc: 'true 用默认比较（accessor/row[key]）；函数走自定义比较器。',
  },
]

const emitsRows = [
  { name: 'row-click', args: '(row: T, index: number, event: MouseEvent)', desc: '行点击。' },
  { name: 'update:selected', args: '(string | number)[]', desc: '选中状态变更（v-model:selected）。' },
  { name: 'update:sort', args: 'ZDataTableSort | null', desc: '排序变更（v-model:sort）。' },
  { name: 'scroll-end', args: '—', desc: '虚拟列表滚动到底，可用于加载更多。' },
]

const slotsRows = [
  { name: 'empty', desc: '空数据展示内容（覆盖 emptyText）。' },
  { name: 'loading', desc: '自定义 loading 遮罩内容（默认 ZSpin）。' },
  { name: 'cell-${key}', desc: '按列 key 自定义单元格，参数 { row, column, index }。优先级高于 render。' },
  { name: 'header-${key}', desc: '按列 key 自定义表头，参数 { column }。' },
]

const exposeRows = [
  { name: 'rootRef', type: 'Ref<HTMLElement | null>', desc: '根 <div role="table"> DOM 引用。' },
  { name: 'scrollToIndex', type: '(i: number, align?: ScrollAlign) => void', desc: '滚动到指定行索引。' },
  { name: 'scrollToOffset', type: '(px: number) => void', desc: '滚动到指定像素偏移。' },
  { name: 'getScroll', type: '() => { offset, total, viewport }', desc: '获取当前滚动状态。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZDataTable 数据表格（虚拟滚动）</ZTitle>
    <ZParagraph>
      基于 ZVirtualList 的大数据表格，支持行虚拟滚动 + sticky 表头。适合 50 行以上数据。
      支持多选 / 单选、排序、loading 遮罩、自定义单元格渲染。
      简单场景（&lt; 50 行）请用 <ZCode code="ZTable" />。
    </ZParagraph>

    <!-- 基础用法 -->
    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="虚拟滚动 / 多选 / 斑马纹（100 行）" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <!-- 排序 -->
    <ZTitle :level="2">排序</ZTitle>
    <ZParagraph>
      列配置 <ZCode code="sortable: true" /> 启用默认比较；传函数可自定义排序逻辑。
      通过 <ZCode code="v-model:sort" /> 绑定 <ZCode code="{ key, order }" /> 排序状态，
      点击列头依次切换 asc → desc → 无排序。
    </ZParagraph>
    <DemoBlock title="点击列头排序（薪资列使用自定义比较器）" :source="SortDemoSource">
      <SortDemo />
    </DemoBlock>

    <!-- loading 加载态 -->
    <ZTitle :level="2">加载态</ZTitle>
    <ZParagraph>
      <ZCode code="loading" /> 为 true 时在表格上方显示半透明遮罩 + 默认 ZSpin。
      可通过 <ZCode code="#loading" /> slot 替换为自定义内容。
    </ZParagraph>
    <DemoBlock title="loading 遮罩（点击按钮模拟 1.5s 请求）" :source="LoadingDemoSource">
      <LoadingDemo />
    </DemoBlock>

    <!-- 行选择 -->
    <ZTitle :level="2">行选择</ZTitle>
    <ZParagraph>
      <ZCode code="selection='multiple'" /> 在首列插入 checkbox，支持全选；
      <ZCode code="selection='single'" /> 点击行选中，无 checkbox。
      均通过 <ZCode code="v-model:selected" /> 双向绑定 key 数组。
    </ZParagraph>
    <DemoBlock title="单选 / 多选切换（v-model:selected）" :source="SelectionDemoSource">
      <SelectionDemo />
    </DemoBlock>

    <!-- 自定义渲染 -->
    <ZTitle :level="2">自定义渲染</ZTitle>
    <ZParagraph>
      列配置 <ZCode code="render: (row, index) => VNode | string" /> 可完全控制单元格内容，
      优先级高于 <ZCode code="accessor" />。也可用 <ZCode code="#cell-{key}" /> slot 实现同等效果。
    </ZParagraph>
    <DemoBlock title="render 函数渲染彩色状态徽标 + 薪资高亮" :source="RenderDemoSource">
      <RenderDemo />
    </DemoBlock>

    <!-- 尺寸变体 -->
    <ZTitle :level="2">尺寸变体</ZTitle>
    <ZParagraph>
      <ZCode code="size" /> 控制字号（px 倍数，默认 1 = 16px），
      搭配 <ZCode code="rowSize" /> 调整行高，可实现紧凑 / 标准 / 宽松三档。
    </ZParagraph>
    <DemoBlock title="字号 + 行高联动切换（小 / 中 / 大）" :source="SizeDemoSource">
      <SizeDemo />
    </DemoBlock>

    <!-- 空数据态 -->
    <ZTitle :level="2">空数据态</ZTitle>
    <ZParagraph>
      <ZCode code="rows" /> 为空数组时显示空状态。默认文字通过 <ZCode code="emptyText" /> 定制，
      也可用 <ZCode code="#empty" /> slot 完全自定义。
    </ZParagraph>
    <DemoBlock title="自定义 emptyText（动态切换有无数据）" :source="EmptyDemoSource">
      <EmptyDemo />
    </DemoBlock>

    <!-- 行事件 -->
    <ZTitle :level="2">行事件</ZTitle>
    <ZParagraph>
      <ZCode code="@row-click" /> 在点击行时触发，参数为 (row, index, MouseEvent)。
      <ZCode code="@scroll-end" /> 在虚拟列表滚动到底时触发，适合实现"加载更多"。
    </ZParagraph>
    <DemoBlock title="row-click / scroll-end 事件（滚到底触发计数）" :source="RowEventDemoSource">
      <RowEventDemo />
    </DemoBlock>

    <!-- API 表格 -->
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
        { key: 'args', label: '参数', mono: true, width: '240px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '160px' },
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
