<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZTabs/BasicDemo.vue'
import BasicDemoSource from './ZTabs/BasicDemo.vue?raw'

const propsRows = [
  { name: 'tabs', type: 'ZTabItem[]', default: '—（必传）', desc: 'Tab 项数组。' },
  { name: 'value', type: 'string', default: '—', desc: '当前激活 tab name（v-model:value）。' },
  { name: 'type', type: "'line' | 'card' | 'segment'", default: "'line'", desc: 'Tab 样式类型。' },
  { name: 'closable', type: 'boolean', default: 'false', desc: '全局显示关闭按钮。' },
  { name: 'addable', type: 'boolean', default: 'false', desc: '显示新增 Tab 按钮。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '整体禁用。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const itemRows = [
  { name: 'name', type: 'string', default: '—（必传）', desc: '唯一标识，也是 v-model 绑定值。' },
  { name: 'label', type: 'string', default: '—（必传）', desc: 'Tab 标签文字。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用该 Tab。' },
  {
    name: 'closable',
    type: 'boolean',
    default: '—',
    desc: '该 Tab 是否可关闭（覆盖全局 closable）。',
  },
]

const emitsRows = [
  { name: 'update:value', type: '(name: string) => void', desc: 'v-model 更新事件。' },
  { name: 'change', type: '(name: string) => void', desc: '切换 tab 时触发。' },
  { name: 'add', type: '() => void', desc: '点击新增按钮时触发。' },
  { name: 'close', type: '(name: string) => void', desc: '点击关闭按钮时触发。' },
]

const slotsRows = [{ name: 'default', desc: '面板内容区域。slot props: { activeName: string }。' }]

const exposeRows = [
  { name: 'rootRef', type: 'Ref<HTMLElement | null>', desc: 'tab list 容器 DOM 引用。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZTabs 标签页</ZTitle>
    <ZParagraph>
      标签页组件，支持 line / card / segment 三种样式。 通过
      <ZCode code="v-model:value" /> 绑定当前激活的 tab name； <ZCode code="closable" /> 和
      <ZCode code="addable" /> 用于动态增删 Tab 场景。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="line / card / segment / 可关闭+新增" :source="BasicDemoSource">
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

    <ZTitle :level="2">ZTabItem 字段</ZTitle>
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
        { key: 'name', label: '事件', mono: true, width: '160px' },
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

    <ZTitle :level="2">Expose</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '240px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="exposeRows"
    />
  </section>
</template>
