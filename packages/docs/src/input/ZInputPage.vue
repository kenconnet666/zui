<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZInput/BasicDemo.vue'
import BasicDemoSource from './ZInput/BasicDemo.vue?raw'

const propsRows = [
  { name: 'value',       type: 'string | number',       default: '—',      desc: '绑定值（v-model:value）。' },
  { name: 'type',        type: 'string',                default: "'text'",  desc: 'HTML input type。' },
  { name: 'size',        type: 'number',                default: '1',       desc: '字号 iem 倍数，影响高度、内边距等。' },
  { name: 'height',      type: 'number',                default: 'size*2',  desc: '高度 iem 倍数。' },
  { name: 'placeholder', type: 'string',                default: '—',       desc: '占位文字。' },
  { name: 'disabled',    type: 'boolean',               default: 'false',   desc: '禁用。' },
  { name: 'readonly',    type: 'boolean',               default: 'false',   desc: '只读。' },
  { name: 'clearable',   type: 'boolean',               default: 'false',   desc: '显示清空按钮（有值时）。' },
  { name: 'showCount',   type: 'boolean',               default: 'false',   desc: '显示字数（配合 maxlength）。' },
  { name: 'maxlength',   type: 'number',                default: '—',       desc: 'HTML maxlength。' },
  { name: 'autofocus',   type: 'boolean',               default: 'false',   desc: '自动聚焦。' },
  { name: 'css',         type: '(s: Chain) => void',    default: '—',       desc: '根元素 CSS 兜底。' },
]

const slotsRows = [
  { name: 'prefix', desc: '前置内容（图标/文字）。' },
  { name: 'suffix', desc: '后置内容（图标/文字）。' },
]

const emitsRows = [
  { name: 'update:value', args: 'string',       desc: '值变更。' },
  { name: 'change',       args: 'string, Event', desc: 'blur 或 Enter 确认时。' },
  { name: 'focus',        args: 'FocusEvent',    desc: '聚焦。' },
  { name: 'blur',         args: 'FocusEvent',    desc: '失焦。' },
  { name: 'clear',        args: '—',             desc: '点击清空按钮。' },
  { name: 'pressEnter',   args: 'KeyboardEvent', desc: '按 Enter 键。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZInput 输入框</ZTitle>
    <ZParagraph>
      文本输入框，支持 <ZCode code="type" /> 切换输入类型，<ZCode code="clearable" /> 一键清空，
      <ZCode code="showCount" /> 显示字数，<ZCode code="prefix" /> / <ZCode code="suffix" /> slot 前后附加内容。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="多类型 / 多尺寸 / 清空 / 字数 / 只读 / 禁用" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
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
        { key: 'name', label: '事件',  mono: true, width: '160px' },
        { key: 'args', label: '参数',  mono: true, width: '180px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
