<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZPopover/BasicDemo.vue'
import BasicDemoSource from './ZPopover/BasicDemo.vue?raw'

import PlacementDemo from './ZPopover/PlacementDemo.vue'
import PlacementDemoSource from './ZPopover/PlacementDemo.vue?raw'

import ContentSlotDemo from './ZPopover/ContentSlotDemo.vue'
import ContentSlotDemoSource from './ZPopover/ContentSlotDemo.vue?raw'

import ControlledDemo from './ZPopover/ControlledDemo.vue'
import ControlledDemoSource from './ZPopover/ControlledDemo.vue?raw'

import DisabledDemo from './ZPopover/DisabledDemo.vue'
import DisabledDemoSource from './ZPopover/DisabledDemo.vue?raw'

const propsRows = [
  { name: 'title', type: 'string', default: '—', desc: '弹出层标题文字（也可用 #title slot 自定义）。' },
  {
    name: 'placement',
    type: 'Placement',
    default: "'bottom'",
    desc: 'floating-ui placement，如 top / bottom / left / right / top-start 等。默认 bottom。',
  },
  {
    name: 'trigger',
    type: "'click'|'hover'|'manual'",
    default: "'click'",
    desc: '触发方式。click=点击切换，hover=悬停，manual=受控（v-model:visible）。',
  },
  {
    name: 'visible',
    type: 'boolean',
    default: 'false',
    desc: '受控显示（manual 模式下生效，配合 v-model:visible）。',
  },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用，不响应触发事件。' },
  { name: 'minWidth', type: 'number', default: '8', desc: 'popper 最小宽度（px 倍数，1 单位 = 16px，默认 8 = 128px）。' },
  { name: 'maxWidth', type: 'number', default: '30', desc: 'popper 最大宽度（px 倍数，1 单位 = 16px，默认 30 = 480px）。' },
  { name: 'sxTrigger', type: 'SxObject', default: '—', desc: '触发器包裹元素（inline-flex 容器）的 sx 覆盖。' },
  { name: 'sxContent', type: 'SxObject', default: '—', desc: '弹层容器的 sx 覆盖。' },
  { name: 'sxTitle', type: 'SxObject', default: '—', desc: '标题区域的 sx 覆盖。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底，在所有内置样式之后应用。' },
]

const slotsRows = [
  { name: 'default', desc: '触发器内容，被 inline-flex 容器包裹。' },
  { name: 'title', desc: '自定义标题区（覆盖 title prop），仅在 title prop 存在或此 slot 有内容时渲染。' },
  { name: 'content', desc: '弹出层主体内容区，可放置任意元素。' },
]

const emitsRows = [{ name: 'update:visible', args: 'boolean', desc: '显示状态变更，用于 v-model:visible 双向绑定。' }]
</script>

<template>
  <section>
    <ZTitle :level="1">ZPopover 气泡卡片</ZTitle>
    <ZParagraph>
      点击或悬停触发的弹出层，内容比 Tooltip 更丰富，可放置任意内容。默认
      <ZCode code="click" /> 触发，支持点击外部或 ESC 关闭，
      <ZCode code="manual" /> 模式下完全受控。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="基础 / 多触发方式" :source="BasicDemoSource">
      <template #desc>
        默认 <ZCode code="trigger='click'" /> 点击触发；<ZCode code="hover" /> 触发时悬停即弹出，
        移出自动关闭；点击弹层外部或按 ESC 也会关闭。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">弹出方向</ZTitle>
    <DemoBlock title="top / bottom / left / right 及变体" :source="PlacementDemoSource">
      <template #desc>
        <ZCode code="placement" /> 支持 floating-ui 全部方向：
        <ZCode code="top" /> / <ZCode code="bottom" /> / <ZCode code="left" /> / <ZCode code="right" />
        及 <ZCode code="-start" /> / <ZCode code="-end" /> 对齐变体。
      </template>
      <PlacementDemo />
    </DemoBlock>

    <ZTitle :level="2">自定义内容（#title / #content slot）</ZTitle>
    <DemoBlock title="#title slot + 富文本 #content" :source="ContentSlotDemoSource">
      <template #desc>
        <ZCode code="#title" /> slot 可放置带图标的富文本标题；
        <ZCode code="#content" /> slot 支持任意布局，适合用户信息卡、操作菜单等场景。
      </template>
      <ContentSlotDemo />
    </DemoBlock>

    <ZTitle :level="2">受控模式</ZTitle>
    <DemoBlock title="trigger='manual' + v-model:visible" :source="ControlledDemoSource">
      <template #desc>
        <ZCode code="trigger='manual'" /> 时，组件不响应用户交互，完全由
        <ZCode code="v-model:visible" /> 控制显示/隐藏。
      </template>
      <ControlledDemo />
    </DemoBlock>

    <ZTitle :level="2">禁用</ZTitle>
    <DemoBlock title="动态启用 / 禁用 Popover" :source="DisabledDemoSource">
      <template #desc>
        <ZCode code=":disabled='true'" /> 禁用后不响应任何触发事件，配合外部状态可动态切换。
      </template>
      <DisabledDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '260px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '160px' },
        { key: 'args', label: '参数', mono: true, width: '120px' },
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
