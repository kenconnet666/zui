<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZList/BasicDemo.vue'
import BasicDemoSource from './ZList/BasicDemo.vue?raw'

const propsRows = [
  { name: 'items', type: 'T[]', default: '—', desc: '数据数组（必传）。' },
  {
    name: 'itemSize',
    type: 'number | (i) => number',
    default: '—',
    desc: '每项高度（px 倍数，1 单位 = 16px，必传）。',
  },
  {
    name: 'height',
    type: 'number | string',
    default: '—',
    desc: '容器高度，px 倍数（1 单位 = 16px）或 CSS 字面字符串，虚拟滚动必传。',
  },
  { name: 'keyField', type: 'string', default: "'id'", desc: '取 key 的字段名，缺失回退 index。' },
  { name: 'bordered', type: 'boolean', default: 'false', desc: '外框 border + 圆角。' },
  { name: 'header', type: 'string', default: '—', desc: '头部文字（#header slot 优先）。' },
  { name: 'footer', type: 'string', default: '—', desc: '尾部文字（#footer slot 优先）。' },
  { name: 'emptyText', type: 'string', default: "'暂无数据'", desc: '空状态文字。' },
  { name: 'overscan', type: 'number', default: '5', desc: '预渲染缓冲项数。' },
  {
    name: 'autoMeasure',
    type: 'boolean',
    default: 'true',
    desc: 'ResizeObserver 自动测真实尺寸。',
  },
  { name: 'size', type: 'number', default: '1', desc: '字号 px 倍数（1 单位 = 16px）。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根容器 CSS 兜底。' },
]

const slotsRows = [
  { name: 'default', desc: 'scope: { item: T, index: number }，渲染每个列表项。' },
  { name: 'header', desc: '自定义头部区域。' },
  { name: 'footer', desc: '自定义尾部区域。' },
  { name: 'empty', desc: '自定义空状态。' },
]

const emitsRows = [
  { name: 'scroll', args: 'offset: number', desc: '滚动事件。' },
  { name: 'scroll-end', args: '—', desc: '触底事件。' },
  { name: 'update', args: 'start: number, end: number', desc: '可见区间变化。' },
]

const exposeRows = [
  { name: 'rootRef', type: 'Ref<HTMLElement | null>', desc: '根 <div role="list"> DOM 引用。' },
  { name: 'scrollToIndex', type: '(i, align?) => void', desc: '滚动到指定项索引。' },
  { name: 'scrollToOffset', type: '(px: number) => void', desc: '滚动到指定像素偏移。' },
  { name: 'getScroll', type: '() => { offset, total, viewport }', desc: '获取当前滚动状态。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZList 数据列表</ZTitle>
    <ZParagraph>
      基于虚拟滚动的数据列表，支持头尾区域、边框、空态、动态行高。 通过
      <ZCode code="itemSize" /> 设置每项高度（px 倍数，1 单位 = 16px），<ZCode code="height" />
      设置容器高度（必传）。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="简单列表 / 虚拟滚动 50 项" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '140px' },
        { key: 'type', label: '类型', mono: true, width: '220px' },
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
        { key: 'name', label: '事件', mono: true, width: '140px' },
        { key: 'args', label: '参数', mono: true, width: '200px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
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
