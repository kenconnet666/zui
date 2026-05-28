<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZVirtualList/BasicDemo.vue'
import BasicDemoSource from './ZVirtualList/BasicDemo.vue?raw'

const propsRows = [
  { name: 'items', type: 'T[]', default: '—', desc: '数据数组（必传）。' },
  {
    name: 'itemSize',
    type: 'number | (i, item) => number',
    default: '—',
    desc: '每项高度 iem 倍数（必传）；函数支持动态行高。',
  },
  {
    name: 'height',
    type: 'number | string',
    default: '—',
    desc: '容器高度（垂直方向）。iem 倍数或 CSS 字面字符串。',
  },
  { name: 'width', type: 'number | string', default: '—', desc: '容器宽度（水平方向）。' },
  { name: 'direction', type: "'vertical'|'horizontal'", default: "'vertical'", desc: '滚动方向。' },
  { name: 'keyField', type: 'string', default: "'id'", desc: '取项 key 字段名，缺失回退 index。' },
  { name: 'overscan', type: 'number', default: '5', desc: '两端各预渲染的缓冲项数。' },
  {
    name: 'autoMeasure',
    type: 'boolean',
    default: 'true',
    desc: 'ResizeObserver 自动测真实尺寸（动态行高时使用）。',
  },
  {
    name: 'scrollEndThreshold',
    type: 'number',
    default: '0',
    desc: '触发 scroll-end 的距底阈值（iem 倍数）。',
  },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根容器 CSS 兜底。' },
]

const slotsRows = [{ name: 'default', desc: 'scope: { item: T, index: number }，渲染每个虚拟项。' }]

const emitsRows = [
  { name: 'scroll', args: 'offset: number', desc: '每次滚动时触发。' },
  { name: 'scroll-end', args: '—', desc: '滚到距底 ≤ scrollEndThreshold 时触发（去重）。' },
  { name: 'update', args: 'start: number, end: number', desc: '可见区间变化时触发。' },
]

const exposeRows = [
  { name: 'scrollToIndex', type: '(i: number, align?) => void', desc: '滚动到指定 index。' },
  { name: 'scrollToOffset', type: '(px: number) => void', desc: '滚动到指定像素偏移。' },
  { name: 'getScroll', type: '() => { offset, total, viewport }', desc: '获取当前滚动信息。' },
  { name: 'getItemOffset', type: '(i: number) => number', desc: '获取第 i 项的像素偏移。' },
  { name: 'getItemSize', type: '(i: number) => number', desc: '获取第 i 项的像素高度。' },
  { name: 'rootRef', type: 'Ref<HTMLElement | null>', desc: '根滚动容器 DOM。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZVirtualList 虚拟滚动列表</ZTitle>
    <ZParagraph>
      通用虚拟滚动渲染单元，仅渲染可见区域（+ overscan 缓冲），DOM 数量恒定。
      <ZCode code="ZList" />、<ZCode code="ZDataTable" />、<ZCode code="ZTree" />
      等大数据组件均基于此实现。 支持固定行高（快路径）和动态行高（autoMeasure）。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="固定行高 1000 项 / 动态行高" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '180px' },
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
        { key: 'name', label: '事件', mono: true, width: '140px' },
        { key: 'args', label: '参数', mono: true, width: '200px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />

    <ZTitle :level="2">Expose</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '方法/属性', mono: true, width: '160px' },
        { key: 'type', label: '类型', mono: true, width: '280px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="exposeRows"
    />
  </section>
</template>
