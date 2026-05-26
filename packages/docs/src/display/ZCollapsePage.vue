<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZCollapse/BasicDemo.vue'
import BasicDemoSource from './ZCollapse/BasicDemo.vue?raw'

const propsRows = [
  { name: 'items',     type: 'ZCollapseItem[]',       default: '—',    desc: 'panel 定义数组。' },
  { name: 'value',     type: 'string | string[] | null', default: '—', desc: '当前展开的 key（v-model:value）。accordion 时为 string，否则为 string[]。' },
  { name: 'accordion', type: 'boolean',               default: 'false', desc: '手风琴模式，同时只展开一个。' },
  { name: 'bordered',  type: 'boolean',               default: 'true',  desc: '外框 + 分割线。' },
  { name: 'css',       type: '(s: Chain) => void',    default: '—',     desc: '根元素 CSS 兜底。' },
]

const itemRows = [
  { name: 'key',      type: 'string',  default: '—',     desc: 'panel 唯一标识。' },
  { name: 'title',    type: 'string',  default: '—',     desc: 'panel 头部标题。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用该 panel。' },
]

const slotsRows = [
  { name: 'default', desc: 'scope: { item: ZCollapseItem }，渲染每个 panel 内容区域。' },
]

const emitsRows = [
  { name: 'update:value', args: 'string | string[]', desc: '展开状态变更。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZCollapse 折叠面板</ZTitle>
    <ZParagraph>
      配置式折叠面板，通过 <ZCode code="items" /> 定义 panel 列表，<ZCode code="#default" /> slot scope
      渲染每个 panel 内容。支持 <ZCode code="accordion" /> 手风琴模式（同时只展开一个）。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="折叠面板 / 手风琴模式" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '240px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">ZCollapseItem</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '120px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="itemRows"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽',  mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="slotsRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',  mono: true, width: '160px' },
        { key: 'args', label: '参数',  mono: true, width: '180px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
