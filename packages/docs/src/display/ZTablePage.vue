<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

// ─── Demo 组件 ───
import BasicDemo from './ZTable/BasicDemo.vue'
import BasicDemoSource from './ZTable/BasicDemo.vue?raw'
import SortDemo from './ZTable/SortDemo.vue'
import SortDemoSource from './ZTable/SortDemo.vue?raw'
import SizeDemo from './ZTable/SizeDemo.vue'
import SizeDemoSource from './ZTable/SizeDemo.vue?raw'
import EmptyDemo from './ZTable/EmptyDemo.vue'
import EmptyDemoSource from './ZTable/EmptyDemo.vue?raw'
import SelectableDemo from './ZTable/SelectableDemo.vue'
import SelectableDemoSource from './ZTable/SelectableDemo.vue?raw'
import RenderDemo from './ZTable/RenderDemo.vue'
import RenderDemoSource from './ZTable/RenderDemo.vue?raw'
import SxDemo from './ZTable/SxDemo.vue'
import SxDemoSource from './ZTable/SxDemo.vue?raw'

// ─── Props API 表格行 ───
const propsRows = [
  { name: 'columns', type: 'ZTableColumn[]', default: '—', desc: '列定义数组（必传）。' },
  { name: 'data', type: 'T[]', default: '—', desc: '数据数组（必传）。' },
  { name: 'rowKey', type: 'string | (row) => key', default: "'id'", desc: '行唯一 key，默认读 row.id。' },
  { name: 'bordered', type: 'boolean', default: 'false', desc: '显示外边框与列分隔线。' },
  { name: 'striped', type: 'boolean', default: 'false', desc: '奇偶行交替斑马纹背景。' },
  {
    name: 'size',
    type: 'number',
    default: '1',
    desc: 'px 倍数（1 单位 = 16px），控制单元格 padding-y，0.75 紧凑 / 1 默认 / 1.5 宽松。',
  },
  { name: 'emptyText', type: 'string', default: "'暂无数据'", desc: '数据为空时显示的占位文案。' },
  { name: 'selectable', type: 'boolean', default: 'false', desc: '启用行选择，首列插入全选/单选 checkbox。' },
  {
    name: 'selectedKeys',
    type: '(string|number)[]',
    default: '[]',
    desc: '选中行 key 集合，与 v-model:selectedKeys 双向绑定。',
  },
  {
    name: 'sortState',
    type: 'ZTableSortState',
    default: '{ column: null, order: null }',
    desc: '排序状态（激活列 key + 方向），与 v-model:sortState 双向绑定。',
  },
  { name: 'sxHead', type: 'SxObject', default: '—', desc: '追加到 <thead> 的 style / class / HTML 属性。' },
  { name: 'sxBody', type: 'SxObject', default: '—', desc: '追加到 <tbody> 的 style / class / HTML 属性。' },
  { name: 'sxRow', type: 'SxObject', default: '—', desc: '追加到每一 <tr> 行的 style / class / HTML 属性。' },
  { name: 'sxCell', type: 'SxObject', default: '—', desc: '追加到每一 <th>/<td> 的 style / class / HTML 属性。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根 <table> 元素 CSS 兜底，通过 Chain API 书写。' },
]

// ─── ZTableColumn 字段 ───
const columnRows = [
  { name: 'key', type: 'string', default: '—', desc: '列唯一 key（必填）。' },
  { name: 'title', type: 'string', default: '—', desc: '表头文字（必填）。' },
  { name: 'dataIndex', type: 'string', default: '同 key', desc: '从数据行取值的字段名，默认与 key 相同。' },
  { name: 'width', type: 'string | number', default: '—', desc: '列宽，数字时单位 px，字符串原样用（如 "30%"）。' },
  { name: 'align', type: "'left'|'center'|'right'", default: "'left'", desc: '单元格对齐方式。' },
  { name: 'sortable', type: 'boolean', default: 'false', desc: '是否可排序；点击列头 toggle asc → desc → none。' },
  { name: 'sorter', type: '(a: T, b: T) => number', default: '—', desc: '自定义排序比较函数；不传则默认数字/字符串比较。' },
  {
    name: 'render',
    type: '(row: T, col: ZTableColumn, idx: number) => VNodeChild',
    default: '—',
    desc: '自定义单元格渲染函数，返回 VNode；不传则渲染文本。',
  },
]

// ─── Emits API 表格行 ───
const emitsRows = [
  { name: 'update:selectedKeys', args: '(string|number)[]', desc: '勾选/取消勾选行时触发，新的选中 key 集合。' },
  { name: 'update:sortState', args: 'ZTableSortState', desc: '点击排序列头时触发，新的排序状态 { column, order }。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZTable 表格</ZTitle>
    <ZParagraph>
      配置式基础表格，适合 50 行以内的普通场景。支持
      <ZCode code="bordered" /> 边框、<ZCode code="striped" /> 斑马纹、<ZCode code="selectable" /> 行选择、
      列 <ZCode code="sortable" /> 排序、<ZCode code="render" /> 自定义渲染、以及
      <ZCode code="sxHead" /> / <ZCode code="sxRow" /> 等 sx 样式注入。
      大数据量请用 <ZCode code="ZDataTable" />（虚拟滚动）。
    </ZParagraph>

    <!-- 基础用法 -->
    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="边框 + 斑马纹 + 行选择同时开启" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <!-- 排序 -->
    <ZTitle :level="2">列排序</ZTitle>
    <ZParagraph>
      列定义添加 <ZCode code="sortable: true" /> 后，点击列头切换 asc → desc → 无排序。
      排序状态通过 <ZCode code="v-model:sortState" /> 双向绑定，类型为
      <ZCode code="ZTableSortState" />（<ZCode code="{ column, order }" />）。
    </ZParagraph>
    <DemoBlock title="点击「分数」列头切换排序方向" :source="SortDemoSource">
      <SortDemo />
    </DemoBlock>

    <!-- 尺寸 -->
    <ZTitle :level="2">尺寸</ZTitle>
    <ZParagraph>
      <ZCode code="size" /> 为 px 倍数（1 单位 = 16px），内部按比例计算
      cell padding-y（<ZCode code="size × 0.625 × 16px" />）。
      常用预设：<ZCode code="0.75" /> 紧凑 / <ZCode code="1" /> 默认 / <ZCode code="1.5" /> 宽松。
    </ZParagraph>
    <DemoBlock title="点击切换三种尺寸预设" :source="SizeDemoSource">
      <SizeDemo />
    </DemoBlock>

    <!-- 空态 -->
    <ZTitle :level="2">空态</ZTitle>
    <ZParagraph>
      <ZCode code="data" /> 为空数组时自动渲染空态；
      通过 <ZCode code="emptyText" /> 自定义占位文案，默认 <ZCode code="暂无数据" />。
    </ZParagraph>
    <DemoBlock title="自定义空态文案" :source="EmptyDemoSource">
      <EmptyDemo />
    </DemoBlock>

    <!-- 行选择 -->
    <ZTitle :level="2">行选择</ZTitle>
    <ZParagraph>
      设置 <ZCode code="selectable" /> 后，首列插入 checkbox；表头全选/反选，
      行选后高亮背景。已选 key 集合通过 <ZCode code="v-model:selectedKeys" /> 双向同步。
    </ZParagraph>
    <DemoBlock title="勾选行后下方显示已选 ID" :source="SelectableDemoSource">
      <SelectableDemo />
    </DemoBlock>

    <!-- 自定义渲染 -->
    <ZTitle :level="2">自定义渲染</ZTitle>
    <ZParagraph>
      列定义中提供 <ZCode code="render(row, col, idx) => VNodeChild" /> 函数，
      可用 <ZCode code="h()" /> 渲染任意标签或组件；不提供则渲染文本。
    </ZParagraph>
    <DemoBlock title="用 render 渲染彩色状态徽章" :source="RenderDemoSource">
      <RenderDemo />
    </DemoBlock>

    <!-- sx 样式定制 -->
    <ZTitle :level="2">sx 样式定制</ZTitle>
    <ZParagraph>
      <ZCode code="sxHead" /> / <ZCode code="sxBody" /> / <ZCode code="sxRow" /> / <ZCode code="sxCell" />
      各接受一个对象，支持 <ZCode code="style" />、<ZCode code="class" /> 及任意 HTML 属性，
      追加到对应元素（不覆盖内部样式，优先级由 CSS 层叠决定）。
    </ZParagraph>
    <DemoBlock title="sxHead 深色渐变表头 + sxCell 字符间距" :source="SxDemoSource">
      <SxDemo />
    </DemoBlock>

    <!-- Props API -->
    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '140px' },
        { key: 'type', label: '类型', mono: true, width: '240px' },
        { key: 'default', label: '默认值', mono: true, width: '110px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <!-- ZTableColumn API -->
    <ZTitle :level="2">ZTableColumn</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '300px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="columnRows"
    />

    <!-- Emits API -->
    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '200px' },
        { key: 'args', label: '参数', mono: true, width: '180px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
