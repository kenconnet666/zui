<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZMenu/BasicDemo.vue'
import BasicDemoSource from './ZMenu/BasicDemo.vue?raw'
import CollapsedDemo from './ZMenu/CollapsedDemo.vue'
import CollapsedDemoSource from './ZMenu/CollapsedDemo.vue?raw'
import DisabledDemo from './ZMenu/DisabledDemo.vue'
import DisabledDemoSource from './ZMenu/DisabledDemo.vue?raw'
import SxDemo from './ZMenu/SxDemo.vue'
import SxDemoSource from './ZMenu/SxDemo.vue?raw'

const propsRows = [
  {
    name: 'items',
    type: 'ZMenuItem[]',
    default: '—（必传）',
    desc: '菜单项数组，支持嵌套 children。',
  },
  {
    name: 'value',
    type: 'string | null',
    default: 'null',
    desc: '当前选中 key（v-model:value）。',
  },
  { name: 'vertical', type: 'boolean', default: 'true', desc: '垂直布局；false 为水平菜单。' },
  {
    name: 'inline',
    type: 'boolean',
    default: 'false',
    desc: '子菜单内联展开（仅 vertical 模式）。',
  },
  {
    name: 'collapsed',
    type: 'boolean',
    default: 'false',
    desc: '收起为仅图标模式（inline 模式生效）。',
  },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '整体禁用。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const itemRows = [
  { name: 'key', type: 'string', default: '—（必传）', desc: '唯一标识，也是 v-model 选中值。' },
  { name: 'label', type: 'string', default: '—（必传）', desc: '菜单项文字。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用。' },
  { name: 'icon', type: 'Component', default: '—', desc: '图标组件（传给 ZIcon）。' },
  { name: 'children', type: 'ZMenuItem[]', default: '—', desc: '子菜单项。' },
]

const sxRows = [
  { name: 'sxItem', type: 'SxObject', default: '—', desc: '每个菜单项按钮的 sx 定制（css / style / class / ref / attrs）。' },
  { name: 'sxSubmenu', type: 'SxObject', default: '—', desc: '子菜单容器（ul）的 sx 定制。' },
  { name: 'sxLabel', type: 'SxObject', default: '—', desc: '菜单项文字 span 的 sx 定制。' },
]

const emitsRows = [
  { name: 'update:value', type: '(key: string) => void', desc: 'v-model 更新事件。' },
  { name: 'select', type: '(key: string) => void', desc: '点击叶子菜单项时触发。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZMenu 菜单</ZTitle>
    <ZParagraph>
      导航菜单，支持垂直（默认）和水平两种布局。垂直模式下可开启
      <ZCode code="inline" /> 子菜单内联展开； 传入 <ZCode code="items" /> 数组，通过
      <ZCode code="v-model:value" /> 绑定当前选中项。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="垂直菜单 / 水平菜单" :source="BasicDemoSource">
      <template #desc>
        <ZCode code="inline=true" /> 开启子菜单内联展开；<ZCode code=":vertical='false'" />
        切换水平模式。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">折叠模式</ZTitle>
    <DemoBlock title="collapsed — 收起为图标模式" :source="CollapsedDemoSource">
      <template #desc>
        <ZCode code=":collapsed='true'" /> 隐藏文字和子菜单箭头，仅显示图标，适用于侧边栏收缩场景。
        需配合 <ZCode code="vertical=true" /> + <ZCode code="inline=true" /> 使用。
      </template>
      <CollapsedDemo />
    </DemoBlock>

    <ZTitle :level="2">禁用状态</ZTitle>
    <DemoBlock title="单项 disabled / 整体 disabled + select 事件" :source="DisabledDemoSource">
      <template #desc>
        <ZCode code="item.disabled=true" /> 仅禁用单项；<ZCode code=":disabled='true'" />
        整体禁用所有菜单项（含非 disabled 项）。单项点击后 <ZCode code="select" /> 事件有输出。
      </template>
      <DisabledDemo />
    </DemoBlock>

    <ZTitle :level="2">自定义样式（sxItem / sxSubmenu / sxLabel）</ZTitle>
    <DemoBlock title="sxItem 圆角 + sxLabel 加粗 + sxSubmenu 左边框" :source="SxDemoSource">
      <template #desc>
        三个 <ZCode code="sx*" /> prop 分别定制菜单项按钮、文字 span、子菜单容器，
        可传 <ZCode code="{ css: s => { ... } }" /> 使用 Chain 语法。
      </template>
      <SxDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Sx Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '160px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="sxRows"
    />

    <ZTitle :level="2">ZMenuItem 字段</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '字段', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '160px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="itemRows"
    />

    <ZTitle :level="2">Events</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '160px' },
        { key: 'type', label: '参数', mono: true },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
