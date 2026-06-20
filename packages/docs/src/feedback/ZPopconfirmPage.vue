<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZPopconfirm/BasicDemo.vue'
import BasicDemoSource from './ZPopconfirm/BasicDemo.vue?raw'

import DescriptionDemo from './ZPopconfirm/DescriptionDemo.vue'
import DescriptionDemoSource from './ZPopconfirm/DescriptionDemo.vue?raw'

import PlacementDemo from './ZPopconfirm/PlacementDemo.vue'
import PlacementDemoSource from './ZPopconfirm/PlacementDemo.vue?raw'

import CustomTextDemo from './ZPopconfirm/CustomTextDemo.vue'
import CustomTextDemoSource from './ZPopconfirm/CustomTextDemo.vue?raw'

const propsRows = [
  { name: 'title', type: 'string', default: '—', desc: '确认框标题（⚠️ 图标右侧显示，粗体）。' },
  { name: 'description', type: 'string', default: '—', desc: '确认框描述文字（标题下方，次要色）。' },
  { name: 'okText', type: 'string', default: "'确定'", desc: '确认按钮文字。' },
  { name: 'cancelText', type: 'string', default: "'取消'", desc: '取消按钮文字。' },
  {
    name: 'placement',
    type: 'Placement',
    default: "'top'",
    desc: 'floating-ui placement，如 top / bottom / left / right / top-start 等。默认 top。',
  },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用，点击触发器不弹出确认框。' },
  { name: 'minWidth', type: 'number', default: '12', desc: 'popper 最小宽度（px 倍数，1 单位 = 16px，默认 12 = 192px）。' },
  { name: 'maxWidth', type: 'number', default: '20', desc: 'popper 最大宽度（px 倍数，1 单位 = 16px，默认 20 = 320px）。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '弹层根元素 CSS 兜底，在所有内置样式之后应用。' },
]

const slotsRows = [
  { name: 'default', desc: '触发器内容，点击后弹出确认气泡。' },
]

const emitsRows = [
  { name: 'confirm', args: '—', desc: '点击确认按钮后触发，同时关闭弹层。' },
  { name: 'cancel', args: '—', desc: '点击取消按钮后触发，同时关闭弹层。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZPopconfirm 气泡确认框</ZTitle>
    <ZParagraph>
      点击触发器弹出含 ⚠️ 图标的确认气泡，适合删除、清空、提交等二次确认场景。
      通过 <ZCode code="@confirm" /> / <ZCode code="@cancel" /> 处理结果，
      点击外部或按 ESC 关闭，<ZCode code="disabled" /> 可禁用弹出。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="删除确认 / 自定义文字 / 禁用" :source="BasicDemoSource">
      <template #desc>
        <ZCode code="@confirm" /> / <ZCode code="@cancel" /> 分别在确认/取消时触发，
        弹层会自动关闭。<ZCode code=":disabled='true'" /> 禁用后不弹出。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">标题与描述</ZTitle>
    <DemoBlock title="title + description 组合" :source="DescriptionDemoSource">
      <template #desc>
        <ZCode code="title" /> 显示粗体标题；<ZCode code="description" /> 在标题下方显示次要色说明文字。
        两者可单独或组合使用，长描述自动折行。
      </template>
      <DescriptionDemo />
    </DemoBlock>

    <ZTitle :level="2">弹出方向</ZTitle>
    <DemoBlock title="top / bottom / left / right 及变体" :source="PlacementDemoSource">
      <template #desc>
        <ZCode code="placement" /> 支持 floating-ui 全部方向，默认 <ZCode code="top" />。
      </template>
      <PlacementDemo />
    </DemoBlock>

    <ZTitle :level="2">自定义按钮文字</ZTitle>
    <DemoBlock title="ok-text / cancel-text 自定义" :source="CustomTextDemoSource">
      <template #desc>
        通过 <ZCode code="ok-text" /> / <ZCode code="cancel-text" /> 适配不同语言或操作语境的按钮文案。
      </template>
      <CustomTextDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '140px' },
        { key: 'type', label: '类型', mono: true, width: '220px' },
        { key: 'default', label: '默认值', mono: true, width: '90px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '120px' },
        { key: 'args', label: '参数', mono: true, width: '80px' },
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
