<script setup lang="ts">
/**
 * ZTree 文档页。
 */
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZTree/BasicDemo.vue'
import BasicDemoSource from './ZTree/BasicDemo.vue?raw'

import SelectableDemo from './ZTree/SelectableDemo.vue'
import SelectableDemoSource from './ZTree/SelectableDemo.vue?raw'

import LargeDataDemo from './ZTree/LargeDataDemo.vue'
import LargeDataDemoSource from './ZTree/LargeDataDemo.vue?raw'

import EventDemo from './ZTree/EventDemo.vue'
import EventDemoSource from './ZTree/EventDemo.vue?raw'

const propsRows = [
  {
    name: 'data',
    type: 'ZTreeNode[]',
    default: '—（必传）',
    desc: '树形数据，支持任意层级嵌套。',
  },
  {
    name: 'height',
    type: 'number | string',
    default: '—（必传）',
    desc: '容器高度。number = px 倍数（1 单位 = 16px），string = CSS 字面值（如 "60vh" / "400px"）。',
  },
  {
    name: 'expandedKeys',
    type: 'string[]',
    default: '[]',
    desc: '展开节点的 key 数组，支持 v-model:expandedKeys 双向绑定。',
  },
  {
    name: 'selectedKey',
    type: 'string | null',
    default: 'null',
    desc: '当前选中节点 key，支持 v-model:selectedKey 双向绑定。null 表示未选中。',
  },
  {
    name: 'selectable',
    type: 'boolean',
    default: 'true',
    desc: '是否允许选中节点。false 时点击只展开/折叠，不会高亮选中。',
  },
  {
    name: 'itemSize',
    type: 'number',
    default: '2',
    desc: '单节点行高 px 倍数（1 单位 = 16px，默认 2 = 32px）。',
  },
  {
    name: 'overscan',
    type: 'number',
    default: '5',
    desc: '虚拟列表预渲染缓冲项数，数值越大滚动越平滑，内存占用略增。',
  },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底 factory。' },
]

const nodeRows = [
  { name: 'key', type: 'string', default: '—（必传）', desc: '节点唯一标识，作为 expandedKeys/selectedKey 的值。' },
  { name: 'label', type: 'string', default: '—（必传）', desc: '节点显示文字。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用节点，禁用后不可选中，渲染时降低透明度。' },
  { name: 'children', type: 'ZTreeNode[]', default: '—', desc: '子节点数组，存在时渲染展开/折叠箭头。' },
]

const emitsRows = [
  {
    name: 'update:expandedKeys',
    args: 'string[]',
    desc: '节点展开/折叠时触发，携带最新展开 key 数组。',
  },
  {
    name: 'update:selectedKey',
    args: 'string | null',
    desc: '选中节点变更时触发，携带新 key 或 null。',
  },
  {
    name: 'select',
    args: 'key: string, node: ZTreeNode',
    desc: '节点被选中时额外触发（selectable=true 且节点未 disabled），同时携带 key 与完整节点对象。',
  },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZTree 树形控件</ZTitle>
    <ZParagraph>
      树形数据展示控件，底层基于 <ZCode code="ZVirtualList" /> 实现，可流畅渲染数千个节点。
      通过 <ZCode code="v-model:expandedKeys" /> 控制展开状态，<ZCode code="v-model:selectedKey" />
      控制单选节点，<ZCode code="height" /> 为<strong>必传</strong>属性，决定滚动容器高度。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="树形展开 / 选中 / 禁用节点" :source="BasicDemoSource">
      <template #desc>
        多层嵌套树，<ZCode code="disabled" /> 节点不可选中但仍可展开子级；
        <ZCode code="height" /> 传数字时为 px 倍数（1 单位 = 16px）。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">仅展开（禁用选中）</ZTitle>
    <DemoBlock title="selectable=false" :source="SelectableDemoSource">
      <template #desc>
        <ZCode code=":selectable='false'" /> 关闭选中功能，点击节点只展开/折叠，适合只读目录场景。
      </template>
      <SelectableDemo />
    </DemoBlock>

    <ZTitle :level="2">大数据量（虚拟滚动）</ZTitle>
    <DemoBlock title="~310 个节点，演示 ZVirtualList 虚拟滚动" :source="LargeDataDemoSource">
      <template #desc>
        共 10 个父节点，每个父节点含 30 个子节点（共 310 项）。<ZCode code=":overscan='10'" />
        增加缓冲，展开任一分组可观察到流畅的虚拟渲染。
      </template>
      <LargeDataDemo />
    </DemoBlock>

    <ZTitle :level="2">选中事件 (@select)</ZTitle>
    <DemoBlock title="@select 回调获取节点 key 与数据" :source="EventDemoSource">
      <template #desc>
        <ZCode code="@select='(key, node) => ...'" /> 额外携带完整节点对象，方便获取 label 或其他业务字段。
      </template>
      <EventDemo />
    </DemoBlock>

    <!-- ─── API ─── -->
    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '160px' },
        { key: 'type', label: '类型', mono: true, width: '220px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">ZTreeNode 字段</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '字段', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '160px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="nodeRows"
    />

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
