<script setup lang="ts">
/**
 * ZCollapse 文档页。
 */
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZCollapse/BasicDemo.vue'
import BasicDemoSource from './ZCollapse/BasicDemo.vue?raw'

import BorderlessDemo from './ZCollapse/BorderlessDemo.vue'
import BorderlessDemoSource from './ZCollapse/BorderlessDemo.vue?raw'

import EventDemo from './ZCollapse/EventDemo.vue'
import EventDemoSource from './ZCollapse/EventDemo.vue?raw'

const propsRows = [
  { name: 'items', type: 'ZCollapseItem[]', default: '—', desc: 'panel 定义数组。' },
  {
    name: 'value',
    type: 'string | string[] | null',
    default: '—',
    desc: '当前展开的 key（v-model:value）。accordion 时为 string，否则为 string[]。',
  },
  { name: 'accordion', type: 'boolean', default: 'false', desc: '手风琴模式，同时只展开一个。' },
  { name: 'bordered', type: 'boolean', default: 'true', desc: '外框 + 分割线。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const itemRows = [
  { name: 'key', type: 'string', default: '—', desc: 'panel 唯一标识。' },
  { name: 'title', type: 'string', default: '—', desc: 'panel 头部标题。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用该 panel，点击无响应。' },
]

const slotsRows = [
  { name: 'default', desc: 'scope: { item: ZCollapseItem }，渲染每个 panel 内容区域。' },
]

const emitsRows = [{ name: 'update:value', args: 'string | string[]', desc: '展开状态变更。' }]
</script>

<template>
  <section>
    <ZTitle :level="1">ZCollapse 折叠面板</ZTitle>
    <ZParagraph>
      配置式折叠面板，通过 <ZCode code="items" /> 定义 panel 列表，<ZCode code="#default" /> slot
      scope <ZCode code="{ item }" /> 渲染每个 panel 内容。支持 <ZCode code="accordion" />
      手风琴模式（同时只展开一个）以及 <ZCode code=":bordered='false'" /> 无边框变体。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="折叠面板 / 手风琴模式" :source="BasicDemoSource">
      <template #desc>
        上方多选展开（默认），下方开启 <ZCode code=":accordion='true'" /> 手风琴模式，同时只允许一个展开。<ZCode code="disabled" /> 的 panel 点击无效。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">无边框</ZTitle>
    <DemoBlock title=":bordered='false'" :source="BorderlessDemoSource">
      <template #desc>
        设置 <ZCode code=":bordered='false'" /> 去掉外框与分割线，适合嵌入卡片、侧边栏等场景。
      </template>
      <BorderlessDemo />
    </DemoBlock>

    <ZTitle :level="2">受控 + 展开状态回显</ZTitle>
    <DemoBlock title="v-model:value 受控绑定" :source="EventDemoSource">
      <template #desc>
        <ZCode code="v-model:value" /> 绑定 <ZCode code="string[]" />，下方实时回显当前展开的 key 列表，方便理解受控数据流。
      </template>
      <EventDemo />
    </DemoBlock>

    <!-- ─── API ─── -->
    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '240px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">ZCollapseItem</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '120px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="itemRows"
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
        { key: 'name', label: '事件', mono: true, width: '160px' },
        { key: 'args', label: '参数', mono: true, width: '180px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
