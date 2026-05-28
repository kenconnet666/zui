<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZDropdown/BasicDemo.vue'
import BasicDemoSource from './ZDropdown/BasicDemo.vue?raw'

const propsRows = [
  { name: 'items', type: 'ZDropdownItem[]', default: '—（必传）', desc: '菜单项数组。' },
  { name: 'trigger', type: "'click' | 'hover' | 'manual'", default: "'click'", desc: '触发方式。' },
  {
    name: 'placement',
    type: 'Placement',
    default: "'bottom-start'",
    desc: 'Floating-UI 定位方向。',
  },
  {
    name: 'visible',
    type: 'boolean',
    default: 'false',
    desc: '是否可见（v-model:visible，manual 模式用）。',
  },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '整体禁用。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '浮层容器 CSS 兜底。' },
]

const itemRows = [
  { name: 'key', type: 'string', default: '—（必传）', desc: '唯一标识。' },
  { name: 'label', type: 'string', default: '—（必传）', desc: '菜单项文字。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用。' },
  { name: 'danger', type: 'boolean', default: 'false', desc: '危险操作样式（红色）。' },
]

const emitsRows = [
  { name: 'update:visible', type: '(value: boolean) => void', desc: 'v-model:visible 更新事件。' },
  { name: 'select', type: '(key: string) => void', desc: '点击菜单项时触发。' },
]

const slotsRows = [{ name: 'default', desc: '触发元素（通常是按钮）。' }]
</script>

<template>
  <section>
    <ZTitle :level="1">ZDropdown 下拉菜单</ZTitle>
    <ZParagraph>
      下拉菜单，将更多操作收纳在触发元素下方。 支持点击触发（默认）、悬停触发和手动控制三种模式。
      <ZCode code="danger=true" /> 的菜单项以红色显示。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="点击触发 / 悬停触发 / danger 项" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '260px' },
        { key: 'default', label: '默认值', mono: true, width: '140px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">ZDropdownItem 字段</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '字段', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '120px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="itemRows"
    />

    <ZTitle :level="2">Events</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '180px' },
        { key: 'type', label: '参数', mono: true },
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
  </section>
</template>
