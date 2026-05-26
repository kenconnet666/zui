<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZPopconfirm/BasicDemo.vue'
import BasicDemoSource from './ZPopconfirm/BasicDemo.vue?raw'

const propsRows = [
  { name: 'title',       type: 'string',             default: '—',    desc: '确认框标题。' },
  { name: 'description', type: 'string',             default: '—',    desc: '确认框描述文字。' },
  { name: 'okText',      type: 'string',             default: "'确认'", desc: '确认按钮文字。' },
  { name: 'cancelText',  type: 'string',             default: "'取消'", desc: '取消按钮文字。' },
  { name: 'placement',   type: 'Placement',          default: "'top'", desc: 'floating-ui placement。' },
  { name: 'disabled',    type: 'boolean',            default: 'false', desc: '禁用（不弹出）。' },
  { name: 'minWidth',    type: 'number',             default: '12',   desc: 'popper 最小宽度（iem 倍数）。' },
  { name: 'maxWidth',    type: 'number',             default: '20',   desc: 'popper 最大宽度（iem 倍数）。' },
  { name: 'css',         type: '(s: Chain) => void', default: '—',    desc: '根元素 CSS 兜底。' },
]

const slotsRows = [
  { name: 'default', desc: '触发器内容。' },
]

const emitsRows = [
  { name: 'confirm', args: '—', desc: '点击确认按钮触发。' },
  { name: 'cancel',  args: '—', desc: '点击取消按钮触发。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZPopconfirm 气泡确认框</ZTitle>
    <ZParagraph>
      点击触发器弹出确认气泡，适合二次确认场景（如删除操作）。通过 <ZCode code="@confirm" /> /
      <ZCode code="@cancel" /> 处理结果，<ZCode code="disabled" /> 可禁用弹出。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="删除确认 / 自定义文字 / 禁用" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
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
        { key: 'name', label: '事件',  mono: true, width: '120px' },
        { key: 'args', label: '参数',  mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
