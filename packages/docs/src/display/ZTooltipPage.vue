<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZTooltip/BasicDemo.vue'
import BasicDemoSource from './ZTooltip/BasicDemo.vue?raw'

import DelayDemo from './ZTooltip/DelayDemo.vue'
import DelayDemoSource from './ZTooltip/DelayDemo.vue?raw'

import ContentSlotDemo from './ZTooltip/ContentSlotDemo.vue'
import ContentSlotDemoSource from './ZTooltip/ContentSlotDemo.vue?raw'

import ControlledDemo from './ZTooltip/ControlledDemo.vue'
import ControlledDemoSource from './ZTooltip/ControlledDemo.vue?raw'

import DisabledDemo from './ZTooltip/DisabledDemo.vue'
import DisabledDemoSource from './ZTooltip/DisabledDemo.vue?raw'

import FocusTriggerDemo from './ZTooltip/FocusTriggerDemo.vue'
import FocusTriggerDemoSource from './ZTooltip/FocusTriggerDemo.vue?raw'

import SxCustomDemo from './ZTooltip/SxCustomDemo.vue'
import SxCustomDemoSource from './ZTooltip/SxCustomDemo.vue?raw'

const propsRows = [
  { name: 'content', type: 'string', default: '—', desc: '提示文字（#content slot 优先级更高）。' },
  {
    name: 'placement',
    type: 'Placement',
    default: "'top'",
    desc: 'floating-ui placement，如 top / bottom / left / right / top-start / bottom-end 等。',
  },
  {
    name: 'trigger',
    type: "'hover'|'click'|'focus'|'manual'",
    default: "'hover'",
    desc: '触发方式。hover=悬停，click=点击，focus=聚焦，manual=手动受控。',
  },
  {
    name: 'visible',
    type: 'boolean',
    default: 'false',
    desc: '受控显示（manual 模式下生效，配合 v-model:visible）。',
  },
  { name: 'delay', type: 'number', default: '100', desc: 'hover/focus 模式 enter/leave 延迟 ms。设为 0 则立即显示/隐藏。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用 tooltip，悬停不弹出。' },
  { name: 'maxWidth', type: 'number', default: '16', desc: 'tooltip 最大宽度（px 倍数，1 单位 = 16px，默认 16 = 256px）。超出折行显示。' },
  { name: 'sxTrigger', type: 'SxObject', default: '—', desc: '触发器包裹元素的 sx 覆盖（inline-flex 容器）。' },
  { name: 'sxContent', type: 'SxObject', default: '—', desc: 'tooltip 弹层的 sx 覆盖。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底，在所有内置样式之后应用。' },
]

const slotsRows = [
  { name: 'default', desc: '触发器内容，被 inline-flex 容器包裹。' },
  { name: 'content', desc: '自定义 tooltip 弹层内容，优先级高于 content prop。' },
]

const emitsRows = [{ name: 'update:visible', args: 'boolean', desc: '显示状态变更，用于 v-model:visible 双向绑定。' }]
</script>

<template>
  <section>
    <ZTitle :level="1">ZTooltip 文字提示</ZTitle>
    <ZParagraph>
      鼠标悬停时显示简短提示，基于 floating-ui 定位，支持 <ZCode code="hover" /> /
      <ZCode code="click" /> / <ZCode code="focus" /> 多种触发方式，<ZCode code="manual" />
      模式可受控显示，<ZCode code="#content" /> slot 支持自定义富文本内容。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="多方向 / 多触发方式" :source="BasicDemoSource">
      <template #desc>
        默认 <ZCode code="trigger='hover'" /> 悬停触发，<ZCode code="placement" /> 控制弹出方向，
        也可切换为 <ZCode code="click" /> 点击触发。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">延迟控制</ZTitle>
    <DemoBlock title="delay=0 / 500 / 100（默认）对比" :source="DelayDemoSource">
      <template #desc>
        <ZCode code="delay" /> 控制 hover/focus 模式的 enter/leave 延迟（ms）。
        设为 <ZCode code="0" /> 立即显示，较大值可避免鼠标扫过时频繁闪烁。
      </template>
      <DelayDemo />
    </DemoBlock>

    <ZTitle :level="2">自定义内容（#content slot）</ZTitle>
    <DemoBlock title="#content slot 放置富文本" :source="ContentSlotDemoSource">
      <template #desc>
        使用 <ZCode code="#content" /> slot 可以放置任意内容（多行文字、图标、ZFlex 布局等），
        优先级高于 <ZCode code="content" /> prop。
      </template>
      <ContentSlotDemo />
    </DemoBlock>

    <ZTitle :level="2">受控模式</ZTitle>
    <DemoBlock title="trigger='manual' + v-model:visible" :source="ControlledDemoSource">
      <template #desc>
        <ZCode code="trigger='manual'" /> 时组件不响应鼠标/键盘事件，完全由外部
        <ZCode code="v-model:visible" /> 控制显示/隐藏。
      </template>
      <ControlledDemo />
    </DemoBlock>

    <ZTitle :level="2">禁用 / 宽度限制</ZTitle>
    <DemoBlock title="disabled + maxWidth 对比" :source="DisabledDemoSource">
      <template #desc>
        <ZCode code=":disabled='true'" /> 完全禁用提示；<ZCode code="max-width" />
        限制弹层最大宽度（px 倍数），超出内容自动折行。
      </template>
      <DisabledDemo />
    </DemoBlock>

    <ZTitle :level="2">focus 触发方式</ZTitle>
    <DemoBlock title="trigger='focus' 聚焦弹出" :source="FocusTriggerDemoSource">
      <template #desc>
        <ZCode code="trigger='focus'" /> 模式下，聚焦到 default slot 内的可聚焦元素（如 input）时弹出 tooltip，
        失焦时收回，配合 <ZCode code="delay" /> 可控制延迟。
      </template>
      <FocusTriggerDemo />
    </DemoBlock>

    <ZTitle :level="2">sxTrigger / sxContent / css 定制</ZTitle>
    <DemoBlock title="三层 sx 精细化覆盖" :source="SxCustomDemoSource">
      <template #desc>
        <ZCode code="sxTrigger.css" /> 覆盖触发器包裹层样式；
        <ZCode code="sxContent.css" /> 覆盖弹层样式（背景色、字色等）；
        <ZCode code="css" /> 作为最终兜底，在内置样式之后应用。
        <ZCode code="maxWidth" /> 控制弹层最大宽度（px 倍数）。
      </template>
      <SxCustomDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '280px' },
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
